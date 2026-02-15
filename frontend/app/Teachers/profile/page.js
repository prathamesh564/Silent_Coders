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
  Phone,
  FileText
} from "lucide-react";

export default function FacultyProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  
  const [editForm, setEditForm] = useState({
    name: "",
    facultyId: "",
    dept: "",
    designation: "",
    college: "",
    phoneNumber: ""
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/Teachers/login");
      return;
    }

    setLoading(true);

    // 1. Setup Real-time Listener for Faculty Profile
    const profileRef = doc(db, "teachers", user.uid);
    const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile(data);
        setEditForm({
          name: data.name || "",
          facultyId: data.facultyId || "",
          dept: data.dept || "",
          designation: data.designation || "",
          college: data.college || "",
          phoneNumber: data.phoneNumber || ""
        });
      } else {
        setProfile({}); 
      }
      setLoading(false);
    }, (err) => {
      console.error("Firestore Permission Error:", err);
      setLoading(false);
    });

    // 2. Fetch Quizzes created by this Faculty
    const fetchQuizzes = async () => {
      try {
        const q = query(collection(db, "quizzes"), where("creatorId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const quizzes = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        setCreatedQuizzes(quizzes);
      } catch (err) {
        console.error("Quiz Fetch Error:", err);
      }
    };

    fetchQuizzes();
    return () => unsubscribeProfile();
  }, [user, authLoading, router]);

  async function handleUpdate() {
    try {
      const docRef = doc(db, "teachers", user.uid);
      const updatedData = {
        ...editForm,
        facultyId: editForm.facultyId.toUpperCase(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(docRef, updatedData, { merge: true });
      setIsEditing(false);
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  }

  if (authLoading || loading) return (
    <div className="flex h-screen items-center justify-center bg-[#F0F4FF] dark:bg-[#0F172A]">
      <Loader2 className="animate-spin text-indigo-500" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen w-full py-12 px-4 bg-[#F0F4FF] dark:bg-[#0F172A] transition-colors duration-500">
      <Header/>
      <div className="max-w-6xl mx-auto space-y-8 mt-10">
        
        {/* Faculty Header Card */}
        <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl border border-white dark:border-slate-700 rounded-[2.5rem] p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-lg">
              {profile?.name?.[0] || "F"}
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#1E293B] dark:text-white tracking-tight">{profile?.name || "Faculty Incharge"}</h1>
              <div className="flex items-center gap-2">
                <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border border-indigo-100 dark:border-indigo-800">
                  {profile?.facultyId || "NO ID"}
                </span>
                <span className="text-slate-400 dark:text-slate-500 font-bold text-sm">{profile?.designation}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
              className="bg-[#1E293B] dark:bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center gap-2"
            >
              {isEditing ? <><Save size={16}/> Save Profile</> : <><Edit3 size={16}/> Edit Profile</>}
            </button>
            <button onClick={logout} className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Faculty Details */}
          <div className="space-y-6">
            <div className="bg-white/50 dark:bg-slate-800/40 backdrop-blur-md border border-white dark:border-slate-700 rounded-[2.5rem] p-8 shadow-lg">
              <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <User size={14}/> Professional Identity
              </h2>
              
              <div className="space-y-6">
                <EditableRow label="Full Name" value={profile?.name} field="name" isEditing={isEditing} editForm={editForm} setEditForm={setEditForm} icon={<User size={14}/>}/>
                <EditableRow label="Faculty ID" value={profile?.facultyId} field="facultyId" isEditing={isEditing} editForm={editForm} setEditForm={setEditForm} icon={<Hash size={14}/>}/>
                <EditableRow label="Institution" value={profile?.college} field="college" isEditing={isEditing} editForm={editForm} setEditForm={setEditForm} icon={<GraduationCap size={14}/>}/>
                <EditableRow label="Department" value={profile?.dept} field="dept" isEditing={isEditing} editForm={editForm} setEditForm={setEditForm} icon={<Briefcase size={14}/>}/>
                <EditableRow label="Designation" value={profile?.designation} field="designation" isEditing={isEditing} editForm={editForm} setEditForm={setEditForm} icon={<CheckCircle size={14}/>}/>
                <EditableRow label="Contact" value={profile?.phoneNumber} field="phoneNumber" isEditing={isEditing} editForm={editForm} setEditForm={setEditForm} icon={<Phone size={14}/>}/>
              </div>
            </div>
          </div>

          {/* Quiz Contributions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border border-white dark:border-slate-700 rounded-[2.5rem] p-8 md:p-10 shadow-lg min-h-[500px]">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-[#1E293B] dark:text-white flex items-center gap-3">
                  <FileText size={24} className="text-indigo-500" /> 
                  Quiz Contributions
                </h2>
                <span className="text-slate-400 dark:text-slate-500 text-[11px] font-black uppercase tracking-widest bg-white dark:bg-slate-700 px-4 py-2 rounded-xl shadow-sm">
                  Total Managed: {createdQuizzes.length}
                </span>
              </div>

              <div className="grid gap-5">
                {createdQuizzes.length === 0 ? (
                  <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[3rem]">
                    <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No quizzes created yet</p>
                  </div>
                ) : (
                  createdQuizzes.map((quiz) => (
                    <div key={quiz.id} className="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-[2rem] flex items-center justify-between hover:border-indigo-500 transition-all duration-300">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">
                          {quiz.title?.[0]}
                        </div>
                        <div>
                          <h4 className="font-black text-[#1E293B] dark:text-white text-lg">{quiz.title}</h4>
                          <p className="text-xs font-bold text-indigo-500 mt-1 uppercase tracking-wider">{quiz.category || 'General'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-slate-400 font-black uppercase flex items-center gap-1.5">
                          <Calendar size={12} /> {quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : 'Active'}
                        </span>
                        <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-all" />
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
    <div className="group">
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
        <p className="text-[#1E293B] dark:text-slate-200 font-bold text-sm ml-6">{value || "Not Set"}</p>
      )}
    </div>
  );
}