'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import AdminNav from '@/components/AdminNav';

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
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <AdminNav />
        <div className="container mx-auto p-6 text-center">Loading user details...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <AdminNav />
        <div className="container mx-auto p-6 text-center text-red-500">Error: {error}</div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <AdminNav />
        <div className="container mx-auto p-6 text-center">User not found</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminNav />
      <div className="container mx-auto p-6">
        <div className="mb-4">
          <Link href="/admin/users" className="text-blue-400 hover:underline">
            &larr; Back to Users
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold mb-6">User Details: {user.username}</h1>
        
        {/* User information */}
        <div className="bg-gray-800 p-6 rounded-lg shadow mb-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Characters</h2>
          
          {user.characters && user.characters.length > 0 ? (
            <div className="grid gap-4">
              {user.characters.map((character: any) => (
                <div key={character.id} className="p-4 border border-gray-700 rounded flex justify-between items-center bg-gray-700">
                  <div>
                    <p className="font-medium">{character.name}</p>
                    <p className="text-gray-400">{character.faction}</p>
                    <p className={character.approved ? "text-green-400" : "text-yellow-400"}>
                      {character.approved ? "Approved" : "Pending Approval"}
                    </p>
                  </div>
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => router.push(`/admin/characters/${character.id}`)}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No characters found</p>
          )}
        </div>
      </div>
    </div>
  );
}