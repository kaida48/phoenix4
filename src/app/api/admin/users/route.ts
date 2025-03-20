import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only admins can view all users
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { characters: true }
        },
        characters: {
          select: {
            id: true,
            name: true,
            approved: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Format the response to include character counts
    const formattedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      characterCount: user._count.characters,
      approvedCharacterCount: user.characters.filter(c => c.approved).length,
      pendingCharacterCount: user.characters.filter(c => !c.approved).length,
      characters: user.characters.map(c => ({
        id: c.id,
        name: c.name,
        approved: c.approved
      }))
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

// In your admin page.tsx navigation section:
<nav className="flex items-center gap-6">
  <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
  <Link href="/admin" className="hover:text-blue-400">Characters</Link>
  <Link href="/admin/users" className="hover:text-blue-400">Users</Link>
  <Link href="/api/auth/signout" className="hover:text-blue-400">Sign Out</Link>
</nav>