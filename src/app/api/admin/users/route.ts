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
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { characters: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(users);
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