'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';
import { AdminCoupon } from '@/types/admin';
import { revalidatePath } from 'next/cache';

// Validation Schema for creating a coupon
const createCouponSchema = z.object({
  code: z.string()
    .min(3, { message: "Coupon code must have a minimum of 3 characters" })
    .regex(/^[A-Z0-9]+$/, { message: "Only letters (A-Z) and numbers (0-9) are allowed" }),
  activeDays: z.number().gt(0, { message: "Active days must be greater than 0" }),
  maxLimit: z.number().gt(0, { message: "Maximum enquiry limit must be greater than 0" }),
});

// Helper to determine status
function calculateCouponStatus(
  currentEnquiries: number,
  maxLimit: number,
  expiryDate: Date
): "ACTIVE" | "EXPIRED" | "LIMIT REACHED" {
  if (new Date() >= expiryDate) {
    return "EXPIRED";
  }
  if (currentEnquiries >= maxLimit) {
    return "LIMIT REACHED";
  }
  return "ACTIVE";
}

/**
 * Fetches all coupons, calculates dynamic status and remaining enquiries.
 */
export async function getCouponsAction(): Promise<AdminCoupon[]> {
  try {
    const list = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return list.map((c) => {
      const remainingEnquiries = Math.max(0, c.maxLimit - c.currentEnquiries);
      const status = calculateCouponStatus(c.currentEnquiries, c.maxLimit, c.expiryDate);

      return {
        id: c.id,
        code: c.code,
        activeDays: c.activeDays,
        maxLimit: c.maxLimit,
        currentEnquiries: c.currentEnquiries,
        remainingEnquiries,
        status,
        createdDate: c.createdAt.toISOString().split('T')[0],
        expiryDate: c.expiryDate.toISOString().split('T')[0],
      };
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return [];
  }
}

/**
 * Creates a new coupon, validates parameters, and logs a COUPON_CREATED audit log.
 */
export async function createCouponAction(data: {
  code: string;
  activeDays: number;
  maxLimit: number;
}) {
  // Convert code to uppercase
  const uppercasedCode = data.code.toUpperCase();
  const parsed = createCouponSchema.safeParse({
    code: uppercasedCode,
    activeDays: data.activeDays,
    maxLimit: data.maxLimit,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Invalid coupon details.',
    };
  }

  const { code, activeDays, maxLimit } = parsed.data;

  try {
    // Check uniqueness
    const existing = await prisma.coupon.findUnique({
      where: { code },
    });

    if (existing) {
      return {
        success: false,
        error: "Coupon code already exists. Please use a unique code.",
      };
    }

    // Expiry Date calculation
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + activeDays);

    const coupon = await prisma.coupon.create({
      data: {
        code,
        activeDays,
        maxLimit,
        expiryDate,
      },
    });

    // Audit Log
    const systemUser = await prisma.user.findFirst({
      where: { status: 'ACTIVE' },
    });

    if (systemUser) {
      await prisma.auditLog.create({
        data: {
          userId: systemUser.id,
          action: 'COUPON_CREATED',
          entityType: 'Coupon',
          entityId: coupon.id,
        },
      });
    }

    // Revalidate paths
    revalidatePath('/admin/coupons');

    return { success: true };
  } catch (error: unknown) {
    console.error('Coupon creation error:', error);
    const msg = error instanceof Error ? error.message : 'Database error creating coupon.';
    return { success: false, error: msg };
  }
}

/**
 * Updates activeDays and maxLimit. Recalculates expiryDate based on original createdAt.
 */
export async function updateCouponAction(
  code: string,
  data: { activeDays: number; maxLimit: number }
) {
  if (data.activeDays <= 0 || data.maxLimit <= 0) {
    return {
      success: false,
      error: 'Values must be greater than 0.',
    };
  }

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return {
        success: false,
        error: 'Coupon not found.',
      };
    }

    // Recalculate expiry from original createdAt
    const newExpiryDate = new Date(coupon.createdAt);
    newExpiryDate.setDate(newExpiryDate.getDate() + data.activeDays);

    const updated = await prisma.coupon.update({
      where: { code },
      data: {
        activeDays: data.activeDays,
        maxLimit: data.maxLimit,
        expiryDate: newExpiryDate,
      },
    });

    // Audit Log
    const systemUser = await prisma.user.findFirst({
      where: { status: 'ACTIVE' },
    });

    if (systemUser) {
      await prisma.auditLog.create({
        data: {
          userId: systemUser.id,
          action: 'COUPON_UPDATED',
          entityType: 'Coupon',
          entityId: updated.id,
        },
      });
    }

    // Revalidate paths
    revalidatePath('/admin/coupons');

    return { success: true };
  } catch (error) {
    console.error('Coupon update error:', error);
    const msg = error instanceof Error ? error.message : 'Database error updating coupon.';
    return { success: false, error: msg };
  }
}

