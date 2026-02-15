"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../core/firebase.js";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";
import { Users, BookOpen, GraduationCap, Trophy } from "lucide-react";

export default function FacultyDashboard() {
  const [profile, setProfile] = useState(null);
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("dark"); 
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // 1. Fetch Faculty Profile
        const docRef = doc(db, "teachers", user.uid); // Assuming collection is 'teachers'
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }

        // 2. Fetch Students for Raw Data (Front-end processing)
        const querySnapshot = await getDocs(collection(db, "students"));
        const students = [];
        querySnapshot.forEach((doc) => {
          students.push({ id: doc.id, ...doc.data() });
        });
        setStudentsData(students.slice(0, 10)); // Limiting to 10 as requested
        setLoading(false);
      } else {
        router.push("/Teachers/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Front-end Data Aggregation Logic
  const classAvg = () => {
    if (studentsData.length === 0) return "0%";
    const allScores = studentsData.flatMap(s => s.quizHistory || []);
    if (allScores.length === 0) return "N/A";
    const sum = allScores.reduce((acc, curr) => acc + parseFloat(curr.percentage), 0);
    return (sum / allScores.length).toFixed(1) + "%";
  };

  const themeClasses = {
    bg: theme === "dark" ? "bg-[#020617] text-slate-200" : "bg-gray-50 text-slate-900",
    card: theme === "dark" ? "bg-slate-900/40 border-slate-800" : "bg-white border-gray-200 shadow-sm",
    sidebar: theme === "dark" ? "bg-slate-900/50 border-slate-800" : "bg-white border-gray-200",
    headerText: theme === "dark" ? "text-white" : "text-gray-900",
    mutedText: theme === "dark" ? "text-slate-400" : "text-gray-500",
    tableHeader: theme === "dark" ? "text-slate-500 border-slate-800" : "text-gray-400 border-gray-200",
    tableRow: theme === "dark" ? "hover:bg-slate-800/30 border-slate-800" : "hover:bg-gray-100 border-gray-100",
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${themeClasses.bg}`}>
      <Header />

      <div className="flex flex-1">
        <aside className={`w-64 min-h-[calc(100vh-64px)] border-r p-6 hidden md:block ${themeClasses.sidebar}`}>
          <nav className="space-y-4">
            <NavLink href="#" active theme={theme}>Faculty Overview</NavLink>
            <NavLink href="/Teachers/profile" theme={theme}>Faculty Profile</NavLink>
            <NavLink href="/Landing-page" theme={theme}>Home</NavLink>
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-10">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className={`text-3xl font-black tracking-tight ${themeClasses.headerText}`}>
                Faculty Portal: {profile?.name} 🏛️
              </h1>
              <p className={themeClasses.mutedText}>Monitoring {profile?.dept} Department Performance</p>
            </div>

            <button onClick={toggleTheme} className={`p-3 rounded-xl border transition-all hover:scale-105 ${themeClasses.card}`}>
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </header>

          {/* Aggregate Stats calculated in Frontend */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <StatCard title="Total Students" value={studentsData.length} icon={<Users size={20}/>} color="blue" themeClasses={themeClasses} />
            <StatCard title="Class Average" value={classAvg()} icon={<GraduationCap size={20}/>} color="green" themeClasses={themeClasses} />
            <StatCard title="Active Quizzes" value="12" icon={<BookOpen size={20}/>} color="purple" themeClasses={themeClasses} />
            <StatCard title="Dept Rank" value="#4" icon={<Trophy size={20}/>} color="orange" themeClasses={themeClasses} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Raw Student Data Table */}
            <div className={`lg:col-span-2 border rounded-2xl p-6 ${themeClasses.card}`}>
              <h3 className={`text-xl font-bold mb-6 ${themeClasses.headerText}`}>Student Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className={`border-b ${themeClasses.tableHeader}`}>
                      <th className="pb-4 font-medium uppercase text-[10px] tracking-widest">Student Name</th>
                      <th className="pb-4 font-medium uppercase text-[10px] tracking-widest">USN</th>
                      <th className="pb-4 font-medium uppercase text-[10px] tracking-widest">Avg Score</th>
                      <th className="pb-4 font-medium uppercase text-[10px] tracking-widest">Quizzes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-transparent">
                    {studentsData.map((student, i) => {
                      const avg = student.quizHistory?.length 
                        ? (student.quizHistory.reduce((a, c) => a + parseFloat(c.percentage), 0) / student.quizHistory.length).toFixed(1) + "%"
                        : "0%";
                      
                      return (
                        <tr key={i} className={`group transition border-b ${themeClasses.tableRow}`}>
                          <td className="py-4 font-semibold">{student.name}</td>
                          <td className={themeClasses.mutedText}>{student.usn}</td>
                          <td className="py-4 font-bold text-indigo-500">{avg}</td>
                          <td className="py-4">
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-bold">
                              {student.quizHistory?.length || 0} Done
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Incharge Profile Info */}
            <div className={`border rounded-2xl p-6 ${themeClasses.card}`}>
              <h3 className={`text-xl font-bold mb-6 ${themeClasses.headerText}`}>Faculty Identity</h3>
              <div className="space-y-4">
                <InfoItem label="Employee ID" value={profile?.facultyId} themeClasses={themeClasses} />
                <InfoItem label="Designation" value={profile?.designation} themeClasses={themeClasses} />
                <InfoItem label="Primary Dept" value={profile?.dept} themeClasses={themeClasses} />
                <InfoItem label="College" value={profile?.college} themeClasses={themeClasses} />
                <button className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all w-full">
                  Generate Semester Report
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Sub-components kept similar but styled for Faculty 
function NavLink({ href, children, active = false, theme }) {
  const activeClass = "bg-indigo-600 text-white shadow-lg";
  const inactiveClass = theme === "dark" 
    ? "text-slate-400 hover:bg-slate-800 hover:text-white" 
    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900";

  return (
    <Link href={href} className={`block px-4 py-3 rounded-xl transition-all font-medium ${active ? activeClass : inactiveClass}`}>
      {children}
    </Link>
  );
}

function StatCard({ title, value, icon, color, themeClasses }) {
  const colors = {
    blue: "text-blue-500 bg-blue-500/10",
    green: "text-emerald-500 bg-emerald-500/10",
    purple: "text-purple-500 bg-purple-500/10",
    orange: "text-orange-500 bg-orange-500/10"
  };
  return (
    <div className={`border p-5 rounded-2xl flex items-center gap-4 ${themeClasses.card}`}>
      <div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className={`text-[10px] font-black uppercase tracking-widest ${themeClasses.mutedText}`}>{title}</p>
        <p className={`text-xl font-bold ${themeClasses.headerText}`}>{value}</p>
      </div>
    </div>
  );
}

function InfoItem({ label, value, themeClasses }) {
  return (
    <div className="border-b border-slate-800/50 pb-2">
      <p className={`text-[10px] uppercase font-black tracking-tighter ${themeClasses.mutedText}`}>{label}</p>
      <p className={`font-medium ${themeClasses.headerText}`}>{value || "Not Set"}</p>
    </div>
  );
}