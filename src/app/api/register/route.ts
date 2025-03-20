import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
    
    // Check if user exists
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
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 }
        );
      }
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });

    // Don't return the password
    const { password: _, ...result } = user;

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Registration error details:", error);
    
    // Add more specific error information
    if (error.code) {
      console.error("Error code:", error.code);
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 500 }
    );
  }
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  
  console.log("Submitting form with data:", { username, email, password });
  
  try {
    // Rest of your code...
  } catch (error) {
    console.error("Error submitting form:", error);
    setError("Failed to submit form");
  } finally {
    setLoading(false);
  }
};