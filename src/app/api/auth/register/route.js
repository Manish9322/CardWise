import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import User from "../../../../../models/user.model.js";

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { username, email, phone, password } = body;
    
    // Validate required fields
    if (!username || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: existingUser.email === email 
            ? "Email already exists" 
            : "Username already exists" 
        },
        { status: 409 }
      );
    }
    
    // Create new user (in a real app, you'd hash the password)
    const newUser = await User.create({
      username,
      email,
      phone,
      status: "active",
      questionsAdded: 0,
    });
    
    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Registration failed" 
      },
      { status: 500 }
    );
  }
}
