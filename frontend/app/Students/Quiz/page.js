"use client";
import { useState } from "react";
import { Loader2, BrainCircuit } from "lucide-react";

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  const startQuiz = async (topic) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/quiz/generate?topic=${topic}&userId=${userId}", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      setQuestions(data);
      setQuizStarted(true);
    } catch (err) {
      alert("Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p className="animate-pulse">Gemini is generating your questions...</p>
    </div>
  );

  if (!quizStarted) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-10 rounded-3xl text-center max-w-md w-full">
        <BrainCircuit className="mx-auto text-blue-500 mb-6" size={60} />
        <h1 className="text-3xl font-bold text-white mb-4">Master Your Topic</h1>
        <p className="text-slate-400 mb-8">Select a subject to begin your AI-generated quiz.</p>
        <button 
          onClick={() => startQuiz("Java Programming")}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition"
        >
          START JAVA QUIZ
        </button>
      </div>
    </div>
  );

  const handleAnswer = (selected) => {
    if (selected === questions[currentIdx].correctAnswer) setScore(score + 1);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      alert(`Quiz Finished! Score: ${score + 1}/${questions.length}`);
      setQuizStarted(false);
      setCurrentIdx(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 flex flex-center items-center justify-center">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl">
        <div className="flex justify-between mb-6 text-sm font-bold text-blue-400 uppercase tracking-widest">
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <h2 className="text-xl font-semibold mb-8">{questions[currentIdx].question}</h2>
        <div className="grid gap-4">
          {questions[currentIdx].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="w-full text-left p-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-blue-500 transition-all"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}