import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";

const prisma = new PrismaClient();

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = forgotPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.issues, { status: 400 });
    }

    const { email } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // We don't want to reveal if a user exists or not for security reasons.
    // So, we'll send a success response even if the user is not found.
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 3600000); // 1 hour from now

      await prisma.passwordResetToken.create({
        data: {
          email,
          token,
          expires,
        },
      });

      const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

      // In a real application, you would send an email here.
      // For now, we'll log the link to the console for development purposes.
      console.log("Password reset link:", resetLink);
    }
    
    return NextResponse.json({ message: "If an account with this email exists, a password reset link has been sent." }, { status: 200 });

  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}
