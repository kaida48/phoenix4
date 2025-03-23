import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Update the GET method to include tokens when requested

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can view all users
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const includeTokens = searchParams.get("includeTokens") === "true";
    
    // Paginate users with 10 per page
    const users = await prisma.user.findMany({
      skip: (page - 1) * 10,
      take: 10,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        authToken: includeTokens, // Only include tokens if explicitly requested
        _count: {
          select: {
            characters: true
          }
        },
        characters: {
          select: {
            id: true,
            name: true,
            approved: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Get total count for pagination
    const totalUsers = await prisma.user.count();

    // Process users to include character counts
    const processedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      authToken: user.authToken,
      characterCount: user._count.characters,
      approvedCharacterCount: user.characters.filter(char => char.approved).length,
      pendingCharacterCount: user.characters.filter(char => !char.approved).length,
      characters: user.characters
    }));

    return NextResponse.json(processedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
