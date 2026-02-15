"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation"; // Added for redirection
import { MessageSquare, Send, History, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

export default function FacultyFeedbackPage() {
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter(); // Initialize router

  // Static mock data for previous history
  const history = [
    { id: 1, date: "2024-05-10", status: "Resolved", text: "Need more math templates for Quiz 3." },
    { id: 2, date: "2024-05-12", status: "Pending", text: "Dashboard loading time is slightly high during peak hours." },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
  
    setIsSubmitted(true);

   
    setTimeout(() => {
      setIsSubmitted(false);
      setFeedback("");
      router.push("/Students/dashboard"); 
    }, 2500); 
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F4FF] dark:bg-[#0F172A] transition-colors duration-500">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 mt-10">
       
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-500 font-bold mb-6 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="grid lg:grid-cols-5 gap-8">
          
         
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl border border-white dark:border-slate-700 rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden">
              
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
                  <MessageSquare size={28} />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                    Faculty Feedback
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Your insights help us build a better Quiz Master.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Describe your experience or suggest new features..."
                    className="w-full min-h-[250px] p-6 rounded-[2rem] bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none font-medium text-lg"
                  />
                
                  {isSubmitted && (
                    <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-[2rem] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 z-10">
                      <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 size={40} />
                      </div>
                      <p className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Feedback Submitted!</p>
                      <p className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-2">
                        Redirecting to dashboard...
                        <span className="w-4 h-4 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full"></span>
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!feedback.trim() || isSubmitted}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] uppercase tracking-widest text-sm"
                >
                  <Send size={20} />
                  Submit Feedback
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle size={20} />
                  <h3 className="font-black uppercase tracking-widest text-xs text-indigo-100">Quick Note</h3>
                </div>
                <p className="font-bold text-lg leading-snug">
                  Feedback is reviewed by the admin panel every 24 hours. Check your history for status updates.
                </p>
              </div>
              <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            <div className="bg-white/50 dark:bg-slate-800/40 backdrop-blur-md border border-white dark:border-slate-700 rounded-[2.5rem] p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-8">
                <History size={20} className="text-slate-400" />
                <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  Recent Activity
                </h2>
              </div>

              <div className="space-y-4">
                {history.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-4 bg-white/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-indigo-500/30 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-slate-400">{item.date}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${
                        item.status === 'Resolved' 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'bg-orange-500/10 text-orange-500'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300 line-clamp-2 italic">
                      "{item.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}