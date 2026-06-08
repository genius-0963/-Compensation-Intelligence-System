import { auth } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";

const prisma = new PrismaClient();

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  // Check authentication
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    // Fetch user context
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        roleFamily: true,
        level: true,
        currentCompany: true,
        yearsExperience: true,
        location: true,
      },
    });

    // Build the system prompt
    let systemPrompt = `You are an expert Compensation Analyst and Career Advisor working for the Compensation Intelligence System.
Your role is to help users navigate their compensation, understand market data, and strategize negotiations.
You should be professional, objective, data-driven, and supportive.

If you don't know exact numbers, provide general frameworks and emphasize that compensation is highly dependent on leveling, location, and company tier.
`;

    if (user) {
      systemPrompt += `\nHere is the current context of the user you are talking to:
- Role Family: ${user.roleFamily || "Unknown"}
- Level/Rank: ${user.level || "Unknown"}
- Current Company: ${user.currentCompany || "Unknown"}
- Years of Experience: ${user.yearsExperience ?? "Unknown"}
- Location: ${user.location || "Unknown"}

Use this context to tailor your advice, but do not share it back to them unless relevant.`;
    }

    // Call the AI provider (Google Gemini)
    const result = streamText({
      model: google("gemini-2.5-flash"), // Use 2.5 flash or pro depending on the use case. 1.5 flash is also fine.
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("CHAT_API_ERROR", error);
    return NextResponse.json(
      { message: "An unexpected error occurred during the AI chat request" },
      { status: 500 }
    );
  }
}
