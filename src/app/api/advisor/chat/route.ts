import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import {
  getConversationTitle,
  getTextFromUIMessage,
} from "@/lib/ui-message";
import { NextRequest, NextResponse } from "next/server";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { google } from "@ai-sdk/google";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id || "temp-user-id"; // fallback for testing without auth if needed

    const {
      messages,
      conversationId,
      mode = "GENERAL",
    }: {
      messages: UIMessage[];
      conversationId?: string;
      mode?: string;
    } = await req.json();

    let dbConversationId = conversationId;

    // 1. Persist conversation if it's new
    if (!dbConversationId) {
      const firstUserMessage = messages.find((message) => message.role === "user");
      const title = getConversationTitle(
        firstUserMessage ? getTextFromUIMessage(firstUserMessage) : ""
      );
      const conversation = await prisma.advisorConversation.create({
        data: {
          userId,
          title,
          mode,
        },
      });
      dbConversationId = conversation.id;
    }

    if (!dbConversationId) {
      return NextResponse.json(
        { message: "Failed to resolve conversation." },
        { status: 500 }
      );
    }

    const resolvedConversationId = dbConversationId;

    // 2. Persist the latest user message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "user") {
      const content = getTextFromUIMessage(lastMessage);
      if (content) {
        await prisma.advisorMessage.create({
          data: {
            conversationId: resolvedConversationId,
            role: "user",
            content,
          },
        });
      }
    }

    const systemPrompt = `You are a Principal AI Compensation Advisor for the Compensation Intelligence System.
You are assisting a user in the context of their compensation.
Provide crisp, structured, and highly professional advice. Use markdown tables where appropriate.`;

    // 3. Call AI with streamText
    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      onFinish: async ({ text }) => {
        // 4. Persist the assistant's response when finished
        await prisma.advisorMessage.create({
          data: {
            conversationId: resolvedConversationId,
            role: "assistant",
            content: text,
          }
        });
      }
    });

    return result.toUIMessageStreamResponse({
      headers: {
        "x-conversation-id": resolvedConversationId,
      },
    });
  } catch (error: any) {
    console.error("ADVISOR_CHAT_ERROR", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
