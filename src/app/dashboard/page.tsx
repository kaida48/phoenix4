"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Protect the dashboard route
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Phoenix Roleplay</h1>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
            <Link href="/characters/create" className="hover:text-blue-400">Create Character</Link>
            <Link href="/api/auth/signout" className="hover:text-blue-400">Sign Out</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Welcome, {session?.user?.name || "Wastelander"}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 p-5 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Your Characters</h3>
              <p className="text-gray-300 mb-4">Manage your characters in the Sunrise Isles.</p>
              <Link href="/characters" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                View Characters
              </Link>
            </div>
            
            <div className="bg-gray-700 p-5 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Create New Character</h3>
              <p className="text-gray-300 mb-4">Join a faction and create your story in the wasteland.</p>
              <Link href="/characters/create" 
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">
                Create Character
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}