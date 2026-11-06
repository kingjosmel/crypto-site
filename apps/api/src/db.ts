import mongoose from "mongoose";
import "dotenv/config";

export async function connectDatabase(uri = process.env.MONGODB_URI) {
  mongoose.set("bufferCommands", false);
  if (!uri) {
    console.warn("[AI Studio] No MONGODB_URI provided: database offline");
    return null;
  }
  try {
    return await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
  } catch (error) {
    console.warn("[AI Studio] MongoDB connection failed: using graceful fallback", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function disconnectDatabase() {
  try {
    await mongoose.disconnect();
  } catch {
    // Ignore disconnect error
  }
}
