import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const topLocations: any = await prisma.$queryRaw`
      SELECT 
        l.city as city,
        l.country as country,
        l.id as location_id,
        COUNT(e.id) as record_count,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY e."totalCompensation") as median_tc,
        AVG(e."totalCompensation") as avg_tc
      FROM "locations" l
      JOIN "compensation_entries" e ON l.id = e."locationId"
      GROUP BY l.id, l.city, l.country
      HAVING COUNT(e.id) > 5
      ORDER BY median_tc DESC
      LIMIT 10
    `;

    return NextResponse.json({
      success: true,
      data: topLocations.map((l: any) => ({
        id: l.location_id,
        city: l.city,
        country: l.country,
        recordCount: Number(l.record_count),
        medianCompensation: Number(l.median_tc) || 0,
        averageCompensation: Number(l.avg_tc) || 0,
      }))
    });
  } catch (error) {
    console.error('Error in /api/stats/locations:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch location stats' }, { status: 500 });
  }
}
