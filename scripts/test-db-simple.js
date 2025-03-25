// Simple database connection test using plain JavaScript
// Used as a fallback when TypeScript execution fails

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

// Create a prisma client
const prisma = new PrismaClient();

console.log('🔄 Simple Database Test');
console.log('=======================');

async function runTest() {
  try {
    // Test connection with a simple query
    console.log('📡 Testing database connection...');
    await prisma.$queryRaw`SELECT 1 as result`;
    console.log('✅ Connection successful!');
    
    // Get user count
    console.log('\n📊 Testing basic queries:');
    const userCount = await prisma.user.count();
    console.log(`- User count: ${userCount}`);
    
    // Get character count
    const characterCount = await prisma.character.count();
    console.log(`- Character count: ${characterCount}`);
    
    console.log('\n✅ Database is properly configured and accessible.');
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed');
    console.error(`Error: ${error.message}`);
    
    // Display helpful messages based on common errors
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n⚠️ Could not connect to the database server.');
      console.error('Please check:');
      console.error('  1. Is the database server running?');
      console.error('  2. Is the DATABASE_URL in .env correct?');
      console.error(`  3. Current DATABASE_URL: ${hideSensitiveInfo(process.env.DATABASE_URL)}`);
    } else if (error.message.includes('does not exist')) {
      console.error('\n⚠️ Database does not exist.');
      console.error('Please run:');
      console.error('  npx prisma db push');
      console.error('to create the database and tables.');
    }
    
    return false;
  } finally {
    // Always disconnect properly
    await prisma.$disconnect();
  }
}

// Helper function to hide sensitive information in connection string
function hideSensitiveInfo(url) {
  if (!url) return 'Not defined';
  return url.replace(/\/\/([^:]+):([^@]+)@/, '//[username]:[password]@');
}

// Run the test
runTest()
  .then(success => {
    if (!success) {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
