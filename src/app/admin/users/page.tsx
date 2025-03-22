"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

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
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (response.ok) {
        setUsers(
          users.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
        );
      } else {
        alert("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const isReady = status !== "loading";
  
  return (
    <div>
      {isReady ? (
        <div className="min-h-screen bg-gray-900 text-white">
          <Navbar />
          <main className="container mx-auto px-6 py-8">
            <h2 className="text-2xl font-bold mb-6">User Management</h2>
            {/* Render users table here */}
          </main>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}
    </div>
  );
}