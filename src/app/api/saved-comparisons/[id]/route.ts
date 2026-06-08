import { auth } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

async function authorize(
  session: { user?: { id?: string } } | null,
  comparisonId: string
) {
  const comparison = await prisma.savedComparison.findUnique({
    where: { id: comparisonId },
  });

  if (!comparison || !session?.user?.id || comparison.userId !== session.user.id) {
    return null;
  }
  return comparison;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const comparison = await authorize(session, resolvedParams.id);
  if (!comparison) {
    return NextResponse.json({ message: "Not found or not authorized" }, { status: 404 });
  }

  return NextResponse.json(comparison, { status: 200 });
}

const putSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  config: z.any().optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const comparison = await authorize(session, resolvedParams.id);
  if (!comparison) {
    return NextResponse.json({ message: "Not found or not authorized" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const validation = putSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.issues, { status: 400 });
    }

    const updatedComparison = await prisma.savedComparison.update({
      where: { id: resolvedParams.id },
      data: validation.data,
    });

    return NextResponse.json(updatedComparison, { status: 200 });
  } catch (error) {
    console.error("PUT_SAVED_COMPARISON_ERROR", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const comparison = await authorize(session, resolvedParams.id);
  if (!comparison) {
    return NextResponse.json({ message: "Not found or not authorized" }, { status: 404 });
  }

  try {
    await prisma.savedComparison.delete({
      where: { id: resolvedParams.id },
    });
    return NextResponse.json({ message: "Comparison deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE_SAVED_COMPARISON_ERROR", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}
