import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: "Character ID is required" }, { status: 400 });
    }
    
    const character = await prisma.character.findUnique({
      where: { id }
    });
    
    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }
    
    return NextResponse.json(character);
  } catch (error) {
    console.error("Error fetching character:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const characterId = params.id;
    
    // Check if character exists and belongs to user
    const existingCharacter = await prisma.character.findUnique({
      where: { id: characterId }
    });
    
    if (!existingCharacter) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }
    
    const isOwner = existingCharacter.userId === session.user.id;
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "MODERATOR";
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
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
    
    // When a character is edited, reset approval status
    // unless an admin is making the change
    const approved = isAdmin ? existingCharacter.approved : false;
    
    const updatedCharacter = await prisma.character.update({
      where: { id: characterId },
      data: {
        name,
        faction,
        backstory,
        appearance,
        skills,
        equipment,
        relationships,
        approved
      }
    });
    
    return NextResponse.json(updatedCharacter);
  } catch (error) {
    console.error("Error updating character:", error);
    return NextResponse.json(
      { error: "Failed to update character" },
      { status: 500 }
    );
  }
}