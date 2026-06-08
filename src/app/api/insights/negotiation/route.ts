import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const offerId = searchParams.get('offerId');
    const severity = searchParams.get('severity');
    const category = searchParams.get('category');

    const where: any = {};
    if (offerId) where.offerId = offerId;
    if (severity) where.severity = severity;
    if (category) where.category = category;

    const insights = await prisma.negotiationInsight.findMany({
      where,
      include: {
        offer: {
          include: {
            candidate: true,
            role: true,
            level: true,
            location: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(insights);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
