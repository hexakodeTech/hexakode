'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';
import { AdminMaintenanceLog } from '@/types/admin';
import { revalidatePath } from 'next/cache';
import { verifyAdminAuth } from '@/lib/auth/utils';

const logSchema = z.object({
  projectId: z.string().uuid({ message: 'Project ID is required' }),
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional().or(z.literal('')),
  logDate: z.string().min(1, { message: 'Log date is required' }),
});

export type MaintenanceLogInput = z.infer<typeof logSchema>;

/**
 * Returns all maintenance logs formatted for the admin table.
 */
export async function getMaintenanceLogsAction(projectId?: string): Promise<AdminMaintenanceLog[]> {
  await verifyAdminAuth();
  try {
    const where: { projectId?: string } = {};
    if (projectId) {
      where.projectId = projectId;
    }
    const list = await prisma.maintenanceLog.findMany({
      where,
      orderBy: { logDate: 'desc' },
      include: {
        project: { select: { name: true, websiteUrl: true } },
        invoices: true,
      },
    });

    return list.map((l) => ({
      id: l.id,
      projectId: l.projectId,
      projectName: l.project.name,
      projectWebsiteUrl: l.project.websiteUrl,
      title: l.title,
      description: l.description,
      logDate: l.logDate.toISOString().split('T')[0],
      createdDate: l.createdAt.toISOString().split('T')[0],
      invoices: l.invoices?.map((inv) => ({
        id: inv.id,
        clientId: inv.clientId,
        clientName: '',
        invoiceNumber: inv.invoiceNumber,
        amount: inv.amount,
        discountType: (inv.discountType as 'amount' | 'percentage') ?? 'amount',
        discountValue: inv.discountValue ?? 0,
        discountAmount: inv.discountAmount ?? 0,
        creditApplied: inv.creditApplied,
        finalAmountDue: inv.finalAmountDue,
        status: inv.status as 'Paid' | 'Pending' | 'Overdue',
        dueDate: inv.dueDate.toISOString().split('T')[0],
        issuedDate: inv.issuedDate.toISOString().split('T')[0],
        createdAt: inv.createdAt.toISOString().split('T')[0],
      })) || [],
    }));
  } catch (error) {
    console.error('Error fetching maintenance logs:', error);
    return [];
  }
}

/**
 * Returns a single maintenance log with project details.
 */
export async function getMaintenanceLogByIdAction(id: string) {
  await verifyAdminAuth();
  try {
    const log = await prisma.maintenanceLog.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, name: true, websiteUrl: true, adminPanelUrl: true, clientId: true } },
        invoices: true,
      },
    });

    if (!log) return null;

    return {
      id: log.id,
      projectId: log.projectId,
      projectName: log.project.name,
      projectWebsiteUrl: log.project.websiteUrl,
      title: log.title,
      description: log.description,
      logDate: log.logDate.toISOString().split('T')[0],
      createdDate: log.createdAt.toISOString().split('T')[0],
      invoices: log.invoices?.map((inv) => ({
        id: inv.id,
        clientId: inv.clientId,
        clientName: '',
        invoiceNumber: inv.invoiceNumber,
        amount: inv.amount,
        discountType: (inv.discountType as 'amount' | 'percentage') ?? 'amount',
        discountValue: inv.discountValue ?? 0,
        discountAmount: inv.discountAmount ?? 0,
        creditApplied: inv.creditApplied,
        finalAmountDue: inv.finalAmountDue,
        status: inv.status as 'Paid' | 'Pending' | 'Overdue',
        dueDate: inv.dueDate.toISOString().split('T')[0],
        issuedDate: inv.issuedDate.toISOString().split('T')[0],
        createdAt: inv.createdAt.toISOString().split('T')[0],
      })) || [],
    } as AdminMaintenanceLog;
  } catch (error) {
    console.error('Error fetching maintenance log:', error);
    return null;
  }
}

/**
 * Creates a new maintenance log entry.
 */
export async function createMaintenanceLogAction(data: MaintenanceLogInput) {
  await verifyAdminAuth();
  const parsed = logSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid input.' };
  }

  const payload = parsed.data;

  try {
    const project = await prisma.project.findUnique({
      where: { id: payload.projectId },
      select: { clientId: true },
    });

    if (!project) {
      return { success: false, error: 'Linked project not found.' };
    }

    await prisma.maintenanceLog.create({
      data: {
        projectId: payload.projectId,
        title: payload.title,
        description: payload.description || null,
        logDate: new Date(payload.logDate),
      },
    });

    revalidatePath(`/admin/clients/${project.clientId}`);
    revalidatePath(`/admin/clients/${project.clientId}/projects/${payload.projectId}`);
    return { success: true };
  } catch (error: unknown) {
    console.error('Maintenance log creation error:', error);
    const msg = error instanceof Error ? error.message : 'Database error creating log.';
    return { success: false, error: msg };
  }
}

/**
 * Updates an existing maintenance log.
 */
export async function updateMaintenanceLogAction(id: string, data: MaintenanceLogInput) {
  await verifyAdminAuth();
  const parsed = logSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid input.' };
  }

  const payload = parsed.data;

  try {
    const existing = await prisma.maintenanceLog.findUnique({
      where: { id },
      include: {
        project: { select: { clientId: true } },
      },
    });

    if (!existing) {
      return { success: false, error: 'Maintenance log not found.' };
    }

    await prisma.maintenanceLog.update({
      where: { id },
      data: {
        projectId: payload.projectId,
        title: payload.title,
        description: payload.description || null,
        logDate: new Date(payload.logDate),
      },
    });

    revalidatePath(`/admin/clients/${existing.project.clientId}`);
    revalidatePath(`/admin/clients/${existing.project.clientId}/projects/${payload.projectId}`);
    return { success: true };
  } catch (error: unknown) {
    console.error('Maintenance log update error:', error);
    const msg = error instanceof Error ? error.message : 'Database error updating log.';
    return { success: false, error: msg };
  }
}

/**
 * Deletes a maintenance log entry.
 */
export async function deleteMaintenanceLogAction(id: string) {
  await verifyAdminAuth();
  try {
    const existing = await prisma.maintenanceLog.findUnique({
      where: { id },
      include: {
        project: { select: { clientId: true } },
      },
    });

    if (!existing) {
      return { success: false, error: 'Maintenance log not found.' };
    }

    await prisma.maintenanceLog.delete({ where: { id } });

    revalidatePath(`/admin/clients/${existing.project.clientId}`);
    revalidatePath(`/admin/clients/${existing.project.clientId}/projects/${existing.projectId}`);
    return { success: true };
  } catch (error: unknown) {
    console.error('Maintenance log deletion error:', error);
    const msg = error instanceof Error ? error.message : 'Database error deleting log.';
    return { success: false, error: msg };
  }
}
