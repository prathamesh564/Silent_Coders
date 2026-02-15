"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/app/core/firebase";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    usn: "",
    name: "",
    branch: "",
    stream: "",
    college: "",
    phone: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: any) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        usn: formData.usn,
        name: formData.name,
        branch: formData.branch,
        stream: formData.stream,
        college: formData.college,
        phone: formData.phone,
        email: formData.email,
        role: "student",
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setTimeout(() => {
        setLoading(false);
      }, 1400);
    } catch (err: any) {
      setError(err.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-start justify-center py-16 px-6">
      {/* animated glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>

      {/* top-left logo */}
      <a href="/" className="fixed top-6 left-6 z-50 flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Quiz Master"
          className="w-10 h-10 rounded-lg shadow-md"
        />
        <span className="hidden sm:inline-block font-extrabold text-lg">
          <span className="text-slate-900">Quiz</span>{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5b4bff] via-[#6f3af7] to-[#ff5fb4]">
            Master
          </span>
        </span>
      </a>

      {/* card */}
      <div className="w-full max-w-xl relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_15px_40px_rgba(20,21,33,0.08)] p-8 md:p-12 border border-white/40">
          <div className="text-center mb-6">
            <h1 className="font-extrabold tracking-tight text-slate-900">
              <span className="block text-2xl md:text-3xl">Let’s Get You</span>
              <span className="block text-3xl md:text-5xl bg-gradient-to-r from-[#5b4bff] via-[#6f3af7] to-[#ff5fb4] bg-clip-text text-transparent leading-tight">
                Registered
              </span>
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Create your student account to start quizzes, track progress and
              join leaderboards.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="usn"
              placeholder="USN (eg. 1MS20CS001)"
              value={formData.usn}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-slate-200 text-black placeholder-slate-500 focus:outline-none input-glow transition"
            />

            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-slate-200 text-black placeholder-slate-500 focus:outline-none input-glow transition"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="branch"
                placeholder="Branch (CSE / ECE)"
                value={formData.branch}
                onChange={handleChange}
                required
                className="p-3 rounded-lg border border-slate-200 text-black placeholder-slate-500 focus:outline-none input-glow transition"
              />
              <input
                name="stream"
                placeholder="Stream (Engineering / Diploma)"
                value={formData.stream}
                onChange={handleChange}
                required
                className="p-3 rounded-lg border border-slate-200 text-black placeholder-slate-500 focus:outline-none input-glow transition"
              />
            </div>

            <input
              name="college"
              placeholder="College Name"
              value={formData.college}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-slate-200 text-black placeholder-slate-500 focus:outline-none input-glow transition"
            />

            <input
              name="phone"
              placeholder="Phone Number (10 digits)"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              className="w-full p-3 rounded-lg border border-slate-200 text-black placeholder-slate-500 focus:outline-none input-glow transition"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-slate-200 text-black placeholder-slate-500 focus:outline-none input-glow transition"
            />

            <input
              type="password"
              name="password"
              placeholder="Password (min 6 chars)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full p-3 rounded-lg border border-slate-200 text-black placeholder-slate-500 focus:outline-none input-glow transition"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full inline-flex items-center justify-center gap-3 rounded-lg py-3 bg-gradient-to-r from-[#5b4bff] via-[#6f3af7] to-[#ff5fb4] text-white font-semibold shadow-md hover:scale-[1.01] transform transition button-glow"
            >
              {loading ? (
                <svg
                  className="w-5 h-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : null}
              <span>{loading ? "Registering..." : "Register"}</span>
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-slate-400">
          By signing up you agree to the platform rules. You can update your
          profile later.
        </p>
      </div>

      {/* success overlay */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md rounded-lg p-8 shadow-2xl w-80 flex flex-col items-center animate-scaleIn">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-emerald-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Registration Successful
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              Welcome! Your account has been created.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        /* blob shapes */
        .blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(70px);
          opacity: 0.55;
          transform: translate3d(0, 0, 0);
          mix-blend-mode: normal;
        }
        .blob-1 {
          width: 520px;
          height: 520px;
          left: -220px;
          top: -180px;
          background: radial-gradient(circle at 20% 20%, rgba(91,75,255,0.28), rgba(111,58,247,0.18) 30%, rgba(255,95,180,0.06) 65%, transparent 70%);
          animation: float1 8s ease-in-out infinite;
        }
        .blob-2 {
          width: 420px;
          height: 420px;
          right: -160px;
          bottom: -140px;
          background: radial-gradient(circle at 80% 80%, rgba(255,95,180,0.18), rgba(111,58,247,0.12) 35%, rgba(91,75,255,0.06) 65%, transparent 70%);
          animation: float2 10s ease-in-out infinite;
        }

        @keyframes float1 {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(20px) rotate(6deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes float2 {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(-6deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }

        /* input focus glow */
        .input-glow {
          transition: box-shadow 220ms ease, transform 160ms ease;
        }
        .input-glow:focus {
          box-shadow: 0 10px 30px rgba(111,58,247,0.12), 0 1px 0 rgba(111,58,247,0.04) inset;
          transform: translateY(-1px);
        }

        /* button glow on hover */
        .button-glow {
          transition: box-shadow 220ms ease, transform 160ms ease;
          will-change: transform;
        }
        .button-glow:hover {
          box-shadow: 0 10px 40px rgba(111,58,247,0.18), 0 2px 8px rgba(255,95,180,0.08);
          transform: translateY(-3px) scale(1.01);
        }

        /* success scale animation */
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scaleIn {
          animation: scaleIn 300ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
}
