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
    <nav className="flex justify-between items-center px-12 py-6">
      <h1 className="text-2xl font-bold text-indigo-600">🎯 Quiz Master</h1>
      <Link href="/leaderboard">
        <button className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition">
          Leaderboard
        </button>
      </Link>
    </nav>

    {/* Hero Section Container (Like Image) */}
    <div className="px-10">
      <div className="bg-white/40 backdrop-blur-xl rounded-[40px] shadow-2xl p-12">

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

        {/* Buttons Section */}
        <div className="flex gap-4">
          <Link href="/Students/dashboard">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition">
              Explore Quizzes
            </button>
          </Link>

          <Link href="/leaderboard">
            <button className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-50 transition">
              View Leaderboard
            </button>
          </Link>
        </div>
      </div>
    </div>

    {/* Lower Content Section (Like Recommended Section) */}
    <div className="flex-1 px-10 mt-12">

      <h2 className="text-3xl font-bold text-center mb-2">
        Recommended for you
      </h2>
      <p className="text-center text-gray-600 mb-10">
        Based on your quiz performance and activity
      </p>

      {/* Glass Card */}
      <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-10 max-w-4xl mx-auto">

        {/* Progress */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-2">Your Progress</h3>
          <p className="text-lg">
            Score: <b>{student.score}</b> / {student.total}
          </p>
        </div>

        {/* Quizzes */}
        {/* <div>
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Available Quizzes</h3>

          {quizzes.map((quiz) => (
            <div key={quiz.id} className="mb-4 flex justify-between items-center">
              <p className="text-lg">{quiz.title}</p>

              <Link href={`/Students/Quiz/${quiz.id}`}>
                <button className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-5 py-2 rounded-xl hover:opacity-90 transition">
                  Start Quiz 🚀
                </button>
              </Link>
            </div>
          ))}
        </div>
</div> */}
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
      <div className="mb-5">
  <h3 className="text-2xl font-semibold mb-6">Available Quizzes</h3>

  <div className="grid gap-6 md:grid-cols-2">
    {quizzes.map((quiz) => (
      <div
        key={quiz.id}
        className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300"
      >
        <h4 className="text-xl font-semibold mb-3">
          {quiz.title}
        </h4>

        <Link href={`/Students/Quiz/${quiz.id}`}>
          <button className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white py-2 rounded-xl hover:opacity-90 transition">
            Start Quiz 🚀
          </button>
        </Link>
      </div>
    ))}
  </div>
</div>
    </div>

    <footer className="text-center py-6 text-gray-600 mt-12">
      <Footer />
    </footer>

  </div>
);
}