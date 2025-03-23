"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';

export default function Home() {
  const { data: session, status } = useSession();

  // Debug session data
  useEffect(() => {
    console.log("Home page - Session status:", status);
    console.log("Home page - Session data:", session);
    console.log("Home page - User role:", session?.user?.role);
  }, [session, status]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="container mx-auto px-6 py-20 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to Phoenix Roleplay</h1>
        
        <div className="max-w-3xl text-center mb-12">
          <p className="text-xl">
            A post-apocalyptic roleplay experience set in the ruins of Phoenix, Arizona.
            Create your character and shape the future of this wasteland.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold mb-3">Create Your Character</h2>
            <p className="mb-4">Design a unique character with their own backstory, skills, and motivations.</p>
            <a href="/characters/create" className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors">
              Get Started
            </a>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold mb-3">Explore Factions</h2>
            <p className="mb-4">Join one of the many factions vying for control of the Phoenix wasteland.</p>
            <a href="/guides/factions" className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors">
              View Factions
            </a>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold mb-3">Game Guides</h2>
            <p className="mb-4">Learn the rules and mechanics of Phoenix Roleplay.</p>
            <a href="/guides" className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors">
              Read Guides
            </a>
          </div>
        </div>
        
        {/* Admin quick access if the user is an admin */}
        {session?.user?.role === 'ADMIN' && (
          <div className="mt-12 p-4 border border-yellow-400 rounded-md bg-yellow-900/20">
            <h2 className="text-lg font-semibold mb-2">Admin Quick Access</h2>
            <div className="flex gap-4">
              <a href="/admin" className="text-yellow-400 hover:underline">
                Admin Dashboard
              </a>
              <a href="/admin/characters/pending" className="text-yellow-400 hover:underline">
                Pending Characters
              </a>
              <a href="/admin/users" className="text-yellow-400 hover:underline">
                Manage Users
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
