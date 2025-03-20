"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client'; 

// Define FactionType manually if Prisma types aren't available yet
type FactionType = 'USRF' | 'COALITION' | 'SOUTHPOINT' | 'ALUMNI' | 'VOYAGEURS' | 'BIOMASS' | 'INDEPENDENT';

export default function CreateCharacter() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Character data
  const [name, setName] = useState('');
  const [faction, setFaction] = useState<FactionType>('INDEPENDENT');
  const [backstory, setBackstory] = useState('');
  const [appearance, setAppearance] = useState('');
  const [skills, setSkills] = useState(''); // Will convert to JSON
  const [equipment, setEquipment] = useState(''); // Will convert to JSON
  const [relationships, setRelationships] = useState(''); // Will convert to JSON
  
  // Protect route
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Parse JSON fields
      const parsedSkills = skills ? JSON.parse(skills) : {};
      const parsedEquipment = equipment ? JSON.parse(equipment) : {};
      const parsedRelationships = relationships ? JSON.parse(relationships) : {};
      
      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          faction,
          backstory,
          appearance,
          skills: parsedSkills,
          equipment: parsedEquipment,
          relationships: parsedRelationships
        }),
      });
      
      if (response.ok) {
        router.push('/characters');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create character');
      }
    } catch (err) {
      console.error('Error creating character:', err);
      setError(err instanceof Error ? err.message : 'Failed to create character');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Phoenix Roleplay</h1>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
            <Link href="/characters" className="hover:text-blue-400">My Characters</Link>
            <Link href="/api/auth/signout" className="hover:text-blue-400">Sign Out</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-6">Create Your Character</h2>
          
          {error && (
            <div className="bg-red-600 text-white p-4 rounded mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-300 mb-2">Character Name *</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="faction" className="block text-gray-300 mb-2">Faction *</label>
                  <select
                    id="faction"
                    value={faction}
                    onChange={(e) => setFaction(e.target.value as FactionType)}
                    className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600"
                    required
                  >
                    <option value="USRF">USRF (United States Reclamation Force)</option>
                    <option value="COALITION">The Coalition</option>
                    <option value="SOUTHPOINT">Southpoint State</option>
                    <option value="ALUMNI">The Alumni</option>
                    <option value="VOYAGEURS">The Voyageurs</option>
                    <option value="BIOMASS">The Biomass</option>
                    <option value="INDEPENDENT">Independent</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Backstory */}
            <div>
              <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Character Details</h3>
              
              <div className="mb-6">
                <label htmlFor="backstory" className="block text-gray-300 mb-2">Backstory *</label>
                <textarea
                  id="backstory"
                  value={backstory}
                  onChange={(e) => setBackstory(e.target.value)}
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 min-h-[150px]"
                  required
                />
                <p className="text-gray-400 text-sm mt-1">Tell us your character's history and motivations.</p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="appearance" className="block text-gray-300 mb-2">Appearance</label>
                <textarea
                  id="appearance"
                  value={appearance}
                  onChange={(e) => setAppearance(e.target.value)}
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 min-h-[100px]"
                />
                <p className="text-gray-400 text-sm mt-1">Describe how your character looks.</p>
              </div>
            </div>
            
            {/* Advanced Fields (JSON) */}
            <div>
              <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Advanced Details (JSON Format)</h3>
              
              <div className="mb-6">
                <label htmlFor="skills" className="block text-gray-300 mb-2">Skills (JSON)</label>
                <textarea
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 font-mono"
                  placeholder='{"combat": 8, "speech": 6, "survival": 9}'
                />
                <p className="text-gray-400 text-sm mt-1">Enter skills as a JSON object.</p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="equipment" className="block text-gray-300 mb-2">Equipment (JSON)</label>
                <textarea
                  id="equipment"
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 font-mono"
                  placeholder='{"weapons": ["Pipe wrench", "9mm pistol"], "armor": "Leather jacket"}'
                />
                <p className="text-gray-400 text-sm mt-1">Enter equipment as a JSON object.</p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="relationships" className="block text-gray-300 mb-2">Relationships (JSON)</label>
                <textarea
                  id="relationships"
                  value={relationships}
                  onChange={(e) => setRelationships(e.target.value)}
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 font-mono"
                  placeholder='{"allies": ["Trader Joe", "Doc Mitchell"], "enemies": ["Raider Boss"]}'
                />
                <p className="text-gray-400 text-sm mt-1">Enter relationships as a JSON object.</p>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Create Character'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}