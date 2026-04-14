import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
  if (!env.connectionString) {
    throw new Error("CONNECTION_STRING is missing. Set your MongoDB connection string in backend/.env.");
  }

  await mongoose.connect(env.connectionString);
}
