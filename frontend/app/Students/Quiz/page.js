"use client";
import { useState, useEffect, Suspense } from "react";
import { auth, db } from "../../core/firebase.js";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sun, Moon } from "lucide-react"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function QuizContent() {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [theme, setTheme] = useState("dark"); 
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "General";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const res = await fetch(`${API_URL}/api/quiz/generate?topic=${encodeURIComponent(topic)}&userId=${user.uid}`);
        const data = await res.json();
        if (Array.isArray(data)) setQuestions(data);
      } catch (err) {
        console.error("Failed to load quiz:", err);
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [topic]);

  const submitQuiz = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      const res = await fetch(`${API_URL}/api/quiz/submit`, {
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
          category: topic 
        })
      });
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const themeClasses = {
    bg: theme === "dark" ? "bg-[#020617] text-white" : "bg-gray-50 text-gray-900",
    card: theme === "dark" ? "bg-slate-900/50 border-slate-800" : "bg-white border-gray-200 shadow-lg",
    textMuted: theme === "dark" ? "text-slate-400" : "text-gray-500",
    option: theme === "dark" 
      ? "border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-slate-300" 
      : "border-gray-200 bg-gray-100 hover:bg-gray-200 text-gray-700",
    optionSelected: "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-white"
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.bg}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Preparing your {topic} quiz...</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 text-center ${themeClasses.bg}`}>
        <div className={`p-10 rounded-3xl border shadow-2xl max-w-md w-full ${themeClasses.card}`}>
          <h2 className={`${themeClasses.textMuted} uppercase tracking-widest text-sm mb-2`}>Quiz Completed</h2>
          <h1 className="text-6xl font-black text-blue-500 mb-4">{result.percentage}</h1>
          <p className={`${themeClasses.textMuted} mb-8`}>Great job! Your results for <b>{topic}</b> have been saved.</p>
          <button onClick={() => router.push("/Students/dashboard")} className="w-full bg-blue-600 py-4 rounded-xl font-bold text-white hover:bg-blue-500 transition shadow-lg">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses.bg}`}>
      <Header />
      <div className="max-w-4xl mx-auto p-4 flex justify-end">
        <button 
          onClick={toggleTheme} 
          className={` rounded-full border ${themeClasses.card}  transition`}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

      <div className="p-6 md:p-10">
        <div className={`max-w-xl mx-auto p-8 rounded-2xl border ${themeClasses.card}`}>
          <div className="flex justify-between items-center mb-6">
             <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-tighter border border-blue-500/20">{topic}</span>
             <div className="text-right">
               <span className={`block text-sm ${themeClasses.textMuted}`}>Question {currentIdx + 1} of {questions.length}</span>
               <div className={`w-32 h-1 rounded-full mt-2 ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-300" 
                    style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                  ></div>
               </div>
             </div>
          </div>

          <h2 className="text-xl font-semibold mb-8 leading-relaxed">{q?.question}</h2>
          
          <div className="space-y-4">
            {q?.options?.map((opt, index) => (
              <button 
                key={index} 
                onClick={() => setSelectedAnswers({...selectedAnswers, [q.id]: opt})}
                className={`w-full p-4 rounded-xl text-left border transition-all duration-200 ${
                  selectedAnswers[q.id] === opt 
                  ? themeClasses.optionSelected 
                  : themeClasses.option
                }`}
              >
                <span className="mr-3 font-mono opacity-50">{String.fromCharCode(65 + index)}.</span>
                {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-10">
             <button 
               disabled={currentIdx === 0} 
               onClick={() => setCurrentIdx(currentIdx - 1)}
               className={`px-6 py-2 disabled:opacity-30 ${themeClasses.textMuted} hover:text-blue-500`}
             >
               Back
             </button>
             
             {currentIdx === questions.length - 1 ? (
              <button 
                onClick={submitQuiz} 
                disabled={!selectedAnswers[q?.id]}
                className="bg-green-600 hover:bg-green-500 text-white px-8 py-2 rounded-lg font-bold transition disabled:opacity-50"
              >
                Finish Quiz
              </button>
             ) : (
              <button 
                onClick={() => setCurrentIdx(currentIdx + 1)} 
                disabled={!selectedAnswers[q?.id]}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2 rounded-lg font-bold transition disabled:opacity-50"
              >
                Next Question
              </button>
             )}
          </div>
        </div>
      </div>
      <div className="mt-10"><Footer/></div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center text-white"><p>Loading...</p></div>}>
      <QuizContent />
    </Suspense>
  );
}