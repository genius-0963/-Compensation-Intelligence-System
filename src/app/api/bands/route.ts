import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const bands = await prisma.compensationBand.findMany({
      include: {
        role: true,
        level: true,
        location: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    
    return NextResponse.json(bands);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
