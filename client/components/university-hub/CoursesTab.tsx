// components/university-hub/CoursesTab.tsx
'use client';

import React from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import PaginatedCourses from '@/components/PaginatedCourses';

interface Course {
  _id: string;
  nome: string;
  link: string;
  tipo: string;
  uni: string;
  accesso: string;
  area: string;
  lingua: string;
  comune: string;
  uniSlug?: string;
}

interface CoursesTabProps {
  courses: Course[];
  isLoading: boolean;
  universityName: string;
}

const CoursesTab: React.FC<CoursesTabProps> = ({ courses, isLoading, universityName }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 rounded-2xl">
            <BookOpen className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900">
              Courses Offered
            </h2>
            <p className="text-slate-600">
              Discover {courses.length} available programs
            </p>
          </div>
        </div>
        {isLoading && courses.length === 0 && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
            <span className="text-sm text-slate-600">Loading courses...</span>
          </div>
        )}
      </div>

      {!isLoading && courses.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="p-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl mb-6">
              <BookOpen className="h-16 w-16 text-slate-400 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No Courses Listed</h3>
            <p className="text-slate-600">
              Course information for {universityName} is not yet available.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-2xl p-6">
          <PaginatedCourses filteredCourses={courses} />
        </div>
      )}
    </div>
  );
};

export default CoursesTab;