// Simple script to test database connection without requiring TSX
console.log("Testing database connection with direct Node.js script...");

// Import the PrismaClient
try {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  // Test the connection
  async function testConnection() {
    try {
      console.log("Connecting to database...");
      
      // Test raw query
      await prisma.$queryRaw`SELECT 1`;
      console.log("✅ Database connection successful!");
      
      // Get counts
      const userCount = await prisma.user.count();
      const characterCount = await prisma.character.count();
      console.log(`Found ${userCount} users and ${characterCount} characters in the database.`);
      
      return true;
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      return false;
    } finally {
      await prisma.$disconnect();
    }
  }

  // Run the test
  testConnection()
    .then(success => {
      if (!success) {
        console.log("\nTroubleshooting tips:");
        console.log("1. Check if PostgreSQL is running");
        console.log("2. Verify your DATABASE_URL in .env file");
        console.log("3. Make sure the database and user exist");
      }
      process.exit(success ? 0 : 1);
    });
  
} catch (error) {
  console.error("❌ Failed to load Prisma client:", error);
  console.log("\nTroubleshooting tips:");
  console.log("1. Run 'npm install' to reinstall dependencies");
  console.log("2. Run 'npx prisma generate' to generate Prisma client");
  process.exit(1);
}
