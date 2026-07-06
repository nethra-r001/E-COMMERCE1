import { NextResponse } from "next/server";
import { execute, queryOne } from "@/lib/db";
import { hashPassword, signJWT } from "@/lib/auth";

export async function POST(req) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { error: "Name, email, password, and phone number are required" },
        { status: 400 },
      );
    }

    // Name alphabet validation (letters and spaces only)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      return NextResponse.json(
        { error: "Name must contain only letters and spaces" },
        { status: 400 },
      );
    }

    // Phone 10-digit validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: "Phone number must be exactly 10 digits" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await queryOne(
      "SELECT id FROM users WHERE email = ?",
      [email.toLowerCase()],
    );
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 },
      );
    }

    const userId = `u-${crypto.randomUUID()}`;
    const hashedPassword = hashPassword(password);

    // Save user to DB using raw SQL (including phone)
    await execute(
      "INSERT INTO users (id, name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, name, email.toLowerCase(), hashedPassword, phone, "USER"],
    );

    // Generate JWT
    const token = await signJWT({
      id: userId,
      name,
      email: email.toLowerCase(),
      role: "USER",
    });

    const response = NextResponse.json(
      {
        user: { id: userId, name, email: email.toLowerCase(), role: "USER" },
        message: "Account created successfully",
      },
      { status: 201 },
    );

    // Set cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
