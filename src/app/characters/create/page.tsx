"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Define FactionType manually
type FactionType = 'USRF' | 'COALITION' | 'SOUTHPOINT' | 'ALUMNI' | 'VOYAGEURS' | 'BIOMASS' | 'INDEPENDENT';

// Types for structured data instead of JSON
type Skill = {
  name: string;
  level: number;
};

type Equipment = {
  name: string;
  description: string;
  source: string; // How the item was obtained
};

type Relationship = {
  name: string;
  type: 'ally' | 'enemy' | 'neutral';
};

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

  // Skills as structured data
  const [skills, setSkills] = useState<Skill[]>([
    { name: '', level: 5 }
  ]);
  
  // Equipment as structured data
  const [equipmentItems, setEquipmentItems] = useState<Equipment[]>([
    { name: '', description: '', source: '' }
  ]);
  
  // Relationships as structured data
  const [relationships, setRelationships] = useState<Relationship[]>([
    { name: '', type: 'ally' }
  ]);
  
  // Add/remove form items
  const addSkill = () => setSkills([...skills, { name: '', level: 5 }]);
  const removeSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };
  
  const addEquipment = () => setEquipmentItems([...equipmentItems, { name: '', description: '', source: '' }]);
  const removeEquipment = (index: number) => {
    const newEquipment = [...equipmentItems];
    newEquipment.splice(index, 1);
    setEquipmentItems(newEquipment);
  };
  
  const addRelationship = () => setRelationships([...relationships, { name: '', type: 'ally' }]);
  const removeRelationship = (index: number) => {
    const newRelationships = [...relationships];
    newRelationships.splice(index, 1);
    setRelationships(newRelationships);
  };
  
  // Update form items
  const updateSkill = (index: number, field: keyof Skill, value: string | number) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setSkills(newSkills);
  };
  
  const updateEquipment = (index: number, field: keyof Equipment, value: string) => {
    const newEquipment = [...equipmentItems];
    newEquipment[index] = { ...newEquipment[index], [field]: value };
    setEquipmentItems(newEquipment);
  };
  
  const updateRelationship = (index: number, field: keyof Relationship, value: string) => {
    const newRelationships = [...relationships];
    newRelationships[index] = { ...newRelationships[index], [field]: value };
    setRelationships(newRelationships);
  };
  
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
      // Convert structured data to JSON objects
      const skillsObject = skills.reduce((obj, skill) => {
        if (skill.name) obj[skill.name] = skill.level;
        return obj;
      }, {} as Record<string, number>);
      
      const equipmentObject = {
        items: equipmentItems.filter(item => item.name).map(item => ({
          name: item.name,
          description: item.description,
          source: item.source
        }))
      };
      
      const relationshipsObject = {
        allies: relationships.filter(r => r.type === 'ally' && r.name).map(r => r.name),
        enemies: relationships.filter(r => r.type === 'enemy' && r.name).map(r => r.name),
        neutral: relationships.filter(r => r.type === 'neutral' && r.name).map(r => r.name)
      };
      
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
          skills: skillsObject,
          equipment: equipmentObject,
          relationships: relationshipsObject
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
            
            {/* Skills */}
            <div>
              <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                <h3 className="text-xl font-semibold">Character Skills</h3>
                <button 
                  type="button" 
                  onClick={addSkill}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
                >
                  Add Skill
                </button>
              </div>
              
              {skills.map((skill, index) => (
                <div key={index} className="mb-4 flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-gray-300 mb-2">Skill Name</label>
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => updateSkill(index, 'name', e.target.value)}
                      className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600"
                      placeholder="e.g. Combat, Speech, Survival"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-gray-300 mb-2">Level (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={skill.level}
                      onChange={(e) => updateSkill(index, 'level', parseInt(e.target.value) || 1)}
                      className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="bg-red-600 hover:bg-red-700 text-white h-12 px-3 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            
            {/* Equipment */}
            <div>
              <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                <h3 className="text-xl font-semibold">Equipment</h3>
                <button 
                  type="button" 
                  onClick={addEquipment}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
                >
                  Add Item
                </button>
              </div>
              
              {equipmentItems.map((item, index) => (
                <div key={index} className="mb-4 grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
                  <div>
                    <label className="block text-gray-300 mb-2">Item Name</label>
                    <select
                      value={item.name}
                      onChange={(e) => updateEquipment(index, 'name', e.target.value)}
                      className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600"
                    >
                      <option value="">Select an item...</option>
                      <option value="Combat Knife">Combat Knife</option>
                      <option value="9mm Pistol">9mm Pistol</option>
                      <option value="Assault Rifle">Assault Rifle</option>
                      <option value="Pipe Wrench">Pipe Wrench</option>
                      <option value="Leather Jacket">Leather Jacket</option>
                      <option value="Combat Armor">Combat Armor</option>
                      <option value="Medical Kit">Medical Kit</option>
                      <option value="Food Rations">Food Rations</option>
                      <option value="Water Purifier">Water Purifier</option>
                      <option value="Radio">Radio</option>
                      <option value="Custom Item...">Custom Item...</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Description</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateEquipment(index, 'description', e.target.value)}
                      className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600"
                      placeholder="e.g. Rusty but functional"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">How Obtained</label>
                    <input
                      type="text"
                      value={item.source}
                      onChange={(e) => updateEquipment(index, 'source', e.target.value)}
                      className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600"
                      placeholder="e.g. Found in abandoned bunker"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEquipment(index)}
                    className="bg-red-600 hover:bg-red-700 text-white h-12 px-3 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            
            {/* Relationships */}
            <div>
              <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                <h3 className="text-xl font-semibold">Relationships</h3>
                <button 
                  type="button" 
                  onClick={addRelationship}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
                >
                  Add Relationship
                </button>
              </div>
              
              {relationships.map((relation, index) => (
                <div key={index} className="mb-4 grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-2 items-end">
                  <div>
                    <label className="block text-gray-300 mb-2">Person/Group Name</label>
                    <input
                      type="text"
                      value={relation.name}
                      onChange={(e) => updateRelationship(index, 'name', e.target.value)}
                      className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600"
                      placeholder="e.g. Trader Joe, USRF Patrol Unit"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Relationship Type</label>
                    <select
                      value={relation.type}
                      onChange={(e) => updateRelationship(index, 'type', e.target.value as 'ally' | 'enemy' | 'neutral')}
                      className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600"
                    >
                      <option value="ally">Ally</option>
                      <option value="enemy">Enemy</option>
                      <option value="neutral">Neutral</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRelationship(index)}
                    className="bg-red-600 hover:bg-red-700 text-white h-12 px-3 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
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