"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Character {
  name: string;
  faction: string;
  backstory: string;
  appearance?: string;
  skills?: Record<string, string | number>;
  equipment?: Record<string, string | any>;
}

export default function CharacterDetail() {
  const { id } = useParams();
  const [character, setCharacter] = useState<Character | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCharacter() {
      try {
        const response = await fetch(`/api/characters/${id}`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setCharacter(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching character:", err);
        setError(err instanceof Error ? err.message : "Failed to load character");
        setLoading(false);
      }
    }

    if (id) {
      fetchCharacter();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-xl text-white">Loading character data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded">
            <p>{error}</p>
            <Link href="/characters" className="text-blue-400 hover:underline mt-2 block">
              ← Back to character list
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Character not found</h2>
            <Link href="/characters" className="text-blue-400 hover:underline">
              ← Back to character list
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render character details when data is available
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-4">{character.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-2">Faction</h2>
              <p className="text-gray-300">{character.faction}</p>
              
              <h2 className="text-xl font-semibold text-blue-400 mt-6 mb-2">Backstory</h2>
              <p className="text-gray-300 whitespace-pre-line">{character.backstory}</p>
              
              {character.appearance && (
                <>
                  <h2 className="text-xl font-semibold text-blue-400 mt-6 mb-2">Appearance</h2>
                  <p className="text-gray-300 whitespace-pre-line">{character.appearance}</p>
                </>
              )}
            </div>
            
            <div>
              {character.skills && (
                <>
                  <h2 className="text-xl font-semibold text-blue-400 mb-2">Skills</h2>
                  <ul className="list-disc list-inside text-gray-300">
                    {Object.entries(character.skills).map(([skill, level]) => (
                      <li key={skill}>
                        {skill}: {level}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              
              {character.equipment && (
                <>
                  <h2 className="text-xl font-semibold text-blue-400 mt-6 mb-2">Equipment</h2>
                  <ul className="list-disc list-inside text-gray-300">
                    {Object.entries(character.equipment).map(([item, details]) => (
                      <li key={item}>
                        {item}: {typeof details === 'string' ? details : JSON.stringify(details)}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
          
          <div className="mt-8">
            <Link href="/characters" className="text-blue-400 hover:underline">
              ← Back to character list
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}