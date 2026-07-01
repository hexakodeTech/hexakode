'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';
import { AdminCreditTransaction } from '@/types/admin';
import { revalidatePath } from 'next/cache';
import { verifyAdminAuth } from '@/lib/auth/utils';

const creditSchema = z.object({
  clientId: z.string().uuid({ message: 'Invalid Client ID' }),
  amount: z.number({ message: 'Amount is required' }),
  description: z.string().optional().nullable(),
});

export type CreditInput = z.infer<typeof creditSchema>;

/**
 * Returns all credit transactions for a client.
 */
export async function getCreditTransactionsAction(
  clientId: string
): Promise<AdminCreditTransaction[]> {
  await verifyAdminAuth();
  try {
    const list = await prisma.creditTransaction.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });

    return list.map((tx) => ({
      id: tx.id,
      clientId: tx.clientId,
      amount: tx.amount,
      description: tx.description,
      createdAt: tx.createdAt.toISOString().split('T')[0],
    }));
  } catch (error) {
    console.error('Error fetching credit transactions:', error);
    return [];
  }
}

/**
 * Adds a credit transaction and updates the client's credit balance atomically.
 */
export async function addCreditTransactionAction(
  clientId: string,
  amount: number,
  description?: string | null
) {
  await verifyAdminAuth();
  const parsed = creditSchema.safeParse({ clientId, amount, description });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid credit transaction data.' };
  }
  
  try {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true },
    });

    if (!client) {
      return { success: false, error: 'Client not found' };
    }

    // 1. Create credit transaction record
    const transaction = await prisma.creditTransaction.create({
      data: {
        clientId,
        amount,
        description: description || null,
      },
    });

    // 2. Update client credit balance
    await prisma.client.update({
      where: { id: clientId },
      data: {
        creditBalance: {
          increment: amount,
        },
      },
    });

    revalidatePath('/admin/clients');
    revalidatePath(`/admin/clients/${clientId}`);
    return { success: true, transaction };
  } catch (error: unknown) {
    console.error('Add credit transaction error:', error);
    const msg = error instanceof Error ? error.message : 'Database error recording credit transaction.';
    return { success: false, error: msg };
  }
}
