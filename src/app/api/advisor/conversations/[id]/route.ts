import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    const userId = session?.user?.id || "temp-user-id";

    const conversation = await prisma.advisorConversation.findFirst({
      where: { id, userId },
      include: {
        messages: {
          include: { attachments: true },
          orderBy: { createdAt: 'asc' }
        },
        recommendations: true
      }
    });

    if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(conversation);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    const userId = session?.user?.id || "temp-user-id";

    // Soft delete (archive)
    await prisma.advisorConversation.updateMany({
      where: { id, userId },
      data: { isArchived: true }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
