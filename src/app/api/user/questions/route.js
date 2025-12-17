import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import connectDB from "@/utils/db";
import Question from "../../../../../models/question.model";

export async function GET() {
  try {

    await connectDB();
    
    // Fetch only the logged-in user's questions
    const questions = await Question.find({ userId: session.userId })
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .lean();
    
    // Transform the data
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
    console.error("Get user questions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user questions" },
      { status: 500 }
    );
  }
}
