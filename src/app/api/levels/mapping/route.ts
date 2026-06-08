import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  try {
    const levels = await prisma.level.findMany({
      include: {
        company: true
      },
      orderBy: {
        normalizedLevelRank: 'asc'
      }
    });

    // Group by rank
    const mapping = new Map();
    levels.forEach(l => {
      if (!l.normalizedLevelRank) return;
      if (!mapping.has(l.normalizedLevelRank)) {
         mapping.set(l.normalizedLevelRank, {
            normalizedRank: l.normalizedLevelRank,
            levels: []
         });
      }
      mapping.get(l.normalizedLevelRank).levels.push({
         companyId: l.company?.id,
         companyName: l.company?.name,
         levelName: l.name,
         levelCode: l.code
      });
    });

    const result = Array.from(mapping.values());

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Mapping Error", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch mapping' }, { status: 500 });
  }
}
