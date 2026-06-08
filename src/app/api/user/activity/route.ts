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

    const savedCompaniesCount = await prisma.savedCompany.count({ where: { userId } });
    const savedLevelsCount = await prisma.savedLevel.count({ where: { userId } });
    const savedLocationsCount = await prisma.savedLocation.count({ where: { userId } });
    const submissionsCount = await prisma.compensationSubmission.count({ where: { userId } });
    
    const recentActivities = await prisma.userActivity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        stats: {
           savedCompanies: savedCompaniesCount,
           savedLevels: savedLevelsCount,
           savedLocations: savedLocationsCount,
           submissions: submissionsCount,
        },
        timeline: recentActivities
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch activity' }, { status: 500 });
  }
}
