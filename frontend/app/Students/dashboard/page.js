"use client";

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
      <div className="min-h-screen flex justify-center items-center text-white bg-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">🎓 Student Dashboard</h1>
        <h2 className="text-xl mb-6">
          Welcome, <span className="font-semibold">{student.name}</span>
        </h2>

        <div className="bg-white/20 p-6 rounded-2xl mb-6">
          <h3 className="text-2xl font-semibold mb-2">Your Progress</h3>
          <p>
            Score: <b>{student.score}</b> / {student.total}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-4">Available Quizzes</h3>
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="mb-4">
              <p>{quiz.title}</p>
              <Link href={`/Students/Quiz/${quiz.id}`}>
                <button className="bg-white text-purple-700 px-4 py-2 rounded-lg mt-2">
                  Start Quiz 🚀
                </button>
              </Link>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4">🏆 Leaderboard</h3>
          {leaderboard.map((user, index) => (
            <p key={index}>
              {index + 1}. {user.name} - {user.score}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}