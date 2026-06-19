import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

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
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error('Logout API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error.';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
