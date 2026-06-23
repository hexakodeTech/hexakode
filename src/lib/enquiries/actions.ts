'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';
import { AdminEnquiry } from '@/types/admin';

const enquirySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid work email" }),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  service: z.string().min(1, { message: "Please select a project type" }),
  budget: z.string().min(1, { message: "Please select a budget range" }),
  couponCode: z.string().optional().nullable(),
  message: z.string().min(10, { message: "Project details must be at least 10 characters" }),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

/**
 * Submits a new contact form enquiry, writes it to the database,
 * and records an ENQUIRY_CREATED audit log.
 */
export async function submitEnquiryAction(data: EnquiryInput) {
  const parsed = enquirySchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Invalid form submission details.',
    };
  }

  const payload = parsed.data;

  try {
    // Create new enquiry
    const enquiry = await prisma.enquiry.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone || null,
        company: payload.company || null,
        service: payload.service,
        budget: payload.budget,
        couponCode: payload.couponCode || null,
        message: payload.message,
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
          action: 'ENQUIRY_CREATED',
          entityType: 'Enquiry',
          entityId: enquiry.id,
        },
      });
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('Enquiry creation error:', error);
    const msg = error instanceof Error ? error.message : 'Database error saving enquiry.';
    return { success: false, error: msg };
  }
}

/**
 * Returns all enquiries in the database formatted for the admin panel.
 */
export async function getEnquiriesAction(): Promise<AdminEnquiry[]> {
  try {
    const list = await prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return list.map((e) => ({
      id: e.id,
      name: e.name,
      email: e.email,
      phone: e.phone || '',
      company: e.company || '',
      projectType: e.service || '',
      couponCode: e.couponCode || '',
      message: e.message,
      date: e.createdAt.toISOString().split('T')[0],
      status: e.status === 'NEW' ? 'New' : e.status === 'ARCHIVED' ? 'Archived' : 'Reviewed',
    }));
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return [];
  }
}

/**
 * Updates status of an enquiry in the database.
 */
export async function updateEnquiryStatusAction(
  id: string,
  status: 'NEW' | 'IN_PROGRESS' | 'RESPONDED' | 'CLOSED' | 'ARCHIVED'
) {
  try {
    await prisma.enquiry.update({
      where: { id },
      data: { status },
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating enquiry status:', error);
    return { success: false, error: 'Failed to update enquiry status.' };
  }
}

/**
 * Deletes an enquiry from the database.
 */
export async function deleteEnquiryAction(id: string) {
  try {
    await prisma.enquiry.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return { success: false, error: 'Failed to delete enquiry.' };
  }
}

/**
 * Returns dashboard metrics and the 5 most recent enquiries.
 */
export async function getDashboardEnquiryStatsAction() {
  try {
    const total = await prisma.enquiry.count();
    const unread = await prisma.enquiry.count({
      where: { status: 'NEW' },
    });
    const list = await prisma.enquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    const recent = list.map((e) => ({
      id: e.id,
      name: e.name,
      email: e.email,
      phone: e.phone || '',
      company: e.company || '',
      projectType: e.service || '',
      message: e.message,
      date: e.createdAt.toISOString().split('T')[0],
      status: e.status === 'NEW' ? 'New' as const : 'Reviewed' as const,
    }));

    return {
      total,
      unread,
      recent,
    };
  } catch (error) {
    console.error('Error fetching dashboard enquiry stats:', error);
    return {
      total: 0,
      unread: 0,
      recent: [],
    };
  }
}
