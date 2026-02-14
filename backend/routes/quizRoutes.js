import express from "express";
import { generateAIQuestions } from "../services/gemini.js";
import { Result } from "../models/Result.js";

const router = express.Router();
let activeQuizzes = {}; // Temporary session storage

// 1. GET: Generate Quiz (Topic-based)
router.get("/generate", async (req, res) => {
  const { topic, userId } = req.query;
  if (!topic || !userId) return res.status(400).json({ error: "Topic and userId required" });

  try {
    const questions = await generateAIQuestions(topic);
    activeQuizzes[userId] = { questions, topic };

    // Send questions without answers to prevent cheating
    const clientQuestions = questions.map(({ answer, ...rest }) => rest);
    res.json(clientQuestions);
  } catch (e) {
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

// 2. POST: Submit and Save to Leaderboard
router.post("/submit", async (req, res) => {
  const { userId, username, answers } = req.body;
  const session = activeQuizzes[userId];

  if (!session) return res.status(400).json({ error: "No active session found" });

  let score = 0;
  const details = session.questions.map(q => {
    const uAns = String(answers[q.id] || "").trim().toLowerCase();
    const cAns = String(q.answer).trim().toLowerCase();
    const isCorrect = uAns === cAns;
    
    if (isCorrect) score++;
    
    return {
      question: q.question,
      yourAnswer: answers[q.id],
      correctAnswer: q.answer,
      isCorrect
    };
  });

  const percentage = (score / session.questions.length) * 100;

  try {
    const record = await Result.create({
      username: username || "Anonymous",
      score,
      totalQuestions: session.questions.length,
      percentage,
      category: session.topic
    });

    delete activeQuizzes[userId]; // Clear session memory
    res.json({ score, total: session.questions.length, percentage: percentage + "%", details, recordId: record._id });
  } catch (err) {
    res.status(500).json({ error: "Database save failed" });
  }
});

// 3. GET: Rank-based Leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const list = await Result.find()
      .sort({ score: -1, percentage: -1, timestamp: 1 }) // Rank by score, then %, then time
      .limit(15);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

export default router;