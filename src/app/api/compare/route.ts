import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { targets } = await req.json(); // Array of { companyId, levelId }

    if (!targets || !Array.isArray(targets)) {
      return NextResponse.json({ error: "Invalid targets" }, { status: 400 });
    }

    const results = await Promise.all(
      targets.map(async (target) => {
        const stats = await prisma.compensationEntry.aggregate({
          where: {
            companyId: target.companyId,
            levelId: target.levelId,
          },
          _avg: {
            baseSalary: true,
            bonus: true,
            stock: true,
            totalCompensation: true,
          },
          _count: true,
        });

        const company = await prisma.company.findUnique({ where: { id: target.companyId } });
        const level = await prisma.level.findUnique({ where: { id: target.levelId } });

        return {
          company,
          level,
          stats,
        };
      })
    );

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: "Comparison failed" }, { status: 500 });
  }
}
