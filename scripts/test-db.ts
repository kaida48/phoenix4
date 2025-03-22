import { prisma } from "../src/lib/prisma";

async function main() {
  try {
    // Test raw query first to check connection
    console.log("Testing database connection...");
    await prisma.$queryRaw`SELECT 1`;
    console.log("Database connection successful!");
    
    // Test character table access
    console.log("Testing character table access...");
    const count = await prisma.character.count();
    console.log(`Found ${count} characters in the database`);
    
    // Test user table access
    console.log("Testing user table access...");
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in the database`);
    
  } catch (error) {
    console.error("Database connection error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
