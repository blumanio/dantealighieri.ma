'use client';

import { useEffect, useState, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import UniversityCard from '@/components/UniversityCard';
import LeadMagnetSidebar from '@/components/LeadMagnetSidebar';
import { 
  Search, Filter, Lock, Loader2, AlertCircle, 
  CheckCircle, BookOpen 
} from 'lucide-react';

// Type definition based on your API response
export interface University {
  _id: string;
  name: string;
  location: string;
  images?: string[];
  admission_fee?: number;
  slug?: string;
  acceptance_rate?: string; // If you have this data
  description?: string;
}

export default function UniversitiesPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');

  // 1. DATA FETCHING (Restored from your original working code)
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/universities');
        
        if (!res.ok) throw new Error('Failed to fetch data');
        
        const json = await res.json();
        
        if (json.success) {
          setUniversities(json.data);
        } else {
          setUniversities([]);
          setError(json.message || 'Failed to load universities');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // 2. FILTERING LOGIC
  const filteredUniversities = useMemo(() => {
    if (!searchTerm) return universities;
    const lower = searchTerm.toLowerCase();
    return universities.filter(u => 
      u.name.toLowerCase().includes(lower) || 
      u.location?.toLowerCase().includes(lower)
    );
  }, [universities, searchTerm]);

  // 3. GATING LOGIC (The Strategy)
  // If user is NOT signed in, we only show top 5 results.
  // We check 'isLoaded' to prevent flashing the locked state while Clerk loads.
  const FREE_LIMIT = 5;
  const isLocked = isLoaded && !isSignedIn;
  
  // The list we actually render
  const visibleList = isLocked 
    ? filteredUniversities.slice(0, FREE_LIMIT) 
    : filteredUniversities;

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* HEADER: Trust & SEO Context */}
      <div className="bg-white border-b border-slate-200 pt-12 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Study in Italy: <span className="text-blue-700">English Programs Directory</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mb-6">
            We track acceptance rates, tuition fees, and IMAT requirements for international students.
            <span className="block mt-2 text-sm font-medium text-emerald-700 bg-emerald-50 w-fit px-2 py-1 rounded">
              Verified for 2025/2026 Admissions
            </span>
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by university name or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-12 gap-8">
        
        {/* MAIN CONTENT (List) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-600" />
              <p>Loading university data...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}

          {/* Data List */}
          {!isLoading && !error && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                {visibleList.length > 0 ? (
                  visibleList.map((uni, index) => (
                    <UniversityCard 
                      key={uni._id} 
                      university={uni} 
                      index={index} // Used to add "Top Choice" badge to first few
                    />
                  ))
                ) : (
                  <div className="p-12 text-center text-slate-500">
                    No universities found matching "{searchTerm}"
                  </div>
                )}
              </div>

              {/* THE GATE: Blurred Bottom Section */}
              {isLocked && filteredUniversities.length > FREE_LIMIT && (
                <div className="relative">
                  {/* Fake Blurred Rows */}
                  <div className="h-48 bg-slate-50 opacity-50 blur-sm pointer-events-none" />
                  
                  {/* Lock Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-white via-white/80 to-transparent p-6 text-center">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-md">
                      <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        <Lock className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        Unlock {filteredUniversities.length - FREE_LIMIT} More Universities
                      </h3>
                      <p className="text-slate-600 mb-6 text-sm">
                        Create a free account to view the full list, including hidden acceptance rates and scholarship details.
                      </p>
                      
                      {/* Simple Sign Up Button (No Redirect Logic Needed for simple version) */}
                      <a 
                        href="/sign-up"
                        className="block w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-md"
                      >
                        Access Full Database (Free)
                      </a>
                      <p className="mt-3 text-xs text-slate-500">
                        Already have an account? <a href="/sign-in" className="text-blue-600 hover:underline">Log in</a>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SIDEBAR (Monetization & Lead Gen) */}
        <div className="lg:col-span-4">
          <div className="sticky top-8 space-y-6">
            <LeadMagnetSidebar />
          </div>
        </div>

      </div>
    </div>
  );
}