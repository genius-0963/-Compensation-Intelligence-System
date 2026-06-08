import { auth } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").optional(),
  careerStage: z.string().optional(),
  currentCompany: z.string().optional(),
  yearsExperience: z.number().optional(),
  location: z.string().optional(),
  roleFamily: z.string().optional(),
  interestedCompanies: z.array(z.string()).optional(),
  compensationGoals: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  level: z.string().optional(),
  linkedinUrl: z.string().optional().nullable(),
  githubUrl: z.string().optional().nullable(),
  portfolioUrl: z.string().optional().nullable(),
  notificationPrefs: z.any().optional(),
});

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        careerStage: true,
        currentCompany: true,
        targetCompensation: true,
        yearsExperience: true,
        location: true,
        roleFamily: true,
        interestedCompanies: true,
        compensationGoals: true,
        phone: true,
        bio: true,
        level: true,
        linkedinUrl: true,
        githubUrl: true,
        portfolioUrl: true,
        notificationPrefs: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("GET_PROFILE_ERROR", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = profileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.issues, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: validation.data,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("PUT_PROFILE_ERROR", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}
