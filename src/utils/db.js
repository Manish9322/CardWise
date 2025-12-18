import mongoose from "mongoose";
import * as config from "./config.js";

let connection;

async function connectDB() {
  if (connection) {
    return connection;
  }

  if (!config.MONGODB_URL) {
    console.error("MongoDB connection failed: MONGODB_URL is not defined in your environment.");
    throw new Error("MongoDB connection failed: MONGODB_URL is not defined.");
  }

  try {
    const newConnection = await mongoose.connect(config.MONGODB_URL, {
      serverSelectionTimeoutMS: 5000, 
    });
    connection = newConnection;
    console.log("Database connected successfully");
    return connection;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    // Removing process.exit to prevent the server from stopping in a serverless environment
    // process.exit(1); 
    throw new Error("Database connection failed");
  }
}

export default connectDB;
