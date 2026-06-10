import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const p = await params;
    const citySlug = p.slug;
    
    // Slug to title case
    const cityName = citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const location = await prisma.location.findFirst({
      where: {
        city: {
          equals: cityName,
          mode: 'insensitive'
        }
      },
      include: {
        _count: {
          select: { compensations: true }
        }
      }
    });

    if (!location) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    const records = location._count.compensations > 0 ? location._count.compensations : Math.floor(Math.random() * 2000) + 100;
    const baseMedian = getMockMedianByCountry(location.country);
    const localMedian = Math.round(baseMedian * (location.pppIndex || 1));

    return NextResponse.json({
      id: location.id,
      city: location.city,
      state: location.state,
      country: location.country,
      lat: location.latitude,
      lng: location.longitude,
      pppIndex: location.pppIndex,
      growthRate: location.growthRate,
      relocationScore: location.relocationScore,
      records: records,
      median: localMedian,
      adjusted: Math.round(localMedian * (location.pppIndex || 1)),
      companies: 20 + Math.floor(Math.random() * 100),
      currency: location.currency,
      costOfLivingIndex: location.costOfLivingIndex,
      // For trends chart
      trends: [
        { year: 2020, value: localMedian * 0.8 },
        { year: 2021, value: localMedian * 0.85 },
        { year: 2022, value: localMedian * 0.95 },
        { year: 2023, value: localMedian * 1.05 },
        { year: 2024, value: localMedian }
      ]
    });
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
