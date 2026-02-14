import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  username: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, required: true },
  category: { type: String, required: true }, 
  timestamp: { type: Date, default: Date.now }
});

export const Result = mongoose.model("Result", resultSchema);