"use client";
import Header from "@/components/Header";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { Trophy, Target, TrendingUp, Loader2, Award, AlertCircle } from "lucide-react";

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
        // Fetching from the endpoint confirmed in your Postman screenshot
        const response = await fetch("http://localhost:5000/api/quiz/leaderboard");
        
        if (!response.ok) throw new Error("Backend Server is unreachable.");
        
        const data = await response.json();

        // Data processing for leaderboard
        const userMap = {};
        data.forEach((entry) => {
          if (!userMap[entry.username]) {
            userMap[entry.username] = {
              username: entry.username,
              totalScore: 0,
              totalQuestions: 0,
              count: 0,
              category: entry.category
            };
          }
          userMap[entry.username].totalScore += entry.score;
          userMap[entry.username].totalQuestions += entry.totalQuestions;
          userMap[entry.username].count += 1;
        });

        const formatted = Object.values(userMap).map(u => ({
          name: u.username,
          percentage: (u.totalScore / u.totalQuestions) * 100 || 0,
          dept: u.category
        })).sort((a, b) => b.percentage - a.percentage);

        setLeaderboard(formatted);

        // Global Average calculation
        const globalAvg = formatted.reduce((acc, curr) => acc + curr.percentage, 0) / (formatted.length || 1);
        setAvgScore(globalAvg.toFixed(1));

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const userStats = useMemo(() => {
    // Matching the username from your MongoDB data ("Prathamesh")
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
    <div className="min-h-screen w-full py-12 px-4 bg-[#020617] text-slate-200">
      <Header />
      <div className="max-w-5xl mx-auto mt-10 space-y-8">
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-500">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">Backend Error: {error}</p>
          </div>
        )}

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <StatCard title="Your Rank" value={userStats.rank === "N/A" ? "N/A" : `#${userStats.rank}`} icon={<Trophy className="text-yellow-500" />} subtitle="Position" />
          <StatCard title="Avg Campus Score" value={`${avgScore}%`} icon={<Target className="text-blue-500" />} subtitle="Global Average" />
          <StatCard title="Your Average" value={userStats.displayScore} icon={<TrendingUp className="text-emerald-500" />} subtitle="Dashboard Sync" />
        </div>

        {/* MongoDB Leaderboard Section */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Award className="text-blue-500" /> Leaderboard (MongoDB)
            </h2>
          </div>

          <div className="p-4">
            {leaderboard.length === 0 ? (
              <div className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest">
                No MongoDB Records Found
              </div>
            ) : (
              leaderboard.map((player, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-6 rounded-2xl mb-3 border transition-all ${
                    player.name === "Prathamesh" 
                    ? "bg-blue-600/20 border-blue-500 shadow-lg" 
                    : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-black bg-slate-800 text-slate-400">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{player.name}</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">{player.dept}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-black text-blue-400">{player.percentage.toFixed(1)}%</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Avg Score</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, subtitle }) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem]">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700">{icon}</div>
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{subtitle}</span>
      </div>
      <h3 className="text-xs font-bold text-slate-400 uppercase mb-1">{title}</h3>
      <p className="text-4xl font-black text-white">{value}</p>
    </div>
  );
}