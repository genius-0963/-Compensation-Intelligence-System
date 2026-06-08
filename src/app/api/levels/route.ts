import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q');
    
    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as any } },
        { code: { contains: search, mode: 'insensitive' as any } }
      ]
    } : {};

    const levels = await prisma.level.findMany({
      where,
      orderBy: { rank: 'asc' },
      take: 50
    });

    return NextResponse.json(levels);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
