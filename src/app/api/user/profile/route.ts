import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@/app/api/auth/[...nextauth]/route';

async function getAuthenticatedUser() {
  const session = await auth();
  if (session?.user?.id) {
    return session.user.id;
  }
  // Fallback to first user for local dev if no session
  const firstUser = await prisma.user.findFirst();
  return firstUser?.id;
}

export async function GET(request: Request) {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        avatarUrl: true,
        currentCompany: true,
        level: true,
        yearsExperience: true,
        location: true,
        roleFamily: true,
        linkedinUrl: true,
        githubUrl: true,
        portfolioUrl: true,
        bio: true,
      }
    });

    if (user) {
       user.avatarUrl = user.avatarUrl || user.image;
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Profile GET Error", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    
    // Whitelist editable fields
    const dataToUpdate = {
      name: body.name,
      email: body.email,
      currentCompany: body.currentCompany,
      yearsExperience: body.yearsExperience ? parseFloat(body.yearsExperience) : undefined,
      location: body.location,
      bio: body.bio,
    };

    // Remove undefined
    Object.keys(dataToUpdate).forEach(key => dataToUpdate[key as keyof typeof dataToUpdate] === undefined && delete dataToUpdate[key as keyof typeof dataToUpdate]);

    const user = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    if (user) {
       user.avatarUrl = user.avatarUrl || user.image;
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Profile PUT Error", error);
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
  }
}
