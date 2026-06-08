import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q');
    
    const where = search ? {
      OR: [
        { city: { contains: search, mode: 'insensitive' as any } },
        { state: { contains: search, mode: 'insensitive' as any } },
        { country: { contains: search, mode: 'insensitive' as any } }
      ]
    } : {};

    const locations = await prisma.location.findMany({
      where,
      orderBy: { city: 'asc' },
      take: 50
    });

    return NextResponse.json(locations);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
