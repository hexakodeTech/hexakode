'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';
import { AdminClient } from '@/types/admin';
import { revalidatePath } from 'next/cache';

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
      },
    });

    if (!client) return null;

    return {
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
        websiteUrl: p.websiteUrl,
        adminUrl: p.adminUrl,
        status: p.status,
        notes: p.notes,
        logCount: p._count.maintenanceLogs,
        createdDate: p.createdAt.toISOString().split('T')[0],
      })),
    };
  } catch (error) {
    console.error('Error fetching client by id:', error);
    return null;
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
