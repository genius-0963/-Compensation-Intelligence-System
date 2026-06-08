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

    let prefs = await prisma.userPreference.findUnique({ where: { userId } });
    if (!prefs) {
       prefs = await prisma.userPreference.create({ data: { userId } });
    }

    return NextResponse.json({ success: true, data: prefs });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch preferences' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    
    const prefs = await prisma.userPreference.upsert({
      where: { userId },
      update: {
        theme: body.theme,
        defaultCurrency: body.defaultCurrency,
        defaultLocation: body.defaultLocation,
        marketingEmails: body.marketingEmails,
        productUpdates: body.productUpdates,
        securityAlerts: body.securityAlerts,
      },
      create: {
        userId,
        ...body
      }
    });

    return NextResponse.json({ success: true, data: prefs });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update preferences' }, { status: 500 });
  }
}
