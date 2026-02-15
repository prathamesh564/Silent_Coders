import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import quizRouter from "./routes/quizRoutes.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(" Database Connected"))
  .catch(err => console.error(" DB Connection Error:", err));

app.use("/api/quiz", quizRouter);

app.get("/api/results", async (req, res) => {
  try {
    const results = await Result.find().sort({ timestamp: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching results" });
  }
});
app.listen(PORT, () => console.log(` Server on http://localhost:${PORT}`));