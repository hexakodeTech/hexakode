'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';
import { AdminPortalProject } from '@/types/admin';
import { revalidatePath } from 'next/cache';

const urlSchema = z
  .string()
  .url({ message: 'Please enter a valid URL (e.g. https://example.com)' })
  .refine((v) => v.startsWith('http://') || v.startsWith('https://'), {
    message: 'URL must start with http:// or https://',
  });

const projectSchema = z.object({
  name: z.string().min(1, { message: 'Project name is required' }),
  clientId: z.string().optional().or(z.literal('')),
  websiteUrl: urlSchema.optional().or(z.literal('')),
  adminUrl: urlSchema.optional().or(z.literal('')),
  status: z.string().default('Active'),
  notes: z.string().optional().or(z.literal('')),
});

export type ProjectInput = z.infer<typeof projectSchema>;

/**
 * Returns all projects formatted for the admin table.
 */
export async function getProjectsAction(): Promise<AdminPortalProject[]> {
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
      clientName: p.client?.name || null,
      websiteUrl: p.websiteUrl,
      adminUrl: p.adminUrl,
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
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true } },
        maintenanceLogs: {
          orderBy: { logDate: 'desc' },
        },
      },
    });

    if (!project) return null;

    return {
      project: {
        id: project.id,
        name: project.name,
        clientId: project.clientId,
        clientName: project.client?.name || null,
        websiteUrl: project.websiteUrl,
        adminUrl: project.adminUrl,
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
  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid input.' };
  }

  const payload = parsed.data;

  try {
    await prisma.project.create({
      data: {
        name: payload.name,
        clientId: payload.clientId || null,
        websiteUrl: payload.websiteUrl || null,
        adminUrl: payload.adminUrl || null,
        status: payload.status || 'Active',
        notes: payload.notes || null,
      },
    });

    revalidatePath('/admin/projects');
    revalidatePath('/admin/maintenance-logs');
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

    await prisma.project.update({
      where: { id },
      data: {
        name: payload.name,
        clientId: payload.clientId || null,
        websiteUrl: payload.websiteUrl || null,
        adminUrl: payload.adminUrl || null,
        status: payload.status || 'Active',
        notes: payload.notes || null,
      },
    });

    revalidatePath('/admin/projects');
    revalidatePath(`/admin/projects/${id}`);
    revalidatePath('/admin/maintenance-logs');
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
  try {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: 'Project not found.' };
    }

    await prisma.project.delete({ where: { id } });

    revalidatePath('/admin/projects');
    revalidatePath('/admin/maintenance-logs');
    return { success: true };
  } catch (error: unknown) {
    console.error('Project deletion error:', error);
    const msg = error instanceof Error ? error.message : 'Database error deleting project.';
    return { success: false, error: msg };
  }
}
