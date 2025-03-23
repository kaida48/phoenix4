'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminNav from '@/components/AdminNav';

// Define comprehensive types for our data
interface Character {
  id: string;
  name: string;
  faction: string;
  backstory: string;
  appearance: string | null;
  approved: boolean;
  rejected: boolean;
  createdAt: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean | null;
  authToken: string | null;
  verificationToken: string | null;
  characterCount: number;
  approvedCharacterCount: number;
  pendingCharacterCount: number;
  rejectedCharacterCount: number;
  characters: Character[];
}

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [impersonationToken, setImpersonationToken] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    fetchUserDetails();
  }, [id]);
  
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
  
  // Generate auth token for this user
  const generateToken = async () => {
    try {
      const response = await fetch(`/api/admin/users/${id}/token`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Refresh user details
      fetchUserDetails();
    } catch (error) {
      console.error('Failed to generate token:', error);
    }
  };
  
  // Revoke auth token for this user
  const revokeToken = async () => {
    try {
      const response = await fetch(`/api/admin/users/${id}/token`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Refresh user details
      fetchUserDetails();
    } catch (error) {
      console.error('Failed to revoke token:', error);
    }
  };
  
  // Start impersonating this user
  const startImpersonation = async () => {
    try {
      const response = await fetch('/api/admin/impersonate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: id })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setImpersonationToken(data.token);
      
      // Store impersonation token in localStorage
      localStorage.setItem('impersonationToken', data.token);
      localStorage.setItem('impersonatedUser', user?.username || '');
      
      alert(`Now impersonating ${user?.username}. Navigate to any page to see the site as this user.`);
    } catch (error) {
      console.error('Failed to start impersonation:', error);
    }
  };
  
  // Update user role
  const updateUserRole = async (newRole: string) => {
    if (confirm(`Are you sure you want to change ${user?.username}'s role to ${newRole}?`)) {
      try {
        const response = await fetch(`/api/admin/promote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: user?.email, role: newRole })
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        // Refresh user details
        fetchUserDetails();
        
        alert(`User role changed to ${newRole} successfully.`);
      } catch (error) {
        console.error('Failed to update user role:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="container mx-auto p-6 text-center">Loading user details...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="container mx-auto p-6 text-center text-red-500">Error: {error}</div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="container mx-auto p-6 text-center">User not found</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="container mx-auto p-6">
        <div className="mb-4">
          <Link href="/admin/users" className="text-blue-600 hover:underline">
            &larr; Back to Users
          </Link>
        </div>
        
        {/* User Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-2xl font-bold">
                {user.username}
                <span className={`ml-2 text-sm ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'} px-2 py-1 rounded-full`}>
                  {user.role}
                </span>
              </h1>
              <p className="text-gray-500">{user.email}</p>
            </div>
            <div className="flex mt-4 md:mt-0 space-x-2">
              <button
                onClick={startImpersonation}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              >
                Impersonate
              </button>
              <div className="relative inline-block text-left">
                <div className="dropdown">
                  <button
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Actions
                    <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="dropdown-menu origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => updateUserRole('ADMIN')}
                        disabled={user.role === 'ADMIN'}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                      >
                        Make Admin
                      </button>
                      <button
                        onClick={() => updateUserRole('USER')}
                        disabled={user.role === 'USER'}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                      >
                        Make User
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-4 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('characters')}
            className={`py-2 px-4 ${activeTab === 'characters' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          >
            Characters ({user.characterCount})
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-2 px-4 ${activeTab === 'security' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`py-2 px-4 ${activeTab === 'raw' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          >
            Raw Data
          </button>
        </div>
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Account Information</h2>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Username</td>
                      <td className="py-2">{user.username}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Email</td>
                      <td className="py-2">{user.email}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Display Name</td>
                      <td className="py-2">{user.name || 'Not set'}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Role</td>
                      <td className="py-2">{user.role}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Email Verified</td>
                      <td className="py-2">
                        {user.emailVerified ? (
                          <span className="text-green-600">Yes</span>
                        ) : (
                          <span className="text-red-600">No</span>
                        )}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Created</td>
                      <td className="py-2">{new Date(user.createdAt).toLocaleString()}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Last Updated</td>
                      <td className="py-2">{new Date(user.updatedAt).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-4">Character Statistics</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Approved Characters</span>
                      <span className="text-green-600 font-medium">{user.approvedCharacterCount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ 
                        width: `${user.characterCount ? (user.approvedCharacterCount / user.characterCount * 100) : 0}%` 
                      }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Pending Characters</span>
                      <span className="text-amber-600 font-medium">{user.pendingCharacterCount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-amber-500 h-2.5 rounded-full" style={{ 
                        width: `${user.characterCount ? (user.pendingCharacterCount / user.characterCount * 100) : 0}%` 
                      }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Rejected Characters</span>
                      <span className="text-red-600 font-medium">{user.rejectedCharacterCount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-red-600 h-2.5 rounded-full" style={{ 
                        width: `${user.characterCount ? (user.rejectedCharacterCount / user.characterCount * 100) : 0}%` 
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Characters Tab */}
        {activeTab === 'characters' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Characters</h2>
            
            {user.characters.length === 0 ? (
              <p className="text-gray-500">This user has no characters.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.characters.map((character) => (
                  <div key={character.id} className="border rounded-lg overflow-hidden bg-gray-50">
                    <div className={`px-4 py-2 ${character.approved ? 'bg-green-100' : character.rejected ? 'bg-red-100' : 'bg-yellow-100'}`}>
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{character.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          character.approved ? 'bg-green-200 text-green-800' : 
                          character.rejected ? 'bg-red-200 text-red-800' : 
                          'bg-yellow-200 text-yellow-800'
                        }`}>
                          {character.approved ? 'Approved' : character.rejected ? 'Rejected' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600">Faction: {character.faction}</p>
                      <p className="text-sm text-gray-600">Created: {new Date(character.createdAt).toLocaleDateString()}</p>
                      <div className="mt-3 text-sm text-gray-600">
                        <p className="font-medium">Backstory:</p>
                        <p className="line-clamp-3">{character.backstory}</p>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Link href={`/admin/characters/${character.id}`}>
                          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Security Information</h2>
            
            {/* Password section - ADD THIS */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-md font-medium mb-2">Password Information</h3>
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Encrypted Password Hash:</p>
                    <div className="bg-gray-100 p-2 rounded font-mono text-xs overflow-auto break-all">
                      {user.password || 'No password hash found'}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      This is a one-way bcrypt hash. The original password cannot be recovered.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to reset this user\'s password?')) {
                        // Implementation for password reset
                        alert('Password reset functionality to be implemented');
                      }
                    }}
                    className="ml-2 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            </div>
            
            {/* Existing token section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-md font-medium mb-2">Authentication Token</h3>
              {user.authToken ? (
                <div>
                  <div className="flex items-center justify-between">
                    <div className="bg-gray-100 p-2 rounded font-mono text-sm overflow-auto flex-1 mr-2">
                      {user.authToken}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(user.authToken || '');
                        alert('Token copied to clipboard!');
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Copy
                    </button>
                    <button
                      onClick={revokeToken}
                      className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Revoke
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    This token can be used for API authentication and admin impersonation.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-500 mb-2">No authentication token has been generated for this user.</p>
                  <button
                    onClick={generateToken}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Generate Token
                  </button>
                </div>
              )}
            </div>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-md font-medium mb-2">Email Verification</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p>Status: 
                    {user.emailVerified ? (
                      <span className="text-green-600 font-medium ml-2">Verified</span>
                    ) : (
                      <span className="text-red-600 font-medium ml-2">Not Verified</span>
                    )}
                  </p>
                  {user.verificationToken && (
                    <p className="text-sm text-gray-500 mt-1">
                      Verification token: <span className="font-mono">{user.verificationToken}</span>
                    </p>
                  )}
                </div>
                {!user.emailVerified && (
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    Send Verification Email
                  </button>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2">Account Actions</h3>
              <div className="flex flex-wrap gap-2">
                <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                  Reset Password
                </button>
                <button 
                  onClick={startImpersonation}
                  className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                >
                  Impersonate User
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                  Disable Account
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Raw Data Tab */}
        {activeTab === 'raw' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Raw User Data</h2>
            <div className="bg-gray-100 p-4 rounded-lg overflow-auto">
              <pre className="text-xs">{JSON.stringify(user, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}