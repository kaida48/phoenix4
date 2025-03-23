import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Generate a secure random token
export function generateToken(length = 32): string {
  return randomBytes(length).toString('hex');
}

// Generate and save an auth token for a user
export async function createUserToken(userId: string): Promise<string> {
  const token = generateToken();
  
  await prisma.user.update({
    where: { id: userId },
    data: { authToken: token }
  });
  
  return token;
}

// Verify a token and get the associated user
export async function verifyToken(token: string) {
  if (!token) return null;
  
  const user = await prisma.user.findUnique({
    where: { authToken: token },
    select: {
      id: true,
      username: true,
      email: true,
      role: true
    }
  });
  
  return user;
}

// Store for active impersonation sessions
type ImpersonationSession = {
  adminId: string;
  targetUserId: string;
  expiresAt: Date;
};

const activeImpersonations = new Map<string, ImpersonationSession>();

// Start an impersonation session
export async function startImpersonation(adminId: string, targetUserId: string) {
  // Generate an impersonation token
  const impersonationToken = generateToken(48);
  
  // Set expiration for 2 hours from now
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 2);
  
  // Store the impersonation session
  activeImpersonations.set(impersonationToken, {
    adminId,
    targetUserId,
    expiresAt
  });
  
  return {
    token: impersonationToken,
    expiresAt
  };
}

// Check if an impersonation is active and valid
export function getImpersonationSession(token: string) {
  const session = activeImpersonations.get(token);
  
  if (!session) return null;
  
  // Check if expired
  if (new Date() > session.expiresAt) {
    activeImpersonations.delete(token);
    return null;
  }
  
  return session;
}

// End an impersonation session
export function endImpersonation(token: string) {
  activeImpersonations.delete(token);
}

// Get the current user, handling potential impersonation
export async function getCurrentUser(request: Request) {
  // Check for regular session first
  const session = await getServerSession(authOptions);
  
  // Check for impersonation header
  const impersonationToken = request.headers.get('x-impersonation-token');
  
  if (impersonationToken && session?.user?.role === 'ADMIN') {
    const impersonationSession = getImpersonationSession(impersonationToken);
    
    if (impersonationSession && impersonationSession.adminId === session.user.id) {
      // Look up the target user
      const targetUser = await prisma.user.findUnique({
        where: { id: impersonationSession.targetUserId },
        select: {
          id: true,
          username: true,
          email: true,
          role: true
        }
      });
      
      if (targetUser) {
        return {
          ...targetUser,
          _impersonated: true,
          _impersonatedBy: session.user.id
        };
      }
    }
  }
  
  return session?.user || null;
}