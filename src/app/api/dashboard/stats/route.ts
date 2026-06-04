import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    // New production metrics
    const compensationCount = await prisma.compensationEntry.count();
    const submissionCount = await prisma.compensationSubmission.count({
        where: { status: 'SUBMITTED' }
    });
    
    // Aggregate salary
    const stats = await prisma.compensationEntry.aggregate({
      _avg: { totalCompensation: true },
      _count: true,
    });

    return NextResponse.json({
      employeeCount: compensationCount, 
      offerCount: submissionCount,
      avgSalary: stats._avg.totalCompensation || 0,
      departments: [], // Placeholder for now
      recentOffers: [] // Placeholder for now
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
