import React from 'react';
import { Link } from 'react-router-dom';

export default function DreamerQuiz() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4 text-teal-400">Dreamer Quiz</h1>
      <p className="text-slate-400 mb-6 max-w-md text-center">
        Explore engineering paths and stream preferences aligned with your interests.
      </p>
      <Link 
        to="/portals" 
        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm transition-colors"
      >
        ← Back to Portals
      </Link>
    </div>
  );
}