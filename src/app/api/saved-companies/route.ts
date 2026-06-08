import { auth } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const savedCompanies = await prisma.savedCompany.findMany({
      where: { userId: session.user.id },
      include: {
        company: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(savedCompanies, { status: 200 });
  } catch (error) {
    console.error("GET_SAVED_COMPANIES_ERROR", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}

const postSchema = z.object({
  companyId: z.string(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = postSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.issues, { status: 400 });
    }

    const { companyId, notes } = validation.data;

    const savedCompany = await prisma.savedCompany.create({
      data: {
        userId: session.user.id,
        companyId,
        notes,
      },
    });

    return NextResponse.json(savedCompany, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ message: "Company already saved" }, { status: 409 });
    }
    console.error("POST_SAVED_COMPANY_ERROR", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}
