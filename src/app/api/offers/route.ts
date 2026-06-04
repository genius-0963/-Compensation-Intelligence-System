import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { OfferService } from "@/services/offer.service";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Create offer
    const offer = await prisma.offer.create({
      data: {
        candidateId: data.candidateId,
        roleId: data.roleId,
        levelId: data.levelId,
        locationId: data.locationId,
        baseSalary: data.baseSalary,
        equity: data.equity || 0,
        signingBonus: data.signingBonus || 0,
        annualBonus: data.annualBonus || 0,
        totalCompensation: data.baseSalary + (data.equity || 0) + (data.signingBonus || 0) + (data.annualBonus || 0),
        status: data.status || 'DRAFT'
      }
    });

    // Calculate score automatically
    await OfferService.calculateOfferScore(offer.id);

    const updatedOffer = await prisma.offer.findUnique({
      where: { id: offer.id }
    });

    return NextResponse.json(updatedOffer, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(request: Request) {
  try {
    const offers = await prisma.offer.findMany({
      include: {
        candidate: true,
        role: true,
        level: true,
        location: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(offers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
