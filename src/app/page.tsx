import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <main className="container mx-auto px-6 py-20 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">Phoenix Roleplay</h1>
        <p className="text-xl text-gray-300 text-center max-w-2xl mb-12">
          Welcome to the Sunrise Isles character submission system. Create your character and become part of the story.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-center"
          >
            Login
          </Link>
          <Link 
            href="/register"
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-center"
          >
            Register
          </Link>
        </div>
      </main>
    </div>
  );
}
