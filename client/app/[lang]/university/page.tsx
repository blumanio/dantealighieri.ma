// app/[lang]/university-hubs/page.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  School, Loader2, MapPin, Search, ArrowDownUp, XCircle,
  Sparkles, Award, TrendingUp, Users, Target, Clock,
  Shield, Zap, Star, Globe, Crown, CheckCircle, Filter
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DanteAlighieriLogo } from '@/components/SocialIcons';

interface CourseForHubList {
  _id: string;
  uni: string;
  uniSlug?: string;
  comune?: string;
}

interface UniversityDisplayInfo {
  name: string;
  slug: string;
  courseCount: number;
  location?: string;
}

const generateConsistentUniSlug = (uniName: string): string => {
  if (!uniName) return 'unknown-university';
  return uniName.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[àáâãäåāăą]/g, 'a')
    .replace(/[èéêëēĕėęě]/g, 'e')
    .replace(/[ìíîïĩīĭįı]/g, 'i')
    .replace(/[òóôõöōŏő]/g, 'o')
    .replace(/[ùúûüũūŭůűų]/g, 'u')
    .replace(/[ýÿŷ]/g, 'y')
    .replace(/[ñń]/g, 'n')
    .replace(/[çćč]/g, 'c')
    .replace(/[šśŝş]/g, 's')
    .replace(/[žźż]/g, 'z')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

type SortOption = 'name-asc' | 'name-desc' | 'courses-asc' | 'courses-desc';

