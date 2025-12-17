import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import connectDB from "@/utils/db";
import Question from "../../../../models/question.model.js";
import User from "../../../../models/user.model.js";

export async function GET() {
  try {

    await connectDB();
    
    // Fetch all questions and populate user information
    const questions = await Question.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .lean();
    
    // Transform the data to include user info in a flat structure
    const transformedQuestions = questions.map(q => ({
      id: q._id.toString(),
      question: q.question,
      answer: q.answer,
      status: q.status,
      userId: q.userId?._id?.toString() || null,
      username: q.userId?.username || 'Unknown',
      userEmail: q.userId?.email || '',
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
    }));

    return NextResponse.json(transformedQuestions);
  } catch (error) {
    console.error("Get questions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {

    const body = await request.json();
    const { question, answer, status = 'inactive' } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { success: false, error: "Question and answer are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user is active (has accessibility)
    const user = await User.findById(session.userId).select('status').lean();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (user.status !== 'active') {
      return NextResponse.json(
        { success: false, error: "Your account has been restricted. You cannot add new questions at this time." },
        { status: 403 }
      );
    }

    // Create the question
    const newQuestion = await Question.create({
      question,
      answer,
      status,
      userId: session.userId,
    });

    // Update user's questionsAdded count
    await User.findByIdAndUpdate(
      session.userId,
      { $inc: { questionsAdded: 1 } }
    );

    // Populate user info for response
    const populatedQuestion = await Question.findById(newQuestion._id)
      .populate('userId', 'username email')
      .lean();

    const transformedQuestion = {
      id: populatedQuestion._id.toString(),
      question: populatedQuestion.question,
      answer: populatedQuestion.answer,
      status: populatedQuestion.status,
      userId: populatedQuestion.userId?._id?.toString() || null,
      username: populatedQuestion.userId?.username || 'Unknown',
      userEmail: populatedQuestion.userId?.email || '',
      createdAt: populatedQuestion.createdAt,
      updatedAt: populatedQuestion.updatedAt,
    };

    return NextResponse.json({
      success: true,
      question: transformedQuestion,
    });
  } catch (error) {
    console.error("Create question error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create question" },
      { status: 500 }
    );
  }
}
