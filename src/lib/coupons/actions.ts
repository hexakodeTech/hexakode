'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';
import { AdminCoupon } from '@/types/admin';
import { revalidatePath } from 'next/cache';

// Validation Schema for creating a coupon
const createCouponSchema = z.object({
  code: z.string()
    .min(3, { message: "Referral code must have a minimum of 3 characters" })
    .regex(/^[A-Z0-9]+$/, { message: "Only letters (A-Z) and numbers (0-9) are allowed" }),
  referrerName: z.string().min(1, { message: "Referrer name is required" }),
  rewardType: z.string().min(1, { message: "Reward type is required" }),
  notes: z.string().optional().nullable(),
  maxLimit: z.number().gt(0, { message: "Maximum referral limit must be greater than 0" }),
  expiryType: z.enum(["custom", "infinite"]),
  expiryDate: z.date().optional().nullable(),
  enabled: z.boolean().default(true),
});

function getBudgetNumericValue(budget: string | null): number {
  if (!budget) return 0;
  switch (budget) {
    case '25k-50k':
      return 37500; // Average of ₹25,000 and ₹50,000
    case '50k-100k':
      return 75000; // Average of ₹50,000 and ₹1,00,000
    case '100k-500k':
      return 300000; // Average of ₹1,00,000 and ₹5,00,000
    case '500k_plus':
      return 500000; // Base value of ₹5,00,000+
    case 'not_sure':
    default:
      return 0;
  }
}

// Helper to determine status
function calculateCouponStatus(
  enabled: boolean,
  currentEnquiries: number,
  maxLimit: number,
  expiryType: string,
  expiryDate: Date | null
): "Active" | "Expired" | "Exhausted" | "Disabled" {
  if (!enabled) {
    return "Disabled";
  }
  if (expiryType === "custom" && expiryDate && new Date() >= expiryDate) {
    return "Expired";
  }
  if (currentEnquiries >= maxLimit) {
    return "Exhausted";
  }
  return "Active";
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
      const status = calculateCouponStatus(c.enabled, c.currentEnquiries, c.maxLimit, c.expiryType, c.expiryDate);

      let activeDays: number | null = null;
      if (c.expiryType === 'custom' && c.expiryDate) {
        const diffTime = c.expiryDate.getTime() - c.createdAt.getTime();
        activeDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      }

      return {
        id: c.id,
        code: c.code,
        referrerName: c.referrerName,
        rewardType: c.rewardType,
        notes: c.notes,
        activeDays,
        maxLimit: c.maxLimit,
        currentEnquiries: c.currentEnquiries,
        remainingEnquiries,
        expiryType: c.expiryType,
        expiryDate: c.expiryDate ? c.expiryDate.toISOString().split('T')[0] : null,
        enabled: c.enabled,
        status,
        createdDate: c.createdAt.toISOString().split('T')[0],
      };
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return [];
  }
}

/**
 * Creates a new coupon, validates parameters, and logs a REFERRAL_CODE_CREATED audit log.
 */
