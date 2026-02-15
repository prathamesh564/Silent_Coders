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
  .then(() => console.log("✅ Database Connected"))
  .catch(err => console.error("❌ DB Connection Error:", err));

app.use("/api/quiz", quizRouter);

app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));