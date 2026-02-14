"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { 
  Sparkles, 
  ArrowRight, 
  Trophy, 
  Zap, 
  BrainCircuit, 
  Timer,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";
export default function QuizLandingPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-200 flex flex-col font-sans transition-colors duration-300">
      <Header isDark={isDark} setIsDark={setIsDark} />

      <main className="flex-grow">       
        <section className="relative pt-24 pb-32 px-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold mb-10 uppercase tracking-[0.2em]">
              <Sparkles size={14} className="animate-pulse" />
              AI-Powered Assessments
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black text-slate-900 dark:text-white leading-[1.1] mb-8 tracking-tight">
              Master your craft <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                one question at a time.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              The ultimate testing ground for modern developers. Battle through real-world 
              coding scenarios, earn XP, and climb the global ranks.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <button className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-[#0f172a] hover:opacity-90 font-extrabold px-10 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl">
                Explore Quizzes <ArrowRight size={20} />
              </button>
              <button className="w-full sm:w-auto bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 font-bold px-10 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all backdrop-blur-sm">
                Daily Challenge
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 pb-32">
          <FeatureCard 
            icon={<Zap className="text-amber-500 dark:text-amber-400" />} 
            title="Rapid Fire Mode" 
            desc="Test your speed and accuracy under pressure with timed adaptive questions."
          />
          <FeatureCard 
            icon={<Trophy className="text-indigo-600 dark:text-indigo-400" />} 
            title="Ranked Leagues" 
            desc="Move from 'Script Kiddie' to 'Legend' as you beat complex engineering trials."
          />
          <FeatureCard 
            icon={<Timer className="text-emerald-600 dark:text-emerald-400" />} 
            title="Real-time Insights" 
            desc="Detailed post-quiz analytics showing your strengths and knowledge gaps."
          />
        </section>

        {/* Categories Preview */}
        <section className="bg-slate-200/50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800/50 py-24 mb-32">
          <div className="max-w-7xl mx-auto px-6">
             <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Popular Categories</h2>
                  <p className="text-slate-500 dark:text-slate-400">Pick a topic and start proving your skills.</p>
                </div>
                <button className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 hover:underline transition-all">
                  View all <ChevronRight size={18} />
                </button>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['React.js', 'System Design', 'Python', 'AWS Cloud'].map((tech) => (
                  <div key={tech} className="p-6 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all cursor-pointer group">
                    <span className="text-slate-700 dark:text-white font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{tech}</span>
                  </div>
                ))}
             </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl hover:border-indigo-500/50 hover:shadow-xl dark:hover:bg-indigo-500/[0.02] transition-all group">
      <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-slate-200 dark:border-slate-700 group-hover:scale-110 group-hover:bg-white dark:group-hover:bg-slate-700 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}