import { prisma } from "../src/lib/prisma";
import { hash } from "bcrypt";
import readline from 'readline';

// Interactive command line interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  try {
    console.log("Create Admin User");
    console.log("=================");
    
    // Get user input
    const username = await askQuestion("Enter username: ");
    const email = await askQuestion("Enter email: ");
    const password = await askQuestion("Enter password: ");
    const name = await askQuestion("Enter display name (optional): ");
    
    // Hash password
    const hashedPassword = await hash(password, 10);
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { 
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        console.error("Error: Email already in use");
      } else {
        console.error("Error: Username already taken");
      }
      process.exit(1);
    }
    
    // Create admin user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        name: name || null,
        role: "ADMIN"
      }
    });
    
    console.log("\nAdmin user created successfully!");
    console.log(`Username: ${user.username}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

main();
