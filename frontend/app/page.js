"use client";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { 
  Sparkles,  
  Trophy, 
  Zap,  
  Timer,
} from "lucide-react";

export default function QuizLandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-200 flex flex-col font-sans transition-colors duration-300">
    <Header />
      <main className="flex-grow">       
        <section className="relative pt-24 pb-32 px-6">   
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />
          
          <div className="max-w-5xl mx-auto text-center relative z-10">  
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold mb-10 uppercase tracking-[0.2em]">
              <Sparkles size={14} className="animate-pulse" />
              Your Personal Learning Path
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-8 tracking-tight">
              Build your future, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                one insight at a time.
              </span>
            </h1>
            
            <div className="text-lg md:text-lg text-slate-600 dark:text-slate-400 max-w-3xl font-serif mx-auto mb-12 leading-relaxed">
              We’ve built a space where curiosity meets capability. Whether you're here to 
              test your limits or guide the next generation, your journey to mastery starts right here.
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <button onClick={() => router.push("./Students/login")} className="w-full sm:w-auto bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 hover:scale-105 hover:shadow-xl active:scale-95 transform transition-all duration-300 ease-in-out font-bold px-10 py-4 rounded-2xl flex items-center justify-center gap-2">
                Join as Student
              </button>
              <button onClick={() => router.push("./Teachers/login")} className="w-full sm:w-auto bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 hover:scale-105 hover:shadow-xl active:scale-95 transform transition-all duration-300 ease-in-out font-bold px-10 py-4 rounded-2xl flex items-center justify-center gap-2">
                Faculty Portal
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 pb-32">
          <FeatureCard 
            icon={<Zap className="text-amber-500 dark:text-amber-400" />} 
            title="Smarter Study" 
            desc="No more guesswork. Get clear, concise guides designed to help you understand the 'why' behind the 'how'."
          />
          <FeatureCard 
            icon={<Trophy className="text-indigo-600 dark:text-indigo-400" />} 
            title="Active Learning" 
            desc="Practice makes permanent. Solve real-world challenges that adapt to your unique pace and skill level."
          />
          <FeatureCard 
            icon={<Timer className="text-slate-600 dark:text-emerald-400" />} 
            title="Grow Together" 
            desc="See how your peers solve problems and learn new perspectives to level up your own technical thinking."
          />
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