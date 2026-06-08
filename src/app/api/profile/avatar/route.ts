import { auth } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const smallFile = formData.get("small") as File | null;
    const mediumFile = formData.get("medium") as File | null;
    const largeFile = formData.get("large") as File | null;
    const fallbackFile = (formData.get("file") || formData.get("image")) as File | null;

    const userId = session.user.id;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");

    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    let imageUrl = "";

    const allowedTypes = ["image/webp", "image/png", "image/jpeg", "image/jpg", "image/avif"];

    const saveAvatarFile = async (file: File, suffix: string) => {
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Unsupported image format. Allowed formats: JPG, JPEG, PNG, WEBP, AVIF");
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image too large. Max 5MB allowed.");
      }
      
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `avatar_${userId}_${suffix}.webp`;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);
      return `/uploads/avatars/${fileName}`;
    };

    if (mediumFile) {
      if (smallFile) await saveAvatarFile(smallFile, "small");
      imageUrl = await saveAvatarFile(mediumFile, "medium");
      if (largeFile) await saveAvatarFile(largeFile, "large");
    } else if (fallbackFile) {
      imageUrl = await saveAvatarFile(fallbackFile, "medium");
      // Create copy for small/large mock
      const smallPath = path.join(uploadDir, `avatar_${userId}_small.webp`);
      const largePath = path.join(uploadDir, `avatar_${userId}_large.webp`);
      const buffer = Buffer.from(await fallbackFile.arrayBuffer());
      await fs.writeFile(smallPath, buffer);
      await fs.writeFile(largePath, buffer);
    } else {
      return NextResponse.json({ message: "No image file provided" }, { status: 400 });
    }

    // Update user image url in DB
    await prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl },
    });

    return NextResponse.json({ 
      message: "Avatar uploaded successfully", 
      imageUrl 
    }, { status: 200 });

  } catch (error) {
    console.error("AVATAR_UPLOAD_ERROR", error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : "An unexpected error occurred" 
    }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");

    // Delete files if they exist on server filesystem
    const suffixes = ["small", "medium", "large"];
    for (const suffix of suffixes) {
      const filePath = path.join(uploadDir, `avatar_${userId}_${suffix}.webp`);
      try {
        await fs.unlink(filePath);
      } catch (e) {
        // File may not exist, fail silently
      }
    }

    // Update user image to null in DB
    await prisma.user.update({
      where: { id: userId },
      data: { image: null },
    });

    return NextResponse.json({ message: "Avatar removed successfully" }, { status: 200 });

  } catch (error) {
    console.error("AVATAR_DELETE_ERROR", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}
