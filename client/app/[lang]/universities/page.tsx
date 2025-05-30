'use client';

import { useEffect, useState, useCallback } from 'react';
import UniversityTable from '@/components/UniversityTable';
import { useUser } from '@clerk/nextjs';
import { University as UniversityCardType } from '@/components/UniversityCard'; // Use the updated interface from UniversityCard

// No longer need validateUniversities if data comes from API correctly structured
// const validateStatus = ...
// const validateProgramType = ...

export default function UniversitiesPage() {
  const { isSignedIn, user } = useUser();
  const [universities, setUniversities] = useState<UniversityCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const uniResponse = await fetch('/api/universities');
      if (!uniResponse.ok) {
        throw new Error(`Failed to fetch universities: ${uniResponse.statusText}`);
      }
      const fetchedUniData = await uniResponse.json();

      if (!fetchedUniData.success) {
        throw new Error(fetchedUniData.message || 'Failed to fetch universities from API.');
      }

      // Ensure the data from API has _id and the count fields
      // The University model should provide viewCount, favoriteCount, trackedCount directly
      let uniDataFromApi: UniversityCardType[] = fetchedUniData.data.map((uni: any) => ({
        ...uni, // Spread all fields from API (name, location, intakes, etc.)
        _id: uni._id, // Ensure _id is correctly mapped
        viewCount: uni.viewCount || 0,
        favoriteCount: uni.favoriteCount || 0,
        trackedCount: uni.trackedCount || 0,
        isFavoriteInitial: false, // Default, will be updated below if user is signed in
        isTrackedInitial: false,  // Default
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
            isFavoriteInitial: favoriteUniIds.has(uni._id),
            isTrackedInitial: trackedUniIds.has(uni._id),
          }));
        } catch (userSpecificError) {
            console.warn('Failed to fetch user-specific favorites/tracked status:', userSpecificError);
            // Proceed with university data but without personalized favorite/tracked status
        }
      }
      setUniversities(uniDataFromApi);
    } catch (e: any) {
      console.error('Error fetching university data:', e);
      setError(e.message || 'An unknown error occurred.');
      setUniversities([]);
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, user]); // Dependencies for useCallback

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]); // useEffect will call the memoized fetchUniversities

  // Optional: Callbacks to update a single university in the list without full refetch
  // This is useful if UniversityCard updates counts and you want to reflect it immediately
  // in the main list without a full page reload/refetch.
  const handleFavoriteUpdate = useCallback((universityId: string, isFavorite: boolean, newCount?: number) => {
    setUniversities(prevUnis =>
      prevUnis.map(uni =>
        uni._id === universityId
          ? { ...uni, isFavoriteInitial: isFavorite, favoriteCount: newCount !== undefined ? newCount : uni.favoriteCount }
          : uni
      )
    );
  }, []);

 const handleTrackUpdate = useCallback((universityId: string, isTracked: boolean, newCount?: number) => {
    setUniversities(prevUnis =>
      prevUnis.map(uni =>
        uni._id === universityId
          ? { ...uni, isTrackedInitial: isTracked, trackedCount: newCount !== undefined ? newCount : uni.trackedCount }
          : uni
      )
    );
  }, []);


  if (isLoading) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 flex justify-center items-center">
            <p className="text-lg text-primary">Loading universities...</p> {/* Or a spinner component */}
        </div>
    );
  }
  if (error) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 flex justify-center items-center">
            <p className="text-lg text-red-500">Error: {error}</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300">
          <UniversityTable
            universities={universities}
            isSignedIn={isSignedIn ?? false}
            // Pass down update handlers if UniversityTable/Card need them
            // onFavoriteToggledInCard={handleFavoriteUpdate}
            // onTrackToggledInCard={handleTrackUpdate}
          />
        </div>
        <div className="mt-8 text-center">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary/5 text-primary">
            <svg
              className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
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

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}