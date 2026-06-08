import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id || "temp-user-id";

    const conversations = await prisma.advisorConversation.findMany({
      where: { userId, isArchived: false },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        mode: true,
        isPinned: true,
        updatedAt: true,
        createdAt: true
      }
    });

    return NextResponse.json(conversations);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
