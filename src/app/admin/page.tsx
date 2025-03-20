"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type Character = {
  id: string;
  name: string;
  faction: string;
  username: string;
  approved: boolean;
  createdAt: string;
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (status === "authenticated") {
      // Check if user is admin/moderator
      if (session?.user?.role !== "ADMIN" && session?.user?.role !== "MODERATOR") {
        router.push("/dashboard");
        return;
      }
      fetchCharacters();
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, router]);
  
  const fetchCharacters = async () => {
    try {
      const response = await fetch('/api/admin/characters');
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
  
  const handleApproval = async (id: string, approved: boolean) => {
    try {
      const response = await fetch(`/api/admin/characters/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved })
      });
      
      if (response.ok) {
        // Update local state to reflect the change
        setCharacters(characters.map(char => 
          char.id === id ? { ...char, approved } : char
        ));
      }
    } catch (error) {
      console.error('Error updating approval status:', error);
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
          <h1 className="text-xl font-bold">Phoenix Roleplay - Admin</h1>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
            <Link href="/admin" className="hover:text-blue-400">Admin Panel</Link>
            <Link href="/api/auth/signout" className="hover:text-blue-400">Sign Out</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">Character Approval Dashboard</h2>
        
        {characters.length === 0 ? (
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <p className="text-xl">No characters found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Faction</th>
                  <th className="py-3 px-4 text-left">User</th>
                  <th className="py-3 px-4 text-left">Created</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {characters.map((character) => (
                  <tr key={character.id}>
                    <td className="py-3 px-4">{character.name}</td>
                    <td className="py-3 px-4">{character.faction}</td>
                    <td className="py-3 px-4">{character.username}</td>
                    <td className="py-3 px-4">{new Date(character.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        character.approved 
                          ? 'bg-green-700 text-green-100' 
                          : 'bg-yellow-700 text-yellow-100'
                      }`}>
                        {character.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link 
                          href={`/admin/characters/${character.id}`}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                        >
                          View
                        </Link>
                        {character.approved ? (
                          <button
                            onClick={() => handleApproval(character.id, false)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                          >
                            Reject
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApproval(character.id, true)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}