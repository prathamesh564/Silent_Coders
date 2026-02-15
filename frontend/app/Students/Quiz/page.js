"use client";
import { useState, useEffect } from "react";
import { auth, db } from "../../core/firebase.js";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        
        const res = await fetch(`http://localhost:5000/api/quiz/generate?topic=DSA&userId=${user.uid}`);
        const data = await res.json();
        
        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setQuestions(data);
        } else {
          console.error("Received data is not an array:", data);
        }
      } catch (err) {
        console.error("Failed to load quiz:", err);
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, []);

  const submitQuiz = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      const res = await fetch("http://localhost:5000/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          username: user.displayName || "Student",
          answers: selectedAnswers
        })
      });
      const data = await res.json();
      setResult(data);

      await updateDoc(doc(db, "students", user.uid), {
        quizHistory: arrayUnion({
          date: new Date().toISOString(),
          percentage: data.percentage,
          category: "DSA"
        })
      });
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Loading State Guard
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Generating Quiz...</p>
        </div>
      </div>
    );
  }

  // 2. Result View
  if (result) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
        <h1 className="text-5xl font-bold text-blue-500 mb-4">{result.percentage}</h1>
        <p className="text-slate-400 mb-8">Great job! Your results have been saved.</p>
        <button onClick={() => router.push("/Students/dashboard")} className="bg-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition">
          Go Home
        </button>
      </div>
    );
  }

  // 3. Question Data Guard
  const q = questions[currentIdx];

  // If loading is done but no questions exist, show an error instead of crashing
  if (!q) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        <p>No questions available. Please refresh or try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-10">
      <div className="max-w-xl mx-auto bg-slate-900/50 p-8 rounded-2xl border border-slate-800 shadow-xl">
        {/* Progress header */}
        <div className="flex justify-between text-sm text-slate-500 mb-4">
           <span>Question {currentIdx + 1} of {questions.length}</span>
           <span>{Math.round(((currentIdx + 1) / questions.length) * 100)}%</span>
        </div>

        <h2 className="text-xl font-semibold mb-8 leading-relaxed">{q.question}</h2>
        
        <div className="space-y-4">
          {q.options && q.options.map((opt, index) => (
            <button 
              key={index} 
              onClick={() => setSelectedAnswers({...selectedAnswers, [q.id]: opt})}
              className={`w-full p-4 rounded-xl text-left border transition-all duration-200 ${
                selectedAnswers[q.id] === opt 
                ? "border-blue-500 bg-blue-500/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                : "border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-slate-300"
              }`}
            >
              <span className="mr-3 text-slate-500 font-mono">{String.fromCharCode(65 + index)}.</span>
              {opt}
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-10">
           <button 
             disabled={currentIdx === 0} 
             onClick={() => setCurrentIdx(currentIdx - 1)}
             className="px-6 py-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
           >
             Back
           </button>
           
           {currentIdx === questions.length - 1 ? (
            <button 
              onClick={submitQuiz} 
              disabled={!selectedAnswers[q.id]}
              className="bg-green-600 hover:bg-green-500 px-8 py-2 rounded-lg font-bold transition disabled:opacity-50"
            >
              Finish Quiz
            </button>
           ) : (
            <button 
              onClick={() => setCurrentIdx(currentIdx + 1)} 
              disabled={!selectedAnswers[q.id]}
              className="bg-blue-600 hover:bg-blue-500 px-8 py-2 rounded-lg font-bold transition disabled:opacity-50"
            >
              Next Question
            </button>
           )}
        </div>
      </div>
    </div>
  );
}