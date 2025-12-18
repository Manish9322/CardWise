import dotenv from "dotenv";

dotenv.config();

export const MONGODB_URL = process.env.MONGODB_URL;
export const PORT = process.env.PORT || 9002;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
export const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';