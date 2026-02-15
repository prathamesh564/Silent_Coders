"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../core/firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiTopic, setAiTopic] = useState("");
  const [theme, setTheme] = useState("dark"); 
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "students", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
        setLoading(false);
      } else {
        router.push("/Students/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const startQuiz = (topic) => {
    let selectedTopic = topic;
    if (topic === "AI") {
      selectedTopic = aiTopic.trim() || "General Programming";
    }
    router.push(`/Students/Quiz?topic=${encodeURIComponent(selectedTopic)}`);
  };

  const themeClasses = {
    bg: theme === "dark" ? "bg-[#020617] text-slate-200" : "bg-gray-50 text-slate-900",
    card: theme === "dark" ? "bg-slate-900/40 border-slate-800" : "bg-white border-gray-200 shadow-sm",
    sidebar: theme === "dark" ? "bg-slate-900/50 border-slate-800" : "bg-white border-gray-200",
    input: theme === "dark" ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-white border-gray-300 text-slate-900",
    headerText: theme === "dark" ? "text-white" : "text-gray-900",
    mutedText: theme === "dark" ? "text-slate-400" : "text-gray-500",
    tableHeader: theme === "dark" ? "text-slate-500 border-slate-800" : "text-gray-400 border-gray-200",
    tableRow: theme === "dark" ? "hover:bg-slate-800/30 border-slate-800" : "hover:bg-gray-100 border-gray-100",
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${themeClasses.bg}`}>
      <Header />

      <div className="flex flex-1">
  
        <aside className={`w-64 min-h-[calc(100vh-64px)] border-r p-6 hidden md:block ${themeClasses.sidebar}`}>
          <nav className="space-y-4">
            <NavLink href="#" active theme={theme}>Dashboard</NavLink>
            <NavLink href="/Students/Quiz" theme={theme}>Take Quiz</NavLink>
            <NavLink href="/Students/results" theme={theme}>My Results</NavLink>
            <NavLink href="/Students/login" theme={theme}>Logout</NavLink>
            <NavLink href="/Landing-page" theme={theme}>Home</NavLink>
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-10">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className={`text-3xl font-bold ${themeClasses.headerText}`}>
                Welcome back, {profile?.name?.split(" ")[0]}! 👋
              </h1>
              <p className={themeClasses.mutedText}>Choose a quiz to start your session.</p>
            </div>

            <button 
              onClick={toggleTheme} 
              className={`p-3 rounded-xl border transition-all hover:scale-105 ${themeClasses.card}`}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         
            <QuizCard 
              title="Quiz 1" 
              desc="Core JS & Data Structures" 
              icon="📚" 
              onClick={() => startQuiz("quiz1")} 
              themeClasses={themeClasses} 
            />
            <QuizCard 
              title="Quiz 2" 
              desc="React & Backend Concepts" 
              icon="⚡" 
              onClick={() => startQuiz("quiz2")} 
              themeClasses={themeClasses} 
            />
            
            <div className={`border p-6 rounded-2xl transition-all bg-gradient-to-br from-purple-500/5 to-transparent ${themeClasses.card} ${theme === 'dark' ? 'border-purple-500/30 hover:border-purple-500/60' : 'border-purple-200'}`}>
              <div className="text-2xl mb-2">🤖</div>
              <h3 className={`text-lg font-bold ${themeClasses.headerText}`}>AI Custom Quiz</h3>
              <input 
                type="text"
                placeholder="Topic (e.g. Python, SQL)"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className={`w-full rounded-lg px-3 py-1.5 mt-2 mb-3 text-sm focus:border-purple-500 focus:outline-none border ${themeClasses.input}`}
              />
              <button onClick={() => startQuiz("AI")} className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition">Generate AI Quiz</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard title="Quizzes Completed" value={profile?.quizHistory?.length || 0} icon="📝" color="blue" themeClasses={themeClasses} />
            <StatCard title="Average Score" value={calculateAverage(profile?.quizHistory)} icon="📈" color="green" themeClasses={themeClasses} />
            <StatCard title="Rank" value="Pro" icon="🏆" color="purple" themeClasses={themeClasses} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={`lg:col-span-2 border rounded-2xl p-6 ${themeClasses.card}`}>
              <h3 className={`text-xl font-bold mb-6 ${themeClasses.headerText}`}>Recent Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className={`border-b ${themeClasses.tableHeader}`}>
                      <th className="pb-4 font-medium">Date</th>
                      <th className="pb-4 font-medium">Score</th>
                      <th className="pb-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-transparent">
                    {profile?.quizHistory?.slice(-5).reverse().map((quiz, i) => (
                      <tr key={i} className={`group transition border-b ${themeClasses.tableRow}`}>
                        <td className={`py-4 ${themeClasses.mutedText.replace('text-', 'text-opacity-80 text-')}`}>{new Date(quiz.date).toLocaleDateString()}</td>
                        <td className="py-4 font-semibold text-blue-400">{quiz.percentage}</td>
                        <td className="py-4">
                          <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs">Passed</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={`border rounded-2xl p-6 ${themeClasses.card} bg-gradient-to-b`}>
              <h3 className={`text-xl font-bold mb-6 ${themeClasses.headerText}`}>Student Info</h3>
              <div className="space-y-4">
                <InfoItem label="USN" value={profile?.usn} themeClasses={themeClasses} />
                <InfoItem label="College" value={profile?.college} themeClasses={themeClasses} />
                <InfoItem label="Branch" value={profile?.branch} themeClasses={themeClasses} />
                <InfoItem label="Stream" value={profile?.stream} themeClasses={themeClasses} />
                 <button 
                    onClick={() => router.push("/Students/profile")} 
                    className="mt-4 bg-indigo-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all w-full md:w-auto"
                  >
                    View Full Profile
                  </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
function NavLink({ href, children, active = false, theme }) {
  const activeClass = "bg-blue-600 text-white shadow-lg";
  const inactiveClass = theme === "dark" 
    ? "text-slate-400 hover:bg-slate-800 hover:text-white" 
    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900";

  return (
    <Link href={href} className={`block px-4 py-2 rounded-lg transition-all ${active ? activeClass : inactiveClass}`}>
      {children}
    </Link>
  );
}

function QuizCard({ title, desc, icon, onClick, themeClasses }) {
  return (
    <div className={`border p-6 rounded-2xl hover:border-blue-500/50 transition-all ${themeClasses.card}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className={`text-lg font-bold ${themeClasses.headerText}`}>{title}</h3>
      <p className={`text-sm mb-4 ${themeClasses.mutedText}`}>{desc}</p>
      <button onClick={onClick} className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition">Start Quiz</button>
    </div>
  );
}

function StatCard({ title, value, icon, color, themeClasses }) {
  const colors = {
    blue: "text-blue-500 bg-blue-500/10",
    green: "text-green-500 bg-green-500/10",
    purple: "text-purple-500 bg-purple-500/10"
  };
  return (
    <div className={`border p-6 rounded-2xl flex items-center gap-4 ${themeClasses.card}`}>
      <div className={`text-2xl p-3 rounded-xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className={`text-sm font-medium uppercase tracking-wider ${themeClasses.mutedText}`}>{title}</p>
        <p className={`text-2xl font-bold ${themeClasses.headerText}`}>{value}</p>
      </div>
    </div>
  );
}

function InfoItem({ label, value, themeClasses }) {
  return (
    <div>
      <p className={`text-xs uppercase font-bold ${themeClasses.mutedText}`}>{label}</p>
      <p className={themeClasses.headerText}>{value || "Not Set"}</p>
    </div>
  );
}

function calculateAverage(history) {
  if (!history || history.length === 0) return "0%";
  const sum = history.reduce((acc, curr) => acc + parseFloat(curr.percentage), 0);
  return (sum / history.length).toFixed(1) + "%";
}