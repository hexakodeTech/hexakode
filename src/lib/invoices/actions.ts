'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';
import { AdminInvoice } from '@/types/admin';
import { revalidatePath } from 'next/cache';
import { formatCurrency } from '@/lib/currency';

const invoiceSchema = z.object({
  clientId: z.string().uuid({ message: 'Invalid Client ID' }),
  projectId: z.string().uuid().optional().nullable(),
  amount: z.number().positive({ message: 'Amount must be greater than zero' }),
  discountType: z.enum(['amount', 'percentage']).default('amount'),
  discountValue: z.number().nonnegative().optional().default(0),
  dueDate: z.string().min(1, { message: 'Due date is required' }),
  status: z.enum(['Paid', 'Pending', 'Overdue']).default('Pending'),
  creditApplied: z.number().nonnegative().optional().default(0),
  finalAmountDue: z.number().nonnegative().optional(),
  maintenanceLogIds: z.array(z.string().uuid()).optional(),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;

/**
 * Computes the monetary discount from type + value + base amount.
 */
function computeDiscountAmount(
  amount: number,
  discountType: 'amount' | 'percentage',
  discountValue: number
): number {
  if (!discountValue || discountValue <= 0) return 0;
  if (discountType === 'percentage') {
    const pct = Math.min(discountValue, 100);
    return Math.round((amount * pct) / 100 * 100) / 100;
  }
  return Math.min(discountValue, amount);
}

/**
 * Helper to generate sequential invoice numbers: INV-YYYY-XXXX
 */
async function generateInvoiceNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `INV-${currentYear}-`;

  // Find the invoice with the highest number for this year
  const latestInvoice = await prisma.invoice.findFirst({
    where: {
      invoiceNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      invoiceNumber: 'desc',
    },
  });

  let nextSequence = 1;
  if (latestInvoice) {
    const parts = latestInvoice.invoiceNumber.split('-');
    const sequencePart = parts[parts.length - 1];
    const parsedSequence = parseInt(sequencePart, 10);
    if (!isNaN(parsedSequence)) {
      nextSequence = parsedSequence + 1;
    }
  }

  // Format with leading zeros, e.g. 0001, 0002...
  const paddedSequence = String(nextSequence).padStart(4, '0');
  return `${prefix}${paddedSequence}`;
}

/**
 * Returns invoices, optionally filtered by client or project.
 */
export async function getInvoicesAction(
  clientId?: string,
  projectId?: string
): Promise<AdminInvoice[]> {
  try {
    const where: any = {};
    if (clientId) where.clientId = clientId;
    if (projectId) where.projectId = projectId;

    const list = await prisma.invoice.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { name: true } },
        project: { select: { name: true } },
        maintenanceLogs: true,
      },
    });

    return list.map((inv) => ({
      id: inv.id,
      clientId: inv.clientId,
      clientName: inv.client.name,
      projectId: inv.projectId,
      projectName: inv.project?.name || null,
      invoiceNumber: inv.invoiceNumber,
      amount: inv.amount,
      discountType: (inv.discountType as 'amount' | 'percentage') ?? 'amount',
      discountValue: inv.discountValue ?? 0,
      discountAmount: inv.discountAmount ?? 0,
      creditApplied: inv.creditApplied ?? 0,
      finalAmountDue: inv.finalAmountDue ?? inv.amount,
      startingCreditBalance: inv.startingCreditBalance ?? null,
      creditTransactionId: inv.creditTransactionId ?? null,
      status: inv.status as AdminInvoice['status'],
      dueDate: inv.dueDate.toISOString().split('T')[0],
      issuedDate: inv.issuedDate.toISOString().split('T')[0],
      createdAt: inv.createdAt.toISOString().split('T')[0],
      maintenanceLogs: inv.maintenanceLogs.map((log) => ({
        id: log.id,
        projectId: log.projectId,
        projectName: inv.project?.name || '',
        title: log.title,
        description: log.description,
        logDate: log.logDate.toISOString().split('T')[0],
        createdDate: log.createdAt.toISOString().split('T')[0],
      })),
    }));
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
}

