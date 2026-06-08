import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q');
    
    // We could add complex filters here
    
    const offers = await prisma.offer.findMany({
      include: {
        candidate: true,
        role: true,
        level: true,
        location: true,
        insights: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json(offers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { 
      candidateId, 
      roleId, 
      levelId, 
      locationId, 
      baseSalary, 
      equityGrant, 
      signingBonus, 
      annualBonus 
    } = body;

    // 1. Calculate total compensation
    const totalCompensation = baseSalary + equityGrant + signingBonus + annualBonus;

    // 2. Fetch context for AI
    const role = await prisma.role.findUnique({ where: { id: roleId } });
    const level = await prisma.level.findUnique({ where: { id: levelId } });
    const location = await prisma.location.findUnique({ where: { id: locationId } });

    // 3. AI Analysis using Gemini
    let aiAnalysis = null;
    try {
      const { object } = await generateObject({
        model: google('gemini-2.5-pro'),
        schema: z.object({
          score: z.number().min(0).max(100),
          scoreGrade: z.string(),
          summary: z.string(),
          insights: z.array(z.object({
            title: z.string(),
            description: z.string(),
            severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
            confidence: z.number().min(0).max(1),
            category: z.enum([
              'BASE_SALARY', 'EQUITY', 'BONUS', 'LOCATION', 'LEVEL', 
              'MARKET_POSITION', 'RETENTION_RISK', 'NEGOTIATION_OPPORTUNITY'
            ])
          }))
        }),
        prompt: `
          Analyze the following compensation offer.
          
          Role: ${role?.title || 'Unknown'}
          Level: ${level?.name || 'Unknown'}
          Location: ${location?.city || 'Unknown'}
          
          Compensation Breakdown:
          - Base Salary: $${baseSalary}
          - Equity: $${equityGrant}
          - Signing Bonus: $${signingBonus}
          - Annual Bonus: $${annualBonus}
          - Total Compensation: $${totalCompensation}
          
          Please provide a competitiveness score (0-100), a letter grade (e.g. A, B+, C-), a brief summary, and specific actionable negotiation insights. Highlight any retention risks or areas where the offer is lacking.
        `
      });
      aiAnalysis = object;
    } catch (aiError) {
      console.error("AI Analysis failed:", aiError);
      // We will proceed without AI analysis if it fails, creating a fallback.
    }

    // 4. Store in database using a transaction
    const newOffer = await prisma.$transaction(async (tx) => {
      const offer = await tx.offer.create({
        data: {
          candidateId,
          roleId,
          levelId,
          locationId,
          baseSalary,
          equity: equityGrant,
          signingBonus,
          annualBonus,
          totalCompensation,
          score: aiAnalysis?.score || 0,
          scoreGrade: aiAnalysis?.scoreGrade || 'N/A',
          status: 'DRAFT',
          notes: aiAnalysis?.summary || 'AI analysis unavailable.',
        }
      });

      if (aiAnalysis && aiAnalysis.insights && aiAnalysis.insights.length > 0) {
        await tx.negotiationInsight.createMany({
          data: aiAnalysis.insights.map((insight) => ({
            offerId: offer.id,
            title: insight.title,
            description: insight.description,
            severity: insight.severity,
            confidence: insight.confidence,
            category: insight.category
          }))
        });
      }

      return offer;
    });

    const completeOffer = await prisma.offer.findUnique({
      where: { id: newOffer.id },
      include: {
        candidate: true,
        role: true,
        level: true,
        location: true,
        insights: true
      }
    });

    return NextResponse.json(completeOffer);
  } catch (error: any) {
    console.error("Failed to create offer:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
