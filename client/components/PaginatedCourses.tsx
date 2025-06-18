import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  ChevronLeft, ChevronRight, BookOpen, Filter,
  Search, Award, Globe, Star, Zap, TrendingUp
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import CourseCard from './CourseCard.tsx';

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
  viewCount?: number;
  favoriteCount?: number;
  trackedCount?: number;
}

interface UserFavorite {
  _id: string;
  courseId: string;
}

interface UserTrackedItem {
  _id: string;
  courseId: string;
}

interface PaginatedCoursesProps {
  filteredCourses: Course[];
  userFavorites?: UserFavorite[];
  userTrackedItems?: UserTrackedItem[];
  onFavoriteToggle?: (courseId: string, isFavorite: boolean, favoriteId: string | null) => void;
  onTrackToggle?: (courseId: string, isTracked: boolean, trackedItemId: string | null) => void;
  onViewIncrement?: (courseId: string) => void;
}

const PaginatedCourses: React.FC<PaginatedCoursesProps> = ({ 
  filteredCourses,
  userFavorites = [],
  userTrackedItems = [],
  onFavoriteToggle,
  onTrackToggle,
  onViewIncrement
}) => {
  const { isSignedIn } = useUser();
  const { t } = useLanguage();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const coursesPerPage = 12;

  // Filter courses based on search and filters
  const filteredAndSearchedCourses = filteredCourses.filter(course => {
    const matchesSearch = !searchTerm ||
      course.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.comune.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = !selectedType || course.tipo === selectedType;
    const matchesArea = !selectedArea || course.area === selectedArea;
    const matchesLanguage = !selectedLanguage || course.lingua === selectedLanguage;

    return matchesSearch && matchesType && matchesArea && matchesLanguage;
  });

  const totalPages = Math.ceil(filteredAndSearchedCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredAndSearchedCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Get unique values for filters
  const uniqueTypes = Array.from(new Set(filteredCourses.map(course => course.tipo))).filter(Boolean);
  const uniqueAreas = Array.from(new Set(filteredCourses.map(course => course.area))).filter(Boolean);
  const uniqueLanguages = Array.from(new Set(filteredCourses.map(course => course.lingua))).filter(Boolean);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedArea, selectedLanguage]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedArea('');
    setSelectedLanguage('');
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const delta = 2;
    const pages = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      pages.push(i);
    }

    if (currentPage - delta > 2) {
      pages.unshift('...');
    }
    if (currentPage + delta < totalPages - 1) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.unshift(1);
      if (totalPages !== 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Helper function to get user's favorite/tracked status for a course
  const getCourseUserStatus = (courseId: string) => {
    const userFavorite = userFavorites.find(fav => fav.courseId === courseId);
    const userTrackedItem = userTrackedItems.find(item => item.courseId === courseId);
    
    return {
      isFavorite: !!userFavorite,
      favoriteId: userFavorite?._id || null,
      isTracked: !!userTrackedItem,
      trackedItemId: userTrackedItem?._id || null
    };
  };

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-slate-900 to-emerald-800 bg-clip-text text-transparent">
            {t('universityHubs', 'availableCourses', { defaultValue: 'Available Courses' })}
          </h2>
        </div>
        <p className="text-slate-600 text-lg">
          {t('universityHubs', 'discoverPrograms', { 
            count: filteredAndSearchedCourses.length, 
            defaultValue: `Discover ${filteredAndSearchedCourses.length} programs tailored for your academic journey` 
          })}
        </p>
      </div>

      {/* Premium Search and Filters */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('universityHubs', 'searchCoursesPlaceholder', { defaultValue: 'Search courses, areas, or cities...' })}
            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 transition-all duration-300"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              ×
            </button>
          )}
        </div>

        {/* Filters Toggle */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${showFilters
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
          >
            <Filter className="h-5 w-5" />
            {t('universityHubs', 'advancedFilters', { defaultValue: 'Advanced Filters' })}
            <div className={`h-4 w-4 transform transition-transform ${showFilters ? 'rotate-90' : ''}`}>
              ▶
            </div>
          </button>

          {(searchTerm || selectedType || selectedArea || selectedLanguage) && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-xl transition-all duration-300"
            >
              <Zap className="h-4 w-4" />
              {t('filters', 'clearAll', { defaultValue: 'Clear All' })}
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
            {/* Area Filter */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Star className="h-4 w-4 text-blue-600" />
                {t('filters', 'studyArea', { defaultValue: 'Study Area' })}
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all duration-300"
              >
                <option value="">{t('filters', 'allAreas', { defaultValue: 'All Areas' })}</option>
                {uniqueAreas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Award className="h-4 w-4 text-green-600" />
                {t('filters', 'courseType', { defaultValue: 'Course Type' })}
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 bg-white transition-all duration-300"
              >
                <option value="">{t('filters', 'allTypes', { defaultValue: 'All Types' })}</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4 text-purple-600" />
                {t('filters', 'language', { defaultValue: 'Language' })}
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white transition-all duration-300"
              >
                <option value="">{t('filters', 'allLanguages', { defaultValue: 'All Languages' })}</option>
                {uniqueLanguages.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      {filteredAndSearchedCourses.length > 0 && (
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-900">
                {t('universityHubs', 'coursesFound', { 
                  count: filteredAndSearchedCourses.length,
                  defaultValue: `${filteredAndSearchedCourses.length} Course${filteredAndSearchedCourses.length !== 1 ? 's' : ''} Found`
                })}
              </h3>
              <p className="text-sm text-emerald-700">
                {t('universityHubs', 'pageInfo', { 
                  current: currentPage, 
                  total: totalPages,
                  defaultValue: `Page ${currentPage} of ${totalPages}`
                })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-emerald-700 font-semibold">
              {t('universityHubs', 'showingResults', {
                start: indexOfFirstCourse + 1,
                end: Math.min(indexOfLastCourse, filteredAndSearchedCourses.length),
                defaultValue: `Showing ${indexOfFirstCourse + 1}-${Math.min(indexOfLastCourse, filteredAndSearchedCourses.length)} results`
              })}
            </div>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      {currentCourses.length > 0 ? (
        <div className="space-y-4">
          {currentCourses.map((course: Course, index) => {
            const userStatus = getCourseUserStatus(course._id);
            return (
              <CourseCard
                key={course._id}
                course={course}
                index={index}
                initialIsFavorite={userStatus.isFavorite}
                initialFavoriteId={userStatus.favoriteId}
                initialIsTracked={userStatus.isTracked}
                initialTrackedItemId={userStatus.trackedItemId}
                onFavoriteToggle={onFavoriteToggle}
                onTrackToggle={onTrackToggle}
                onViewIncrement={onViewIncrement}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="p-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl mb-6">
              <BookOpen className="h-16 w-16 text-slate-400 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {t('results', 'noCoursesFound', { defaultValue: 'No Courses Found' })}
            </h3>
            <p className="text-slate-600 mb-6">
              {searchTerm || selectedType || selectedArea || selectedLanguage
                ? t('results', 'adjustCriteria', { defaultValue: 'Try adjusting your search criteria or filters.' })
                : t('results', 'noMatchingCourses', { defaultValue: 'No courses match your current selection.' })
              }
            </p>
            {(searchTerm || selectedType || selectedArea || selectedLanguage) && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Zap className="h-5 w-5" />
                {t('filters', 'clearAllFilters', { defaultValue: 'Clear All Filters' })}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Premium Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Page Info - Mobile */}
            <div className="text-sm text-slate-600 font-semibold sm:hidden">
              {t('pagination', 'pageInfo', { 
                current: currentPage, 
                total: totalPages,
                defaultValue: `Page ${currentPage} of ${totalPages}`
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 1}
                className="group flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-emerald-50 text-white hover:text-emerald-600 font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:bg-slate-100 disabled:hover:text-slate-600 disabled:transform-none"
              >
                <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">{t('pagination', 'previous', { defaultValue: 'Previous' })}</span>
              </button>

              {/* Page Numbers - Desktop */}
              <div className="hidden sm:flex items-center gap-1">
                {getPageNumbers().map((pageNum, idx) => (
                  <button
                    key={idx}
                    onClick={() => typeof pageNum === 'number' && setCurrentPage(pageNum)}
                    disabled={pageNum === '...'}
                    className={`min-w-[3rem] h-12 flex items-center justify-center rounded-2xl font-bold transition-all duration-300 transform ${pageNum === currentPage
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-110'
                      : pageNum === '...'
                        ? 'text-slate-400 cursor-default'
                        : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:scale-105'
                      }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === totalPages}
                className="group flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:bg-slate-100 disabled:hover:text-slate-600 disabled:transform-none"
              >
                <span className="hidden sm:inline">{t('pagination', 'next', { defaultValue: 'Next' })}</span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Results Info - Desktop */}
            <div className="hidden sm:block text-sm text-slate-600 font-semibold">
              {t('pagination', 'showingResults', {
                start: indexOfFirstCourse + 1,
                end: Math.min(indexOfLastCourse, filteredAndSearchedCourses.length),
                total: filteredAndSearchedCourses.length,
                defaultValue: `Showing ${indexOfFirstCourse + 1}-${Math.min(indexOfLastCourse, filteredAndSearchedCourses.length)} of ${filteredAndSearchedCourses.length} courses`
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginatedCourses;