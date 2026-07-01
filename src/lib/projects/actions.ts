'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';
import { AdminPortalProject } from '@/types/admin';
import { revalidatePath } from 'next/cache';
import { calculateCouponStatus } from '../coupons/utils';
import { verifyAdminAuth } from '@/lib/auth/utils';

const urlSchema = z
  .string()
  .url({ message: 'Please enter a valid URL (e.g. https://example.com)' })
  .refine((v) => v.startsWith('http://') || v.startsWith('https://'), {
    message: 'URL must start with http:// or https://',
  });

const repositoryUrlSchema = z
  .string()
  .url({ message: 'Please enter a valid URL (e.g. https://github.com/username/project)' })
  .refine((v) => v.startsWith('https://'), {
    message: 'Repository URL must start with https://',
  });

const packageIdRegex = /^[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)+$/;
const packageIdSchema = z.string().optional().or(z.literal(''))
  .refine(
    (val) => !val || packageIdRegex.test(val),
    { message: 'Invalid format. Use com.company.app' }
  );

const projectSchema = z.object({
  name: z.string().min(1, { message: 'Project name is required' }),
  clientId: z.string().uuid({ message: 'Client ID is required' }),
  projectType: z.enum(['web', 'mobile']).default('web'),
  websiteUrl: urlSchema.optional().or(z.literal('')),
  adminPanelUrl: urlSchema.optional().or(z.literal('')),
  androidPackage: packageIdSchema,
  iosBundleId: packageIdSchema,
  playStoreUrl: urlSchema.optional().or(z.literal('')),
  appStoreUrl: urlSchema.optional().or(z.literal('')),
  repositoryUrl: repositoryUrlSchema.optional().or(z.literal('')),
  status: z.string().default('Active'),
  notes: z.string().optional().or(z.literal('')),
});

export type ProjectInput = z.infer<typeof projectSchema>;

/**
 * Returns all projects formatted for the admin table.
 */
export async function getProjectsAction(): Promise<AdminPortalProject[]> {
  await verifyAdminAuth();
  try {
    const list = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { name: true } },
        _count: { select: { maintenanceLogs: true } },
      },
    });

    return list.map((p) => ({
      id: p.id,
      name: p.name,
      clientId: p.clientId,
      clientName: p.client.name,
      projectType: p.projectType,
      websiteUrl: p.websiteUrl,
      adminPanelUrl: p.adminPanelUrl,
      androidPackage: p.androidPackage,
      iosBundleId: p.iosBundleId,
      playStoreUrl: p.playStoreUrl,
      appStoreUrl: p.appStoreUrl,
      repositoryUrl: p.repositoryUrl,
      status: p.status,
      notes: p.notes,
      logCount: p._count.maintenanceLogs,
      createdDate: p.createdAt.toISOString().split('T')[0],
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

/**
 * Returns a single project with its maintenance logs.
 */
export async function getProjectByIdAction(id: string) {
  await verifyAdminAuth();
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true, creditBalance: true } },
        maintenanceLogs: {
          orderBy: { logDate: 'desc' },
        },
        coupons: {
          select: {
            id: true,
            code: true,
            referrerName: true,
            rewardType: true,
            enabled: true,
            currentEnquiries: true,
            maxLimit: true,
            expiryType: true,
            expiryDate: true,
            startDate: true,
          }
        }
      },
    });

    if (!project) return null;

    const mappedCoupons = project.coupons.map((c) => {
      const status = calculateCouponStatus(
        c.enabled,
        c.currentEnquiries,
        c.maxLimit,
        c.expiryType,
        c.expiryDate,
        c.startDate
      );
      return {
        id: c.id,
        code: c.code,
        referrerName: c.referrerName || '',
        rewardType: c.rewardType || '',
        status,
      };
    });

    return {
      project: {
        id: project.id,
        name: project.name,
        clientId: project.clientId,
        clientName: project.client.name,
        clientCreditBalance: project.client.creditBalance,
        projectType: project.projectType,
        websiteUrl: project.websiteUrl,
        adminPanelUrl: project.adminPanelUrl,
        androidPackage: project.androidPackage,
        iosBundleId: project.iosBundleId,
        playStoreUrl: project.playStoreUrl,
        appStoreUrl: project.appStoreUrl,
        repositoryUrl: project.repositoryUrl,
        status: project.status,
        notes: project.notes,
        logCount: project.maintenanceLogs.length,
        createdDate: project.createdAt.toISOString().split('T')[0],
      } as AdminPortalProject,
      logs: project.maintenanceLogs.map((l) => ({
        id: l.id,
        projectId: l.projectId,
        projectName: project.name,
        projectWebsiteUrl: project.websiteUrl,
        title: l.title,
        description: l.description,
        logDate: l.logDate.toISOString().split('T')[0],
        createdDate: l.createdAt.toISOString().split('T')[0],
      })),
      coupons: mappedCoupons,
    };
  } catch (error) {
    console.error('Error fetching project by id:', error);
    return null;
  }
}

