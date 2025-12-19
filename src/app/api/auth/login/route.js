import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import User from "../../../../../models/user.model.js";
import { createSession } from "@/lib/session";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }
    
    // Handle hardcoded admin credentials
    if (email === 'admin@cardwise.com' && password === 'Password@cardwise') {
        await createSession('admin_user');
        return NextResponse.json({
            success: true,
            message: "Admin login successful",
            isAdmin: true,
        });
    }

    await connectDB();
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    // Check if user is active
    if (user.status !== "active") {
      return NextResponse.json(
        { success: false, error: "Your account has been restricted by the administrator. Please contact support for assistance." },
        { status: 403 }
      );
    }
    
    // In a real app, you'd verify the hashed password here
    // For now, we're just checking if the user exists
    // TODO: Implement proper password hashing and verification
    
    // Create session
    await createSession(user._id.toString());
    
    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        questionsAdded: user.questionsAdded,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Login failed" 
      },
      { status: 500 }
    );
  }
}
