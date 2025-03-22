"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type Character = {
  id: string;
  name: string;
  faction: string;
  approved: boolean;
  createdAt: string;
};

async function fetchCharacters(): Promise<Character[]> {
  const response = await fetch('/api/characters');
  if (!response.ok) {
    throw new Error("Failed to fetch characters");
  }
  return response.json();
}

export default function Characters() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const { data: characters, isLoading, error } = useQuery({
    queryKey: ["characters"],
    queryFn: fetchCharacters,
    enabled: status === "authenticated"
  });

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  
  if (error instanceof Error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <main className="container mx-auto px-6 py-8">
          <div className="bg-red-600 p-4 rounded">
            {error.message}
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Characters</h2>
          <Link 
            href="/characters/create"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Create New Character
          </Link>
        </div>
        
        {characters?.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-lg text-center">
            <h3 className="text-xl mb-4">You haven't created any characters yet</h3>
            <p className="text-gray-400 mb-6">Start your journey in the Sunrise Isles by creating your first character.</p>
            <Link 
              href="/characters/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
            >
              Create Your First Character
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters?.map((character) => (
              <div key={character.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{character.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-gray-700 px-3 py-1 rounded text-sm">
                      {character.faction}
                    </span>
                    <span className={`px-3 py-1 rounded text-sm ${character.approved ? 'bg-green-700 text-green-100' : 'bg-yellow-700 text-yellow-100'}`}>
                      {character.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <Link 
                    href={`/characters/${character.id}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}