"use client";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../core/firebase";
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { 
  User, 
  Briefcase, 
  Globe, 
  Loader2, 
  Edit3, 
  Save, 
  CheckCircle,
  Calendar,
  ChevronRight,
  LogOut
} from "lucide-react";

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    username: "",
    skills: "",
    role: "",
    company: "",
    years: "",
    domain: ""
  });

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        // 1. Fetch Profile Data from 'profiles' collection
        const docRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data);
          setEditForm({
            name: data.name || "",
            username: data.username || "",
            skills: data.skills?.join(", ") || "",
            role: data.experience?.role || "",
            company: data.experience?.company || "",
            years: data.experience?.years || "",
            domain: data.preferences?.domain || ""
          });
        }

        // 2. Fetch Applications from 'applications' collection
        const q = query(collection(db, "applications"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const apps = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        // Sort by newest application first
        setAppliedJobs(apps.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)));

      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  async function handleUpdate() {
    try {
      const docRef = doc(db, "profiles", user.uid);
      const updatedData = {
        name: editForm.name,
        username: editForm.username,
        skills: editForm.skills.split(",").map(s => s.trim()),
        experience: {
          role: editForm.role,
          company: editForm.company,
          years: Number(editForm.years)
        },
        preferences: { domain: editForm.domain }
      };
      await updateDoc(docRef, updatedData);
      setProfile(updatedData);
      setIsEditing(false);
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  }

  if (authLoading || loading) return (
    <div className="flex h-screen items-center justify-center bg-[#CFD9F4]">
      <Loader2 className="animate-spin text-[#185D72]" size={48} />
    </div>
  );

  return (
    
    <div className="min-h-screen w-full py-12 px-4 selection:bg-blue-100" 
         style={{ background: "linear-gradient(135deg, #CFD9F4 0%, #FFFFFF 100%)" }}>
      <Header/>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* TOP BAR / HEADER */}
        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-[#185D72] rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-lg">
              {profile?.name?.[0] || user?.email?.[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#185D72] tracking-tight">{profile?.name || "User"}</h1>
              <p className="text-blue-500 font-bold">@{profile?.username || "username"}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
              className="bg-[#185D72] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
            >
              {isEditing ? <div className="flex items-center gap-2"><Save size={16}/> Save Changes</div> : <div className="flex items-center gap-2"><Edit3 size={16}/> Edit Profile</div>}
            </button>
            <button 
              onClick={logout}
              className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: REGISTRATION DETAILS */}
          <div className="space-y-6">
            <div className="bg-white/50 backdrop-blur-md border border-white rounded-[2.5rem] p-8 shadow-lg">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <User size={14}/> Professional Details
              </h2>
              
              <div className="space-y-6">
                <EditableRow label="Full Name" value={profile?.name} field="name" isEditing={isEditing} editForm={editForm} setEditForm={setEditForm} />
                <EditableRow label="Role" value={profile?.experience?.role} field="role" isEditing={isEditing} editForm={editForm} setEditForm={setEditForm} />
                <EditableRow label="Company" value={profile?.experience?.company} field="company" isEditing={isEditing} editForm={editForm} setEditForm={setEditForm} />
                <EditableRow label="Experience" value={`${profile?.experience?.years} Years`} field="years" isEditing={isEditing} editForm={editForm} setEditForm={setEditForm} />
                <EditableRow label="Domain" value={profile?.preferences?.domain} field="domain" isEditing={isEditing} editForm={editForm} setEditForm={setEditForm} />
                
                <div className="pt-6 border-t border-slate-200/50">
                  <span className="text-[10px] font-black text-slate-400 uppercase block mb-4 tracking-widest">Skills Portfolio</span>
                  <div className="flex flex-wrap gap-2">
                    {isEditing ? (
                       <textarea 
                        className="w-full bg-[#EBF1FF] rounded-xl p-4 text-sm text-[#185D72] outline-none border border-blue-100 font-medium"
                        value={editForm.skills}
                        onChange={(e) => setEditForm({...editForm, skills: e.target.value})}
                        placeholder="React, Node.js, Firebase..."
                       />
                    ) : (
                      profile?.skills?.map((s, i) => (
                        <span key={i} className="px-4 py-2 bg-[#EBF1FF] text-[#185D72] rounded-xl text-[11px] font-black uppercase tracking-tight shadow-sm border border-white">
                          {s}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: APPLIED JOBS LIST */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/60 backdrop-blur-md border border-white rounded-[2.5rem] p-8 md:p-10 shadow-lg min-h-[600px]">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-[#185D72] flex items-center gap-3">
                  <Briefcase size={24} className="text-blue-500" /> 
                  Applied Jobs
                </h2>
                <div className="flex items-center gap-2 bg-[#185D72]/5 px-4 py-2 rounded-2xl">
                  <span className="text-[#185D72] text-[11px] font-black uppercase tracking-widest">
                    Total: {appliedJobs.length}
                  </span>
                </div>
              </div>

              <div className="grid gap-5">
                {appliedJobs.length === 0 ? (
                  <div className="text-center py-24 border-3 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/50">
                    <div className="text-5xl mb-6 opacity-20">📁</div>
                    <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No Applications Yet</p>
                    <p className="text-slate-400 text-sm mt-2 font-medium">Head to the Jobs page to start applying!</p>
                  </div>
                ) : (
                  appliedJobs.map((app) => (
                    <div key={app.id} className="group bg-white border border-slate-100 p-6 rounded-[2.5rem] flex items-center justify-between hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-[#EBF1FF] text-[#185D72] rounded-[1.5rem] flex items-center justify-center font-black text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                          {app.company?.[0]}
                        </div>
                        <div>
                          <h4 className="font-black text-[#185D72] text-xl tracking-tight leading-tight">{app.jobTitle}</h4>
                          <div className="flex items-center gap-4 mt-1.5">
                            <span className="text-sm font-bold text-blue-500">@{app.company}</span>
                            <span className="text-[10px] text-slate-400 font-black uppercase flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
                              <Calendar size={12} /> {new Date(app.appliedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col items-end">
                          <span className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-5 py-2.5 rounded-full tracking-[0.1em] border border-emerald-100">
                            <CheckCircle size={14} /> Applied
                          </span>
                        </div>
                        <ChevronRight size={22} className="text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Editable Field Helper
function EditableRow({ label, value, field, isEditing, editForm, setEditForm }) {
  return (
    <div className="pb-5 border-b border-slate-100/80 last:border-0">
      <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 tracking-widest">{label}</label>
      {isEditing ? (
        <input 
          className="w-full bg-[#EBF1FF] rounded-xl p-3 text-[#185D72] font-bold text-sm outline-none border border-blue-100 focus:ring-2 focus:ring-blue-400 transition-all"
          value={editForm[field]}
          onChange={(e) => setEditForm({...editForm, [field]: e.target.value})}
        />
      ) : (
        <p className="text-[#185D72] font-black text-sm">{value || "—"}</p>
      )}
    </div>
  );
}