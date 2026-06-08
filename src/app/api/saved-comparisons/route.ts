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
    const savedComparisons = await prisma.savedComparison.findMany({
      where: { userId: session.user.id },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(savedComparisons, { status: 200 });
  } catch (error) {
    console.error("GET_SAVED_COMPARISONS_ERROR", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  config: z.any(),
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

    const { title, description, config } = validation.data;

    const savedComparison = await prisma.savedComparison.create({
      data: {
        userId: session.user.id,
        title,
        description,
        config,
      },
    });

    return NextResponse.json(savedComparison, { status: 201 });
  } catch (error) {
    console.error("POST_SAVED_COMPARISON_ERROR", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}
