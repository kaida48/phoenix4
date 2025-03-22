import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Get some basic stats
    const userCount = await prisma.user.count();
    const characterCount = await prisma.character.count();
    
    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      stats: {
        users: userCount,
        characters: characterCount
      }
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: "Database connection failed",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
