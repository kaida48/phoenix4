import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const characters = await prisma.character.findMany();
    return NextResponse.json(characters);
  } catch (error) {
    console.error("Error fetching characters:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}