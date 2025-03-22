import { execSync } from 'child_process';

async function main() {
  try {
    console.log("Initializing database...");
    
    console.log("Running Prisma schema generation...");
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log("Running Prisma migrations...");
    execSync('npx prisma migrate dev --name initial_setup', { stdio: 'inherit' });
    
    console.log("Database initialization completed!");
    
  } catch (error) {
    console.error("Error during database initialization:", error);
    process.exit(1);
  }
}

main();
