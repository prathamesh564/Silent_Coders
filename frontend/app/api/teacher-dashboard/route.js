export async function GET() {
  return Response.json({
    teacher: { name: "Mr. Sharma" },

    quizzes: [
      { id: 1, title: "Java Basics Quiz" },
      { id: 2, title: "DBMS Quiz" },
      { id: 3, title: "DSA Quiz" },
    ],

    students: [
      { name: "Sohan.P.Rai", score: 10 },
      { name: "Hamdhan", score: 9 },
      { name: "Preetham", score: 8 },
    ],
  });
}
