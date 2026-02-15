"use client";
import { useState } from "react";
import { login, createAccount, logout } from "../core/auth";
import { createProfile } from "../core/profileLogic";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login}=useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [checked, setChecked] = useState(false);
async function handleSignUp() {
  setLoading(true);
  try {
    const { user } = await createAccount(email, password);
    await Promise.all([,
      createProfile({
        uid: user.uid,
        email: user.email,
        createdAt: new Date().toISOString(),
      }),
    ]);

    alert("Account created");
    setEmail(""); setPassword(""); 
  } catch (e) {
    alert(e.message);
  } finally {
    setLoading(false);
  } 

}
async function handleLogin() {
  try {
    await login(email, password);
    alert("Logged in");
    router.push("/details");
  } catch (e) {
    alert(e.message);
  }
}
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 selection:bg-blue-100" 
         style={{ backgroundImage: "url('https://img.freepik.com/premium-photo/light-romantic-blue-abstract-creative-background-design_851755-200790.jpg')", 
           backgroundSize: "cover",
           backgroundPosition: "center",
           backgroundAttachment: "fixed"   }}>
      
      <div className="relative w-full max-w-6xl overflow-hidden rounded-[3rem] border border-white/40 bg-white/30 backdrop-blur-2xl shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)]">
        
        <div className="flex flex-col md:flex-row min-h-[700px]">
          
          <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white/40">

            <div className="flex items-center gap-4 mb-12 animate-in fade-in slide-in-from-left duration-700">
              <div 
                className="w-20 h-20 bg-contain bg-no-repeat bg-center drop-shadow-xl" 
                style={{ backgroundImage: "url('robot.png')" }}
              />
              <div className="text-4xl font-black tracking-tighter text-[#185D72]">
                Job<span className="text-blue-600">Finder</span>
              </div>
            </div>
            <div className="mb-10">
              <h2 className="text-4xl font-black text-[#185D72] leading-tight">
                Sign Up <span className="text-blue-600">To</span> <br />Continue
              </h2>
              <p className="text-slate-500 mt-2 font-medium">Empowering your career with AI precision.</p>
            </div>
            <div className="space-y-4">
              <div className="group">
                <input type="email" placeholder="Email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-slate-200/60 bg-white/70 outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 font-medium shadow-sm"
                />
              </div>
              <div className="group">
                <input 
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-slate-200/60 bg-white/70 outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 font-medium shadow-sm"
                />
              </div>
            </div>
            <label className="flex items-center gap-3 mt-6 mb-8 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                  className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-300 bg-white checked:bg-blue-600 checked:border-blue-600 transition-all"
                />
                <svg className="absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 left-1 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                I agree with the <span className="text-blue-700 underline decoration-2 underline-offset-4">Terms and Conditions</span>
              </span>
            </label>
            <div className="flex gap-4">
              <button 
                onClick={handleLogin}
                disabled={loading}
                className="flex-1 bg-white border-2 border-blue-500 text-blue-600 font-black py-4 rounded-2xl hover:bg-blue-50 transition-all active:scale-95 disabled:opacity-50"
              >
                LOGIN
              </button>
              <button 
                onClick={handleSignUp}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "PROCESSING..." : "SIGN UP"}
              </button>
            </div>
          </div>

          <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-blue-600/20 to-indigo-600/10 items-center justify-center p-1 overflow-hidden">
            <div className="absolute w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] "></div>
            
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