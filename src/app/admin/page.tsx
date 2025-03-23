"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminNav from '@/components/AdminNav';

interface AdminStats {
  totalUsers: number;
  totalCharacters: number;
  pendingCharacters: number;
  approvedCharacters: number;
  rejectedCharacters: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // For debugging
  useEffect(() => {
    console.log("AdminPage - Session status:", status);
    console.log("AdminPage - Session data:", session);
    console.log("AdminPage - User role:", session?.user?.role);
  }, [session, status]);

  // Only fetch data when we confirm the user is an admin
  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (status === 'authenticated') {
      // Double check role is present
      if (!session?.user?.role) {
        console.error("User role is missing from session:", session);
        return;
      }
      
      if (session.user.role !== 'ADMIN') {
        router.push('/unauthorized');
        return;
      }
      
      // If we get here, user is admin, fetch data
      fetchAdminStats();
    }
  }, [status, session, router]);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication or fetching data
  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <>
        <AdminNav />
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          <div className="text-center">Loading dashboard data...</div>
        </div>
      </>
    );
  }

  // Only show the dashboard if we have stats
  return (
    <>
      <AdminNav />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2 text-gray-800">Users</h2>
                <p className="text-3xl font-bold text-gray-800">{stats.totalUsers || 0}</p>
                <Link href="/admin/users" className="text-blue-600 hover:underline block mt-4">
                  Manage Users →
                </Link>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2 text-gray-800">Total Characters</h2>
                <p className="text-3xl font-bold text-gray-800">{stats.totalCharacters || 0}</p>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2 text-gray-800">Pending Characters</h2>
                <p className="text-3xl font-bold text-gray-800">{stats.pendingCharacters || 0}</p>
                <Link href="/admin/characters/pending" className="text-amber-600 hover:underline block mt-4">
                  Review Pending →
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
                <div className="grid grid-cols-1 gap-3">
                  <Link href="/admin/characters/pending">
                    <div className="bg-amber-100 hover:bg-amber-200 transition p-4 rounded flex justify-between items-center">
                      <span className="text-gray-800">Review Pending Characters</span>
                      <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-sm">
                        {stats.pendingCharacters || 0}
                      </span>
                    </div>
                  </Link>
                  <Link href="/admin/users">
                    <div className="bg-blue-100 hover:bg-blue-200 transition p-4 rounded">
                      <span className="text-gray-800">Manage Users</span>
                    </div>
                  </Link>
                </div>
              </div>
              
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Character Statistics</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-800">Approved</span>
                      <span className="text-green-600 font-medium">{stats.approvedCharacters || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ 
                        width: `${stats.totalCharacters ? (stats.approvedCharacters / stats.totalCharacters * 100) : 0}%` 
                      }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-800">Pending</span>
                      <span className="text-amber-600 font-medium">{stats.pendingCharacters || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-amber-500 h-2.5 rounded-full" style={{ 
                        width: `${stats.totalCharacters ? (stats.pendingCharacters / stats.totalCharacters * 100) : 0}%` 
                      }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-800">Rejected</span>
                      <span className="text-red-600 font-medium">{stats.rejectedCharacters || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-red-600 h-2.5 rounded-full" style={{ 
                        width: `${stats.totalCharacters ? (stats.rejectedCharacters / stats.totalCharacters * 100) : 0}%` 
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}