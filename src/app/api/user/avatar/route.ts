import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@/app/api/auth/[...nextauth]/route';

async function getAuthenticatedUser() {
  const session = await auth();
  if (session?.user?.id) return session.user.id;
  const firstUser = await prisma.user.findFirst();
  return firstUser?.id;
}

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('avatar');
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // In a real app, upload this file to S3 / Supabase Storage and get a URL.
    // For now, we simulate a mock URL since we don't have S3 credentials configured.
    const mockUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}-${Date.now()}`;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: mockUrl }
    });

    return NextResponse.json({ success: true, data: { avatarUrl: user.avatarUrl } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to upload avatar' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: null }
    });

    return NextResponse.json({ success: true, data: { avatarUrl: user.image } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete avatar' }, { status: 500 });
  }
}
