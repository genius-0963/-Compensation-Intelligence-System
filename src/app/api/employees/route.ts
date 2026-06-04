import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        role: true,
        level: true,
        location: true,
        department: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    
    return NextResponse.json(employees);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
