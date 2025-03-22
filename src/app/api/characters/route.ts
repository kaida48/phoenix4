import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(_request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get characters for the current user only
    const characters = await prisma.character.findMany({
      where: {
        userId: session.user.id
      }
    });
    
    return NextResponse.json(characters);
  } catch (error) {
    console.error("Error fetching characters:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Parse the JSON data from the request body
    const data = await request.json();
    const { name, faction, backstory, appearance, skills, equipment, relationships } = data;

    // Get the user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!name || !faction || !backstory) {
      return NextResponse.json(
        { error: "Name, faction and backstory are required" },
        { status: 400 }
      );
    }
    
    const newCharacter = await prisma.character.create({
      data: {
        name,
        faction,
        backstory,
        approved: false,
        appearance: appearance || null,
        skills: skills || {},
        equipment: equipment || {},
        relationships: relationships || {},
        user: {
          connect: { id: session.user.id }
        }
      },
    });

    return NextResponse.json(newCharacter, { status: 201 });
  } catch (error) {
    console.error("Error submitting character:", error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Stack trace:", error.stack);
    }
    
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