export async function createCouponAction(data: {
  code: string;
  referrerName: string;
  rewardType: string;
  notes?: string | null;
  maxLimit: number;
  expiryType: "custom" | "infinite";
  expiryDate?: string | null;
  enabled: boolean;
}) {
  const uppercasedCode = data.code.toUpperCase().trim();
  
  if (uppercasedCode.length < 3) {
    return { success: false, error: "Referral code must have a minimum of 3 characters." };
  }
  if (!/^[A-Z0-9]+$/.test(uppercasedCode)) {
    return { success: false, error: "Only letters (A-Z) and numbers (0-9) are allowed in the code." };
  }
  if (!data.referrerName || data.referrerName.trim().length === 0) {
    return { success: false, error: "Referrer name is required." };
  }
  if (!data.rewardType || data.rewardType.trim().length === 0) {
    return { success: false, error: "Reward type is required." };
  }
  if (data.maxLimit <= 0) {
    return { success: false, error: "Maximum referral limit must be greater than 0." };
  }
  if (data.expiryType === "custom" && !data.expiryDate) {
    return { success: false, error: "Expiry date is required when Custom Date is selected." };
  }

  try {
    const existing = await prisma.coupon.findUnique({
      where: { code: uppercasedCode },
    });

    if (existing) {
      return {
        success: false,
        error: "Referral code already exists. Please use a unique code.",
      };
    }

    let parsedExpiryDate: Date | null = null;
    let activeDays: number | null = null;
    
    if (data.expiryType === "custom" && data.expiryDate) {
      parsedExpiryDate = new Date(data.expiryDate);
      if (isNaN(parsedExpiryDate.getTime())) {
        return { success: false, error: "Invalid expiry date selected." };
      }
      const diffTime = parsedExpiryDate.getTime() - new Date().getTime();
      activeDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: uppercasedCode,
        referrerName: data.referrerName,
        rewardType: data.rewardType,
        notes: data.notes || null,
        activeDays,
        maxLimit: data.maxLimit,
        expiryType: data.expiryType,
        expiryDate: parsedExpiryDate,
        enabled: data.enabled,
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
          action: 'REFERRAL_CODE_CREATED',
          entityType: 'Coupon',
          entityId: coupon.id,
        },
      });
    }

    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error: unknown) {
    console.error('Referral code creation error:', error);
    const msg = error instanceof Error ? error.message : 'Database error creating referral code.';
    return { success: false, error: msg };
  }
}

/**
 * Updates an existing referral code.
 */
export async function updateCouponAction(
  code: string,
  data: {
    referrerName: string;
    rewardType: string;
    notes?: string | null;
    maxLimit: number;
    expiryType: "custom" | "infinite";
    expiryDate?: string | null;
    enabled: boolean;
  }
) {
  if (!data.referrerName || data.referrerName.trim().length === 0) {
    return { success: false, error: "Referrer name is required." };
  }
  if (!data.rewardType || data.rewardType.trim().length === 0) {
    return { success: false, error: "Reward type is required." };
  }
  if (data.maxLimit <= 0) {
    return { success: false, error: "Maximum referral limit must be greater than 0." };
  }
  if (data.expiryType === "custom" && !data.expiryDate) {
    return { success: false, error: "Expiry date is required when Custom Date is selected." };
  }

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return {
        success: false,
        error: 'Referral code not found.',
      };
    }

    let parsedExpiryDate: Date | null = null;
    let activeDays: number | null = null;

    if (data.expiryType === "custom" && data.expiryDate) {
      parsedExpiryDate = new Date(data.expiryDate);
      if (isNaN(parsedExpiryDate.getTime())) {
        return { success: false, error: "Invalid expiry date selected." };
      }
      const diffTime = parsedExpiryDate.getTime() - coupon.createdAt.getTime();
      activeDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    const updated = await prisma.coupon.update({
      where: { code },
      data: {
        referrerName: data.referrerName,
        rewardType: data.rewardType,
        notes: data.notes || null,
        maxLimit: data.maxLimit,
        expiryType: data.expiryType,
        expiryDate: parsedExpiryDate,
        activeDays,
        enabled: data.enabled,
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
          action: 'REFERRAL_CODE_UPDATED',
          entityType: 'Coupon',
          entityId: updated.id,
        },
      });
    }

    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error) {
    console.error('Referral code update error:', error);
    const msg = error instanceof Error ? error.message : 'Database error updating referral code.';
    return { success: false, error: msg };
  }
}

/**
 * Deletes a referral code.
 */
export async function deleteCouponAction(code: string) {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return {
        success: false,
        error: 'Referral code not found.',
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
          action: 'REFERRAL_CODE_DELETED',
          entityType: 'Coupon',
          entityId: coupon.id,
        },
      });
    }

    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error) {
    console.error('Referral code deletion error:', error);
    const msg = error instanceof Error ? error.message : 'Database error deleting referral code.';
    return { success: false, error: msg };
  }
}

