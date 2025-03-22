"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type RegisterFormValues = {
  username: string;
  email: string;
  password: string;
};

export default function Register() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>();
  const router = useRouter();

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        router.push("/login");
      } else {
        const result = await response.json();
        // Optionally, use your own error display component here
        console.error(result.error || "Registration failed");
      }
    } catch (err) {
      console.error("An error occurred during registration", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Navbar />
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-2">Join The Sunrise Isles</h1>
        <p className="text-gray-400 mb-6">
          Create your account to submit characters and join the roleplay
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-300 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register("username", { required: "Username is required" })}
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
              })}
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full p-3 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-gray-400 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}