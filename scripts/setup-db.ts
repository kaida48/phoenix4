import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  try {
    console.log('Checking database connection...');
    // Validate DATABASE_URL
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set in environment variables');
    }
    
    console.log('Running Prisma migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

main();
