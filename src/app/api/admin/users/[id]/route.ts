import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can view user details
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = params.id;
    
    // Get comprehensive user data including all relationships
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        characters: {
          orderBy: { createdAt: 'desc' }
        },
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Count approved, pending, and rejected characters
    const approvedCharacterCount = user.characters.filter(char => char.approved).length;
    const pendingCharacterCount = user.characters.filter(char => !char.approved && !char.rejected).length;
    const rejectedCharacterCount = user.characters.filter(char => char.rejected).length;

    // Remove sensitive data before returning
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      ...userWithoutPassword,
      characterCount: user.characters.length,
      approvedCharacterCount,
      pendingCharacterCount,
      rejectedCharacterCount,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { error: "Failed to fetch user details" },
      { status: 500 }
    );
  }
}

// Add PUT method to update user data
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can update user details
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = params.id;
    const userData = await request.json();
    
    // Filter out fields that shouldn't be directly updated
    const { id, password, createdAt, updatedAt, ...updateData } = userData;
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}