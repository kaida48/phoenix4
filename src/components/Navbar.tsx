"use client";

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
  const { data: session } = useSession();
  
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "MODERATOR";
  
  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <Link href="/" className="text-xl font-bold text-white">Phoenix Roleplay</Link>
        </div>
        
        {session ? (
          <nav className="flex items-center flex-wrap justify-center gap-4 sm:gap-6">
            <Link href="/dashboard" className="text-gray-300 hover:text-blue-400 transition-colors">Dashboard</Link>
            <Link href="/characters" className="text-gray-300 hover:text-blue-400 transition-colors">My Characters</Link>
            <Link href="/characters/create" className="text-gray-300 hover:text-blue-400 transition-colors">Create Character</Link>
            
            {isAdmin && (
              <>
                <Link href="/admin" className="text-yellow-300 hover:text-yellow-400 transition-colors">Admin Panel</Link>
                <Link href="/admin/users" className="text-yellow-300 hover:text-yellow-400 transition-colors">Manage Users</Link>
              </>
            )}
            
            <Link 
              href="/api/auth/signout"
              className="text-gray-300 hover:text-red-400 transition-colors"
            >
              Sign Out
            </Link>
          </nav>
        ) : (
          <nav className="flex items-center gap-6">
            <Link href="/login" className="text-gray-300 hover:text-blue-400 transition-colors">Login</Link>
            <Link href="/register" className="text-gray-300 hover:text-blue-400 transition-colors">Register</Link>
          </nav>
        )}
      </div>
    </header>
  );
}