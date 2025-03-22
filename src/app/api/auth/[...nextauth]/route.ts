import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { type NextAuthOptions, DefaultSession } from "next-auth";
// Import the singleton Prisma instance instead of creating a new one
import { prisma } from "@/lib/prisma";

// Extend the default NextAuth types
declare module "next-auth" {
  interface User {
    username: string;
    role: string;
  }
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Received credentials:", credentials);
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        
        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });
        console.log("User found:", user);
        if (!user) {
          return null;
        }
        
        const passwordMatch = await compare(credentials.password, user.password);
        
        if (!passwordMatch) {
          return null;
        }
        
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username; // Add username to the token
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).username = token.username as string; // Add username to the session
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };