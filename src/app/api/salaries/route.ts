import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const company = searchParams.get('company');
    const location = searchParams.get('location');
    const role = searchParams.get('role');
    const sort = searchParams.get('sort') || 'totalCompensation';
    const order = searchParams.get('order') || 'desc';

    const where: any = {};
    
    if (company) {
      where.company = { name: { contains: company, mode: 'insensitive' } };
    }
    if (location) {
      where.location = { city: { contains: location, mode: 'insensitive' } };
    }
    if (role) {
      where.roleFamily = { name: { contains: role, mode: 'insensitive' } };
    }

    const [salaries, total] = await Promise.all([
      prisma.compensationEntry.findMany({
        where,
        include: {
          company: true,
          location: true,
          roleFamily: true,
          level: true,
        },
        orderBy: {
          [sort]: order,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.compensationEntry.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: salaries,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in /api/salaries:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch salaries' }, { status: 500 });
  }
}
