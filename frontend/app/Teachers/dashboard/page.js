"use client";

import Footer from "../../components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/teacher-dashboard");
      const data = await res.json();

      setTeacher(data.teacher);
      setQuizzes(data.quizzes);
      setStudents(data.students);
    }

    fetchData();
  }, []);

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex justify-center items-center">
        <p className="text-xl text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 
      dark:from-gray-900 dark:via-gray-800 dark:to-black 
      text-gray-900 dark:text-white transition-colors duration-300 flex flex-col"
    >
      {/* Navbar */}
      <nav className="flex justify-between items-center px-12 py-6">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          👩‍🏫 Quiz Master
        </h1>

        <Link href="/Teachers/Feedback">
          <button className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition">
            Feedback
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="px-10">
        <div
          className="bg-white/40 dark:bg-gray-800/50 backdrop-blur-xl 
          rounded-[40px] shadow-2xl p-12"
        >
          <h1 className="text-5xl font-extrabold mb-4">
            Inspire your students,
            <span className="block bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
              one quiz at a time.
            </span>
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
            Welcome back,{" "}
            <span className="font-semibold">{teacher.name}</span>. Manage quizzes
            and track student performance 🚀
          </p>

          <div className="flex gap-4">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition">
              Manage Quizzes
            </button>

            <Link href="/Teachers/Feedback">
              <button
                className="border border-indigo-600 text-indigo-600 dark:text-indigo-400 
                px-6 py-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-gray-700 transition"
              >
                View Feedback
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 px-10 mt-12">
        <h2 className="text-3xl font-bold text-center mb-2">
          Teacher Dashboard
        </h2>

        <p className="text-center text-gray-600 dark:text-gray-400 mb-10">
          Track quizzes, monitor student scores, and manage learning
        </p>

        {/* Glass Card */}
        <div
          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg 
          rounded-3xl shadow-xl p-10 max-w-4xl mx-auto"
        >
          {/* Overview */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-2">Your Overview</h3>

            <p className="text-lg">
              Total Quizzes Created: <b>{quizzes.length}</b>
            </p>

            <p className="text-lg">
              Students Participated: <b>{students.length}</b>
            </p>
          </div>

          {/* Student Leaderboard */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              🏆 Top Performing Students
            </h3>

            {students.map((s, index) => (
              <p key={index} className="text-lg">
                {index + 1}. {s.name} - {s.score}
              </p>
            ))}
          </div>
        </div>

        {/* Quiz Section */}
        <div className="mb-5 mt-10">
          <h3 className="text-2xl font-semibold mb-6">
            Manage Available Quizzes
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg
                rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
              >
                <h4 className="text-xl font-semibold mb-3">{quiz.title}</h4>

                <button
                  className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 
                  text-white py-2 rounded-xl hover:opacity-90 transition"
                >
                  View Quiz 👀
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-600 dark:text-gray-400 mt-12">
        <Footer />
      </footer>
    </div>
  );
}
