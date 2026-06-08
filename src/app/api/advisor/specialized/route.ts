import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import prisma from "@/lib/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";

async function saveMessage(conversationId: string, role: string, content: string, metadata?: any) {
  if (!conversationId) return;
  return prisma.advisorMessage.create({
    data: { conversationId, role, content, metadata: metadata || {} }
  });
}

export async function POST(req: Request) {
  try {
    const { mode, payload, conversationId } = await req.json();
    const session = await auth();
    const userId = session?.user?.id || "temp-user-id";

    let dbConversationId = conversationId;

    if (!dbConversationId) {
      const conv = await prisma.advisorConversation.create({
        data: { userId, title: `Analysis: ${mode.replace('_', ' ')}`, mode }
      });
      dbConversationId = conv.id;
    }

    let schema: z.ZodType<any>;
    let promptStr = "";

    if (mode === 'OFFER_ANALYSIS') {
      schema = z.object({
        score: z.number(),
        grade: z.string(),
        strengths: z.array(z.string()),
        weaknesses: z.array(z.string()),
        marketPosition: z.string(),
        negotiationOpportunities: z.array(z.string()),
        riskAnalysis: z.string()
      });
      promptStr = `Analyze this offer: ${JSON.stringify(payload)}. Return structured strengths, weaknesses, a score 0-100, and a grade.`;
    } else if (mode === 'NEGOTIATION') {
      schema = z.object({
        negotiationPlan: z.string(),
        suggestedCounterOffer: z.object({
          base: z.number(),
          equity: z.number(),
          bonus: z.number()
        }),
        riskAnalysis: z.string(),
        successProbability: z.number(),
        negotiationScript: z.string()
      });
      promptStr = `Build a negotiation strategy for this payload: ${JSON.stringify(payload)}. Provide a script and counter offer amounts.`;
    } else if (mode === 'CAREER_GROWTH') {
      schema = z.object({
        promotionRoadmap: z.string(),
        expectedCompensation: z.number(),
        timelineYears: z.number(),
        recommendedSkills: z.array(z.string())
      });
      promptStr = `Plan career growth for: ${JSON.stringify(payload)}.`;
    } else if (mode === 'MARKET_BENCHMARK') {
      schema = z.object({
        medianCompensation: z.number(),
        percentile: z.number(),
        topCompetitors: z.array(z.string()),
        alternativeEmployers: z.array(z.string()),
        marketTrend: z.string()
      });
      promptStr = `Provide market benchmarks for: ${JSON.stringify(payload)}.`;
    } else {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    // Save User Request Message
    await saveMessage(dbConversationId, "user", `Requested ${mode} analysis`, { payload });

    const { object } = await generateObject({
      model: google("gemini-2.5-pro"),
      schema,
      prompt: promptStr
    });

    // Save Assistant Response Data Message
    await saveMessage(dbConversationId, "data", `Generated structured data for ${mode}`, { data: object });

    return NextResponse.json({ conversationId: dbConversationId, result: object });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
