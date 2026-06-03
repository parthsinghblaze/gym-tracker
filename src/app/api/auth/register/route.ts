import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const usersCollection = db.collection("users");

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document
    const result = await usersCollection.insertOne({
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date(),
    });

    const userId = result.insertedId.toString();

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || "fallback-secret-for-dev";
    const token = jwt.sign(
      { userId, email: normalizedEmail },
      jwtSecret,
      { expiresIn: "7d" }
    );

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Extract username from email
    const username = normalizedEmail.split("@")[0];

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: normalizedEmail,
        username,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong during registration" },
      { status: 500 }
    );
  }
}
