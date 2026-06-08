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

  const locationId = resolvedParams.id;

  if (!locationId) {
    return NextResponse.json({ message: "Location ID is required" }, { status: 400 });
  }

  try {
    const savedLocation = await prisma.savedLocation.findFirst({
      where: {
        userId: session.user.id,
        locationId,
      },
    });

    if (!savedLocation) {
      return NextResponse.json({ message: "Saved location not found" }, { status: 404 });
    }

    await prisma.savedLocation.delete({
      where: { id: savedLocation.id },
    });

    return NextResponse.json({ message: "Location removed from saved list" }, { status: 200 });
  } catch (error) {
    console.error("DELETE_SAVED_LOCATION_ERROR", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}
