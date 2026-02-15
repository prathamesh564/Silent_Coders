import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  title: String,
});

export default mongoose.model("Quiz", quizSchema);
