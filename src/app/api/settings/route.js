
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Settings from "../../../../models/settings.model.js";

// GET handler to fetch settings
export async function GET() {
  try {
    await connectDB();
    const settings = await Settings.getSingleton();
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT handler to update settings
export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Find the single settings document and update it
    const updatedSettings = await Settings.findOneAndUpdate(
      {}, // find the single document
      { $set: body },
      { new: true, upsert: true, runValidators: true } // upsert creates it if it doesn't exist
    ).lean();

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
    });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
