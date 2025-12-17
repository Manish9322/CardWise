import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import User from "../../../../../models/user.model";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { username, email, phone, status } = body;

    if (!username || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "Username, email, and phone are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if another user has the same email or username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
      _id: { $ne: id }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Another user with this email or username already exists" },
        { status: 409 }
      );
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email, phone, status },
      { new: true, runValidators: true }
    )
      .select('-__v')
      .lean();

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const transformedUser = {
      id: updatedUser._id.toString(),
      username: updatedUser.username,
      email: updatedUser.email,
      phone: updatedUser.phone,
      status: updatedUser.status,
      questionsAdded: updatedUser.questionsAdded || 0,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    return NextResponse.json({
      success: true,
      user: transformedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await connectDB();

    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
