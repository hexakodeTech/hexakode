import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/proxy';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function cleanExpiredRateLimits() {
  if (rateLimitMap.size > 1000) {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now > entry.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }
}

function isRateLimited(ip: string, actionKey: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const mapKey = `${ip}:${actionKey}`;
  const entry = rateLimitMap.get(mapKey);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(mapKey, {
      count: 1,
      resetTime: now + windowMs,
    });
    return false;
  }

  entry.count++;
  if (entry.count > limit) {
    return true;
  }
  return false;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isPost = request.method === 'POST';

  // Apply rate limiting on state-changing (POST) sensitive routes
  if (isPost) {
    const ip = request.ip || request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    cleanExpiredRateLimits();

    // 1. Auth endpoints (Login / Reset Password)
    if (pathname === '/api/auth/login' || pathname === '/api/auth/reset-password') {
      if (isRateLimited(ip, 'auth', 5, 60000)) {
        return NextResponse.json(
          { success: false, error: 'Too many requests. Please try again in a minute.' },
          { status: 429 }
        );
      }
    }

    // 2. Contact form & Demo requests (Server Actions POST request with next-action header)
    const isNextAction = request.headers.has('next-action');
    if (isNextAction && (pathname === '/contact' || pathname === '/' || pathname === '/careers')) {
      if (isRateLimited(ip, 'forms', 5, 60000)) {
        return NextResponse.json(
          { success: false, error: 'Too many form submissions. Please try again in a minute.' },
          { status: 429 }
        );
      }
    }

    // 3. File upload rate limiting
    if (pathname === '/api/portfolio/upload') {
      if (isRateLimited(ip, 'upload', 30, 60000)) {
        return NextResponse.json(
          { success: false, error: 'Upload rate limit exceeded. Please try again in a minute.' },
          { status: 429 }
        );
      }
    }
  }

  const { supabaseResponse, user } = await updateSession(request);
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
