import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

/* ✅ Import Models */
import Teacher from "./models/Teacher.js";
import Quiz from "./models/Quiz.js";
import Student from "./models/Student.js";

dotenv.config();

const app = express();

/* ✅ Middleware */
app.use(cors());
app.use(express.json());

/* ✅ Check ENV Variables */
if (!process.env.MONGO_URI) {
  console.log("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

/* ✅ MongoDB Atlas Connection */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected Successfully"))
  .catch((err) => {
    console.log("❌ MongoDB Connection Failed");
    console.error(err);
    process.exit(1);
  });

/* ✅ Default Route */
app.get("/", (req, res) => {
  res.send("🚀 Backend is Running Successfully");
});

/* ✅ SEED ROUTE (Run Only Once) */
app.get("/api/seed", async (req, res) => {
  try {
    await Teacher.deleteMany();
    await Quiz.deleteMany();
    await Student.deleteMany();

    await Teacher.create({
      name: "Mr. Sharma",
      email: "sharma@gmail.com",
    });

    await Quiz.insertMany([
      { title: "Java Basics Quiz" },
      { title: "DBMS Quiz" },
      { title: "DSA Quiz" },
    ]);

    await Student.insertMany([
      { name: "Ravi", score: 10 },
      { name: "Ajay", score: 9 },
      { name: "Preetham", score: 8 },
    ]);

    res.send("✅ Database Seeded Successfully!");
  } catch (error) {
    res.status(500).send("❌ Seeding Failed");
  }
});

/* ✅ Teacher Dashboard API Route (REAL MongoDB Data) */
app.get("/api/teacher/dashboard", async (req, res) => {
  try {
    const teacher = await Teacher.findOne();
    const quizzes = await Quiz.find();
    const students = await Student.find().sort({ score: -1 });

    res.json({
      teacher,
      quizzes,
      students,
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Dashboard Fetch Failed" });
  }
});

/* ✅ Server Start */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on: http://localhost:${PORT}`);
});
