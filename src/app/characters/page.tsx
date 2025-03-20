"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Character = {
  id: string;
  name: string;
  faction: string;
  approved: boolean;
  createdAt: string;
};

export default function Characters() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    
    if (status === "authenticated") {
      fetchCharacters();
    }
  }, [status, router]);
  
  const fetchCharacters = async () => {
    try {
      const response = await fetch('/api/characters');
      if (response.ok) {
        const data = await response.json();
        setCharacters(data);
      }
    } catch (error) {
      console.error('Error fetching characters:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (status === "loading" || loading) {
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Characters</h2>
          <Link 
            href="/characters/create"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Create New Character
          </Link>
        </div>
        
        {characters.length === 0 ? (
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
            {characters.map((character) => (
              <div key={character.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{character.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-gray-700 px-3 py-1 rounded text-sm">
                      {character.faction}
                    </span>
                    <span className={`px-3 py-1 rounded text-sm ${
                      character.approved 
                        ? 'bg-green-700 text-green-100' 
                        : 'bg-yellow-700 text-yellow-100'
                    }`}>
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