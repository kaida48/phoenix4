"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Check if user is an admin
  const isAdmin = session?.user?.role === "ADMIN";

  // For debugging
  useEffect(() => {
    if (session) {
      // For debugging purposes, replace console.log with a proper logging mechanism if needed.
      // Example: logUserRole(session?.user?.role);
    }
  }, [session]);
  
  // Helper to set active link style
  const isActive = (path: string) => {
    return pathname.startsWith(path) ? "text-blue-300" : "hover:text-blue-300";
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Phoenix Roleplay
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/characters" className={isActive("/characters")}>
              My Characters
            </Link>
            <Link href="/guides" className={isActive("/guides")}>
              Game Guides
            </Link>
            
            {/* Admin Links - Only shown if user is admin */}
            {isAdmin && (
              <div className="relative group">
                <button className="hover:text-blue-300 flex items-center">
                  Admin
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 ease-in-out z-50">
                  <div className="py-1">
                    <Link href="/admin" className="block px-4 py-2 hover:bg-gray-600">
                      Dashboard
                    </Link>
                    <Link href="/admin/characters/pending" className="block px-4 py-2 hover:bg-gray-600">
                      Pending Characters
                    </Link>
                    <Link href="/admin/users" className="block px-4 py-2 hover:bg-gray-600">
                      Manage Users
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            {session ? (
              <div className="relative group">
                <button className="hover:text-blue-300 flex items-center">
                  <div className="flex items-center">
                    {session.user?.name || session.user?.username || session.user?.email}
                    {/* Admin Badge */}
                    {isAdmin && (
                      <span className="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 ease-in-out z-50">
                  <div className="py-1">
                    <Link href="/profile" className="block px-4 py-2 hover:bg-gray-600">
                      Profile
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="block px-4 py-2 hover:bg-gray-600">
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-600 text-red-400"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <Link href="/characters" className="block py-2">
              My Characters
            </Link>
            <Link href="/guides" className="block py-2">
              Game Guides
            </Link>
            
            {/* Mobile Admin Links */}
            {isAdmin && (
              <div className="border-t border-gray-700 pt-2 mt-2">
                <div className="font-semibold mb-1 flex items-center">
                  Admin
                  <span className="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                    ADMIN
                  </span>
                </div>
                <Link href="/admin" className="block py-2 pl-4">
                  Dashboard
                </Link>
                <Link href="/admin/characters/pending" className="block py-2 pl-4">
                  Pending Characters
                </Link>
                <Link href="/admin/users" className="block py-2 pl-4">
                  Manage Users
                </Link>
              </div>
            )}
            
            {session ? (
              <div className="border-t border-gray-700 pt-2 mt-2">
                <div className="flex items-center py-2">
                  <span>{session.user?.name || session.user?.username || session.user?.email}</span>
                  {/* Admin Badge for mobile */}
                  {isAdmin && (
                    <span className="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                      ADMIN
                    </span>
                  )}
                </div>
                <Link href="/profile" className="block py-2">
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block py-2 w-full text-left text-red-400"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/login" className="block mt-4 bg-blue-600 text-center px-4 py-2 rounded">
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}