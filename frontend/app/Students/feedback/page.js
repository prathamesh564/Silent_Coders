
"use client"; 

import React from "react";

export default function FeedbackModal({ show, setShow, feedback, setFeedback }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 p-6 rounded-2xl w-96">
        <h3 className="text-xl font-bold text-white mb-4">Quick Feedback</h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter your feedback here..."
          className="w-full p-3 rounded-lg bg-slate-950 text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500"
          rows={4}
        />
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => {
              setShow(false);
              setFeedback("");
            }}
            className="py-2 px-4 rounded-lg bg-red-600 hover:bg-red-500 transition text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert("Thanks for your feedback!"); 
              setShow(false);
              setFeedback("");
            }}
            className="py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 transition text-white"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}