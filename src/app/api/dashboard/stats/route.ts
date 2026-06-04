import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const employeeCount = await prisma.employee.count();
    const offerCount = await prisma.offer.count({ where: { status: { in: ['PENDING', 'DRAFT'] } } });
    
    // Aggregate salary
    const aggregations = await prisma.employee.aggregate({
      _avg: { totalCompensation: true }
    });
    
    // Department headcount
    const departments = await prisma.department.findMany({
      include: { _count: { select: { employees: true } } }
    });
    
    return NextResponse.json({
      employeeCount,
      offerCount,
      avgSalary: aggregations._avg.totalCompensation || 0,
      departments: departments.map((d: any) => ({
        name: d.name,
        count: d._count.employees
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
