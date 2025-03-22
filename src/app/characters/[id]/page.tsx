"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type Character = {
  id: string;
  name: string;
  faction: string;
  backstory: string;
  appearance: string | null;
  skills: Record<string, number>;
  equipment: { items: { name: string; description?: string; source?: string }[] };
  relationships: {
    allies?: string[];
    enemies?: string[];
    neutral?: string[];
  };
  approved: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export default function CharacterDetail() {
  const params = useParams();
  const characterId = params.id as string;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && characterId) {
      fetchCharacter();
    }
  }, [status, router, characterId]);

  const fetchCharacter = async () => {
    try {
      const response = await fetch(`/api/characters/${characterId}`);
      if (response.ok) {
        const data = await response.json();
        setCharacter(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to load character");
      }
    } catch (err) {
      setError("An error occurred while loading the character");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "MODERATOR";
  const isOwner = character?.userId === session?.user?.id;
  const canEdit = isAdmin || isOwner;

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-white text-xl">Loading...</div>
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
            <Link
              href="/characters"
              className="text-blue-400 hover:underline mt-2 block"
            >
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
            <h2 className="text-2xl font-bold text-white mb-4">
              Character not found
            </h2>
            <Link
              href="/characters"
              className="text-blue-400 hover:underline"
            >
              ← Back to character list
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="container mx-auto px-6 py-8">
        {/* Navigation and Edit/Approval Actions */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/characters" className="text-blue-400 hover:underline">
            ← Back to character list
          </Link>

          {canEdit && (
            <div className="flex gap-2">
              <Link
                href={`/characters/${character.id}/edit`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Edit Character
              </Link>

              {isAdmin && !character.approved && (
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  onClick={async () => {
                    const res = await fetch(
                      `/api/admin/characters/${character.id}/approve`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ approved: true }),
                      }
                    );
                    if (res.ok) fetchCharacter();
                  }}
                >
                  Approve
                </button>
              )}

              {isAdmin && character.approved && (
                <button
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
                  onClick={async () => {
                    const res = await fetch(
                      `/api/admin/characters/${character.id}/approve`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ approved: false }),
                      }
                    );
                    if (res.ok) fetchCharacter();
                  }}
                >
                  Reject
                </button>
              )}

              {isAdmin && (
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  onClick={async () => {
                    if (
                      confirm(
                        "Are you sure you want to delete this character?"
                      )
                    ) {
                      const res = await fetch(
                        `/api/admin/characters/${character.id}`,
                        { method: "DELETE" }
                      );
                      if (res.ok) router.push("/characters");
                    }
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>

        {/* Character Header */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <div className="flex justify-between items-start border-b border-gray-700 pb-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">{character.name}</h2>
              <div className="flex items-center gap-3 text-sm">
                <span className="bg-gray-700 px-3 py-1 rounded">
                  {character.faction}
                </span>
                <span
                  className={`px-3 py-1 rounded ${
                    character.approved
                      ? "bg-green-700 text-green-100"
                      : "bg-yellow-700 text-yellow-100"
                  }`}
                >
                  {character.approved ? "Approved" : "Pending Approval"}
                </span>
              </div>
            </div>
          </div>

          {/* Backstory Section */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
              Backstory
            </h3>
            <div className="whitespace-pre-wrap">{character.backstory}</div>
          </section>

          {/* Appearance Section */}
          {character.appearance && (
            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
                Appearance
              </h3>
              <div className="whitespace-pre-wrap">{character.appearance}</div>
            </section>
          )}

          {/* Skills Section */}
          {character.skills &&
            Object.keys(character.skills).length > 0 && (
              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
                  Skills
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(character.skills).map(([skill, level]) => (
                    <div
                      key={skill}
                      className="bg-gray-700 p-3 rounded flex justify-between"
                    >
                      <span>{skill}</span>
                      <span className="font-mono">{level}/10</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

          {/* Equipment Section */}
          {character.equipment?.items &&
            character.equipment.items.length > 0 && (
              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
                  Equipment
                </h3>
                <div className="space-y-3">
                  {character.equipment.items.map((item, index) => (
                    <div key={index} className="bg-gray-700 p-3 rounded">
                      <h4 className="font-medium">{item.name}</h4>
                      {item.description && (
                        <p className="text-gray-400 text-sm mt-1">
                          {item.description}
                        </p>
                      )}
                      {item.source && (
                        <p className="text-gray-400 text-sm mt-1">
                          Source: {item.source}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

          {/* Relationships Section */}
          {character.relationships && (
            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
                Relationships
              </h3>
              {character.relationships.allies &&
                character.relationships.allies.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-green-400 mb-2">
                      Allies
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {character.relationships.allies.map(
                        (ally, index) => (
                          <div
                            key={index}
                            className="bg-green-900/30 p-2 rounded border border-green-800"
                          >
                            {ally}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              {character.relationships.enemies &&
                character.relationships.enemies.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-red-400 mb-2">
                      Enemies
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {character.relationships.enemies.map(
                        (enemy, index) => (
                          <div
                            key={index}
                            className="bg-red-900/30 p-2 rounded border border-red-800"
                          >
                            {enemy}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              {character.relationships.neutral &&
                character.relationships.neutral.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-400 mb-2">
                      Neutral
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {character.relationships.neutral.map(
                        (neutral, index) => (
                          <div
                            key={index}
                            className="bg-gray-700 p-2 rounded border border-gray-600"
                          >
                            {neutral}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}