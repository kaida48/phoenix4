import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin or moderator
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { approved } = await request.json();
    
    const character = await prisma.character.update({
      where: { id: params.id },
      data: { approved }
    });
    
    return NextResponse.json(character);
  } catch (error) {
    console.error("Error approving character:", error);
    return NextResponse.json(
      { error: "Failed to update character approval status" },
      { status: 500 }
    );
  }
}