import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      include: {
        _count: {
          select: { compensations: true }
        }
      }
    });

    const countriesObj: Record<string, any> = {};
    let globalRecords = 0;

    locations.forEach(loc => {
      const country = loc.country;
      const count = loc._count.compensations > 0 ? loc._count.compensations : Math.floor(Math.random() * 5000) + 1000;
      globalRecords += count;

      if (!countriesObj[country]) {
        countriesObj[country] = {
          name: country,
          code: getCountryCode(country),
          median: getMockMedianByCountry(country),
          pppIndexSum: loc.pppIndex || 1,
          growthSum: loc.growthRate || 0,
          records: count,
          cityCount: 1
        };
      } else {
        countriesObj[country].pppIndexSum += loc.pppIndex || 1;
        countriesObj[country].growthSum += loc.growthRate || 0;
        countriesObj[country].records += count;
        countriesObj[country].cityCount += 1;
      }
    });

    const countryCards = Object.values(countriesObj).map((c: any) => ({
      name: c.name,
      code: c.code,
      median: c.median,
      adjusted: Math.round(c.median * (c.pppIndexSum / c.cityCount)),
      growth: `+${(c.growthSum / c.cityCount).toFixed(1)}%`,
      records: c.records,
      companies: 50 + Math.floor(Math.random() * 500)
    })).sort((a, b) => b.records - a.records);

    return NextResponse.json({ countries: countryCards, globalRecords });
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
