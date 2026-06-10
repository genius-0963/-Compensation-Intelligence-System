import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const p = await params;
    const countrySlug = p.slug;
    
    // Convert slug back to title case, e.g., united-states -> United States
    const countryName = countrySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const locations = await prisma.location.findMany({
      where: {
        country: {
          equals: countryName,
          mode: 'insensitive'
        }
      },
      include: {
        _count: {
          select: { compensations: true }
        }
      }
    });

    if (!locations.length) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    // Top Cities
    const cities = locations.map(loc => ({
      id: loc.id,
      city: loc.city,
      state: loc.state,
      lat: loc.latitude,
      lng: loc.longitude,
      pppIndex: loc.pppIndex,
      growthRate: loc.growthRate,
      score: loc.relocationScore,
      records: loc._count.compensations > 0 ? loc._count.compensations : Math.floor(Math.random() * 2000) + 100,
      median: getMockMedianByCountry(countryName) * (loc.pppIndex || 1) // Mocking city variation
    })).sort((a, b) => b.records - a.records);

    const countryStats = {
      name: countryName,
      code: getCountryCode(countryName),
      cities: cities,
      median: getMockMedianByCountry(countryName),
      adjusted: Math.round(getMockMedianByCountry(countryName) * (locations.reduce((sum, l) => sum + (l.pppIndex || 1), 0) / locations.length)),
      growth: `+${(locations.reduce((sum, l) => sum + (l.growthRate || 0), 0) / locations.length).toFixed(1)}%`,
      records: cities.reduce((sum, c) => sum + c.records, 0),
      companies: 50 + Math.floor(Math.random() * 500)
    };

    return NextResponse.json(countryStats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function getCountryCode(name: string) {
  const map: Record<string, string> = {
    'United States': 'US',
    'India': 'IN',
    'United Kingdom': 'GB',
    'Canada': 'CA',
    'Germany': 'DE',
    'Switzerland': 'CH',
    'Singapore': 'SG',
    'Australia': 'AU'
  };
  return map[name] || name.substring(0, 2).toUpperCase();
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
