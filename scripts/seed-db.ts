import { prisma } from "../src/lib/prisma";
import { hash } from "bcrypt";

async function main() {
  try {
    console.log("Seeding database with test data...");
    
    // Create test users if they don't exist
    const testPassword = await hash("password123", 10);
    
    // Create regular user
    await prisma.user.upsert({
      where: { email: "user@example.com" },
      update: {},
      create: {
        email: "user@example.com",
        username: "testuser",
        password: testPassword,
        name: "Test User",
        role: "USER"
      }
    });
    
    // Create moderator
    await prisma.user.upsert({
      where: { email: "mod@example.com" },
      update: {},
      create: {
        email: "mod@example.com",
        username: "testmod",
        password: testPassword,
        name: "Test Moderator",
        role: "MODERATOR"
      }
    });
    
    // Create admin if not exists
    await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        email: "admin@example.com",
        username: "testadmin",
        password: testPassword,
        name: "Test Admin",
        role: "ADMIN"
      }
    });
    
    console.log("Users created!");
    
    // Create some sample characters
    const user = await prisma.user.findUnique({ where: { email: "user@example.com" } });
    
    if (user) {
      // Sample character 1
      await prisma.character.upsert({
        where: { id: "test-char-1" },
        update: {},
        create: {
          id: "test-char-1",
          name: "John Wanderer",
          faction: "INDEPENDENT",
          backstory: "A lone wanderer from the wastes...",
          approved: true,
          appearance: "Tall with weathered skin and a long coat.",
          skills: {
            "Survival": 8,
            "Combat": 6,
            "Negotiation": 4
          },
          equipment: {
            items: [
              { name: "Hunting Rifle", description: "Old but reliable", source: "Found in abandoned bunker" },
              { name: "Combat Knife", description: "Sharp and worn", source: "Family heirloom" }
            ]
          },
          relationships: {
            allies: ["Maria (trader)", "Southpoint Guards"],
            enemies: ["Raiders of the North", "The Collector"],
            neutral: ["USRF Patrols"]
          },
          userId: user.id
        }
      });
      
      // Sample character 2
      await prisma.character.upsert({
        where: { id: "test-char-2" },
        update: {},
        create: {
          id: "test-char-2",
          name: "Sarah Technician",
          faction: "ALUMNI",
          backstory: "A skilled technician looking to preserve knowledge...",
          approved: false,
          appearance: "Short with glasses and utility belt.",
          skills: {
            "Technology": 9,
            "Medicine": 5,
            "Combat": 2
          },
          equipment: {
            items: [
              { name: "Toolkit", description: "Complete set of tools", source: "Alumni issue" },
              { name: "Medical Kit", description: "Basic supplies", source: "Crafted from salvage" }
            ]
          },
          relationships: {
            allies: ["The Professor", "Tech Guild"],
            enemies: ["Anti-tech cult", "Scavengers"],
            neutral: ["Coalition Forces"]
          },
          userId: user.id
        }
      });
    }
    
    console.log("Sample characters created!");
    console.log("Database seeded successfully!");
    
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
