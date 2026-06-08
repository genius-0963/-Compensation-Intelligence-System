import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // In PostgreSQL we can use native functions, but via Prisma raw queries are easiest for grouping with medians
    const topCompanies: any = await prisma.$queryRaw`
      SELECT 
        c.name as company_name,
        c.id as company_id,
        COUNT(e.id) as record_count,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY e."totalCompensation") as median_tc,
        AVG(e."totalCompensation") as avg_tc
      FROM "companies" c
      JOIN "compensation_entries" e ON c.id = e."companyId"
      GROUP BY c.id, c.name
      HAVING COUNT(e.id) > 5
      ORDER BY median_tc DESC
      LIMIT 10
    `;

    return NextResponse.json({
      success: true,
      data: topCompanies.map((c: any) => ({
        id: c.company_id,
        name: c.company_name,
        recordCount: Number(c.record_count),
        medianCompensation: Number(c.median_tc) || 0,
        averageCompensation: Number(c.avg_tc) || 0,
      }))
    });
  } catch (error) {
    console.error('Error in /api/stats/companies:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch company stats' }, { status: 500 });
  }
}
