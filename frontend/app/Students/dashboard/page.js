"use client";
import Footer from "../../components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
  async function fetchData() {
    const res = await fetch("/api/dashboard");
    const data = await res.json();
    setStudent(data.student);
    setQuizzes(data.quizzes);
    setLeaderboard(data.leaderboard);
}

fetchData();
  }, []);

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col justify-center items-center">
        <p className="text-xl text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col">

    {/* Navbar */}
    <nav className="flex justify-between items-center px-10 py-5">
      <h1 className="text-2xl font-bold text-indigo-600">🎯 Quiz Master</h1>
      <Link href="/leaderboard">
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition">
          Leaderboard
        </button>
      </Link>
    </nav>

    {/* Main Content */}
    <div className="flex flex-1 justify-center items-center px-6">
      <div className="max-w-4xl text-center">

        {/* Heading */}
        <h1 className="text-5xl font-extrabold mb-4">
          Build your future,
          <span className="block bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
            one insight at a time.
          </span>
        </h1>

        <p className="text-gray-600 mb-8 text-lg">
          Welcome back, <span className="font-semibold">{student.name}</span>.
          Track your progress and climb the leaderboard 🚀
        </p>

        {/* Glass Card */}
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-8">

          {/* Progress */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-2">Your Progress</h3>
            <p className="text-lg">
              Score: <b>{student.score}</b> / {student.total}
            </p>
          </div>

          {/* Quizzes */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Available Quizzes</h3>

            {quizzes.map((quiz) => (
              <div key={quiz.id} className="mb-4">
                <p className="text-lg">{quiz.title}</p>

                <Link href={`/Students/Quiz/${quiz.id}`}>
                  <button className="mt-2 bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-6 py-2 rounded-xl hover:opacity-90 transition">
                    Start Quiz 🚀
                  </button>
                </Link>
              </div>
            ))}
          </div>

          {/* Leaderboard */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">🏆 Leaderboard</h3>

            {leaderboard.map((user, index) => (
              <p key={index} className="text-lg">
                {index + 1}. {user.name} - {user.score}
              </p>
            ))}
          </div>

        </div>
      </div>
    </div>

    <footer className="text-center py-6 text-gray-600">
      <Footer />
    </footer>
  </div>
  );
}