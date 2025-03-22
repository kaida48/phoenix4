import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// POST method to explicitly reject a character
export async function POST(request: Request, { params }: { params: { id: string } }) {
  // Check that the user is authenticated and has admin or moderator role
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const characterId = params.id;
  const character = await prisma.character.findUnique({
    where: { id: characterId },
  });

  if (!character) {
    return NextResponse.json({ error: "Character not found" }, { status: 404 });
  }

  // Update the character: mark as rejected
  const updatedCharacter = await prisma.character.update({
    where: { id: characterId },
    data: { 
      approved: false
    },
  });

  // Here you can insert code to send a notification (e.g. email, in-app toast, etc.)

  return NextResponse.json(updatedCharacter, { status: 200 });
}