/**
 * Creates a new invoice with an auto-generated invoice number.
 */
export async function createInvoiceAction(data: InvoiceInput) {
  const parsed = invoiceSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid input.' };
  }

  const payload = parsed.data;
  const discountType = payload.discountType ?? 'amount';
  const discountValue = payload.discountValue ?? 0;

  // Validate discount
  if (discountType === 'percentage' && discountValue > 100) {
    return { success: false, error: 'Discount percentage cannot exceed 100%.' };
  }
  if (discountType === 'amount' && discountValue > payload.amount) {
    return { success: false, error: `Discount (${formatCurrency(discountValue)}) cannot exceed the invoice amount (${formatCurrency(payload.amount)}).` };
  }

  // Compute monetary discount (order: amount → discount → credits)
  const discountAmount = computeDiscountAmount(payload.amount, discountType, discountValue);
  const amountAfterDiscount = payload.amount - discountAmount;
  const creditApplied = payload.creditApplied ?? 0;
  const finalAmount = Math.max(0, amountAfterDiscount - creditApplied);

  try {
    const invoiceNumber = await generateInvoiceNumber();
    let startingCreditBalance: number | null = null;
    let creditTransactionId: string | null = null;

    // If credit balance applied, check availability and deduct
    if (creditApplied > 0) {
      const client = await prisma.client.findUnique({
        where: { id: payload.clientId },
        select: { creditBalance: true },
      });

      if (!client) {
        return { success: false, error: 'Client not found.' };
      }

      if (client.creditBalance < creditApplied) {
        return { success: false, error: `Insufficient credit balance. Available: ${formatCurrency(client.creditBalance)}` };
      }

      startingCreditBalance = client.creditBalance;

      await prisma.client.update({
        where: { id: payload.clientId },
        data: { creditBalance: { decrement: creditApplied } },
      });

      const creditTx = await prisma.creditTransaction.create({
        data: {
          clientId: payload.clientId,
          amount: -creditApplied,
          description: `Applied credits to invoice ${invoiceNumber}`,
        },
      });

      creditTransactionId = creditTx.id;
    }

    // Validate project logs
    if (payload.projectId && payload.maintenanceLogIds && payload.maintenanceLogIds.length > 0) {
      const logsCount = await prisma.maintenanceLog.count({
        where: { id: { in: payload.maintenanceLogIds }, projectId: payload.projectId },
      });
      if (logsCount !== payload.maintenanceLogIds.length) {
        return { success: false, error: 'One or more selected maintenance logs do not belong to the selected project.' };
      }
    }

    await prisma.invoice.create({
      data: {
        clientId: payload.clientId,
        projectId: payload.projectId || null,
        invoiceNumber,
        amount: payload.amount,
        discountType,
        discountValue,
        discountAmount,
        creditApplied,
        finalAmountDue: finalAmount,
        startingCreditBalance,
        creditTransactionId,
        status: payload.status,
        dueDate: new Date(payload.dueDate),
        maintenanceLogs: payload.maintenanceLogIds ? {
          connect: payload.maintenanceLogIds.map((logId) => ({ id: logId })),
        } : undefined,
      },
    });

    revalidatePath('/admin/clients');
    if (payload.clientId) revalidatePath(`/admin/clients/${payload.clientId}`);
    return { success: true };
  } catch (error: unknown) {
    console.error('Invoice creation error:', error);
    const msg = error instanceof Error ? error.message : 'Database error creating invoice.';
    return { success: false, error: msg };
  }
}

/**
 * Marks an invoice as Paid.
 */
export async function markInvoicePaidAction(id: string) {
  try {
    const existing = await prisma.invoice.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: 'Invoice not found.' };
    }

    await prisma.invoice.update({
      where: { id },
      data: { status: 'Paid' },
    });

    revalidatePath('/admin/clients');
    revalidatePath(`/admin/clients/${existing.clientId}`);
    return { success: true };
  } catch (error: unknown) {
    console.error('Invoice status update error:', error);
    const msg = error instanceof Error ? error.message : 'Database error updating invoice.';
    return { success: false, error: msg };
  }
}

/**
 * Deletes an invoice and refunds any applied credits.
 */
