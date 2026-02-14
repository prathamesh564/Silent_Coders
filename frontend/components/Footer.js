"use Client";
import React from "react";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg mb-4">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white text-xs">Q</div>
              QuizMaster
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              The ultimate testing ground for modern developers.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-sm dark:text-slate-400">Product</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="hover:text-indigo-600 cursor-pointer dark:text-slate-400 transition-colors">Find Quiz</li>
              <li className="hover:text-indigo-600 cursor-pointer dark:text-slate-400 transition-colors">Skill Verify</li>
              <li className="hover:text-indigo-600 cursor-pointer dark:text-slate-400 transition-colors">Leaderboard</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-sm dark:text-slate-400">Company</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="hover:text-indigo-600 cursor-pointer dark:text-slate-400 transition-colors">About Us</li>
              <li className="hover:text-indigo-600 cursor-pointer dark:text-slate-400 transition-colors">Privacy Policy</li>
              <li className="hover:text-indigo-600 cursor-pointer dark:text-slate-400 transition-colors">Contact</li>
            </ul>
          </div>

          {/* Socials Column */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-sm dark:text-slate-400">Connect</h4>
            <div className="flex gap-4">
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
              <SocialIcon icon={<Github size={18} />} />
              <SocialIcon icon={<Mail size={18} />} />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 ">
            © {new Date().getFullYear()} QuizMaster Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer dark:text-slate-400">Terms</span>
            <span className="hover:text-slate-600 cursor-pointer dark:text-slate-400">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }) {
  return (
    <button className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all">
      {icon}
    </button>
  );
}