'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';
import { AdminCoupon } from '@/types/admin';
import { revalidatePath } from 'next/cache';

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
  expiryDate: Date | null,
  startDate: Date
): "Active" | "Expired" | "Exhausted" | "Disabled" | "Scheduled" {
  if (!enabled) {
    return "Disabled";
  }
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  
  if (today < start) {
    return "Scheduled";
  }
  
  if (expiryType === "custom" && expiryDate) {
    const expiry = new Date(expiryDate.getFullYear(), expiryDate.getMonth(), expiryDate.getDate());
    if (today > expiry) {
      return "Expired";
    }
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
      const status = calculateCouponStatus(c.enabled, c.currentEnquiries, c.maxLimit, c.expiryType, c.expiryDate, c.startDate);

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
  startDate: string;
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
  if (!data.startDate) {
    return { success: false, error: "Start date is required." };
  }

  const parsedStartDate = new Date(data.startDate);
  if (isNaN(parsedStartDate.getTime())) {
    return { success: false, error: "Invalid start date selected." };
  }

  if (data.expiryType === "custom") {
    if (!data.expiryDate) {
      return { success: false, error: "Expiry date is required when Custom Date is selected." };
    }
    const parsedExpiryDate = new Date(data.expiryDate);
    if (isNaN(parsedExpiryDate.getTime())) {
      return { success: false, error: "Invalid expiry date selected." };
    }
    
    // Validate that Expiry Date is not earlier than Start Date
    const start = new Date(parsedStartDate.getFullYear(), parsedStartDate.getMonth(), parsedStartDate.getDate());
    const expiry = new Date(parsedExpiryDate.getFullYear(), parsedExpiryDate.getMonth(), parsedExpiryDate.getDate());
    if (expiry < start) {
      return { success: false, error: "Expiry Date cannot be earlier than Start Date." };
    }
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
      const diffTime = parsedExpiryDate.getTime() - parsedStartDate.getTime();
      activeDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: uppercasedCode,
        referrerName: data.referrerName,
        rewardType: data.rewardType,
        notes: data.notes || null,
        startDate: parsedStartDate,
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
    startDate: string;
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
  if (!data.startDate) {
    return { success: false, error: "Start date is required." };
  }

  const parsedStartDate = new Date(data.startDate);
  if (isNaN(parsedStartDate.getTime())) {
    return { success: false, error: "Invalid start date selected." };
  }

  if (data.expiryType === "custom") {
    if (!data.expiryDate) {
      return { success: false, error: "Expiry date is required when Custom Date is selected." };
    }
    const parsedExpiryDate = new Date(data.expiryDate);
    if (isNaN(parsedExpiryDate.getTime())) {
      return { success: false, error: "Invalid expiry date selected." };
    }
    
    // Validate that Expiry Date is not earlier than Start Date
    const start = new Date(parsedStartDate.getFullYear(), parsedStartDate.getMonth(), parsedStartDate.getDate());
    const expiry = new Date(parsedExpiryDate.getFullYear(), parsedExpiryDate.getMonth(), parsedExpiryDate.getDate());
    if (expiry < start) {
      return { success: false, error: "Expiry Date cannot be earlier than Start Date." };
    }
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
      const diffTime = parsedExpiryDate.getTime() - parsedStartDate.getTime();
      activeDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    const updated = await prisma.coupon.update({
      where: { code },
      data: {
        referrerName: data.referrerName,
        rewardType: data.rewardType,
        notes: data.notes || null,
        startDate: parsedStartDate,
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
    const status = calculateCouponStatus(coupon.enabled, coupon.currentEnquiries, coupon.maxLimit, coupon.expiryType, coupon.expiryDate, coupon.startDate);

    let activeDays: number | null = null;
    if (coupon.expiryType === 'custom' && coupon.expiryDate) {
      const diffTime = coupon.expiryDate.getTime() - coupon.startDate.getTime();
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
        startDate: coupon.startDate.toISOString().split('T')[0],
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

    // Start date check
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const start = new Date(coupon.startDate.getFullYear(), coupon.startDate.getMonth(), coupon.startDate.getDate());
    
    if (today < start) {
      return {
        success: false,
        error: 'Referral code is not active yet.',
      };
    }

    // Expiry check
    if (coupon.expiryType === 'custom' && coupon.expiryDate) {
      const expiry = new Date(coupon.expiryDate.getFullYear(), coupon.expiryDate.getMonth(), coupon.expiryDate.getDate());
      if (today > expiry) {
        return {
          success: false,
          error: 'Invalid referral code.',
        };
      }
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
    
    const activeCodes = list.filter((c) => {
      const status = calculateCouponStatus(c.enabled, c.currentEnquiries, c.maxLimit, c.expiryType, c.expiryDate, c.startDate);
      return status === "Active";
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
