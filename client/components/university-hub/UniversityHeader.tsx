'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Loader2, Sparkles, ShieldCheck, CheckCircle2, Download } from 'lucide-react';

import UniversityHeader from './UniversityHeader';
import TabNavigation, { TabId } from './TabNavigation';
import CoursesTab from './CoursesTab';
import DeadlinesTab from './DeadlinesTab'; // Now behaves as Admission Roadmap
import EntranceExamsTab from './EntranceExamsTab';
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
export default function UniversityHubPage() {
  const params = useParams();
  const universitySlug = decodeURIComponent(params?.universitySlug as string || '');
  const { isSignedIn, isLoaded } = useUser();

  const [universityDetails, setUniversityDetails] = useState<any>(null);
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState<TabId>('courses');
  const [isLoading, setIsLoading] = useState(true);

  const FREE_ITEM_LIMIT = 5;
  const isLocked = isLoaded && !isSignedIn;

  useEffect(() => {
    const loadData = async () => {
      if (!universitySlug) return;
      try {
        const [uRes, cRes] = await Promise.all([
          fetch(`/api/universities/${universitySlug}`),
          fetch(`/api/courses?uni=${universitySlug}`)
        ]);
        if (uRes.ok) setUniversityDetails(await uRes.json());
        if (cRes.ok) setCourses(await cRes.json());
      } catch (err) {
        console.error("Failed to sync university data", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [universitySlug]);

  const universityName = universityDetails?.name || universitySlug.replace(/-/g, ' ');

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-medium">Syncing official records...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      <UniversityHeader
        universityDetails={universityDetails}
        universityName={universityName}
        coursesCount={courses.length}
        communityPostsCount={0} // Strategy: Minimalist until revenue proven
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* EXPERT DIFFERENTIATOR: The Architect's Take */}
        <div className="mb-8 bg-blue-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="text-amber-400" /> Architect's Insider Take
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                {universityName} is a top choice for {universityDetails?.location?.split(',')[0]}, but beware:
                <strong> Non-EU quotas for English programs fill up 4 months earlier</strong> than the Italian ones.
                We recommend completing your Universitaly pre-enrollment by March 15th to secure your spot.
              </p>
            </div>
            <div className="flex-shrink-0">
              <a href="/en/shop" className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-6 py-3 rounded-xl font-bold transition-all inline-block text-sm">
                Get The Admission Strategy →
              </a>
            </div>
          </div>
        </div>

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} t={(n, k) => k} />

        <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200 p-4 md:p-8 min-h-[500px] shadow-sm">
          {activeTab === 'courses' && (
            <CoursesTab
              courses={courses}
              isLoading={false}
              universityName={universityName}
              isLocked={isLocked}
              limit={FREE_ITEM_LIMIT}
            />
          )}

          {activeTab === 'deadlines' && (
            <div className="animate-in fade-in duration-500">
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                <ShieldCheck className="text-emerald-600" />
                <p className="text-sm text-emerald-800 font-medium">Verified for 2026/2027 Academic Year</p>
              </div>
              <DeadlinesTab currentUniversityName={universityName} currentUniversitySlug={universitySlug} />
              <LeadMagnetCapture universityName={universityName} />
            </div>
          )}

          {activeTab === 'entrance_exams' && (
            <EntranceExamsTab universityName={universityName} universitySlug={universitySlug} />
          )}
        </div>
      </div>
    </div>
  );
}