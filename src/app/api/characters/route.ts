import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// GET handler to retrieve user's characters
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const characters = await prisma.character.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(characters);
  } catch (error) {
    console.error("Error fetching characters:", error);
    return NextResponse.json(
      { error: "Failed to retrieve characters" },
      { status: 500 }
    );
  }
}

// POST handler to create a new character
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await request.json();
    const { name, faction, backstory, appearance, skills, equipment, relationships } = data;
    
    // Validate required fields
    if (!name || !faction || !backstory) {
      return NextResponse.json(
        { error: "Name, faction and backstory are required" },
        { status: 400 }
      );
    }
    
    const character = await prisma.character.create({
      data: {
        name,
        faction,
        backstory,
        appearance,
        skills,
        equipment,
        relationships,
        userId: session.user.id
      }
    });
    
    return NextResponse.json(character, { status: 201 });
  } catch (error) {
    console.error("Error creating character:", error);
    return NextResponse.json(
      { error: "Failed to create character" },
      { status: 500 }
    );
  }
}