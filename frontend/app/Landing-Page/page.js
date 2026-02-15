"use client";

import FeatureCard from "../components/ui/feature-card";
import { useRouter } from "next/navigation";
import Header from "../components/Header";


export default function Landing() {
 const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header/>
      <div className=" grid grid-cols-2 items-center py-14 px-14">
        <div>
          <h1 className="text-[40px] text-blue-950 font-bold">
            Land your Dream Job <br /> with{" "}
            <span className="text-blue-700">AI-Powered</span> Job Matching
          </h1>
          <h4 className="text-[20px] py-7">
            Find the best jobs tailered to you with AI-driven <br />
            recommendations and easy application tracking
          </h4>
          <button onClick={() => router.push("/login")}
          className="bg-green-700 hover:scale-95 hover:bg-green-700 px-6 py-3 text-white text-[16px] rounded-2xl">
            Get Started
          </button>
          <button className="ml-10 border-2 px-6 py-3 rounded-2xl hover:scale-90">
            Watch Demo
          </button>
        </div>
        <div>
          <img
            src="/hero.png"
            alt="Image not found"
            className="w-max rounded-2xl"
          />
        </div>
      </div>
      <div>
        <div className="flex flex-col   ">
          <div className=" flex items-center justify-center text-3xl font-[Marcellus] tracking-wider ">
            Your Carrer , SuperCharged With AI
          </div>
          <div className=" grid grid-cols-3 px-60 py-16">
            <FeatureCard
              image="/robot.png"
              title="AI Job Matching"
              desc="Get personalized job recommendations  "
            />
            <FeatureCard
              image="/search.png"
              title="Smart Job Search"
              desc="FIlter and find the best opportunities"
            />
            <FeatureCard
              image="/application.png"
              title="Application Tracking "
              desc="Manage and track your job applications"
            />
          </div>
          </div>
<div className=" flex justify-center mt-10 mb-36 ">
   <div className="bg-white rounded-xl shadow-xl px-5 py-6  w-[550px] flex  ">
            <img src="/person.png" className="w-14 h-14" />
            This platform helped me land the perfect job in record time
            <br />
            -Sarah W., Marketing Specialist
          </div>
</div>
         
        </div>
        <div></div>
        <div className=" flex flex-col items-center py-6 px-9">
       
           <h1 className="text-[40px] text-blue-950 font-bold">
            Ready to SuperCharge Your  
            <span className="text-blue-700">  Dream</span> Job
          </h1>
    <h4 className="text-[20px] py-2 px-6">
        Sign up today and discover jobs tailored just for you!
          </h4>
          <button onClick={() => router.push("/login")}  className="bg-green-700 hover:scale-95 hover:bg-green-700 px-6 py-3 text-white text-[16px] rounded-2xl "> Get Started </button>
        </div>
      
    </div>
  );
}