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
  const router = useRouter();

  useEffect(() => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex flex-col">
      <Header />

      <div className="flex flex-1">
        <aside className="w-64 min-h-[calc(100vh-64px)] bg-slate-900/50 border-r border-slate-800 p-6 hidden md:block">
          <nav className="space-y-4">
            <NavLink href="#" active>Dashboard</NavLink>
            <NavLink href="/Students/Quiz">Take Quiz</NavLink>
            <NavLink href="/Students/results">My Results</NavLink>
            <NavLink href="/Students/settings">Settings</NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-10 bg-[#020617]">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {profile?.name?.split(" ")[0]}! 👋
              </h1>
              <p className="text-slate-400">Here is what's happening with your learning today.</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 transition">
                <span className="sr-only">Notifications</span>
                🔔
              </button>
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full border-2 border-slate-800"></div>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard title="Quizzes Completed" value={profile?.quizHistory?.length || 0} icon="📝" color="blue" />
            <StatCard title="Average Score" value={calculateAverage(profile?.quizHistory)} icon="📈" color="green" />
            <StatCard title="Rank" value="Pro" icon="🏆" color="purple" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Recent Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-800">
                      <th className="pb-4 font-medium">Date</th>
                      <th className="pb-4 font-medium">Score</th>
                      <th className="pb-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {profile?.quizHistory?.slice(-5).reverse().map((quiz, i) => (
                      <tr key={i} className="group hover:bg-slate-800/30 transition">
                        <td className="py-4 text-slate-300">{new Date(quiz.date).toLocaleDateString()}</td>
                        <td className="py-4 font-semibold text-blue-400">{quiz.percentage}</td>
                        <td className="py-4">
                          <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs">Passed</span>
                        </td>
                      </tr>
                    ))}
                    {!profile?.quizHistory?.length && (
                      <tr><td colSpan="3" className="py-10 text-center text-slate-500">No quizzes taken yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Student Info</h3>
              <div className="space-y-4">
                <InfoItem label="USN" value={profile?.usn} />
                <InfoItem label="College" value={profile?.college} />
                <InfoItem label="Branch" value={profile?.branch} />
                <InfoItem label="Stream" value={profile?.stream} />
                <hr className="border-slate-800 my-4" />
                <Link href="/Students/Quiz" className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-900/20">
                  Start New Quiz
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Reusable NavLink, StatCard, and InfoItem components remain the same as your previous version...
function NavLink({ href, children, active = false }) {
  return (
    <Link href={href} className={`block px-4 py-2 rounded-lg transition-all ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
      {children}
    </Link>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "text-blue-500 bg-blue-500/10",
    green: "text-green-500 bg-green-500/10",
    purple: "text-purple-500 bg-purple-500/10"
  };
  return (
    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
      <div className={`text-2xl p-3 rounded-xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500 uppercase font-bold">{label}</p>
      <p className="text-slate-200">{value || "Not Set"}</p>
    </div>
  );
}

function calculateAverage(history) {
  if (!history || history.length === 0) return "0%";
  const sum = history.reduce((acc, curr) => acc + parseFloat(curr.percentage), 0);
  return (sum / history.length).toFixed(1) + "%";
}