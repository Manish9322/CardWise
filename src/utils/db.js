// db.js
import mongoose from "mongoose";
import { MONGODB_URL } from "./config";

export const _db = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URL);

    console.log("MongoDB connected successfully");
    return conn;
  } catch (error) {
    console.error("MongoDB connection failed");
    console.error(error.message);
    throw error;
  }
};
