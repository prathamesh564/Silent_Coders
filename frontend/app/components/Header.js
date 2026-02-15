"use client";
import { BrainCircuit, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
export default function Header({ isDark, setIsDark }) {
  const router = useRouter();
  return (
    <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-2xl tracking-tight">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BrainCircuit size={20} className="text-white" />
          </div>
          Quiz<span className="text-indigo-600 dark:text-indigo-400">Master</span>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:ring-2 ring-indigo-500 transition-all"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button type="button" className="hidden md:block text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
            Leaderboard
          </button>
          
          <button 
            onClick={() => router.push("/signup")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all"
          >
            Sign Up
          </button>
        </div>
      </nav>
);
}