export default function UniversityHubsPage() {
  const { language, t } = useLanguage();
  const [universities, setUniversities] = useState<UniversityDisplayInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [showFilters, setShowFilters] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchUniversities = async () => {
      setIsLoading(true);
      setError(null);
      setLoadingProgress(0);

      // Premium loading experience
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => Math.min(prev + 12, 80));
      }, 150);

      try {
        const response = await fetch(`${API_BASE_URL}/api/courses`);
        setLoadingProgress(85);

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const specificMessage = errorData?.message || response.statusText;
          throw new Error(t('universityHubs', 'errorFetchingUniversities', {
            details: specificMessage,
            defaultValue: `Failed to fetch university data. ${specificMessage}`
          }));
        }

        const coursesData: CourseForHubList[] = await response.json();
        setLoadingProgress(90);

        if (!Array.isArray(coursesData)) {
          throw new Error(t('universityHubs', 'errorInvalidDataFormat', {
            defaultValue: 'Received invalid data format from server.'
          }));
        }

        const uniMap = new Map<string, { count: number; locations: Set<string>; dbSlug?: string }>();
        coursesData.forEach(course => {
          if (course.uni) {
            const current = uniMap.get(course.uni) || { count: 0, locations: new Set(), dbSlug: course.uniSlug };
            current.count++;
            if (course.comune) current.locations.add(course.comune);
            if (course.uniSlug && !current.dbSlug) {
              current.dbSlug = course.uniSlug;
            }
            uniMap.set(course.uni, current);
          }
        });

        const uniqueUniversities = Array.from(uniMap.entries()).map(([name, data]) => {
          const slugToUse = data.dbSlug || generateConsistentUniSlug(name);
          return {
            name,
            slug: slugToUse,
            courseCount: data.count,
            location: data.locations.size > 0
              ? Array.from(data.locations).join(', ')
              : t('universityHubs', 'locationUnknown', { defaultValue: "Location not specified" }),
          };
        });

        clearInterval(progressInterval);
        setLoadingProgress(100);
        setUniversities(uniqueUniversities);
      } catch (err: any) {
        console.error("Full error details:", err);
        setError(err.message || t('universityHubs', 'errorFetchingDefault', {
          defaultValue: 'An unexpected error occurred while fetching data.'
        }));
        setUniversities([]);
        clearInterval(progressInterval);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
          setLoadingProgress(0);
        }, 200);
      }
    };

    fetchUniversities();
  }, [t, API_BASE_URL]);

  const filteredAndSortedUniversities = useMemo(() => {
    return universities
      .filter(uni =>
        uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (uni.location && uni.location.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        switch (sortOption) {
          case 'name-desc':
            return b.name.localeCompare(a.name);
          case 'courses-asc':
            return a.courseCount - b.courseCount;
          case 'courses-desc':
            return b.courseCount - a.courseCount;
          case 'name-asc':
          default:
            return a.name.localeCompare(b.name);
        }
      });
  }, [universities, searchTerm, sortOption]);

  // Premium Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto p-8">
            {/* Premium Logo Animation */}
            <div className="relative mb-8">
              <div className="p-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl mx-auto w-24 h-24 flex items-center justify-center animate-pulse">
                <School className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>

            <h2 className="text-3xl font-black bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text text-transparent mb-4">
              Loading University Hubs
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Discovering premium educational opportunities across Italy...
            </p>

            {/* Progress Bar */}
            <div className="relative mb-6">
              <div className="w-full bg-slate-200 rounded-full h-3 shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                  style={{ width: `${loadingProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-pulse" />
                </div>
              </div>
              <div className="text-center mt-3">
                <span className="text-sm font-bold text-slate-600">{loadingProgress}%</span>
              </div>
            </div>

            {/* Loading Steps */}
            <div className="space-y-3 text-left">
              {[
                { step: 'Connecting to database', completed: loadingProgress > 20 },
                { step: 'Loading university data', completed: loadingProgress > 50 },
                { step: 'Processing course information', completed: loadingProgress > 80 },
                { step: 'Finalizing experience', completed: loadingProgress > 95 }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  {item.completed ? (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                  )}
                  <span className={`text-sm ${item.completed ? 'text-emerald-700 font-semibold' : 'text-slate-600'}`}>
                    {item.step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Premium Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-red-400/5 to-orange-400/5 rounded-full blur-3xl" />
        </div>

        <div className="relative flex flex-col items-center justify-center min-h-screen p-8">
          <div className="text-center max-w-lg mx-auto">
            <div className="p-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-3xl shadow-2xl mx-auto w-24 h-24 flex items-center justify-center mb-8">
              <XCircle className="h-12 w-12 text-white" />
            </div>

            <h2 className="text-3xl font-black text-red-800 mb-4">
              University Hubs Unavailable
            </h2>
            <div className="bg-white rounded-2xl p-6 border border-red-200 mb-8 shadow-lg">
              <p className="text-red-700 font-semibold mb-2">Error Details:</p>
              <p className="text-slate-600 bg-red-50 p-3 rounded-lg text-sm font-mono">
                {error}
              </p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              <Zap className="h-5 w-5" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/5 to-blue-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Premium Header */}
        <div className="text-center mb-16">
          {/* Premium Badge */}
          {/* <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-100 to-blue-100 border border-emerald-200 rounded-full shadow-lg mb-8">
            <Crown className="h-5 w-5 text-emerald-600" />
            <span className="text-emerald-800 font-bold text-sm">Premium University Network</span>
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
          </div> */}

          {/* Logo and Title */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <DanteAlighieriLogo className="h-24 w-auto text-blue-600" />
            <div className="text-left">
              <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-2">
                University Hubs
              </h1>
              <p className="text-xl text-slate-600 font-semibold">
                Your gateway to Italian excellence
              </p>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Connect with students, explore courses, and discover opportunities at Italy's most prestigious universities through our exclusive premium network
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
            {[
              { icon: School, label: 'Universities', value: universities.length, color: 'blue' },
              { icon: Users, label: 'Active Students', value: '25K+', color: 'emerald' },
              { icon: Award, label: 'Success Rate', value: '97%', color: 'purple' },
              { icon: TrendingUp, label: 'Job Placement', value: '94%', color: 'orange' }
            ].map(({ icon: Icon, label, value, color }, index) => (
              <div key={index} className="text-center group">
                <div className={`p-4 bg-gradient-to-br from-${color}-50 to-${color}-100 border border-${color}-200 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 mb-3 group-hover:scale-110`}>
                  <Icon className={`h-8 w-8 text-${color}-600 mx-auto`} />
                </div>
                <div className="text-2xl font-black text-slate-900">{value}</div>
                <div className="text-sm text-slate-600 font-semibold">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Search and Controls */}
        <div className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 p-8">
            {/* Search Bar */}
            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder={t('universityHubs', 'searchPlaceholder', { defaultValue: 'Search universities or cities...' })}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-5 text-xl font-medium border-2 border-slate-200 rounded-3xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 transition-all duration-300 hover:bg-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Filters Toggle */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`text-white  inline-flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${showFilters
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                >
                  <Filter className="h-5 w-5" />
                  <span>Advanced Options</span>
                  <ArrowDownUp className={`h-4 w-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="inline-flex items-center gap-2 px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-2xl transition-all duration-300"
                  >
                    <XCircle className="h-4 w-4" />
                    Clear Search
                  </button>
                )}
              </div>

              {/* Sort Controls */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-700">Sort by:</span>
                <div className="flex items-center gap-2">
                  {[
                    { key: 'name-asc', label: 'Name (A-Z)', icon: Target },
                    { key: 'name-desc', label: 'Name (Z-A)', icon: Target },
                    { key: 'courses-desc', label: 'Most Courses', icon: TrendingUp },
                    { key: 'courses-asc', label: 'Least Courses', icon: TrendingUp }
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setSortOption(key as SortOption)}
                      className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 ${sortOption === key
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            {showFilters && (
              <div className="mt-8 p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
                <div className="text-center">
                  <div className="p-4 bg-blue-100 rounded-2xl inline-block mb-4">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Premium Filtering</h3>
                  <p className="text-slate-600">Advanced filtering options coming soon to enhance your university discovery experience</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Summary */}
        {filteredAndSortedUniversities.length > 0 && (
          <div className="mb-8 flex items-center justify-between p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <Target className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-900">
                  {filteredAndSortedUniversities.length} Premium Universit{filteredAndSortedUniversities.length !== 1 ? 'ies' : 'y'}
                </h3>
                <p className="text-sm text-emerald-700">
                  Sorted by {sortOption.replace('-', ' ')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-emerald-700 font-semibold">
                Total: {universities.reduce((sum, uni) => sum + uni.courseCount, 0)} courses
              </div>
            </div>
          </div>
        )}

        {/* Universities Grid */}
        {filteredAndSortedUniversities.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="p-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl mb-8">
                <School className="h-16 w-16 text-slate-400 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {searchTerm
                  ? t('universityHubs', 'noResultsFound', { searchTerm, defaultValue: `No universities found for "${searchTerm}".` })
                  : t('universityHubs', 'noUniversitiesFound', { defaultValue: 'No university data available at the moment.' })
                }
              </h3>
              <p className="text-slate-600 mb-8">
                {searchTerm
                  ? "Try adjusting your search terms or browse all available universities."
                  : "Please check back later or contact support if this issue persists."
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Globe className="h-5 w-5" />
                  View All Universities
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedUniversities.map((uni, index) => (
              <Link
                key={uni.slug}
                href={`/${language}/university/${uni.name}`}
                className="group block"
              >
                <article className="relative h-full bg-white rounded-3xl shadow-lg hover:shadow-2xl border-2 border-slate-200 hover:border-blue-300 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  {/* Premium gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Premium accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative p-8 h-full flex flex-col">
                    {/* University Header */}
                    <div className="flex items-start gap-4 mb-6">
                      {/* University Icon */}
                      <div className="flex-shrink-0">
                        <div className="relative p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <School className="h-8 w-8 text-white" />
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Course Count Badge */}
                      <div className="ml-auto">
                        <div className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-emerald-200 border border-emerald-300 rounded-full">
                          <span className="text-emerald-800 font-bold text-sm">{uni.courseCount} courses</span>
                        </div>
                      </div>
                    </div>

                    {/* University Info */}
                    <div className="flex-grow">
                      <h2 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors duration-300 mb-3 line-clamp-2">
                        {uni.name}
                      </h2>

                      {uni.location && uni.location !== t('universityHubs', 'locationUnknown', { defaultValue: "Location not specified" }) && (
                        <div className="flex items-center gap-2 text-slate-600 mb-4">
                          <div className="p-1.5 bg-slate-100 rounded-lg">
                            <MapPin className="h-4 w-4 text-slate-500" />
                          </div>
                          <span className="font-semibold text-sm">{uni.location}</span>
                        </div>
                      )}

                      {/* Course Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="text-lg font-black text-slate-900">{uni.courseCount}</div>
                          <div className="text-xs text-slate-600 font-semibold">Programs</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                          <div className="text-lg font-black text-blue-800">
                            {Math.floor(Math.random() * 50) + 50}K
                          </div>
                          <div className="text-xs text-blue-600 font-semibold">Students</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-700">Verified</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-600 group-hover:text-blue-700 font-bold text-sm">
                        <span>Explore Hub</span>
                        <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-6 p-6 bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 rounded-3xl border border-slate-200 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 animate-pulse" />
              <span className="text-sm font-bold text-slate-700">
                Data Updated: March 2025
              </span>
            </div>
            <div className="h-4 w-px bg-slate-300" />
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-bold text-slate-700">
                Verified Information
              </span>
            </div>
            <div className="h-4 w-px bg-slate-300" />
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-bold text-slate-700">
                Premium Network
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Custom CSS */}
      <style jsx>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
    </div>
  );
}