/**
 * Fetches specific referral code details and the list of enquiries associated with it.
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
      where: {
        OR: [
          { couponCode: code },
          { referralCode: code }
        ]
      },
      orderBy: { createdAt: 'desc' },
    });

    const remainingEnquiries = Math.max(0, coupon.maxLimit - coupon.currentEnquiries);
    const status = calculateCouponStatus(coupon.enabled, coupon.currentEnquiries, coupon.maxLimit, coupon.expiryType, coupon.expiryDate);

    let activeDays: number | null = null;
    if (coupon.expiryType === 'custom' && coupon.expiryDate) {
      const diffTime = coupon.expiryDate.getTime() - coupon.createdAt.getTime();
      activeDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    const mappedEnquiries = enquiries.map((e) => ({
      id: e.id,
      name: e.name,
      email: e.email,
      phone: e.phone || '',
      company: e.company || '',
      projectType: e.service || '',
      couponCode: e.couponCode || '',
      referralCode: e.referralCode || e.couponCode || '',
      referredBy: e.referredBy || '',
      message: e.message,
      date: e.createdAt.toISOString().split('T')[0],
      status: e.status === 'NEW' ? 'New' as const : e.status === 'ARCHIVED' ? 'Archived' as const : 'Reviewed' as const,
    }));

    return {
      coupon: {
        id: coupon.id,
        code: coupon.code,
        referrerName: coupon.referrerName,
        rewardType: coupon.rewardType,
        notes: coupon.notes,
        activeDays,
        maxLimit: coupon.maxLimit,
        currentEnquiries: coupon.currentEnquiries,
        remainingEnquiries,
        expiryType: coupon.expiryType,
        expiryDate: coupon.expiryDate ? coupon.expiryDate.toISOString().split('T')[0] : null,
        enabled: coupon.enabled,
        status,
        createdDate: coupon.createdAt.toISOString().split('T')[0],
      },
      enquiries: mappedEnquiries,
    };
  } catch (error) {
    console.error('Error fetching referral details:', error);
    return null;
  }
}

/**
 * Public validation endpoint for verification in client forms.
 * Follows the requirement: Success: "Referral code applied successfully."
 * Error: "Invalid referral code." (for any validation failure).
 */
export async function validateCouponAction(code: string) {
  const uppercased = code.toUpperCase().trim();
  if (uppercased.length < 3) {
    return {
      success: false,
      error: 'Invalid referral code.',
    };
  }

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: uppercased },
    });

    if (!coupon) {
      return {
        success: false,
        error: 'Invalid referral code.',
      };
    }

    // Enabled check
    if (!coupon.enabled) {
      return {
        success: false,
        error: 'Invalid referral code.',
      };
    }

    // Expiry check
    if (coupon.expiryType === 'custom' && coupon.expiryDate && new Date() >= coupon.expiryDate) {
      return {
        success: false,
        error: 'Invalid referral code.',
      };
    }

    // Limit check
    if (coupon.currentEnquiries >= coupon.maxLimit) {
      return {
        success: false,
        error: 'Invalid referral code.',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error validating referral code:', error);
    return {
      success: false,
      error: 'Invalid referral code.',
    };
  }
}

/**
 * Returns statistics dashboard data for the referral program page.
 */
export async function getReferralStatsAction() {
  try {
    const list = await prisma.coupon.findMany();
    const totalCodes = list.length;
    
    const now = new Date();
    const activeCodes = list.filter((c) => {
      const isExpired = c.expiryType === 'custom' && c.expiryDate && now >= c.expiryDate;
      const isExhausted = c.currentEnquiries >= c.maxLimit;
      return c.enabled && !isExpired && !isExhausted;
    }).length;

    const totalReferrals = list.reduce((sum, c) => sum + c.currentEnquiries, 0);

    const enquiries = await prisma.enquiry.findMany({
      where: {
        OR: [
          { referralCode: { not: null } },
          { couponCode: { not: null } }
        ]
      },
      select: {
        budget: true
      }
    });

    const totalRevenue = enquiries.reduce((sum, e) => {
      return sum + getBudgetNumericValue(e.budget);
    }, 0);

    return {
      totalCodes,
      activeCodes,
      totalReferrals,
      totalRevenue
    };
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    return {
      totalCodes: 0,
      activeCodes: 0,
      totalReferrals: 0,
      totalRevenue: 0
    };
  }
}
