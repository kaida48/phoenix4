"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";

type LoginFormData = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });
      
      if (result?.error) {
        setError("Invalid username or password");
        return;
      }
      
      // Redirect to home page on successful login
      router.push("/");
      router.refresh(); // Important to refresh the page
      
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-white text-center">Login to Phoenix Roleplay</h1>
          <p className="mt-2 text-center text-gray-400">Enter your credentials to access your account</p>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  type="text"
                  {...register("username", { required: "Username is required" })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 
                         rounded-md shadow-sm bg-gray-700 text-white 
                         focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.username && (
                  <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  {...register("password", { required: "Password is required" })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 
                         rounded-md shadow-sm bg-gray-700 text-white 
                         focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent 
                     rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                     disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/register" className="text-blue-400 hover:text-blue-300">
                Don't have an account? Register
              </Link>
            </div>
            <div className="text-sm">
              <Link href="/forgot-password" className="text-blue-400 hover:text-blue-300">
                Forgot your password?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}