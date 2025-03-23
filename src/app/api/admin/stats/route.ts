import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Check if requester is admin
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user count
    const totalUsers = await prisma.user.count();

    // Get character counts
    const totalCharacters = await prisma.character.count();
    
    // Get approved characters
    const approvedCharacters = await prisma.character.count({
      where: { approved: true }
    });
    
    // Get pending characters (not approved and not rejected)
    const pendingCharacters = await prisma.character.count({
      where: { 
        approved: false,
        rejected: false
      }
    });
    
    // Get rejected characters
    const rejectedCharacters = await prisma.character.count({
      where: { rejected: true }
    });

    return NextResponse.json({
      totalUsers,
      totalCharacters,
      approvedCharacters,
      pendingCharacters,
      rejectedCharacters
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}