'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';
import { AdminDemoRequest } from '@/types/admin';

const demoRequestSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  company: z.string().min(1, { message: "Company name is required" }),
  phone: z.string().min(6, { message: "Please enter a valid phone number" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  source: z.string().optional().nullable(),
  inquiryType: z.string().optional().nullable(),
});

export type DemoRequestInput = z.infer<typeof demoRequestSchema>;

/**
 * Submits a new demo request, writes it to the database,
 * and records an AUDIT LOG if system users exist.
 */
export async function submitDemoRequestAction(data: DemoRequestInput) {
  const parsed = demoRequestSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Invalid details.',
    };
  }

  const payload = parsed.data;

  try {
    const demoRequest = await prisma.demoRequest.create({
      data: {
        name: payload.name,
        company: payload.company,
        phone: payload.phone,
        email: payload.email,
        source: payload.source,
        inquiryType: payload.inquiryType,
        status: 'NEW',
      },
    });

    // Audit log link to first active user
    const systemUser = await prisma.user.findFirst({
      where: { status: 'ACTIVE' },
    });

    if (systemUser) {
      await prisma.auditLog.create({
        data: {
          userId: systemUser.id,
          action: 'DEMO_REQUEST_CREATED',
          entityType: 'DemoRequest',
          entityId: demoRequest.id,
        },
      });
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('Demo request creation error:', error);
    const msg = error instanceof Error ? error.message : 'Database error saving demo request.';
    return { success: false, error: msg };
  }
}

/**
 * Returns all demo requests in the database formatted for the admin panel.
 */
export async function getDemoRequestsAction(): Promise<AdminDemoRequest[]> {
  try {
    const list = await prisma.demoRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return list.map((d) => ({
      id: d.id,
      name: d.name,
      company: d.company,
      phone: d.phone,
      email: d.email,
      date: d.createdAt.toISOString().split('T')[0],
      status: d.status,
      meetingLink: d.meetingLink,
      meetingTime: d.meetingTime ? d.meetingTime.toISOString() : null,
      notes: d.notes,
    }));
  } catch (error) {
    console.error('Error fetching demo requests:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch demo requests.');
  }
}

/**
 * Updates status of a demo request in the database.
 */
export async function updateDemoRequestStatusAction(
  id: string,
  status: 'NEW' | 'CONTACTED' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
) {
  try {
    await prisma.demoRequest.update({
      where: { id },
      data: { status },
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating demo request status:', error);
    return { success: false, error: 'Failed to update status.' };
  }
}

/**
 * Deletes a demo request from the database.
 */
export async function deleteDemoRequestAction(id: string) {
  try {
    await prisma.demoRequest.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting demo request:', error);
    return { success: false, error: 'Failed to delete demo request.' };
  }
}

/**
 * Schedules a meeting for a demo request.
 */
export async function scheduleMeetingAction(
  id: string,
  meetingLink: string,
  meetingTime: string,
  notes?: string
) {
  try {
    await prisma.demoRequest.update({
      where: { id },
      data: {
        meetingLink,
        meetingTime: new Date(meetingTime),
        notes: notes || null,
        status: 'SCHEDULED',
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    return { success: false, error: 'Failed to schedule meeting.' };
  }
}

/**
 * Returns summary stats of demo requests for dashboard panels.
 */
export async function getDemoRequestStatsAction() {
  try {
    const total = await prisma.demoRequest.count();
    const newReq = await prisma.demoRequest.count({
      where: { status: 'NEW' },
    });
    const scheduled = await prisma.demoRequest.count({
      where: { status: 'SCHEDULED' },
    });
    const completed = await prisma.demoRequest.count({
      where: { status: 'COMPLETED' },
    });

    return {
      total,
      newRequests: newReq,
      scheduledRequests: scheduled,
      completedRequests: completed,
    };
  } catch (error) {
    console.error('Error fetching demo request stats:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch demo request statistics.');
  }
}
