"use client";
import { useState, useEffect, Suspense } from "react";
import { auth, db } from "../../core/firebase.js";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";

// Sub-component to handle search params
function QuizContent() {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  


  const router = useRouter();
  
  // Logic: Get topic from URL (e.g., ?topic=quiz1 or ?topic=Python)
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "General";

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        
        // Dynamic Fetch: Uses the 'topic' from URL
        const res = await fetch(`http://localhost:5000/api/quiz/generate?topic=${encodeURIComponent(topic)}&userId=${user.uid}`);
        const data = await res.json();
        
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
  }, [topic]);

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

      // Logic: Save history using the dynamic category
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Preparing your {topic} quiz...</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white p-4 text-center">
        <div className="bg-slate-900/50 p-10 rounded-3xl border border-slate-800 shadow-2xl max-w-md w-full">
          <h2 className="text-slate-400 uppercase tracking-widest text-sm mb-2">Quiz Completed</h2>
          <h1 className="text-6xl font-black text-blue-500 mb-4">{result.percentage}</h1>
          <p className="text-slate-400 mb-8">Great job! Your results for <b>{topic}</b> have been saved to your profile.</p>
          <button onClick={() => router.push("/Students/dashboard")} className="w-full bg-blue-600 py-4 rounded-xl font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-900/20">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];

  if (!q) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        <p>No questions available for {topic}. Please try another topic.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-10">
      <div className="max-w-xl mx-auto bg-slate-900/50 p-8 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex justify-between items-center mb-6">
           <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-tighter border border-blue-500/20">{topic}</span>
           <div className="text-right">
             <span className="block text-sm text-slate-500">Question {currentIdx + 1} of {questions.length}</span>
             <div className="w-32 h-1 bg-slate-800 rounded-full mt-2">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300" 
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                ></div>
             </div>
           </div>
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
            <>
              <button 
                onClick={submitQuiz} 
                disabled={!selectedAnswers[q.id]}
                className="bg-green-600 hover:bg-green-500 px-8 py-2 rounded-lg font-bold transition disabled:opacity-50"
              >
                Finish Quiz
              </button>

              {/* {showFeedback && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-slate-900 p-6 rounded-2xl w-96">
                  <h3 className="text-xl font-bold text-white mb-4">Quick Feedback</h3>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter your feedback here..."
                    className="w-full p-3 rounded-lg bg-slate-950 text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500"
                    rows={4}
                  />
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => { setShowFeedback(false); setFeedback(""); }}
                      className="py-2 px-4 rounded-lg bg-red-600 hover:bg-red-500 transition text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        alert("Thanks for your feedback!"); // temporary usage
                        setShowFeedback(false);
                        setFeedback("");
                      }}
                      className="py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 transition text-white"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
                    )} */}
                    <feedback
        show={showFeedback}
        setShow={setShowFeedback}
        feedback={feedback}
        setFeedback={setFeedback}
      />
            </>
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

// Main component wrapped in Suspense (required for useSearchParams in Next.js)
export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        <p>Loading Quiz Environment...</p>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}