"use client";

import { useRouter } from "next/navigation";
import Footer from "./components/Footer";


import { 
  Sparkles, 
  ArrowRight, 
  Briefcase, 
  LineChart, 
  Shield 
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
    
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xl">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white text-sm">J</div>
          JobFinder
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.push("/login")}
            className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={() => router.push("/login")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>

     
      <main className="flex-grow">
    
        <section className="relative pt-20 pb-32 px-6 overflow-hidden">
      
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-indigo-100/50 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold mb-8 uppercase tracking-widest">
              <Sparkles size={14} />
              Next-Gen Recruitment
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-tight mb-8">
              The future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                Career Matching.
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Connect with opportunities that align with your technical DNA. 
              Built for developers, analyzed by intelligence, delivered instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => router.push("/login")}
                className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-200"
              >
                Find Your Match <ArrowRight size={20} />
              </button>
              <button className="w-full sm:w-auto bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm">
                View All Jobs
              </button>
            </div>
          </div>
        </section>

        
        <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 pb-32">
          <FeatureCard 
            icon={<Briefcase className="text-indigo-600" />} 
            title="Curated Roles" 
            desc="High-impact positions from top-tier engineering teams."
          />
          <FeatureCard 
            icon={<LineChart className="text-blue-600" />} 
            title="Skill Analysis" 
            desc="We verify your expertise to bypass basic screening."
          />
          <FeatureCard 
            icon={<Shield className="text-emerald-600" />} 
            title="Direct Access" 
            desc="No recruiters in the middle. Talk directly to hiring managers."
          />
        </section>
      </main>

  
      <Footer />
    </div>
  );
}


function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white border border-slate-200 p-8 rounded-2xl hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
      <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-6 border border-slate-100 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}