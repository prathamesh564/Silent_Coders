"use client";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../core/firebase";
import { useRouter } from "next/navigation";
import { 
  doc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  onSnapshot
} from "firebase/firestore";
import { 
  User, 
  Briefcase, 
  Loader2, 
  Edit3, 
  Save, 
  CheckCircle,
  Calendar,
  ChevronRight,
  LogOut,
  GraduationCap,
  Hash,
  Phone
} from "lucide-react";

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const [editForm, setEditForm] = useState({
    name: "",
    usn: "",
    dept: "",
    course: "",
    college: "",
    phoneNumber: ""
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/Students/login");
      return;
    }

    setLoading(true);

    const profileRef = doc(db, "profiles", user.uid);
    const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile(data);
        setEditForm({
          name: data.name || "",
          usn: data.usn || "",
          dept: data.dept || "",
          course: data.course || "",
          college: data.college || "",
          phoneNumber: data.phoneNumber || ""
        });
      } else {
      
        setProfile({}); 
      }
      setLoading(false);
    }, (err) => {
      console.error("Firestore Permission/Fetch Error:", err);
      setLoading(false);
    });
    const fetchApplications = async () => {
      try {
        const q = query(collection(db, "applications"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const apps = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        setAppliedJobs(apps.sort((a, b) => {
          const dateA = a.appliedAt?.seconds ? a.appliedAt.seconds * 1000 : new Date(a.appliedAt);
          const dateB = b.appliedAt?.seconds ? b.appliedAt.seconds * 1000 : new Date(b.appliedAt);
          return dateB - dateA;
        }));
      } catch (err) {
        console.error("Applications Fetch Error:", err);
      }
    };

    fetchApplications();

    return () => unsubscribeProfile();
  }, [user, authLoading, router]);

  async function handleUpdate() {
    try {
      const docRef = doc(db, "profiles", user.uid);
      const updatedData = {
        name: editForm.name,
        usn: editForm.usn.toUpperCase(),
        dept: editForm.dept,
        course: editForm.course,
        college: editForm.college,
        phoneNumber: editForm.phoneNumber,
        updatedAt: new Date().toISOString()
      };

      await setDoc(docRef, updatedData, { merge: true });
      
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed: " + err.message);
    }
  }

  if (authLoading || loading) return (
    <div className="flex h-screen items-center justify-center bg-[#F0F4FF] dark:bg-[#0F172A]">
      <Loader2 className="animate-spin text-[#6366F1]" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen w-full py-12 px-4 transition-colors duration-500 bg-[#F0F4FF] dark:bg-[#0F172A]" 
         style={{ backgroundImage: "linear-gradient(135deg, rgba(207, 217, 244, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)" }}>
      <Header/>
      <div className="max-w-6xl mx-auto space-y-8 mt-10">
      
        <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl border border-white dark:border-slate-700 rounded-[2.5rem] p-8 shadow-xl dark:shadow-none flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-[#6366F1] rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20">
              {profile?.name?.[0] || "U"}
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#1E293B] dark:text-white tracking-tight">{profile?.name || "New User"}</h1>
              <div className="flex items-center gap-2">
                <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border border-indigo-100 dark:border-indigo-800">
                  {profile?.usn || "No USN"}
                </span>
                <span className="text-slate-400 dark:text-slate-500 font-bold text-sm">{profile?.course}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
              className="bg-[#1E293B] dark:bg-[#6366F1] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center gap-2"
            >
              {isEditing ? <><Save size={16}/> Save Profile</> : <><Edit3 size={16}/> Edit Details</>}
            </button>
            <button onClick={logout} className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-2xl hover:bg-red-500 dark:hover:bg-red-500 hover:text-white transition-all">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="space-y-6">
            <div className="bg-white/50 dark:bg-slate-800/40 backdrop-blur-md border border-white dark:border-slate-700 rounded-[2.5rem] p-8 shadow-lg dark:shadow-none">
              <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <User size={14}/> Student Information
              </h2>
              
              <div className="space-y-6">
                <EditableRow label="Full Name" value={profile?.name} field="name" isEditing={isEditing} editForm={editForm} setEditForm={setEditForm} icon={<User size={14}/>}/>
                <EditableRow label="USN / ID" value={profile?.usn} field="usn" isEditing={isEditing} editForm={editForm} setEditForm={setEditForm} icon={<Hash size={14}/>}/>
                <EditableRow label="College" value={profile?.college} field="college" isEditing={isEditing} editForm={editForm} setEditForm={setEditForm} icon={<GraduationCap size={14}/>}/>
                <EditableRow label="Department" value={profile?.dept} field="dept" isEditing={isEditing} editForm={editForm} setEditForm={setEditForm} icon={<Briefcase size={14}/>}/>
                <EditableRow label="Course" value={profile?.course} field="course" isEditing={isEditing} editForm={editForm} setEditForm={setEditForm} icon={<GraduationCap size={14}/>}/>
                <EditableRow label="Phone" value={profile?.phoneNumber} field="phoneNumber" isEditing={isEditing} editForm={editForm} setEditForm={setEditForm} icon={<Phone size={14}/>}/>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border border-white dark:border-slate-700 rounded-[2.5rem] p-8 md:p-10 shadow-lg dark:shadow-none min-h-[500px]">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-[#1E293B] dark:text-white flex items-center gap-3">
                  <CheckCircle size={24} className="text-[#6366F1]" /> 
                  My Participation
                </h2>
                <span className="text-slate-400 dark:text-slate-500 text-[11px] font-black uppercase tracking-widest bg-white dark:bg-slate-700 px-4 py-2 rounded-xl shadow-sm">
                  Activity Count: {appliedJobs.length}
                </span>
              </div>

              <div className="grid gap-5">
                {appliedJobs.length === 0 ? (
                  <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[3rem] bg-slate-50/50 dark:bg-transparent">
                    <p className="text-slate-400 dark:text-slate-600 font-black uppercase text-xs tracking-widest">No active participations</p>
                  </div>
                ) : (
                  appliedJobs.map((app) => (
                    <div key={app.id} className="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-[2rem] flex items-center justify-between hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-[#6366F1] dark:text-indigo-400 rounded-2xl flex items-center justify-center font-black text-xl">
                          {app.company?.[0] || app.jobTitle?.[0]}
                        </div>
                        <div>
                          <h4 className="font-black text-[#1E293B] dark:text-white text-lg leading-tight">{app.jobTitle}</h4>
                          <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 mt-1 uppercase tracking-wider">{app.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase flex items-center gap-1.5">
                          <Calendar size={12} /> {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}
                        </span>
                        <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:translate-x-1 transition-all" />
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

function EditableRow({ label, value, field, isEditing, editForm, setEditForm, icon }) {
  return (
    <div className="group transition-all">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-slate-300 dark:text-slate-600">{icon}</span>
        <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</label>
      </div>
      {isEditing ? (
        <input 
          className="w-full bg-indigo-50/50 dark:bg-slate-900/50 rounded-xl p-3 text-[#1E293B] dark:text-white font-bold text-sm outline-none border border-indigo-100 dark:border-slate-700 focus:ring-2 focus:ring-indigo-400 transition-all"
          value={editForm[field]}
          onChange={(e) => setEditForm({...editForm, [field]: e.target.value})}
        />
      ) : (
        <p className="text-[#1E293B] dark:text-slate-200 font-bold text-sm ml-6">{value || "Not Provided"}</p>
      )}
    </div>
  );
}