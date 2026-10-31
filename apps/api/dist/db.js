import mongoose from "mongoose";
import "dotenv/config";
export async function connectDatabase(uri = process.env.MONGODB_URI) {
    if (!uri)
        throw new Error("MONGODB_URI is required");
    return mongoose.connect(uri);
}
export async function disconnectDatabase() {
    await mongoose.disconnect();
}
