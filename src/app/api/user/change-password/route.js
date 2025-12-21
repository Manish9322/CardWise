import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import connectDB from "@/utils/db";
import User from "../../../../../models/user.model.js";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const session = await getSession();
    
    if (!session?.userId || session.userId === 'admin_user') {
      return NextResponse.json(
        { success: false, error: "Not authenticated or action not allowed for this user" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Basic validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Current and new passwords are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
        return NextResponse.json(
          { success: false, error: "Password must be at least 8 characters long" },
          { status: 400 }
        );
    }
    
    await connectDB();
    
    const user = await User.findById(session.userId);

    if (!user) {
        return NextResponse.json(
            { success: false, error: "User not found" },
            { status: 404 }
        );
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return NextResponse.json(
            { success: false, error: "Incorrect current password." },
            { status: 403 }
        );
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to change password" },
      { status: 500 }
    );
  }
}
