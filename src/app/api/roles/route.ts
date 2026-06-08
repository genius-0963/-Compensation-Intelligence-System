import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q');
    
    const where = search ? {
      title: { contains: search, mode: 'insensitive' as any }
    } : {};

    const roles = await prisma.role.findMany({
      where,
      orderBy: { title: 'asc' },
      take: 50
    });

    return NextResponse.json(roles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
