

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
    
    const isUserAdmin = session.userId === 'admin_user';

    // If the user is a regular user, check their status.
    if (!isUserAdmin) {
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
    }


    // Add userId and set status for each question
    const userIdForDb = isUserAdmin ? null : session.userId;
    const questionsWithUser = questions.map(q => ({
      ...q,
      status: isUserAdmin ? (q.status || 'inactive') : 'pending',
      userId: userIdForDb,
    }));

    // Create the questions
    const createdQuestions = await Question.insertMany(questionsWithUser);

    // Update user's questionsAdded count only for regular users
    if (userIdForDb) {
      await User.findByIdAndUpdate(userIdForDb, {
        $inc: { questionsAdded: createdQuestions.length },
      });
    }

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
