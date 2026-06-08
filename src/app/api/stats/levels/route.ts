import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const topLevels: any = await prisma.$queryRaw`
      SELECT 
        l.name as level_name,
        l.code as level_code,
        c.name as company_name,
        COUNT(e.id) as record_count,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY e."totalCompensation") as median_tc,
        AVG(e."totalCompensation") as avg_tc
      FROM "levels" l
      JOIN "companies" c ON l."companyId" = c.id
      JOIN "compensation_entries" e ON l.id = e."levelId"
      GROUP BY l.id, l.name, l.code, c.name
      HAVING COUNT(e.id) > 5
      ORDER BY median_tc DESC
      LIMIT 10
    `;

    return NextResponse.json({
      success: true,
      data: topLevels.map((l: any) => ({
        levelName: l.level_name,
        levelCode: l.level_code,
        companyName: l.company_name,
        recordCount: Number(l.record_count),
        medianCompensation: Number(l.median_tc) || 0,
        averageCompensation: Number(l.avg_tc) || 0,
      }))
    });
  } catch (error) {
    console.error('Error in /api/stats/levels:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch level stats' }, { status: 500 });
  }
}
