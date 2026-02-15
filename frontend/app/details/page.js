"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { db } from "../core/firebase"; 
import { doc, setDoc } from "firebase/firestore";
import { Loader2, Check, User, Briefcase, Globe, Sparkles } from "lucide-react";

export default function RegisterProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    name: "",
    skills: "",
    role: "",
    company: "",
    years: "",
    domain: "",
  });

  const [saving, setSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return alert("You must be logged in");
    
    setSaving(true);
    try {
      const profileData = {
        uid: user.uid,
        username: form.username.toLowerCase().replace(/\s/g, ""),
        name: form.name,
        skills: form.skills.split(",").map((s) => s.trim()),
        experience: {
          role: form.role,
          company: form.company,
          years: Number(form.years),
        },
        preferences: {
          domain: form.domain,
        },
        setupComplete: true,
        updatedAt: new Date().toISOString(),
      };

      
      await setDoc(doc(db, "profiles", user.uid), profileData);

      setIsSuccess(true);
      
      setTimeout(() => {
        router.push("/dashboard"); 
      }, 2000);
    } catch (err) {
      console.error("Firestore Error:", err);
      alert("Error saving: " + err.message);
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#CFD9F4]">
      <Loader2 className="animate-spin text-[#185D72]" size={48} />
    </div>
  );

  if (isSuccess) return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "linear-gradient(135deg, #CFD9F4 0%, #FFFFFF 100%)" }}>
      <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center border-3 border-dashed border-green-200">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={40} />
        </div>
        <h1 className="text-3xl font-bold text-[#185D72]">Success!</h1>
        <p className="text-slate-500 mt-2">Opening your dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "linear-gradient(135deg, #CFD9F4 0%, #FFFFFF 100%)" }}>
      <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-md rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white">
        
       
        <div className="md:w-1/3 bg-[#185D72] p-10 text-white flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles size={24} />
            <span className="font-bold text-xl">JobFinder</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4 text-[#CFD9F4]">Set up your dashboard.</h2>
          <p className="text-blue-100 opacity-80 text-sm">Fill in your details to customize your experience.</p>
        </div>

        <div className="md:w-2/3 p-10 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Username" name="username" ph="skill1" icon={<User size={18}/>} val={form.username} change={handleChange} />
              <InputField label="Full Name" name="name" ph="Your Name" icon={<User size={18}/>} val={form.name} change={handleChange} />
              <div className="md:col-span-2">
                <InputField label="Technical Skills" name="skills" ph="React, Firebase, Tailwind" icon={<Globe size={18}/>} val={form.skills} change={handleChange} />
              </div>
              <InputField label="Current Role" name="role" ph="Developer" icon={<Briefcase size={18}/>} val={form.role} change={handleChange} />
              <InputField label="Years of Experience" name="years" type="number" ph="3" icon={<Briefcase size={18}/>} val={form.years} change={handleChange} />
              <div className="md:col-span-2">
                <InputField label="Industry / Domain" name="domain" ph="e.g. Fintech" icon={<Globe size={18}/>} val={form.domain} change={handleChange} />
              </div>
            </div>

            <button 
              disabled={saving}
              className="w-full bg-[#185D72] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#134a5b] transition-all flex items-center justify-center shadow-lg"
            >
              {saving ? <Loader2 className="animate-spin" /> : "Complete Setup"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


function InputField({ label, name, ph, icon, val, change, type = "text" }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-[#185D72] ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
          {icon}
        </div>
        <input 
          type={type} name={name} value={val} onChange={change} placeholder={ph} required
          className="w-full bg-[#EBF1FF] border-none rounded-2xl py-3 pl-12 pr-4 text-[#185D72] placeholder-[#A0B1D9] outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />
      </div>
    </div>
  );
}