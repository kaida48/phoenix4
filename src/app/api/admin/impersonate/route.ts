import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startImpersonation, endImpersonation } from "@/lib/tokens";

// Start impersonating a user
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only admins can impersonate
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true,
        username: true,
        email: true
      }
    });
    
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Start impersonation
    const impersonation = await startImpersonation(session.user.id, userId);
    
    // Return impersonation details
    return NextResponse.json({
      token: impersonation.token,
      expiresAt: impersonation.expiresAt,
      user: targetUser
    });
  } catch (error) {
    console.error("Error starting impersonation:", error);
    return NextResponse.json(
      { error: "Failed to start impersonation" },
      { status: 500 }
    );
  }
}

// End impersonation
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only admins can end impersonation
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    
    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }
    
    // End the impersonation session
    endImpersonation(token);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error ending impersonation:", error);
    return NextResponse.json(
      { error: "Failed to end impersonation" },
      { status: 500 }
    );
  }
}