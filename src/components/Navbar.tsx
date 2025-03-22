"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-white text-xl font-bold">
                Phoenix RP
              </Link>
            </div>
            {status === "authenticated" && (
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <Link
                    href="/characters"
                    className="text-gray-300 hover:text-white"
                  >
                    Characters
                  </Link>
                  <Link
                    href="/characters/create"
                    className="text-gray-300 hover:text-white"
                  >
                    Create Character
                  </Link>
                  {session.user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="text-gray-300 hover:text-white"
                    >
                      Admin Panel
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {status === "authenticated" ? (
                <>
                  <span className="text-gray-300 mr-4">
                    {session.user.name || session.user.email}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="ml-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700"
            >
              Home
            </Link>
            {status === "authenticated" && (
              <>
                <Link
                  href="/characters"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700"
                >
                  Characters
                </Link>
                <Link
                  href="/characters/create"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700"
                >
                  Create Character
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700"
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            )}
            {status !== "authenticated" && (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          {status === "authenticated" && (
            <div className="pt-4 pb-3 border-t border-gray-700 px-5">
              <div className="flex items-center">
                <div className="flex-1">
                  <span className="text-gray-300">
                    {session.user.name || session.user.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="ml-auto px-3 py-2 border border-gray-600 rounded-md text-sm font-medium text-white hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}