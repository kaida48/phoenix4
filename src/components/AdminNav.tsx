"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminNav() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Add state to track authorization
  const [authChecked, setAuthChecked] = useState(false);
  
  // Use for debugging
  useEffect(() => {
    console.log("AdminNav - Session status:", status);
    console.log("AdminNav - Session data:", session);
    console.log("AdminNav - User role:", session?.user?.role);
  }, [status, session]);

  useEffect(() => {
    if (status === 'loading') {
      return; // Wait until loading is complete
    }
    
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (status === 'authenticated') {
      if (session?.user?.role !== 'ADMIN') {
        console.log("Not an admin, redirecting to unauthorized");
        router.push('/unauthorized');
        return;
      }
      
      // Mark auth check as complete if we reach here (user is authenticated and admin)
      setAuthChecked(true);
    }
  }, [status, session, router]);

  // Show loading state only during initial load
  if (status === 'loading' || !authChecked) {
    return <div className="bg-gray-800 text-white p-4">Checking admin permissions...</div>;
  }

  // At this point, we know the user is an admin, so render the navigation
  const isActive = (path: string) => {
    return pathname === path ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white";
  };

  return (
    <div className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/admin" className="font-bold text-xl">
                Admin Panel
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link href="/admin" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/admin')}`}>
                  Dashboard
                </Link>
                <Link href="/admin/characters/pending" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/admin/characters/pending')}`}>
                  Pending Characters
                </Link>
                <Link href="/admin/users" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/admin/users')}`}>
                  Manage Users
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700">
                Back to Main Site
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/admin" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/admin')}`}>
              Dashboard
            </Link>
            <Link href="/admin/characters/pending" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/admin/characters/pending')}`}>
              Pending Characters
            </Link>
            <Link href="/admin/users" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/admin/users')}`}>
              Manage Users
            </Link>
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600">
              Back to Main Site
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}