export async function deleteInvoiceAction(id: string) {
  try {
    const existing = await prisma.invoice.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: 'Invoice not found.' };
    }

    // Refund creditApplied if it was positive
    if (existing.creditApplied && existing.creditApplied > 0) {
      await prisma.client.update({
        where: { id: existing.clientId },
        data: {
          creditBalance: {
            increment: existing.creditApplied,
          },
        },
      });

      // Record a refund transaction
      await prisma.creditTransaction.create({
        data: {
          clientId: existing.clientId,
          amount: existing.creditApplied,
          description: `Refunded applied credits from deleted invoice ${existing.invoiceNumber}`,
        },
      });
    }

    await prisma.invoice.delete({ where: { id } });

    revalidatePath('/admin/clients');
    revalidatePath(`/admin/clients/${existing.clientId}`);
    return { success: true };
  } catch (error: unknown) {
    console.error('Invoice deletion error:', error);
    const msg = error instanceof Error ? error.message : 'Database error deleting invoice.';
    return { success: false, error: msg };
  }
}

/**
 * Updates an existing invoice, including its linked maintenance logs.
 */
export async function updateInvoiceAction(
  id: string,
  data: Partial<InvoiceInput>
) {
  try {
    const existing = await prisma.invoice.findUnique({
      where: { id },
      include: { maintenanceLogs: true },
    });
    if (!existing) {
      return { success: false, error: 'Invoice not found.' };
    }

    // Resolve final values (fall back to existing)
    const amt = data.amount !== undefined ? data.amount : existing.amount;
    const discountType = (data.discountType ?? existing.discountType ?? 'amount') as 'amount' | 'percentage';
    const discountValue = data.discountValue !== undefined ? data.discountValue : (existing.discountValue ?? 0);
    const cred = data.creditApplied !== undefined ? data.creditApplied : existing.creditApplied;

    // Validate discount
    if (discountType === 'percentage' && discountValue > 100) {
      return { success: false, error: 'Discount percentage cannot exceed 100%.' };
    }
    if (discountType === 'amount' && discountValue > amt) {
      return { success: false, error: `Discount (${formatCurrency(discountValue)}) cannot exceed the invoice amount (${formatCurrency(amt)}).` };
    }

    // Recompute in correct order: amount → discount → credits
    const discountAmount = computeDiscountAmount(amt, discountType, discountValue);
    const amountAfterDiscount = amt - discountAmount;
    const finalAmountDue = Math.max(0, amountAfterDiscount - cred);

    const updateData: any = {
      discountType,
      discountValue,
      discountAmount,
      finalAmountDue,
    };
    if (data.amount !== undefined) updateData.amount = amt;
    if (data.creditApplied !== undefined) updateData.creditApplied = cred;
    if (data.dueDate !== undefined) updateData.dueDate = new Date(data.dueDate);
    if (data.status !== undefined) updateData.status = data.status;
    if (data.projectId !== undefined) updateData.projectId = data.projectId || null;

    // Validate project logs
    const targetProjId = data.projectId !== undefined ? data.projectId : existing.projectId;
    const targetLogIds = data.maintenanceLogIds;

    if (targetProjId && targetLogIds && targetLogIds.length > 0) {
      const logsCount = await prisma.maintenanceLog.count({
        where: { id: { in: targetLogIds }, projectId: targetProjId },
      });
      if (logsCount !== targetLogIds.length) {
        return { success: false, error: 'One or more selected maintenance logs do not belong to the selected project.' };
      }
    }

    if (data.maintenanceLogIds !== undefined) {
      updateData.maintenanceLogs = {
        set: data.maintenanceLogIds.map((logId) => ({ id: logId })),
      };
    }

    await prisma.invoice.update({ where: { id }, data: updateData });

    revalidatePath('/admin/clients');
    if (existing.clientId) revalidatePath(`/admin/clients/${existing.clientId}`);
    return { success: true };
  } catch (error: unknown) {
    console.error('Invoice update error:', error);
    const msg = error instanceof Error ? error.message : 'Database error updating invoice.';
    return { success: false, error: msg };
  }
}
