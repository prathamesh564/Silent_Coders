"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { Trophy, Target, TrendingUp, Loader2, Award, AlertCircle } from "lucide-react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function ResultsPage() {
  const { user, loading: authLoading } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [avgScore, setAvgScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/quiz/leaderboard`);
        if (!response.ok) throw new Error("Backend Server is unreachable.");
        
        const data = await response.json();

        const userMap = {};
        data.forEach((entry) => {
          if (!userMap[entry.username]) {
            userMap[entry.username] = {
              username: entry.username,
              totalPercentage: 0,
              count: 0,
              category: entry.category
            };
          }
          
          const attemptPercentage = (entry.score / (entry.totalQuestions || 1)) * 100;
          userMap[entry.username].totalPercentage += attemptPercentage;
          userMap[entry.username].count += 1;
        });

        const formatted = Object.values(userMap).map(u => ({
          name: u.username,
          percentage: u.totalPercentage / u.count,
          dept: u.category || "General"
        })).sort((a, b) => b.percentage - a.percentage);

        setLeaderboard(formatted);

        const campusAvg = formatted.reduce((acc, curr) => acc + curr.percentage, 0) / (formatted.length || 1);
        setAvgScore(campusAvg.toFixed(1));

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const userStats = useMemo(() => {
    const myName = user?.displayName || "Prathamesh"; 
    const index = leaderboard.findIndex(u => u.name === myName);
    const myData = leaderboard[index];
    
    return {
      rank: index !== -1 ? index + 1 : "N/A",
      displayScore: myData ? myData.percentage.toFixed(1) + "%" : "0%",
    };
  }, [leaderboard, user]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#020617]">
      <Loader2 className="animate-spin text-blue-500" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#020617] text-slate-200 font-sans flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-5xl mx-auto w-full py-12 px-4 space-y-8">
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-500">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">System Status: {error}</p>
          </div>
        )}

        <div className="mb-10">
            <h1 className="text-3xl font-bold text-white">Campus Analytics</h1>
            <p className="text-slate-400">Real-time performance tracking and community rankings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Your Rank" 
            value={userStats.rank === "N/A" ? "N/A" : `#${userStats.rank}`} 
            icon={<Trophy size={20} className="text-yellow-500" />} 
            subtitle="Standing" 
          />
          <StatCard 
            title="Campus Avg" 
            value={`${avgScore}%`} 
            icon={<Target size={20} className="text-blue-500" />} 
            subtitle="Global Mean" 
          />
          <StatCard 
            title="Your Average" 
            value={userStats.displayScore} 
            icon={<TrendingUp size={20} className="text-emerald-500" />} 
            subtitle="Accuracy" 
          />
        </div>

       
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-slate-800 bg-slate-900/20 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Award className="text-blue-500" /> Leaderboard
            </h2>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-bold uppercase tracking-tighter">
                Live Updates
            </span>
          </div>

          <div className="p-6 space-y-3">
            {leaderboard.length === 0 ? (
              <div className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest">
                Waiting for Quiz Submissions...
              </div>
            ) : (
              leaderboard.map((player, index) => {
                const isMe = player.name === (user?.displayName || "Prathamesh");
                return (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                      isMe 
                      ? "bg-blue-600/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.05)]" 
                      : "bg-slate-800/20 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        index === 0 ? "bg-yellow-500/20 text-yellow-500" : 
                        index === 1 ? "bg-slate-400/20 text-slate-300" :
                        index === 2 ? "bg-orange-500/20 text-orange-500" : "bg-slate-800 text-slate-500"
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h4 className={`font-bold ${isMe ? "text-blue-400" : "text-white"}`}>
                          {player.name} {isMe && "(You)"}
                        </h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">{player.dept}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-black text-white">{player.percentage.toFixed(1)}%</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Avg Score</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

function StatCard({ title, value, icon, subtitle }) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl hover:border-slate-700 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700 group-hover:border-slate-600 transition-colors">
          {icon}
        </div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{subtitle}</span>
      </div>
      <h3 className="text-xs font-bold text-slate-500 uppercase mb-1 tracking-tight">{title}</h3>
      <p className="text-3xl font-black text-white">{value}</p>
    </div>
  );
}