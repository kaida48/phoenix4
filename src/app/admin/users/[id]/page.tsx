'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  // Extract id directly from params
  const { id } = params;
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // Admin check and fetch user details
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchUserDetails();
    } else if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/unauthorized');
    }
  }, [status, session, id, router]);
  
  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching user: ${response.status}`);
      }
      
      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.error('Failed to fetch user details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="p-8 text-center">Loading user details...</div>;
  }
  
  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }
  
  if (!user) {
    return <div className="p-8 text-center">User not found</div>;
  }
  
  return (
    <div className="p-6">
      <div className="mb-4">
        <Link href="/admin/users" className="text-blue-500 hover:underline">
          &larr; Back to Users
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">User Details: {user.username}</h1>
      
      {/* User information */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
          <div>
            <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            <p><strong>Total Characters:</strong> {user.characterCount}</p>
          </div>
        </div>
      </div>
      
      {/* Characters section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Characters</h2>
        
        {user.characters && user.characters.length > 0 ? (
          <div className="grid gap-4">
            {user.characters.map((character: any) => (
              <div key={character.id} className="p-4 border rounded flex justify-between items-center">
                <div>
                  <p className="font-medium">{character.name}</p>
                  <p className={character.approved ? "text-green-600" : "text-amber-600"}>
                    {character.approved ? "Approved" : "Pending Approval"}
                  </p>
                </div>
                <button 
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => router.push(`/admin/characters/${character.id}`)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No characters found</p>
        )}
      </div>
    </div>
  );
}