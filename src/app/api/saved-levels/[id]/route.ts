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

  const levelId = resolvedParams.id;

  if (!levelId) {
    return NextResponse.json({ message: "Level ID is required" }, { status: 400 });
  }

  try {
    const savedLevel = await prisma.savedLevel.findFirst({
      where: {
        userId: session.user.id,
        levelId,
      },
    });

    if (!savedLevel) {
      return NextResponse.json({ message: "Saved level not found" }, { status: 404 });
    }

    await prisma.savedLevel.delete({
      where: { id: savedLevel.id },
    });

    return NextResponse.json({ message: "Level removed from saved list" }, { status: 200 });
  } catch (error) {
    console.error("DELETE_SAVED_LEVEL_ERROR", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}
