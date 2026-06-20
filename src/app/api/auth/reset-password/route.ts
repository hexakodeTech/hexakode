import { NextRequest, NextResponse } from 'next/server';
import { requestPasswordResetAction } from '@/lib/auth/actions';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required.' },
        { status: 400 }
      );
    }

    const ipAddress = request.headers.get('x-forwarded-for') || undefined;
    const result = await requestPasswordResetAction(email, ipAddress);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error('Password Reset API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error.';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
