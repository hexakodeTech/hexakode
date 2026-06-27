'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';
import { AdminClient, AdminCoupon } from '@/types/admin';
import { revalidatePath } from 'next/cache';
import { calculateCouponStatus } from '@/lib/coupons/utils';
import { isValidClientId } from './utils';

const urlSchema = z
  .string()
  .url({ message: 'Please enter a valid URL (e.g. https://example.com)' })
  .refine((v) => v.startsWith('http://') || v.startsWith('https://'), {
    message: 'URL must start with http:// or https://',
  });

const clientSchema = z.object({
  name: z.string().min(1, { message: 'Client name is required' }),
  email: z.string().email({ message: 'Please enter a valid email' }).optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  websiteUrl: urlSchema.optional().or(z.literal('')),
  status: z.string().default('Active').optional(),
  creditBalance: z.number().default(0).optional(),
  notes: z.string().optional().or(z.literal('')),
});

export type ClientInput = z.infer<typeof clientSchema>;

/**
 * Returns all clients formatted for the admin table.
 */
export async function getClientsAction(): Promise<AdminClient[]> {
  try {
    const list = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { projects: true } },
      },
    });

    return list.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      company: c.company,
      websiteUrl: c.websiteUrl,
      status: c.status,
      creditBalance: c.creditBalance,
      notes: c.notes,
      projectCount: c._count.projects,
      createdDate: c.createdAt.toISOString().split('T')[0],
    }));
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
}

/**
 * Returns a single client with its associated projects.
 */
export async function getClientByIdAction(id: string) {
  if (!isValidClientId(id)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[getClientByIdAction] Invalid ID format supplied: ${id}`);
    }
    return {
      success: false,
      error: 'Invalid Client ID format.',
      code: 'INVALID_ID' as const,
    };
  }

  try {
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        projects: {
          orderBy: { createdAt: 'desc' },
          include: {
            _count: { select: { maintenanceLogs: true } },
          },
        },
        coupons: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!client) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[getClientByIdAction] Client not found in DB for ID: ${id}`);
      }
      return {
        success: false,
        error: 'The requested client does not exist.',
        code: 'NOT_FOUND' as const,
      };
    }

    const payload = {
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        websiteUrl: client.websiteUrl,
        status: client.status,
        creditBalance: client.creditBalance,
        notes: client.notes,
        projectCount: client.projects.length,
        createdDate: client.createdAt.toISOString().split('T')[0],
      } as AdminClient,
      projects: client.projects.map((p) => ({
        id: p.id,
        name: p.name,
        clientId: p.clientId,
        clientName: client.name,
        projectType: p.projectType,
        websiteUrl: p.websiteUrl,
        adminPanelUrl: p.adminPanelUrl,
        androidPackage: p.androidPackage,
        iosBundleId: p.iosBundleId,
        playStoreUrl: p.playStoreUrl,
        appStoreUrl: p.appStoreUrl,
        status: p.status,
        notes: p.notes,
        logCount: p._count.maintenanceLogs,
        createdDate: p.createdAt.toISOString().split('T')[0],
      })),
      coupons: client.coupons.map((c) => {
        const remainingEnquiries = Math.max(0, c.maxLimit - c.currentEnquiries);
        const status = calculateCouponStatus(
          c.enabled,
          c.currentEnquiries,
          c.maxLimit,
          c.expiryType,
          c.expiryDate,
          c.startDate
        );

        let activeDays: number | null = null;
        if (c.expiryType === 'custom' && c.expiryDate) {
          const diffTime = c.expiryDate.getTime() - c.startDate.getTime();
          activeDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        }

        return {
          id: c.id,
          code: c.code,
          referrerName: c.referrerName,
          rewardType: c.rewardType,
          notes: c.notes,
          startDate: c.startDate.toISOString().split('T')[0],
          activeDays,
          maxLimit: c.maxLimit,
          currentEnquiries: c.currentEnquiries,
          remainingEnquiries,
          expiryType: c.expiryType,
          expiryDate: c.expiryDate ? c.expiryDate.toISOString().split('T')[0] : null,
          enabled: c.enabled,
          status,
          createdDate: c.createdAt.toISOString().split('T')[0],
          clientId: c.clientId,
          clientName: c.clientName,
        } as AdminCoupon;
      }),
    };

    return {
      success: true,
      data: payload,
    };
  } catch (error: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[getClientByIdAction] Database Error:', {
        requestedId: id,
        error: error.message || error,
      });
    }
    return {
      success: false,
      error: 'Database query failed.',
      code: 'DB_ERROR' as const,
      reason: error.message || String(error),
    };
  }
}

/**
 * Creates a new client.
 */
export async function createClientAction(data: ClientInput) {
  const parsed = clientSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid input.' };
  }

  const payload = parsed.data;

  try {
    await prisma.client.create({
      data: {
        name: payload.name,
        email: payload.email || null,
        phone: payload.phone || null,
        company: payload.company || null,
        websiteUrl: payload.websiteUrl || null,
        status: payload.status || 'Active',
        creditBalance: payload.creditBalance ?? 0,
        notes: payload.notes || null,
      },
    });

    revalidatePath('/admin/clients');
    return { success: true };
  } catch (error: unknown) {
    console.error('Client creation error:', error);
    const msg = error instanceof Error ? error.message : 'Database error creating client.';
    return { success: false, error: msg };
  }
}

/**
 * Updates an existing client.
 */
export async function updateClientAction(id: string, data: ClientInput) {
  const parsed = clientSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid input.' };
  }

  const payload = parsed.data;

  try {
    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: 'Client not found.' };
    }

    await prisma.client.update({
      where: { id },
      data: {
        name: payload.name,
        email: payload.email || null,
        phone: payload.phone || null,
        company: payload.company || null,
        websiteUrl: payload.websiteUrl || null,
        status: payload.status || 'Active',
        creditBalance: payload.creditBalance ?? 0,
        notes: payload.notes || null,
      },
    });

    revalidatePath('/admin/clients');
    revalidatePath(`/admin/clients/${id}`);
    return { success: true };
  } catch (error: unknown) {
    console.error('Client update error:', error);
    const msg = error instanceof Error ? error.message : 'Database error updating client.';
    return { success: false, error: msg };
  }
}

/**
 * Deletes a client by ID.
 */
export async function deleteClientAction(id: string) {
  try {
    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: 'Client not found.' };
    }

    await prisma.client.delete({ where: { id } });

    revalidatePath('/admin/clients');
    return { success: true };
  } catch (error: unknown) {
    console.error('Client deletion error:', error);
    const msg = error instanceof Error ? error.message : 'Database error deleting client.';
    return { success: false, error: msg };
  }
}
