
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import connectDB from "@/utils/db";
import Question from "../../../../../models/question.model.js";
import User from "../../../../../models/user.model.js";

export async function POST(request) {
  try {
    const session = await getSession();
    
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { questions } = body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { success: false, error: "An array of questions is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user is active
    const user = await User.findById(session.userId).select("status").lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (user.status !== "active") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your account has been restricted. You cannot add new questions at this time.",
        },
        { status: 403 }
      );
    }

    // Add userId to each question
    const questionsWithUser = questions.map(q => ({
      ...q,
      userId: session.userId,
    }));

    // Create the questions
    const createdQuestions = await Question.insertMany(questionsWithUser);

    // Update user's questionsAdded count
    await User.findByIdAndUpdate(session.userId, {
      $inc: { questionsAdded: createdQuestions.length },
    });

    return NextResponse.json({
      success: true,
      message: `${createdQuestions.length} questions added successfully.`,
      count: createdQuestions.length,
    });
  } catch (error) {
    console.error("Bulk create questions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create questions in bulk" },
      { status: 500 }
    );
  }
}