/**
 * Deletes a coupon.
 */
export async function deleteCouponAction(code: string) {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return {
        success: false,
        error: 'Coupon not found.',
      };
    }

    await prisma.coupon.delete({
      where: { code },
    });

    // Audit Log
    const systemUser = await prisma.user.findFirst({
      where: { status: 'ACTIVE' },
    });

    if (systemUser) {
      await prisma.auditLog.create({
        data: {
          userId: systemUser.id,
          action: 'COUPON_DELETED',
          entityType: 'Coupon',
          entityId: coupon.id,
        },
      });
    }

    // Revalidate paths
    revalidatePath('/admin/coupons');

    return { success: true };
  } catch (error) {
    console.error('Coupon deletion error:', error);
    const msg = error instanceof Error ? error.message : 'Database error deleting coupon.';
    return { success: false, error: msg };
  }
}

/**
 * Fetches specific coupon details and the list of enquiries associated with it.
 */
export async function getCouponDetailsAction(code: string) {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return null;
    }

    const enquiries = await prisma.enquiry.findMany({
      where: { couponCode: code },
      orderBy: { createdAt: 'desc' },
    });

    const remainingEnquiries = Math.max(0, coupon.maxLimit - coupon.currentEnquiries);
    const status = calculateCouponStatus(coupon.currentEnquiries, coupon.maxLimit, coupon.expiryDate);

    const mappedEnquiries = enquiries.map((e) => ({
      id: e.id,
      name: e.name,
      email: e.email,
      phone: e.phone || '',
      company: e.company || '',
      projectType: e.service || '',
      couponCode: e.couponCode || '',
      message: e.message,
      date: e.createdAt.toISOString().split('T')[0],
      status: e.status === 'NEW' ? 'New' as const : e.status === 'ARCHIVED' ? 'Archived' as const : 'Reviewed' as const,
    }));

    return {
      coupon: {
        id: coupon.id,
        code: coupon.code,
        activeDays: coupon.activeDays,
        maxLimit: coupon.maxLimit,
        currentEnquiries: coupon.currentEnquiries,
        remainingEnquiries,
        status,
        createdDate: coupon.createdAt.toISOString().split('T')[0],
        expiryDate: coupon.expiryDate.toISOString().split('T')[0],
      },
      enquiries: mappedEnquiries,
    };
  } catch (error) {
    console.error('Error fetching coupon details:', error);
    return null;
  }
}

/**
 * Public validation endpoint for verification in client forms.
 */
export async function validateCouponAction(code: string) {
  const uppercased = code.toUpperCase().trim();
  if (uppercased.length < 3) {
    return {
      success: false,
      error: 'Invalid coupon code entered.',
    };
  }

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: uppercased },
    });

    if (!coupon) {
      return {
        success: false,
        error: 'Invalid coupon code entered.',
      };
    }

    // Expiry check
    if (new Date() >= coupon.expiryDate) {
      return {
        success: false,
        error: 'This coupon has expired.',
      };
    }

    // Limit check
    if (coupon.currentEnquiries >= coupon.maxLimit) {
      return {
        success: false,
        error: 'This coupon has reached its maximum enquiry limit.',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error validating coupon:', error);
    return {
      success: false,
      error: 'System error validating coupon code.',
    };
  }
}
