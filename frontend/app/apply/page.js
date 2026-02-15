"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { db } from "../core/firebase";
import { addDoc, collection } from "firebase/firestore";
import { Loader2, ArrowLeft, Send, FileText, User, Mail } from "lucide-react";

function ApplyForm() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const jobTitle = searchParams.get("jobTitle") || "Position";
  const company = searchParams.get("company") || "Company";

  const [form, setForm] = useState({
    fullName: "",
    email: user?.email || "",
    resumeLink: "",
    coverLetter: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleApply(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "applications"), {
        userId: user.uid,
        jobTitle,
        company,
        ...form,
        appliedAt: new Date().toISOString(),
        status: "pending",
      });
      setSuccess(true);
      setTimeout(() => router.push("/jobs"), 2500);
    } catch (err) {
      alert("Error submitting application: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center p-12 bg-white/80 backdrop-blur-xl rounded-[3rem] border border-white shadow-2xl">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Send size={40} className="animate-bounce" />
        </div>
        <h2 className="text-3xl font-black text-[#1F5669]">Application Sent!</h2>
        <p className="text-slate-500 mt-2 font-medium">Your profile has been shared with {company}.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-white/60 backdrop-blur-xl border border-white/80 rounded-[3rem] shadow-2xl overflow-hidden">
      <div className="bg-[#1F5669] p-8 text-white relative">
        <button onClick={() => router.back()} className="absolute left-6 top-8 hover:scale-110 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-black uppercase tracking-tighter">Application Form</h1>
          <p className="opacity-70 text-sm font-bold mt-1">{jobTitle} @ {company}</p>
        </div>
      </div>

      <form onSubmit={handleApply} className="p-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-[#1F5669] uppercase ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
              <input 
                required type="text" 
                className="w-full bg-[#EBF1FF] border-none rounded-2xl py-3 pl-12 pr-4 text-[#1F5669] outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                placeholder="John Doe"
                value={form.fullName}
                onChange={(e) => setForm({...form, fullName: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
  <label className="text-xs font-black text-[#1F5669] uppercase ml-1">Email Address</label>
  <div className="relative">
    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
    <input 
      required 
      type="email" 
      className="w-full bg-[#EBF1FF] border-none rounded-2xl py-3 pl-12 pr-4 text-[#185D72] outline-none focus:ring-2 focus:ring-blue-400 transition-all"
      placeholder="yourname@example.com"
      value={form.email}
      onChange={(e) => setForm({...form, email: e.target.value})} // Added this back
    />
  </div>
</div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-[#1F5669] uppercase ml-1">Resume Link (Drive/Dropbox)</label>
          <div className="relative">
            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
            <input 
              required type="url" 
              className="w-full bg-[#EBF1FF] border-none rounded-2xl py-3 pl-12 pr-4 text-[#1F5669] outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              placeholder="https://drive.google.com/..."
              value={form.resumeLink}
              onChange={(e) => setForm({...form, resumeLink: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-[#1F5669] uppercase ml-1">Why should we hire you?</label>
          <textarea 
            required rows="4"
            className="w-full bg-[#EBF1FF] border-none rounded-[1.5rem] py-4 px-5 text-[#1F5669] outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-none"
            placeholder="Briefly describe your interest..."
            value={form.coverLetter}
            onChange={(e) => setForm({...form, coverLetter: e.target.value})}
          />
        </div>

        <button 
          disabled={loading}
          className="w-full bg-[#1F5669] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <>Submit Application <Send size={18} /></>}
        </button>
      </form>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-16 px-4" 
         style={{ 
           backgroundImage: "url('https://img.freepik.com/premium-photo/soft-gradient-light-blue-background_1000823-157650.jpg')", 
           backgroundSize: "cover",
           backgroundAttachment: "fixed"
         }}>
      <Suspense fallback={<Loader2 className="animate-spin text-[#1F5669]" size={48} />}>
        <ApplyForm />
      </Suspense>
    </div>
  );
}