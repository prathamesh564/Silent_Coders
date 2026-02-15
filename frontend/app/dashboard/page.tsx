"use client";
import { useEffect, useState } from "react";
import SearchBar from "../components/ui/searchbar";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";


type Job = {
  id?: string;
  title: string;
  company: string;
  location: string;
  type?: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchText, setSearchText] = useState("");
  const [domain, setDomain] = useState("");
  const [location, setLocation] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const searchJobs = async () => {
    const query = new URLSearchParams({
      search: searchText,
      domain,
      location,
    }).toString();

    try {
      const res = await fetch(`${API_URL}/jobs?${query}`);
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!API_URL) return;

    fetch(`${API_URL}/jobs`)
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error(err));
  }, [API_URL]);

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/dashboard.png')" }}
    >
      <div className="w-full">
      
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between text-black">
          <h1 className="text-2xl font-bold tracking-wide">JobFinder</h1>

          <div className="hidden md:flex gap-6 text-sm font-medium">
            <span onClick={() => router.push("/")} className="cursor-pointer hover:opacity-80">Home</span>
            <span onClick={() => router.push("/jobs")} className="cursor-pointer hover:opacity-80">Jobs</span>
            <span onClick={() => router.push("/profile")} className="cursor-pointer hover:opacity-80">Profile</span>
          </div>
        </div>

       
        <div className="bg-white/40 rounded-3xl shadow-xl w-[90%] sm:w-[420px] md:w-[1350px] mx-auto p-6 sm:p-8">
          <h1 className="text-5xl mt-10 text-blue-950 font-bold tracking-wide">
            Welcome Back
          </h1>

          <p className="py-2 text-[18px] text-gray-600">
            Find opportunities tailored to your skills, interest, and search history
          </p>

          <div className="mt-8 flex gap-4">
            <div className="px-6 py-3 hover:scale-95 bg-cyan-700 rounded-2xl text-white hover:bg-cyan-800">
              Explore Jobs
            </div>

            <div
              onClick={() => router.push("/register")}
              className="px-6 py-3 hover:scale-95 rounded-2xl border border-cyan-900 text-cyan-800 font-medium cursor-pointer transition"
            >
              Search using AI
            </div>
          </div>
        </div>

      
        <div className="text-cyan-900 text-3xl font-bold mt-20 flex justify-center">
          Recommended for you
        </div>

        <div className="flex justify-center py-3">
          Based on your profile and recent activity
        </div>

        <SearchBar
          onSearchTextChange={setSearchText}
          onDomainChange={setDomain}
          onLocationChange={setLocation}
          onSearchClick={searchJobs}
        />

      
        <div className="mt-10 max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.slice(0, 9).map((job, index) => (
            <div
              key={job.id ?? index}
              className="bg-white/90 backdrop-blur rounded-2xl p-5 shadow-md hover:shadow-xl transition"
            >
              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
              <p className="text-sm text-blue-600 mt-1">{job.company}</p>

              <div className="mt-4 text-sm text-gray-500 space-y-2">
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{job.location}</span>
                </div>

                {job.type && (
                  <div className="flex items-center gap-2">
                    <span>🕒</span>
                    <span>{job.type}</span>
                  </div>
                )}
              </div>

              <button className="mt-5 w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}