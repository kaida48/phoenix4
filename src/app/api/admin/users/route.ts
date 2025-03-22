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

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can view all users
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { characters: true },
        },
        characters: {
          select: {
            id: true,
            name: true,
            approved: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5, // Limit the number of nested characters fetched
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      characterCount: user._count.characters,
      approvedCharacterCount: user.characters.filter((c) => c.approved).length,
      pendingCharacterCount: user.characters.filter((c) => !c.approved).length,
      characters: user.characters.map((c) => ({
        id: c.id,
        name: c.name,
        approved: c.approved,
      })),
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
