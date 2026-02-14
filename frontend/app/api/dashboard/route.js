import { NextResponse } from "next/server";

export async function GET() {
  const data = {
    student: { name: "Preetham", score: 8, total: 10 },
    quizzes: [
      { id: 1, title: "Java Basics Quiz" },
      { id: 2, title: "DBMS Quiz" },
      { id: 3, title: "DSA Quiz" }
    ],
    leaderboard: [
      { name: "Ravi", score: 10 },
      { name: "Ajay", score: 9 },
      { name: "Preetham", score: 8 }
    ]
  };

  return NextResponse.json(data);
}
