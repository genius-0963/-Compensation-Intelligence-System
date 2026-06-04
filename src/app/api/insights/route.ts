import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const offerId = searchParams.get('offerId');
    
    const where = offerId ? { offerId } : {};
    
    const insights = await prisma.negotiationInsight.findMany({
      where,
      include: { offer: { include: { candidate: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    
    return NextResponse.json(insights);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
