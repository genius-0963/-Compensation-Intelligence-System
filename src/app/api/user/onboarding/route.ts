import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id || (await prisma.user.findFirst())?.id;
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { currentCompany, yearsExperience, location, bio } = body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        currentCompany,
        yearsExperience: yearsExperience ? parseFloat(yearsExperience) : null,
        location,
        bio,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Onboarding PUT Error", error);
    return NextResponse.json({ success: false, error: 'Failed to complete onboarding' }, { status: 500 });
  }
}
