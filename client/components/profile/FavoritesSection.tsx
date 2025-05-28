'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building, BookOpen, Star, Loader2, Trash2 } from 'lucide-react'; // Added Loader2, Trash2
// Adjust path if types moved. This type represents the structure from your DB's Favorite model.
// type FavoriteCourse = {
//   _id: string;
//   courseLink: string;
//   courseNome: string;
//   courseUni: string;
//   courseComune: string; // You might want to display this too
//   // ... any other fields you stored and want to display
// };
// Or import from a shared types file if you create one e.g. from the FavoriteItem type above
type FavoriteFromAPI = {
  _id: string;
  userId: string;
  courseUni: string;
  courseNome: string;
  courseLink: string;
  courseComune: string;
  createdAt: string;
  updatedAt: string;
};


// Assuming FavoriteUniversity is a separate concern for now and its data source is different
export interface FavoriteUniversity {
  id: string;
  name: string;
  logoUrl?: string;
  link: string;
  city: string;
}

interface FavoritesSectionProps {
  // universities prop can remain if it's fetched separately or is static
  universities: FavoriteUniversity[];
  t: (namespace: string, key: string, options?: any) => string;
}

const FavoritesSection: React.FC<FavoritesSectionProps> = ({ universities, t }) => {
  const [favoriteCourses, setFavoriteCourses] = useState<FavoriteFromAPI[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [errorCourses, setErrorCourses] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchFavoriteCourses = async () => {
    setIsLoadingCourses(true);
    setErrorCourses(null);
    try {
      const response = await fetch('/api/favorites');
      const result = await response.json();
      if (response.ok && result.success) {
        setFavoriteCourses(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch favorite courses');
      }
    } catch (err: any) {
      setErrorCourses(err.message);
      console.error(err);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchFavoriteCourses();
  }, []);

  const handleRemoveCourse = async (favoriteId: string) => {
    if (window.confirm(t('profile', 'favoritesConfirmRemoveCourse'))) {
      setRemovingId(favoriteId);
      try {
        const response = await fetch(`/api/favorites?id=${favoriteId}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        if (response.ok && result.success) {
          setFavoriteCourses(prev => prev.filter(course => course._id !== favoriteId));
          // Optionally show a success toast/message
        } else {
          throw new Error(result.message || 'Failed to remove course');
        }
      } catch (err: any) {
        alert(`${t('profile', 'favoritesRemoveError')}: ${err.message}`); // Simple alert for error
        console.error(err);
      } finally {
        setRemovingId(null);
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-neutral-700 mb-6">{t('profile', 'favoritesTitle')}</h2>

      {/* Favorite Universities (existing logic, assuming data passed as prop) */}
      <div className="mb-8">
        <h3 className="text-xl font-medium text-neutral-600 mb-4 flex items-center gap-2">
          <Building size={22} className="text-primary" /> {t('profile', 'favoritesUniversities')}
        </h3>
        {universities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {universities.map(uni => (
              <div key={uni.id} className="bg-neutral-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
                {uni.logoUrl ? <img src={uni.logoUrl} alt={uni.name} className="w-12 h-12 rounded-md object-contain flex-shrink-0" /> : <div className="w-12 h-12 bg-neutral-200 rounded-md flex items-center justify-center text-neutral-400 flex-shrink-0"><Building size={24} /></div>}
                <div className="flex-grow">
                  <a href={uni.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline text-base">{uni.name}</a>
                  <p className="text-xs text-neutral-500">{uni.city}</p>
                </div>
                <button title={t('profile', 'favoritesRemove')} className="text-red-500 hover:text-red-700 p-1"> <Star size={18} fill="currentColor" /> </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 text-sm">
            {t('profile', 'favoritesNoUniversities')} {' '}
            <Link href="/program-search" className="text-primary hover:underline">
              {t('profile', 'favoritesExploreNow')}
            </Link>
          </p>
        )}
      </div>

      {/* Favorite Courses */}
      <div>
        <h3 className="text-xl font-medium text-neutral-600 mb-4 flex items-center gap-2">
          <BookOpen size={22} className="text-primary" /> {t('profile', 'favoritesCourses')}
        </h3>
        {isLoadingCourses && (
          <div className="flex justify-center items-center py-6">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        )}
        {errorCourses && !isLoadingCourses && (
          <p className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
            {t('profile', 'favoritesLoadError', { message: errorCourses })}
          </p>
        )}
        {!isLoadingCourses && !errorCourses && favoriteCourses.length > 0 && (
          <div className="space-y-3">
            {favoriteCourses.map(course => (
              <div key={course._id} className="bg-neutral-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4">
                <div className="flex-grow">
                  <a href={course.courseLink} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline text-base line-clamp-2">
                    {course.courseNome}
                  </a>
                  <p className="text-xs text-neutral-500 mt-1">
                    {course.courseUni} - {course.courseComune} {/* Adjust if you have degreeType */}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveCourse(course._id)}
                  disabled={removingId === course._id}
                  title={t('profile', 'favoritesRemoveCourse')}
                  className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-100 transition-colors self-start sm:self-center disabled:opacity-50"
                >
                  {removingId === course._id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                </button>
              </div>
            ))}
          </div>
        )}
        {!isLoadingCourses && !errorCourses && favoriteCourses.length === 0 && (
          <p className="text-neutral-500 text-sm">
            {t('profile', 'favoritesNoCourses')} {' '}
            <Link href="/program-search" className="text-primary hover:underline">
              {t('profile', 'favoritesExploreNow')}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default FavoritesSection;