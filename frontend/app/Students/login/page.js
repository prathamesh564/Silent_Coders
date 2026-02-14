"use client";
import { useState } from "react";
import { createAccount } from "../../core/Auth"; 
import { createProfile } from "../../core/profileLogic";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { BrainCircuit } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth(); 
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  async function handleSignUp() {
    if (!checked) return alert("Please agree to our learning terms first!");
    setLoading(true);
    try {
      // 1. Create the Authentication entry
      const { user } = await createAccount(email, password);
      
      // 2. Create the Firestore profile document
      await createProfile({
        uid: user.uid,
        email: user.email,
        role: "student", 
        createdAt: new Date().toISOString(),
      });

      alert("Welcome! Your journey starts now.");
      router.push("/Students/dashboard");
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        alert("This email is already registered. Try logging in instead!");
      } else {
        alert(e.message);
      }
    } finally {
      setLoading(false);
    } 
  }

  async function handleLogin() {
    setLoading(true);
    try {
      await login(email, password); 
      router.push("/Students/dashboard"); 
    } catch (e) {
      alert("Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 selection:bg-indigo-100" 
         style={{ backgroundImage: "url('https://img.freepik.com/premium-photo/light-romantic-blue-abstract-creative-background-design_851755-200790.jpg')", 
           backgroundSize: "cover",
           backgroundPosition: "center",
           backgroundAttachment: "fixed" }}>
      
      <div className="relative w-full max-w-6xl overflow-hidden rounded-[3rem] border border-white/40 bg-white/30 backdrop-blur-2xl shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)]">
        
        <div className="flex flex-col md:flex-row min-h-[700px]">
          
          <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white/40">

            <div className="flex items-center gap-3 mb-12 animate-in fade-in slide-in-from-left duration-700">
               <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <BrainCircuit size={28} className="text-white" />
              </div>
              <div className="text-3xl font-black tracking-tighter text-slate-800">
                Quiz<span className="text-indigo-600">Master</span>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-4xl font-black text-slate-800 leading-tight">
                Ready to <span className="text-indigo-600">Level Up</span> Your Skills?
              </h2>
              <p className="text-slate-500 mt-2 font-medium">Join thousands of students mastering tech daily.</p>
            </div>

            <div className="space-y-4">
              <div className="group">
                <input type="email" placeholder="Email Address" value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-slate-200/60 bg-white/70 outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 font-medium shadow-sm"
                />
              </div>
              <div className="group">
                <input 
                  type="password"
                  placeholder="Create Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-slate-200/60 bg-white/70 outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 font-medium shadow-sm"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 mt-6 mb-8 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                  className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-300 bg-white checked:bg-indigo-600 checked:border-indigo-600 transition-all"
                />
                <svg className="absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 left-1 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                I'm ready for the <span className="text-indigo-700 underline decoration-2 underline-offset-4">Learning Terms</span>
              </span>
            </label>

            <div className="flex gap-4">
              <button 
                onClick={handleLogin}
                disabled={loading}
                className="flex-1 bg-white border-2 border-indigo-500 text-indigo-600 font-black py-4 rounded-2xl hover:bg-indigo-50 transition-all active:scale-95 disabled:opacity-50"
              >
                LOG IN
              </button>
              <button 
                onClick={handleSignUp}
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "PROCESSING..." : "GET STARTED"}
              </button>
            </div>
          </div>

          <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-indigo-600/20 to-purple-600/10 items-center justify-center p-1 overflow-hidden">
            <div className="absolute w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[100px] "></div>
            <div
              className="relative z-10 w-full h-full bg-contain bg-no-repeat bg-center transition-transform duration-1000 hover:scale-110"
              style={{ backgroundImage: "url('workspace.png')" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}