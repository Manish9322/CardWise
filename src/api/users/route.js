
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import User from "../../../../models/user.model";
import Question from "../../../../models/question.model";

export async function GET() {
  try {
    await connectDB();
    
    // Fetch all users
    const users = await User.find()
      .select('-__v')
      .sort({ createdAt: -1 })
      .lean();
    
    // For each user, get their active questions count
    const usersWithActiveQuestions = await Promise.all(
      users.map(async (u) => {
        const activeQuestionsCount = await Question.countDocuments({
          userId: u._id,
          status: 'active'
        });
        return {
          id: u._id.toString(),
          username: u.username,
          email: u.email,
          phone: u.phone,
          status: u.status,
          questionsAdded: u.questionsAdded || 0,
          activeQuestions: activeQuestionsCount, // Add active questions count
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
        };
      })
    );


    return NextResponse.json(usersWithActiveQuestions);
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email, phone, status = 'active' } = body;

    if (!username || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "Username, email, and phone are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email or username already exists" },
        { status: 409 }
      );
    }

    // Create the user
    const newUser = await User.create({
      username,
      email,
      phone,
      status,
      questionsAdded: 0,
    });

    const transformedUser = {
      id: newUser._id.toString(),
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
      status: newUser.status,
      questionsAdded: newUser.questionsAdded || 0,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    return NextResponse.json({
      success: true,
      user: transformedUser,
    });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}
