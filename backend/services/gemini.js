import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


export async function generateAIQuestions(topic) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });
 const prompt = `You are an expert technical examiner. Generate 5 multiple-choice questions about: ${topic}.
    
    OUTPUT RULES:
    1. Return ONLY a raw JSON array. No markdown, no backticks.
    2. The "answer" field MUST be a string that matches exactly one of the values in the "options" array.
    3. Do not include prefixes like "A)" or "1." in any string.

    STRUCTURE: [{"id": 1, "question": "...", "options": ["Choice1", "Choice2", "Choice3", "Choice4"], "answer": "Choice1"}]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("Gemini Error:", error.message);
    // Reliable Fallback
   return[
    [
  { "id": 1, "question": "Which keyword is used to define a constant in JavaScript?", "options": ["var", "let", "const", "def"], "answer": "const" },
  { "id": 2, "question": "What is the time complexity of searching for an element in a balanced Binary Search Tree?", "options": ["O(1)", "O(n)", "O(log n)", "O(n log n)"], "answer": "O(log n)" },
  { "id": 3, "question": "Which hook is used to handle side effects in React?", "options": ["useState", "useEffect", "useContext", "useReducer"], "answer": "useEffect" },
  { "id": 4, "question": "In MongoDB, what is the equivalent of a 'table' in a relational database?", "options": ["Document", "Field", "Collection", "Schema"], "answer": "Collection" },
  { "id": 5, "question": "What does the 'S' in SOLID principles stand for?", "options": ["Single Responsibility", "Structural Integrity", "Scalability", "Systematic Logic"], "answer": "Single Responsibility" },
  { "id": 6, "question": "Which HTTP method is typically used to update an existing resource?", "options": ["GET", "POST", "PUT", "DELETE"], "answer": "PUT" },
  { "id": 7, "question": "What is the default port for a standard Express.js server?", "options": ["3000", "5000", "8080", "27017"], "answer": "3000" },
  { "id": 8, "question": "Which data structure follows the Last-In-First-Out (LIFO) principle?", "options": ["Queue", "Stack", "Linked List", "Tree"], "answer": "Stack" },
  { "id": 9, "question": "What does CSS stand for?", "options": ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Syntax", "Color Style System"], "answer": "Cascading Style Sheets" },
  { "id": 10, "question": "Which of these is NOT a valid JavaScript data type?", "options": ["Boolean", "String", "Float", "Undefined"], "answer": "Float" }
]
  ]
  }
}
