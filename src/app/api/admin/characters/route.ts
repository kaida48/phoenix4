import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin or moderator
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get all characters with their creators' usernames
    const characters = await prisma.character.findMany({
      include: {
        user: {
          select: {
            username: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Format the response
    const formattedCharacters = characters.map(char => ({
      id: char.id,
      name: char.name,
      faction: char.faction,
      username: char.user.username,
      approved: char.approved,
      createdAt: char.createdAt
    }));
    
    return NextResponse.json(formattedCharacters);
  } catch (error) {
    console.error("Error fetching characters:", error);
    return NextResponse.json(
      { error: "Failed to fetch characters" },
      { status: 500 }
    );
  }
}