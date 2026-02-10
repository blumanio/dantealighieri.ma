'use client';

import { useEffect, useState, useCallback } from 'react';
import UniversityTable from '@/components/UniversityTable';
import { useUser } from '@clerk/nextjs';
import { UniversityCardProps as UniversityCardType } from '@/components/UniversityCard';
import {
  Sparkles, Award, TrendingUp, Users, Target, Clock,
  Shield, Zap, Star, Globe, Heart, Calendar, Loader2,
  CheckCircle, XCircle, AlertCircle
} from 'lucide-react';

export default function UniversitiesPage() {
  const { isSignedIn, user } = useUser();
  const [universities, setUniversities] = useState<UniversityCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const fetchUniversities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setLoadingProgress(0);

    try {
      // Simulate loading progress for better UX
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => Math.min(prev + 10, 80));
      }, 100);

      const uniResponse = await fetch('/api/universities');
      setLoadingProgress(85);

      if (!uniResponse.ok) {
        throw new Error(`Failed to fetch universities: ${uniResponse.statusText}`);
      }

      const fetchedUniData = await uniResponse.json();
      setLoadingProgress(90);

      if (!fetchedUniData.success) {
        throw new Error(fetchedUniData.message || 'Failed to fetch universities from API.');
      }

      let uniDataFromApi: UniversityCardType[] = fetchedUniData.data.map((uni: any) => ({
        ...uni,
        _id: uni._id,
        viewCount: uni.viewCount || 0,
        favoriteCount: uni.favoriteCount || 0,
        trackedCount: uni.trackedCount || 0,
        isFavoriteInitial: false,
        isTrackedInitial: false,
      }));

      if (isSignedIn && user?.id) {
        try {
          const [favResponse, trackedResponse] = await Promise.all([
            fetch(`/api/users/${user.id}/university-favorites`),
            fetch(`/api/users/${user.id}/university-tracked-items`)
          ]);

          const userFavoritesData = favResponse.ok ? await favResponse.json() : { success: false, data: [] };
          const userTrackedData = trackedResponse.ok ? await trackedResponse.json() : { success: false, data: [] };

          const favoriteUniIds = new Set(
            userFavoritesData.success ? userFavoritesData.data.map((fav: any) => fav.universityId?._id || fav.universityId) : []
          );
          const trackedUniIds = new Set(
            userTrackedData.success ? userTrackedData.data.map((tracked: any) => tracked.universityId?._id || tracked.universityId) : []
          );

          uniDataFromApi = uniDataFromApi.map(uni => ({
            ...uni,
           
          }));
        } catch (userSpecificError) {
          console.warn('Failed to fetch user-specific favorites/tracked status:', userSpecificError);
        }
      }

      clearInterval(progressInterval);
      setLoadingProgress(100);
      setUniversities(uniDataFromApi);

    } catch (e: any) {
      console.error('Error fetching university data:', e);
      setError(e.message || 'An unknown error occurred.');
      setUniversities([]);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);
      }, 200);
    }
  }, [isSignedIn, user]);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);



  // Premium Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative flex flex-col items-center justify-center min-h-screen p-8">
          <div className="text-center max-w-md mx-auto">
            {/* Premium Logo/Icon */}
            <div className="relative mb-8">
              <div className="p-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl mx-auto w-24 h-24 flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Loading Text */}
            <h2 className="text-3xl font-black bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text text-transparent mb-4">
              Loading Premium Universities
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Preparing your personalized university experience...
            </p>

            {/* Premium Progress Bar */}
            <div className="relative mb-6">
              <div className="w-full bg-slate-200 rounded-full h-3 shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                  style={{ width: `${loadingProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-pulse" />
                </div>
              </div>
              <div className="text-center mt-2">
                <span className="text-sm font-bold text-slate-600">{loadingProgress}%</span>
              </div>
            </div>

            {/* Loading Steps */}
            <div className="space-y-3 text-left max-w-xs mx-auto">
              {[
                { step: 'Fetching university data', completed: loadingProgress > 20 },
                { step: 'Loading user preferences', completed: loadingProgress > 50 },
                { step: 'Personalizing experience', completed: loadingProgress > 80 },
                { step: 'Almost ready!', completed: loadingProgress > 95 }
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
              Oops! Something went wrong
            </h2>
            <div className="bg-white rounded-2xl p-6 border border-red-200 mb-8">
              <p className="text-red-700 font-semibold mb-2">Error Details:</p>
              <p className="text-slate-600 bg-red-50 p-3 rounded-lg text-sm font-mono">
                {error}
              </p>
            </div>

            <button
              onClick={fetchUniversities}
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

  // Main Content
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/5 to-blue-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-400/5 to-pink-400/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto pt-16 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-100 to-blue-100 border border-emerald-200 rounded-full shadow-lg mb-8">
              <Shield className="h-5 w-5 text-emerald-600" />
              <span className="text-emerald-800 font-bold text-sm">Premium University Access</span>
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                Italian Universities
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Discover world-class educational opportunities with our
              <span className="font-bold text-blue-600"> premium collection </span>
              of partner universities in Italy
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
              {[
                { icon: Globe, label: 'Universities', value: universities.length, color: 'blue' },
                { icon: Users, label: 'Active Students', value: '50K+', color: 'emerald' },
                { icon: Award, label: 'Success Rate', value: '98%', color: 'purple' },
                { icon: Clock, label: 'Updated', value: 'Today', color: 'orange' }
              ].map(({ icon: Icon, label, value, color }, index) => (
                <div key={index} className="text-center group">
                  <div className={`p-4 bg-gradient-to-br from-${color}-50 to-${color}-100 border border-${color}-200 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 mb-3`}>
                    <Icon className={`h-8 w-8 text-${color}-600 mx-auto`} />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{value}</div>
                  <div className="text-sm text-slate-600 font-semibold">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* University Table */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/60 overflow-hidden">
            {/* <UniversityTable
              universities={universities}
              isSignedIn={isSignedIn ?? false}
            /> */}
          </div>

          {/* Bottom CTA Section */}
          <div className="mt-16 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-12 border border-blue-200 shadow-xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-left">
                    <h3 className="text-2xl font-black text-slate-900 mb-2">
                      Ready to start your journey?
                    </h3>
                    <p className="text-slate-600 max-w-md">
                      {isSignedIn
                        ? "Explore detailed university information, save favorites, and track application deadlines"
                        : "Sign in to access premium features, detailed information, and personalized recommendations"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-blue-600">{universities.length}</div>
                      <div className="text-sm text-slate-600 font-semibold">Universities Available</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Stats */}
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full animate-pulse" />
                <span className="font-semibold">Live Data</span>
              </div>
              <div className="w-px h-4 bg-slate-300" />
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span className="font-semibold">Verified Information</span>
              </div>
              <div className="w-px h-4 bg-slate-300" />
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/5 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-gradient-to-l from-emerald-400/5 to-transparent rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(20px);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}