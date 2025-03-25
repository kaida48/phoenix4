import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create a new Prisma client instance
const prisma = new PrismaClient();

async function testDatabaseConnection() {
  console.log("🔍 Testing database connection...");
  
  try {
    // Test basic connectivity with a simple raw query
    await prisma.$queryRaw`SELECT 1 as result`;
    console.log("✅ Database connection successful!");
    
    // Test table access
    console.log("\n📊 Database Statistics:");
    
    // Count users
    const userCount = await prisma.user.count();
    console.log(`👤 Users: ${userCount}`);
    
    // Count characters
    const characterCount = await prisma.character.count();
    console.log(`🎭 Characters: ${characterCount}`);
    
    // Count approved characters
    const approvedCharacters = await prisma.character.count({
      where: { approved: true }
    });
    console.log(`✓ Approved Characters: ${approvedCharacters}`);
    
    // Count pending characters
    const pendingCharacters = await prisma.character.count({
      where: { approved: false, rejected: false }
    });
    console.log(`⏳ Pending Characters: ${pendingCharacters}`);
    
    console.log("\n📝 Database connection details:");
    console.log(`- URL: ${maskDatabaseUrl(process.env.DATABASE_URL || '')}`);
    console.log(`- Provider: ${process.env.DATABASE_URL?.split('://')[0] || 'unknown'}`);
    
    return true;
  } catch (error) {
    console.error("❌ Database connection failed!");
    
    if (error instanceof Error) {
      console.error(`Error message: ${error.message}`);
      
      // Provide helpful troubleshooting tips based on the error
      if (error.message.includes("connect ECONNREFUSED")) {
        console.error("\n🔍 Troubleshooting tips:");
        console.error("- Check if your database server is running");
        console.error("- Verify the host and port in your DATABASE_URL");
        console.error("- Ensure network connectivity to the database server");
      } else if (error.message.includes("does not exist")) {
        console.error("\n🔍 Troubleshooting tips:");
        console.error("- The database may need to be created");
        console.error("- Run 'npx prisma db push' to create the database and tables");
      } else if (error.message.includes("authentication failed")) {
        console.error("\n🔍 Troubleshooting tips:");
        console.error("- Check your database username and password");
        console.error("- Verify the user has appropriate permissions");
      }
    } else {
      console.error("Unknown error occurred");
    }
    
    return false;
  } finally {
    // Always disconnect properly
    await prisma.$disconnect();
  }
}

// Helper function to mask sensitive information in the database URL
function maskDatabaseUrl(url: string): string {
  if (!url) return 'Not defined';
  
  try {
    // Create a URL object to parse the database URL
    const parsedUrl = new URL(url);
    
    // Mask the password if present
    if (parsedUrl.password) {
      parsedUrl.password = '******';
    }
    
    return parsedUrl.toString();
  } catch {
    // If URL parsing fails, return a generic masked string
    return url.replace(/\/\/.*?@/, "//********@");
  }
}

// Run the test
testDatabaseConnection()
  .then((success) => {
    if (!success) {
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
  });
