import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import connectDB from "@/utils/db";
import Question from "../../../../../models/question.model.js";

export async function PUT(request, { params }) {
  try {

    const { id } = await params;
    const body = await request.json();
    const { question, answer, status } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { success: false, error: "Question and answer are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the question and check ownership
    const existingQuestion = await Question.findById(id);
    
    if (!existingQuestion) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      );
    }

    // Update the question
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { question, answer, status },
      { new: true, runValidators: true }
    )
      .populate('userId', 'username email')
      .lean();

    const transformedQuestion = {
      id: updatedQuestion._id.toString(),
      question: updatedQuestion.question,
      answer: updatedQuestion.answer,
      status: updatedQuestion.status,
      userId: updatedQuestion.userId?._id?.toString() || null,
      username: updatedQuestion.userId?.username || 'Unknown',
      userEmail: updatedQuestion.userId?.email || '',
      createdAt: updatedQuestion.createdAt,
      updatedAt: updatedQuestion.updatedAt,
    };

    return NextResponse.json({
      success: true,
      question: transformedQuestion,
    });
  } catch (error) {
    console.error("Update question error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update question" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {

    const { id } = await params;

    await connectDB();

    // Find and delete the question
    const deletedQuestion = await Question.findByIdAndDelete(id);
    
    if (!deletedQuestion) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Delete question error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete question" },
      { status: 500 }
    );
  }
}
