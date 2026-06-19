'use server';

import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function loginAction(email: string, password: string, ipAddress?: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    // Audit log failed login if local user exists
    const localUser = await prisma.user.findUnique({
      where: { email },
    });
    if (localUser) {
      await prisma.auditLog.create({
        data: {
          userId: localUser.id,
          action: 'LOGIN_FAILED',
          entityType: 'User',
          entityId: localUser.id,
          ipAddress,
        },
      });
    }
    return {
      success: false,
      error: error?.message || 'Authentication failed.',
    };
  }

  const supabaseUser = data.user;
  console.log("[DEBUG] Supabase Auth user authenticated successfully:", {
    id: supabaseUser.id,
    email: supabaseUser.email,
    user_metadata: supabaseUser.user_metadata,
  });

  // Find or create local user
  let localUser = await prisma.user.findFirst({
    where: {
      OR: [
        { supabaseId: supabaseUser.id },
        { email: supabaseUser.email! },
      ],
    },
    include: { role: true },
  });

  console.log("[DEBUG] Local user profile search result:", localUser ? {
    id: localUser.id,
    email: localUser.email,
    supabaseId: localUser.supabaseId,
    role: localUser.role.name,
  } : "Not Found");

  if (!localUser) {
    console.log("[DEBUG] Starting automatic user provisioning flow (user not found in local DB).");
    
    // Admin bootstrap check: check if any Super Admin exists
    const superAdminRole = await prisma.role.findFirst({
      where: { name: { equals: 'Super Admin', mode: 'insensitive' } },
    });
    const viewerRole = await prisma.role.findFirst({
      where: { name: { equals: 'Viewer', mode: 'insensitive' } },
    });

    console.log("[DEBUG] Retrieved DB Roles:", {
      superAdminRole: superAdminRole ? { id: superAdminRole.id, name: superAdminRole.name } : "NOT FOUND",
      viewerRole: viewerRole ? { id: viewerRole.id, name: viewerRole.name } : "NOT FOUND",
    });

    if (!superAdminRole || !viewerRole) {
      console.error("[DEBUG] Role initialization check failed. Super Admin or Viewer roles do not exist in DB.");
      return {
        success: false,
        error: 'Database roles not initialized. Please seed roles first.',
      };
    }

    const hasSuperAdmin = await prisma.user.findFirst({
      where: {
        role: {
          name: { equals: 'Super Admin', mode: 'insensitive' },
        },
      },
    });

    console.log("[DEBUG] Super Admin existence check in DB:", hasSuperAdmin ? "Found existing Super Admin" : "No Super Admin exists (First User bootstrap)");

    const assignedRole = hasSuperAdmin ? viewerRole : superAdminRole;
    console.log("[DEBUG] Assigning role to new user:", assignedRole.name);

    localUser = await prisma.user.create({
      data: {
        supabaseId: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.name || supabaseUser.email!.split('@')[0],
        roleId: assignedRole.id,
        status: 'ACTIVE',
        lastLoginAt: new Date(),
      },
      include: { role: true },
    });
    
    console.log("[DEBUG] Automatically provisioned local user profile successfully:", {
      id: localUser.id,
      email: localUser.email,
      role: localUser.role.name,
    });
  } else {
    // Update existing user with supabaseId and lastLoginAt
    console.log("[DEBUG] User already exists locally. Updating supabaseId and lastLoginAt.");
    localUser = await prisma.user.update({
      where: { id: localUser.id },
      data: {
        supabaseId: supabaseUser.id,
        lastLoginAt: new Date(),
      },
      include: { role: true },
    });
    console.log("[DEBUG] Updated local user profile successfully:", {
      id: localUser.id,
      email: localUser.email,
      lastLoginAt: localUser.lastLoginAt,
    });
  }

  // Create audit log for login success
  console.log("[DEBUG] Creating login success audit log entry.");
  await prisma.auditLog.create({
    data: {
      userId: localUser.id,
      action: 'LOGIN_SUCCESS',
      entityType: 'User',
      entityId: localUser.id,
      ipAddress,
    },
  });
  console.log("[DEBUG] Login success audit log created successfully.");


  return {
    success: true,
    user: {
      id: localUser.id,
      email: localUser.email,
      name: localUser.name,
      status: localUser.status,
    },
    role: localUser.role.name,
  };
}

export async function logoutAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const localUser = await prisma.user.findFirst({
      where: {
        OR: [
          { supabaseId: user.id },
          { email: user.email! },
        ],
      },
    });

    if (localUser) {
      await prisma.auditLog.create({
        data: {
          userId: localUser.id,
          action: 'LOGOUT',
          entityType: 'User',
          entityId: localUser.id,
        },
      });
    }
  }

  await supabase.auth.signOut();
  redirect('/admin');
}

export async function requestPasswordResetAction(email: string, ipAddress?: string) {
  const localUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!localUser) {
    return {
      success: false,
      error: 'User with this email does not exist.',
    };
  }

  const request = await prisma.passwordResetRequest.create({
    data: {
      userId: localUser.id,
      status: 'PENDING',
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: localUser.id,
      action: 'PASSWORD_RESET_REQUEST',
      entityType: 'PasswordResetRequest',
      entityId: request.id,
      ipAddress,
    },
  });

  return {
    success: true,
    message: 'Password reset request submitted for admin approval.',
  };
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const localUser = await prisma.user.findFirst({
    where: {
      OR: [
        { supabaseId: user.id },
        { email: user.email! },
      ],
    },
    include: { role: true },
  });

  if (!localUser) return null;

  // Auto-heal/sync supabaseId if missing
  if (!localUser.supabaseId) {
    await prisma.user.update({
      where: { id: localUser.id },
      data: { supabaseId: user.id },
    });
  }

  return {
    user,
    localUser,
    role: localUser.role.name,
  };
}
