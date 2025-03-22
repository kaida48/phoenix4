"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect in useEffect to avoid state updates during render
  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push(result?.url || "/dashboard");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-4">Login to Your Account</h1>
        {error && <div className="bg-red-600 p-4 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Logging in…" : "Login"}
          </button>
        </form>
      </main>
    </div>
  );
}

// Example snippet in your NextAuth route
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function authorize(credentials: { username: string; password: string }) {
  console.log("Received credentials:", credentials);
  if (!credentials?.username || !credentials?.password) {
    return null;
  }
  const user = await prisma.user.findUnique({
    where: { username: credentials.username },
  });
  console.log("User found:", user);
  if (!user) return null;
  // Continue with password check…
}