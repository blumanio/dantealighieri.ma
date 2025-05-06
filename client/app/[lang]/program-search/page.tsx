'use client';

import { useSearchParams } from 'next/navigation';
import ProgramSearch from '@/components/ProgramSearch';
import { LanguageProvider } from '../LanguageContext';

export default function SearchPage() {
  const searchParams = useSearchParams();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-neutral-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-poppins">
            Find Your Perfect Program
          </h1>
          <p className="text-lg text-textSecondary max-w-2xl mx-auto">
            Search through our comprehensive database of Italian university programs
          </p>
        </div>

        {/* Search Container */}
        <div className="bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 p-6 md:p-8">
          <ProgramSearch 
            initialFilters={{
              degreeType: searchParams?.get('degreeType') || '',
              accessType: searchParams?.get('accessType') || '',
              courseLanguage: searchParams?.get('courseLanguage') || '',
              academicArea: searchParams?.get('academicArea') || ''
            }} 
          />
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Bottom Section - Optional Tips or Info */}
      <div className="mt-12 pb-8 text-center">
        <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary/5 text-primary">
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <span className="text-sm font-medium">
            Pro tip: Use filters to narrow down your search results
          </span>
        </div>
      </div>
    </main>
  );
}