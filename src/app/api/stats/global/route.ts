import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const [
      totalRecords,
      totalCompanies,
      totalLocations,
      totalRoles,
    ] = await Promise.all([
      prisma.compensationEntry.count(),
      prisma.company.count(),
      prisma.location.count(),
      prisma.roleFamily.count(),
    ]);

    // Calculate median and average.
    // In PostgreSQL, computing percentiles is possible natively, but via Prisma we can do raw queries.
    // For simplicity and DB agnosticism here we will fetch a sample or use raw queries depending on the provider.
    
    // We can use Prisma raw query for median since we're using PostgreSQL.
    const tcStats: any = await prisma.$queryRaw`
      SELECT 
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY "totalCompensation") as median_tc,
        AVG("totalCompensation") as avg_tc,
        MAX("totalCompensation") as highest_tc,
        MIN("totalCompensation") as lowest_tc
      FROM "compensation_entries"
    `;

    const stats = tcStats[0];

    return NextResponse.json({
      success: true,
      data: {
        totalRecords,
        uniqueCompanies: totalCompanies,
        uniqueLocations: totalLocations,
        uniqueRoles: totalRoles,
        medianCompensation: Number(stats.median_tc) || 0,
        averageCompensation: Number(stats.avg_tc) || 0,
        highestCompensation: Number(stats.highest_tc) || 0,
        lowestCompensation: Number(stats.lowest_tc) || 0,
      }
    });
  } catch (error) {
    console.error('Error in /api/stats/global:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch global stats' }, { status: 500 });
  }
}
