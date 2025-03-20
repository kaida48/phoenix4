import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

// DELETE handler to remove a character (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin or moderator
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const characterId = params.id;
    
    // Check if character exists
    const character = await prisma.character.findUnique({
      where: { id: characterId }
    });
    
    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }
    
    // Delete the character
    await prisma.character.delete({
      where: { id: characterId }
    });
    
    return NextResponse.json({ message: "Character deleted successfully" });
  } catch (error) {
    console.error("Error deleting character:", error);
    return NextResponse.json(
      { error: "Failed to delete character" },
      { status: 500 }
    );
  }
}