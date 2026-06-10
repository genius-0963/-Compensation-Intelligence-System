import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const locationsParam = searchParams.get('locations'); // e.g. "seattle,bangalore"
    
    if (!locationsParam) {
      return NextResponse.json({ error: "Missing locations parameter" }, { status: 400 });
    }

    const cityNames = locationsParam.split(',').map(s => s.trim().replace(/-/g, ' '));

    const locations = await prisma.location.findMany({
      where: {
        city: {
          in: cityNames,
          mode: 'insensitive'
        }
      },
      include: {
        _count: {
          select: { compensations: true }
        }
      }
    });

    const compareData = locations.map(loc => {
      const records = loc._count.compensations > 0 ? loc._count.compensations : Math.floor(Math.random() * 2000) + 100;
      const baseMedian = getMockMedianByCountry(loc.country);
      const localMedian = Math.round(baseMedian * (loc.pppIndex || 1));

      return {
        id: loc.id,
        city: loc.city,
        country: loc.country,
        median: localMedian,
        adjusted: Math.round(localMedian * (loc.pppIndex || 1)),
        costOfLiving: loc.costOfLivingIndex,
        ppp: loc.pppIndex,
        growth: loc.growthRate,
        score: loc.relocationScore,
        records: records,
      };
    });

    return NextResponse.json(compareData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function getMockMedianByCountry(name: string) {
  const map: Record<string, number> = {
    'United States': 248000,
    'India': 65000,
    'United Kingdom': 135000,
    'Canada': 155000,
    'Germany': 110000,
    'Switzerland': 220000,
    'Singapore': 165000,
    'Australia': 140000
  };
  return map[name] || 120000;
}
