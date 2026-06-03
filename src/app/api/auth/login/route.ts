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

    const db = await getDb();
    const usersCollection = db.collection("users");

    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await usersCollection.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const userId = user._id.toString();

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
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong during login" },
      { status: 500 }
    );
  }
}
