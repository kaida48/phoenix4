import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // Test database connection before trying the query
    await prisma.$queryRaw`SELECT 1`;
    
    // Get characters
    const characters = await prisma.character.findMany();
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
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.faction || !data.backstory) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const character = await prisma.character.create({
      data: {
        ...data,
        userId: session.user.id
      }
    });
    
    return NextResponse.json(character, { status: 201 });
  } catch (error) {
    console.error("Error creating character:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
