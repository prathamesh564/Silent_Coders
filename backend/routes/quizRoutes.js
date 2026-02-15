import express from "express";
import { generateAIQuestions } from "../services/gemini.js";
import { Result } from "../models/Result.js";
// Import the static data you defined earlier
import { staticQuizzes } from "../data/staticQuizzes.js"; 

const router = express.Router();
let activeQuizzes = {}; 

router.get("/generate", async (req, res) => {
  const { topic, userId } = req.query;
  if (!topic || !userId) return res.status(400).json({ error: "Topic and userId required" });

  try {
    let questions;
    
    // Normalize the topic: trim spaces and make it lowercase
    const normalizedTopic = topic.trim().toLowerCase();

    // LOGIC: Check static data first
    if (normalizedTopic === "quiz1") {
      console.log("✅ Serving Static Quiz 1");
      questions = staticQuizzes.quiz1;
    } 
    else if (normalizedTopic === "quiz2") {
      console.log("✅ Serving Static Quiz 2");
      questions = staticQuizzes.quiz2;
    } 
    else {
      // ONLY call Gemini if it is NOT quiz1 or quiz2
      console.log(`🤖 Calling Gemini for AI Topic: ${topic}`);
      questions = await generateAIQuestions(topic);
    }

    // Save session and remove answers for client-side security
    activeQuizzes[userId] = { questions, topic };
    const clientSafeQuestions = questions.map(({ answer, ...rest }) => rest);
    
    res.json(clientSafeQuestions);
  } catch (e) {
    console.error("Route Error:", e.message);
    res.status(500).json({ error: "Failed to load quiz" });
  }
});
// 2. POST: Submit (Remains the same)
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

    delete activeQuizzes[userId]; 
    res.json({ score, total: session.questions.length, percentage: percentage + "%", details, recordId: record._id });
  } catch (err) {
    res.status(500).json({ error: "Database save failed" });
  }
});

// 3. GET: Leaderboard (Remains the same)
router.get("/leaderboard", async (req, res) => {
  try {
    const list = await Result.find()
      .sort({ score: -1, percentage: -1, timestamp: 1 }) 
      .limit(15);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

export default router;