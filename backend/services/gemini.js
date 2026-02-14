import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateAIQuestions(topic) {
  try {
    // Using gemini-1.5-flash-latest for stability
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `You are an expert technical examiner. Generate 5 multiple-choice questions about: ${topic}.
    
    OUTPUT RULES:
    1. Return ONLY a raw JSON array. No markdown, no backticks.
    2. The "answer" field MUST be a string that matches exactly one of the values in the "options" array.
    3. Do not include prefixes like "A)" or "1." in any string.

    STRUCTURE: [{"id": 1, "question": "...", "options": ["Choice1", "Choice2", "Choice3", "Choice4"], "answer": "Choice1"}]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().replace(/```json|```/g, "").trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error.message);
    // Fallback for DSA/OS topics
    if (topic.toUpperCase().includes("DSA")) {
      return [{ id: 1, question: "What is the time complexity of a Hash Map search?", options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], answer: "O(1)" }];
    }
    return [{ id: 1, question: "Which language is used for web logic?", options: ["HTML", "CSS", "JavaScript", "SQL"], answer: "JavaScript" }];
  }
}