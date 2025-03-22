'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";

interface Character {
  id: string;
  name: string;
  approved: boolean;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  characterCount: number;
  approvedCharacterCount: number;
  pendingCharacterCount: number;
  characters: Character[];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // Redirect if user is not authenticated or not an admin
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/unauthorized');
      return;
    }
    
    // Fetch users if user is admin
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [status, session, router]);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      
      if (!response.ok) {
        throw new Error(`Error fetching users: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };
  
  if (status === 'loading' || loading) {
    return <div className="p-8 text-center">Loading users...</div>;
  }
  
  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left border">Username</th>
                <th className="p-3 text-left border">Email</th>
                <th className="p-3 text-left border">Role</th>
                <th className="p-3 text-left border">Characters</th>
                <th className="p-3 text-left border">Created At</th>
                <th className="p-3 text-left border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 border">{user.username}</td>
                  <td className="p-3 border">{user.email}</td>
                  <td className="p-3 border">{user.role}</td>
                  <td className="p-3 border">
                    <div>Total: {user.characterCount}</div>
                    <div className="text-green-600">Approved: {user.approvedCharacterCount}</div>
                    <div className="text-amber-600">Pending: {user.pendingCharacterCount}</div>
                  </td>
                  <td className="p-3 border">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 border">
                    <button 
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                      onClick={() => router.push(`/admin/users/${user.id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
          <div className="text-center p-8 text-gray-500">No users found</div>
        )}
      </main>
    </div>
  );
}