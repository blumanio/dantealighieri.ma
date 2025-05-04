'use client';

import { UniversityTable, University } from '@/components/UniversityTable';
import { italianUniversities } from '../../../lib/data';
import { useUser } from '@clerk/nextjs';

// Keep existing validation functions...
const validateUniversities = (data: any[]): University[] => {
  return data.map(uni => ({
    ...uni,
    status: validateStatus(uni.status),
    programs_offered: uni.programs_offered?.map((program: any) => ({
      ...program,
      type: validateProgramType(program.type)
    })) || []
  }));
};

const validateStatus = (status: string): 'Open' | 'Closed' | 'Coming Soon' => {
  const validStatuses = ['Open', 'Closed', 'Coming Soon'] as const;
  if (validStatuses.includes(status as any)) {
    return status as 'Open' | 'Closed' | 'Coming Soon';
  }
  return 'Coming Soon';
};

const validateProgramType = (type: string): 'Bachelor' | 'Master' => {
  return type === 'Master' ? 'Master' : 'Bachelor';
};

export default function UniversitiesPage() {
  const { isSignedIn } = useUser();
  const validatedUniversities = validateUniversities(italianUniversities);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-poppins">
            Italian Universities
          </h1>
          <p className="text-lg text-textSecondary max-w-2xl mx-auto">
            Explore our comprehensive list of partner universities in Italy
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300">
          <UniversityTable
            universities={validatedUniversities}
            isSignedIn={isSignedIn ?? false}
          />
        </div>

        {/* Info Section */}
        <div className="mt-8 text-center">
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
              {isSignedIn
                ? "Click on a university to see detailed information"
                : "Sign in to access detailed university information"}
            </span>
          </div>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}