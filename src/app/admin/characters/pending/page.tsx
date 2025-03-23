"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminNav from '@/components/AdminNav';

interface Character {
  id: string;
  name: string;
  faction: string;
  backstory: string;
  appearance: string | null;
  approved: boolean;
  rejected: boolean;
  createdAt: string;
  userId: string;
  user: {
    username: string;
    email: string;
  };
}

export default function PendingCharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Fetch pending characters when component loads
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (status === 'authenticated') {
      if (session?.user?.role !== 'ADMIN') {
        router.push('/unauthorized');
        return;
      }
      
      fetchPendingCharacters();
    }
  }, [status, session, router]);

  const fetchPendingCharacters = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/characters/pending');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setCharacters(data);
    } catch (err) {
      console.error('Failed to fetch pending characters:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pending characters');
    } finally {
      setLoading(false);
    }
  };

  const approveCharacter = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/characters/${id}/approve`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Remove approved character from list or refresh the list
      fetchPendingCharacters();
    } catch (err) {
      console.error('Failed to approve character:', err);
      alert('Failed to approve character');
    }
  };

  const rejectCharacter = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/characters/${id}/reject`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Remove rejected character from list or refresh the list
      fetchPendingCharacters();
    } catch (err) {
      console.error('Failed to reject character:', err);
      alert('Failed to reject character');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <AdminNav />
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Pending Characters</h1>
          <div className="text-center">Loading...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AdminNav />
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Pending Characters</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNav />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Pending Characters</h1>
          <Link href="/admin" className="text-blue-500 hover:underline">
            Back to Admin Dashboard
          </Link>
        </div>

        {characters.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            No pending characters found.
          </div>
        ) : (
          <div className="grid gap-6">
            {characters.map((character) => (
              <div key={character.id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                <div className="flex justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{character.name}</h2>
                    <p className="text-gray-600">
                      Faction: {character.faction} | Created by: {character.user.username}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Submitted on {new Date(character.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => approveCharacter(character.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectCharacter(character.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Reject
                    </button>
                    <Link href={`/admin/characters/${character.id}`}>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Backstory:</h3>
                  <p className="text-gray-700 whitespace-pre-wrap line-clamp-3">
                    {character.backstory}
                  </p>
                  {character.backstory.length > 300 && (
                    <button className="text-blue-500 hover:underline mt-2">
                      Read more
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}