import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/proxy';
import prisma from './lib/prisma';

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  // 1. Define public admin routes that do not require authentication
  const isLoginPage = pathname === '/admin' || pathname === '/admin/';

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

    // Protect all other admin/studio routes
    if (!user && process.env.NODE_ENV !== 'development') {
      // Redirect unauthenticated users to login
      const loginUrl = new URL('/admin', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated: check local user profile status
    try {
      if (process.env.NODE_ENV !== 'development' && user) {
        const localUser = await prisma.user.findFirst({
          where: {
            OR: [
              { supabaseId: user.id },
              { email: user.email! },
            ],
          },
        });

        if (!localUser || localUser.status !== 'ACTIVE') {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
      }
    } catch (dbError) {
      console.error('Database check error in proxy:', dbError);
      // Fallback: redirect to login to prevent leaks
      return NextResponse.redirect(new URL('/admin', request.url));
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
