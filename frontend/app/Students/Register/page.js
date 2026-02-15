"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { BrainCircuit, Loader2 } from "lucide-react";

export default function StudentRegister() {
  const router = useRouter();
  const { register, createRegister } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    usn: "",
    name: "",
    dept: "",    
    course: "",  
    college: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const loginID = `${formData.usn.toLowerCase().trim()}@quizmaster.com`;
      const userCredential = await register(loginID, formData.password);
      const user = userCredential.user;

      const profilePayload = {
        uid: user.uid,
        name: formData.name.trim(),
        usn: formData.usn.trim().toUpperCase(),
        college: formData.college.trim(),
        branch: formData.dept.trim(),  
        stream: formData.course.trim(), 
        phoneNumber: formData.phoneNumber.trim(),
        quizHistory: [],               
        createdAt: new Date().toISOString()
      };

      await createRegister(profilePayload); 
      
      router.push("/Students/dashboard");
    } catch (error) {
      alert("Permission Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F4FF] dark:bg-[#0F172A] p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-[#1E293B] rounded-[2.5rem] shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden border border-white dark:border-slate-700">
        
        <div className="md:w-1/2 p-12 bg-white dark:bg-[#1E293B] flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-[#6366F1] dark:bg-[#818CF8] p-2 rounded-xl text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-500/20">
              <BrainCircuit size={28} />
            </div>
            <span className="text-2xl font-black text-[#1E293B] dark:text-white">QuizMaster</span>
          </div>
          
          <h1 className="text-5xl font-black text-[#1E293B] dark:text-white leading-tight mb-4">
            Ready to <span className="text-[#6366F1] dark:text-[#818CF8]">Level Up</span> <br /> Your Skills?
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Join thousands of students mastering tech daily.</p>
        </div>

        <div className="md:w-1/2 bg-[#F8FAFF] dark:bg-[#0F172A]/50 p-10 border-l border-slate-100 dark:border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <RegInput label="USN" name="usn" value={formData.usn} onChange={handleChange} placeholder="1DS22CS001" />
              <RegInput label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
            </div>
            <RegInput label="College" name="college" value={formData.college} onChange={handleChange} placeholder="College Name" />
            
            <div className="grid grid-cols-2 gap-4">
              <RegInput label="Dept / Branch" name="dept" value={formData.dept} onChange={handleChange} placeholder="e.g. CSE" />
              <RegInput label="Course" name="course" value={formData.course} onChange={handleChange} placeholder="e.g. B.Tech" />
            </div>

            <RegInput label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} type="tel" />
            
            <div className="grid grid-cols-2 gap-4">
              <RegInput label="Password" name="password" value={formData.password} onChange={handleChange} type="password" />
              <RegInput label="Confirm" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#6366F1] dark:bg-[#6366F1] text-white font-bold py-4 rounded-2xl hover:bg-[#4F46E5] dark:hover:bg-[#4F46E5] transition-all shadow-lg shadow-indigo-100 dark:shadow-indigo-500/10 mt-4 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "CREATE ACCOUNT"}
            </button>
          </form>
          
          <p className="text-center mt-6 text-sm font-semibold text-slate-400 dark:text-slate-500">
            Already have an account? <Link href="/Students/login" className="text-[#6366F1] dark:text-[#818CF8] hover:underline">LOG IN</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function RegInput({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <input
        type={type}
        name={name}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none focus:border-[#6366F1] dark:focus:border-[#818CF8] transition-all text-sm font-medium text-slate-700 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
      />
    </div>
  );
}