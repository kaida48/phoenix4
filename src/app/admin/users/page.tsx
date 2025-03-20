"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from '@/components/Navbar';

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function UsersAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (status === "authenticated") {
      // Check if user is admin
      if (session?.user?.role !== "ADMIN") {
        router.push("/dashboard");
        return;
      }
      fetchUsers();
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, router]);
  
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      
      if (response.ok) {
        // Update the user in the state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
      } else {
        alert('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
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
            <Link href="/admin" className="hover:text-blue-400">Characters</Link>
            <Link href="/admin/users" className="hover:text-blue-400">Users</Link>
            <Link href="/api/auth/signout" className="hover:text-blue-400">Sign Out</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">User Management</h2>
        
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Username</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Created</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-3 px-4">{user.username}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.role === "ADMIN" 
                        ? 'bg-red-700 text-red-100' 
                        : user.role === "MODERATOR"
                        ? 'bg-blue-700 text-blue-100'
                        : 'bg-gray-700 text-gray-100'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <select 
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm"
                      >
                        <option value="USER">User</option>
                        <option value="MODERATOR">Moderator</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}