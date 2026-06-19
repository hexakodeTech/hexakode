import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/proxy';
import prisma from './lib/prisma';
import { hasAccess } from './lib/auth/rbac';

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  // 1. Define public admin routes that do not require authentication
  const isLoginPage = pathname === '/admin' || pathname === '/admin/';
  const isUnauthorizedPage =
    pathname === '/admin/unauthorized' || pathname === '/admin/unauthorized/';

  // 2. Route protection for /admin/* and /studio/*
  const isAdminOrStudioPath = pathname.startsWith('/admin') || pathname.startsWith('/studio');

  if (isAdminOrStudioPath) {
    if (isLoginPage) {
      // If already logged in, redirect to dashboard
      if (user) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return supabaseResponse;
    }

    if (isUnauthorizedPage) {
      return supabaseResponse;
    }

    // Protect all other admin/studio routes
    if (!user) {
      // Redirect unauthenticated users to login
      const loginUrl = new URL('/admin', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated: check local user profile and RBAC
    try {
      const localUser = await prisma.user.findFirst({
        where: {
          OR: [
            { supabaseId: user.id },
            { email: user.email! },
          ],
        },
        include: { role: true },
      });

      if (!localUser || localUser.status !== 'ACTIVE') {
        return NextResponse.redirect(new URL('/admin/unauthorized', request.url));
      }

      // Check role permissions using hasAccess helper
      if (!hasAccess(localUser.role.name, pathname)) {
        return NextResponse.redirect(new URL('/admin/unauthorized', request.url));
      }
    } catch (dbError) {
      console.error('Database check error in proxy:', dbError);
      // Fallback: during migrations or seed, redirect to unauthorized to prevent leaks
      return NextResponse.redirect(new URL('/admin/unauthorized', request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Images/assets matching typical extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
