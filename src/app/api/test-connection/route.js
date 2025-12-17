import { NextResponse } from "next/server";
import { _db } from "@/utils/db.js";

export async function GET(request) {
  try {
    await _db();
    return NextResponse.json({
      success: true,
      message: "Database connection successful!",
    });
  } catch (error) {
    console.error("Error connecting to database:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to database",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
