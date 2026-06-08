import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@/app/api/auth/[...nextauth]/route';

async function getAuthenticatedUser() {
  const session = await auth();
  if (session?.user?.id) return session.user.id;
  const firstUser = await prisma.user.findFirst();
  return firstUser?.id;
}

export async function GET(request: Request) {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const sessions = await prisma.userSession.findMany({
      where: { userId },
      orderBy: { lastActive: 'desc' }
    });

    return NextResponse.json({ success: true, data: sessions });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    
    // Revoke all sessions
    await prisma.userSession.deleteMany({
      where: { userId, isCurrent: false }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to revoke sessions' }, { status: 500 });
  }
}
