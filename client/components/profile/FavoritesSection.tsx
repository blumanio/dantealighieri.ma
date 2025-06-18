'use client';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Building, BookOpen, Star, Loader2, Trash2, Heart, MapPin, Plus, ChevronRight, GraduationCap } from 'lucide-react';

// --- Types ---
interface University { id: string; name: string; city: string; country: string; }
interface Course { id: string; name: string; university: University; duration: string; level: string; language: string; tuitionFee: number; }
interface Favorite { id: string; course: Course; createdAt: string; }
type FilterType = 'all' | 'masters' | 'bachelors';
interface ApiCourse { _id: string; nome: string; uni: string; comune: string; tipo: string; lingua: string; }
interface ApiFavorite { _id: string; courseId: ApiCourse | null; createdAt: string; }
interface ApiResponse { success: boolean; data: ApiFavorite[]; }


// ============================================================================
// Main Component
// ============================================================================
const StudyInItalyFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  // --- Data Fetching & Transformation ---
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/favorites');
        if (!response.ok) throw new Error("Failed to fetch favorites");

        const apiResponse: ApiResponse = await response.json();
        if (apiResponse.success && Array.isArray(apiResponse.data)) {
          const transformedData = apiResponse.data
            .filter(fav => fav.courseId)
            .map((fav): Favorite => {
              const courseData = fav.courseId!;
              const getLevel = (tipo: string) => tipo.toLowerCase().includes('magistrale') ? "Master's" : "Bachelor's";
              const getLanguage = (lingua: string) => lingua.toUpperCase() === 'EN' ? 'English' : 'Italian';
              return {
                id: fav._id, createdAt: fav.createdAt,
                course: {
                  id: courseData._id, name: courseData.nome, level: getLevel(courseData.tipo), language: getLanguage(courseData.lingua), duration: '2 Years', tuitionFee: 2500,
                  university: { id: courseData.uni, name: courseData.uni, city: courseData.comune, country: 'Italy' },
                },
              };
            });
          setFavorites(transformedData);
        } else { setFavorites([]); }
      } catch (error) { console.error('Error fetching favorites:', error); }
      finally { setLoading(false); }
    };
    fetchFavorites();
  }, []);

  // --- Actions ---
  const removeFavorite = useCallback(async (favoriteId: string) => {
    setDeletingId(favoriteId);
    try {
      const response = await fetch(`/api/favorites/${favoriteId}`, { method: 'DELETE' });
      if (response.ok) {
        setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      }
    } catch (error) { console.error('Error removing favorite:', error); }
    finally { setDeletingId(null); }
  }, []);

  // --- Memoized Calculations ---
  const filteredFavorites = useMemo(() => {
    if (filter === 'all') return favorites;
    return favorites.filter(fav => {
      const courseLevel = fav.course.level?.toLowerCase() || '';
      if (filter === 'masters') return courseLevel.includes('master');
      if (filter === 'bachelors') return courseLevel.includes('bachelor');
      return false;
    });
  }, [favorites, filter]);

  const getFilterCount = useCallback((filterType: FilterType) => {
    if (filterType === 'all') return favorites.length;
    return favorites.filter(fav => {
      const courseLevel = fav.course?.level?.toLowerCase() || '';
      if (filterType === 'masters') return courseLevel.includes('master');
      if (filterType === 'bachelors') return courseLevel.includes('bachelor');
      return false;
    }).length;
  }, [favorites]);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="w-full flex justify-center items-center p-20">
        <Loader2 size={32} className="text-blue-500 animate-spin" />
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Saved Programs</h2>
            <p className="text-sm text-slate-500 mt-1">Manage and compare programs you are interested in.</p>
          </div>
          <Link href="/courses" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors text-sm whitespace-nowrap">
            <Plus size={16} /> Add Programs
          </Link>
        </div>
        {/* Filter Controls */}
        <div className="mt-6 flex items-center gap-2">
          {[
            { key: 'all', label: 'All Programs' },
            { key: 'masters', label: 'Masters' },
            { key: 'bachelors', label: 'Bachelors' }
          ].map((tab) => (
            <button key={tab.key} onClick={() => setFilter(tab.key as FilterType)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === tab.key
                ? 'bg-blue-100 text-blue-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}>
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${filter === tab.key ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-slate-500'}`}>
                {getFilterCount(tab.key as FilterType)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-2 sm:p-4">
        {filteredFavorites.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {filter !== 'all' ? 'No programs match your filter' : 'No saved programs yet'}
            </h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              {filter !== 'all' ? 'Try selecting a different filter or adding new programs.' : 'Start exploring Italian universities and save programs that interest you.'}
            </p>
            <Link href="/courses" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white font-semibold rounded-lg shadow-sm hover:bg-slate-900 transition-colors">
              <BookOpen size={18} /> Explore Programs
            </Link>
          </div>
        ) : (
          <div className="flow-root">
            <ul className="divide-y divide-slate-100">
              {filteredFavorites.map((favorite) => (
                <li key={favorite.id} className="p-4 hover:bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{favorite.course.name}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                        <span className="inline-flex items-center gap-1.5"><Building size={12} /> {favorite.course.university.name}</span>
                        <span className="inline-flex items-center gap-1.5"><MapPin size={12} /> {favorite.course.university.city}</span>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${favorite.course.level.toLowerCase().includes('master') ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {favorite.course.level}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {favorite.course.language}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/courses/${favorite.course.id}`} className="px-3 py-2 text-sm font-semibold text-white bg-slate-800 rounded-md hover:bg-slate-900 transition-colors">
                        Details
                      </Link>
                      <button onClick={() => removeFavorite(favorite.id)} disabled={deletingId === favorite.id} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors">
                        {deletingId === favorite.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyInItalyFavorites;