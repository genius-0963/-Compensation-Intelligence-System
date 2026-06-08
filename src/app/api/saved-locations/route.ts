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
    const savedLocations = await prisma.savedLocation.findMany({
      where: { userId: session.user.id },
      include: {
        location: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(savedLocations, { status: 200 });
  } catch (error) {
    console.error("GET_SAVED_LOCATIONS_ERROR", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}

const postSchema = z.object({
  locationId: z.string(),
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

    const { locationId } = validation.data;

    const savedLocation = await prisma.savedLocation.create({
      data: {
        userId: session.user.id,
        locationId,
      },
    });

    return NextResponse.json(savedLocation, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ message: "Location already saved" }, { status: 409 });
    }
    console.error("POST_SAVED_LOCATION_ERROR", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}
