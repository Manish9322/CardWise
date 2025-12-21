
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import connectDB from "@/utils/db";
import User from "../../../../models/user.model.js";
import Question from "../../../../models/question.model.js";

export async function GET() {
  try {
    const session = await getSession();
    
    
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findById(session.userId).select('-__v').lean();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    
    const activeQuestionsCount = await Question.countDocuments({ 
        userId: session.userId, 
        status: 'active' 
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        phone: user.phone,
        status: user.status,
        questionsAdded: user.questionsAdded || 0,
        activeQuestions: activeQuestionsCount,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