/**
 * Creates a new project.
 */
export async function createProjectAction(data: ProjectInput) {
  await verifyAdminAuth();
  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid input.' };
  }

  const payload = parsed.data;

  try {
    const isWeb = payload.projectType === 'web';
    await prisma.project.create({
      data: {
        name: payload.name,
        client: { connect: { id: payload.clientId } },
        projectType: payload.projectType,
        websiteUrl: isWeb ? (payload.websiteUrl || null) : null,
        adminPanelUrl: isWeb ? (payload.adminPanelUrl || null) : null,
        androidPackage: !isWeb ? (payload.androidPackage || null) : null,
        iosBundleId: !isWeb ? (payload.iosBundleId || null) : null,
        playStoreUrl: !isWeb ? (payload.playStoreUrl || null) : null,
        appStoreUrl: !isWeb ? (payload.appStoreUrl || null) : null,
        repositoryUrl: payload.repositoryUrl || null,
        status: payload.status || 'Active',
        notes: payload.notes || null,
      },
    });

    revalidatePath('/admin/clients');
    revalidatePath(`/admin/clients/${payload.clientId}`);
    return { success: true };
  } catch (error: unknown) {
    console.error('Project creation error:', error);
    const msg = error instanceof Error ? error.message : 'Database error creating project.';
    return { success: false, error: msg };
  }
}

/**
 * Updates an existing project.
 */
export async function updateProjectAction(id: string, data: ProjectInput) {
  await verifyAdminAuth();
  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid input.' };
  }

  const payload = parsed.data;

  try {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: 'Project not found.' };
    }

    const isWeb = payload.projectType === 'web';
    await prisma.project.update({
      where: { id },
      data: {
        name: payload.name,
        client: { connect: { id: payload.clientId } },
        projectType: payload.projectType,
        websiteUrl: isWeb ? (payload.websiteUrl || null) : null,
        adminPanelUrl: isWeb ? (payload.adminPanelUrl || null) : null,
        androidPackage: !isWeb ? (payload.androidPackage || null) : null,
        iosBundleId: !isWeb ? (payload.iosBundleId || null) : null,
        playStoreUrl: !isWeb ? (payload.playStoreUrl || null) : null,
        appStoreUrl: !isWeb ? (payload.appStoreUrl || null) : null,
        repositoryUrl: payload.repositoryUrl || null,
        status: payload.status || 'Active',
        notes: payload.notes || null,
      },
    });

    revalidatePath('/admin/clients');
    revalidatePath(`/admin/clients/${payload.clientId}`);
    revalidatePath(`/admin/clients/${payload.clientId}/projects/${id}`);
    return { success: true };
  } catch (error: unknown) {
    console.error('Project update error:', error);
    const msg = error instanceof Error ? error.message : 'Database error updating project.';
    return { success: false, error: msg };
  }
}

/**
 * Deletes a project by ID.
 */
export async function deleteProjectAction(id: string) {
  await verifyAdminAuth();
  try {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: 'Project not found.' };
    }

    await prisma.project.delete({ where: { id } });

    revalidatePath('/admin/clients');
    revalidatePath(`/admin/clients/${existing.clientId}`);
    return { success: true };
  } catch (error: unknown) {
    console.error('Project deletion error:', error);
    const msg = error instanceof Error ? error.message : 'Database error deleting project.';
    return { success: false, error: msg };
  }
}

/**
 * Fetches all active projects for a specific client.
 */
export async function getProjectsByClientAction(clientId: string) {
  await verifyAdminAuth();
  try {
    const list = await prisma.project.findMany({
      where: {
        clientId,
        status: "Active",
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });
    return { success: true, data: list };
  } catch (error) {
    console.error("Error fetching projects by client:", error);
    return { success: false, error: "Failed to fetch client projects." };
  }
}
