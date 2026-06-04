import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const submissionId = searchParams.get("submissionId");

    const where = submissionId ? { submissionId } : {};

    const insights = await prisma.compensationInsight.findMany({
      where,
      include: { submission: { include: { company: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(insights);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
