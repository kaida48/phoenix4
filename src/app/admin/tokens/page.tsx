"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/AdminNav';

interface User {
  id: string;
  username: string;
  email: string;
  authToken: string | null;
}

export default function TokenManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [impersonating, setImpersonating] = useState(false);
  const [impersonationToken, setImpersonationToken] = useState('');
  const [currentImpersonatedUser, setCurrentImpersonatedUser] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
    
    // Check for active impersonation in localStorage
    const storedToken = localStorage.getItem('impersonationToken');
    const storedUser = localStorage.getItem('impersonatedUser');
    if (storedToken && storedUser) {
      setImpersonationToken(storedToken);
      setCurrentImpersonatedUser(storedUser);
      setImpersonating(true);
    }
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users?includeTokens=true');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateToken = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/token`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Refresh user list
      fetchUsers();
    } catch (error) {
      console.error('Failed to generate token:', error);
    }
  };

  const revokeToken = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/token`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Refresh user list
      fetchUsers();
    } catch (error) {
      console.error('Failed to revoke token:', error);
    }
  };

  const startImpersonation = async (userId: string, username: string) => {
    try {
      const response = await fetch('/api/admin/impersonate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Store impersonation details
      setImpersonationToken(data.token);
      setCurrentImpersonatedUser(username);
      setImpersonating(true);
      
      // Store in localStorage to persist through page refreshes
      localStorage.setItem('impersonationToken', data.token);
      localStorage.setItem('impersonatedUser', username);
      
      alert(`Now impersonating ${username}. Your admin session remains active.`);
    } catch (error) {
      console.error('Failed to start impersonation:', error);
    }
  };

  const endImpersonation = async () => {
    try {
      const response = await fetch(`/api/admin/impersonate?token=${impersonationToken}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Clear impersonation state
      setImpersonationToken('');
      setCurrentImpersonatedUser(null);
      setImpersonating(false);
      
      // Clear localStorage
      localStorage.removeItem('impersonationToken');
      localStorage.removeItem('impersonatedUser');
      
      alert('Impersonation ended.');
    } catch (error) {
      console.error('Failed to end impersonation:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Token Management</h1>
          <div className="text-center p-8">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Token Management</h1>
        
        {/* Active Impersonation Warning */}
        {impersonating && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex justify-between items-center">
            <div>
              <span className="font-bold">⚠️ Currently impersonating: </span>
              {currentImpersonatedUser}
            </div>
            <button 
              onClick={endImpersonation}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              End Impersonation
            </button>
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Auth Token
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.authToken ? (
                      <div className="text-sm text-gray-500 font-mono">
                        {user.authToken.substring(0, 8)}...
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(user.authToken as string);
                            alert('Token copied to clipboard');
                          }}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                        >
                          Copy
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No token</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {user.authToken ? (
                      <button 
                        onClick={() => revokeToken(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Revoke Token
                      </button>
                    ) : (
                      <button 
                        onClick={() => generateToken(user.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Generate Token
                      </button>
                    )}
                    <button 
                      onClick={() => startImpersonation(user.id, user.username)}
                      className="ml-2 text-blue-600 hover:text-blue-900"
                    >
                      Impersonate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}