import { NextRequest, NextResponse } from 'next/server';
import { loginAction } from '@/lib/auth/actions';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const ipAddress = request.headers.get('x-forwarded-for') || undefined;
    const result = await loginAction(email, password, ipAddress);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error('Login API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error.';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
