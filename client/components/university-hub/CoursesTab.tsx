// components/university-hub/CoursesTab.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { BookOpen, Loader2, Search, Filter, GraduationCap, Globe, X, CheckCircle2, Download } from 'lucide-react';
import PaginatedCourses from '@/components/PaginatedCourses';
const LeadMagnetCapture = ({ universityName }: { universityName: string }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return (
    <div className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center animate-in fade-in zoom-in duration-300">
      <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
      <h3 className="text-base font-bold text-emerald-900">Calculator Sent!</h3>
      <p className="text-sm text-emerald-700">Check your email for your personalized {universityName} report.</p>
    </div>
  );

  return (
    <div className="mt-12 p-8 bg-slate-900 rounded-2xl text-white relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 p-4 opacity-10"><Download size={120} /></div>
      <div className="relative z-10 max-w-lg">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Free Tool</span>
        <h3 className="text-2xl font-bold mt-2 mb-3">2026 Scholarship Calculator</h3>
        <p className="text-slate-400 text-sm mb-6">
          Calculate your ISEE-U score and see which regional scholarships you qualify for at {universityName}.
        </p>
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email" placeholder="Email address" required
            className="flex-1 px-4 py-3 rounded-xl text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-500 transition-all whitespace-nowrap shadow-lg">
            Send My Report
          </button>
        </form>
      </div>
    </div>
  );
};

interface Course {
  _id: string;
  nome: string;
  link: string;
  tipo: string;       // e.g. "Laurea Magistrale", "Laurea"
  uni: string;
  accesso: string;    // e.g. "Libero", "Programmato"
  area: string;
  lingua: string;     // e.g. "inglese", "italiano"
  comune: string;
  uniSlug?: string;
}

interface CoursesTabProps {
  courses: Course[];
  isLoading: boolean;
  universityName: string;
}

export default function CoursesTab({ courses, isLocked, limit, universityName }: any) {
  const visibleCourses = useMemo(() => {
    return isLocked ? courses.slice(0, limit) : courses;
  }, [courses, isLocked, limit]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Programs for International Students</h2>
        <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {courses.length} Degrees Available
        </div>
      </div>

      <div className={isLocked ? "relative" : ""}>
        <div className={isLocked ? "blur-[3px] pointer-events-none select-none max-h-[600px] overflow-hidden" : ""}>
          {/* Render existing PaginatedCourses logic here using visibleCourses */}
          <div className="grid gap-4">
            {visibleCourses.map((c: any) => (
              <div key={c._id} className="p-4 border rounded-xl flex justify-between items-center hover:bg-slate-50">
                <div>
                  <h4 className="font-bold">{c.nome}</h4>
                  <p className="text-xs text-slate-500 uppercase font-bold">{c.lingua} • {c.tipo}</p>
                </div>
                <button className="text-blue-600 font-semibold text-sm">View Details →</button>
              </div>
            ))}
          </div>
        </div>

        {isLocked && (
          <div className="absolute inset-x-0 bottom-0 h-full flex flex-col items-center justify-center bg-gradient-to-t from-white via-white/80 to-transparent pt-32 pb-12 text-center z-10">
            <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 max-w-md mx-4">
              <h3 className="text-xl font-bold mb-2">Unlock {courses.length - limit} more programs</h3>
              <p className="text-slate-600 mb-6 text-sm">
                See the full list of English-taught programs, seat quotas for Non-EU, and direct application links.
              </p>
              <a href="/sign-up" className="w-full block py-3 px-6 bg-slate-900 text-white font-bold rounded-xl mb-4">
                Create Free Account to Unlock
              </a>
              <p className="text-xs text-slate-400">Join 5,000+ students applying to Italy this year.</p>
            </div>
          </div>
        )}
      </div>

      {!isLocked && <LeadMagnetCapture universityName={universityName} />}
    </div>
  );
}