import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if requester is admin
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const characterId = params.id;

    // Reject the character
    const updatedCharacter = await prisma.character.update({
      where: {
        id: characterId,
      },
      data: {
        approved: false,
        rejected: true,
      },
    });

    return NextResponse.json(updatedCharacter);
  } catch (error) {
    console.error("Error rejecting character:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}