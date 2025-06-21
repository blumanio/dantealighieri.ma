'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, BookOpen, Building, ArrowRight, Lock, Sparkles } from 'lucide-react';
import { Translation } from '@/app/i18n/types';

// --- Configurable Constants ---
const FREE_COURSES_LIMIT = 3;
const XP_PER_UNLOCKED_COURSE = 5;

// --- Types ---
interface Course {
  _id: string;
  nome: string;
  link: string;
  tipo: string;
  uni: string;
  uniSlug?: string;
  area: string;
  lingua: string;
}

interface SuggestedCoursesProps {
  t: (namespace: keyof Translation, key: string, interpolations?: Record<string, string | number>) => string;
}

interface AcademicArea {
  id: string;
  name: string;
}

// --- API Fetch Functions ---
const fetchSuggestedCourses = async (
  academicAreas: AcademicArea[],
  targetUniversities: string[]
): Promise<Course[]> => {
  const params = new URLSearchParams();

  if (academicAreas.length > 0) {
    const areaIds = academicAreas.map(area => area.id).filter(Boolean);
    params.append('area', areaIds.join(','));
  }

  if (targetUniversities.length > 0) {
    params.append('universities', targetUniversities.join(','));
  }

  const apiUrl = `/api/courses?${decodeURIComponent(params.toString())}`;

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch suggested courses');
  }

  return response.json();
};

const fetchUserXP = async (): Promise<number> => {
  const response = await fetch('/api/dashboard');
  if (!response.ok) throw new Error('Failed to fetch user XP');
  const data = await response.json();
  return data?.data?.userStats?.xp ?? 0;
};

// --- Course Card ---
const CourseCard = ({
  course,
  isBlurred,
  xpRequired,
}: {
  course: Course;
  isBlurred: boolean;
  xpRequired?: number;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
    className="group relative bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
  >
    <div className={`p-4 ${isBlurred ? 'blur-[2px]' : ''}`}>
      <h3 className="font-medium text-gray-900 text-sm leading-tight mb-2 group-hover:text-blue-600 transition-colors">
        {course.nome}
      </h3>
      <div className="flex items-center text-xs text-gray-500 mb-1">
        <Building size={12} className="mr-1.5" />
        <span className="truncate">{course.uni}</span>
      </div>
      <div className="text-xs text-gray-400">{course.tipo}</div>
    </div>

    {isBlurred && (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[1px] rounded-lg text-center p-3">
        <Lock size={16} className="text-gray-400 mb-1" />
        <p className="text-xs text-gray-500 font-medium">
          Unlock with {xpRequired} XP
        </p>
      </div>
    )}

    {!isBlurred && (
      <a
        href={course.link}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-md bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600"
      >
        <ArrowRight size={12} />
      </a>
    )}
  </motion.div>
);

// --- Main Component ---
const SuggestedCourses = ({ t }: SuggestedCoursesProps) => {
  const { user, isLoaded } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(FREE_COURSES_LIMIT);

  useEffect(() => {
    const load = async () => {
      try {
        if (!user) {
          setIsLoading(false);
          return;
        }

        const academicAreasRaw = (user.publicMetadata?.academicAreas || []) as AcademicArea[];
        const targetUniversities = (user.publicMetadata?.targetUniversities || []) as string[];

        if (academicAreasRaw.length === 0 && targetUniversities.length === 0) {
          setIsLoading(false);
          return;
        }

        const [fetchedCourses, userXP] = await Promise.all([
          fetchSuggestedCourses(academicAreasRaw, targetUniversities),
          fetchUserXP(),
        ]);

        const extraUnlocked = Math.floor(userXP / XP_PER_UNLOCKED_COURSE);
        setVisibleCount(FREE_COURSES_LIMIT + extraUnlocked);
        setCourses(fetchedCourses);
      } catch (err) {
        console.error('Load error:', err);
        setError('Failed to load suggested courses.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded) load();
  }, [isLoaded, user]);

  const visibleCourses = useMemo(() => courses.slice(0, visibleCount), [courses, visibleCount]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-500 mr-3" size={18} />
          <span className="text-gray-600 text-sm">Loading suggestions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <span className="text-red-600 text-sm">{error}</span>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
        <Sparkles size={24} className="text-gray-400 mx-auto mb-3" />
        <h3 className="text-gray-800 font-medium mb-1">No suggestions available</h3>
        <p className="text-gray-500 text-sm">
          Add academic areas and universities to your profile for personalized course recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-blue-600" />
          <h2 className="font-semibold text-gray-900">
            {t('profile', 'yourRecommendedCourses')}
          </h2>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {t('profile', 'theseCoursesMatchYourGoalsAndInterests')}
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {courses.map((course, index) => {
              const isBlurred = index >= visibleCount;
              const xpRequired = isBlurred
                ? (index - FREE_COURSES_LIMIT + 1) * XP_PER_UNLOCKED_COURSE
                : undefined;

              return (
                <CourseCard
                  key={course._id}
                  course={course}
                  isBlurred={isBlurred}
                  xpRequired={xpRequired}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SuggestedCourses;
