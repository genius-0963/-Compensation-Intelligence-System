import { auth } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const companyId = resolvedParams.id;

  if (!companyId) {
    return NextResponse.json({ message: "Company ID is required" }, { status: 400 });
  }

  try {
    const savedCompany = await prisma.savedCompany.findFirst({
      where: {
        userId: session.user.id,
        companyId,
      },
    });

    if (!savedCompany) {
      return NextResponse.json({ message: "Saved company not found" }, { status: 404 });
    }

    await prisma.savedCompany.delete({
      where: { id: savedCompany.id },
    });

    return NextResponse.json({ message: "Company removed from saved list" }, { status: 200 });
  } catch (error) {
    console.error("DELETE_SAVED_COMPANY_ERROR", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}
