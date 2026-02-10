'use client';

import React from 'react';

/**
 * Keep this interface lightweight.
 * You can expand it later to match your API exactly.
 */
export interface UniversityDetails {
  name?: string;
  location?: string;
  logoUrl?: string;
  coverImageUrl?: string;
}

interface UniversityHeaderProps {
  universityDetails: UniversityDetails | null;
  universityName: string;
  coursesCount: number;
  communityPostsCount: number;
}

export default function UniversityHeader({
  universityDetails,
  universityName,
  coursesCount,
  communityPostsCount,
}: UniversityHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Logo */}
          {universityDetails?.logoUrl && (
            <img
              src={universityDetails.logoUrl}
              alt={universityName}
              className="h-16 w-16 object-contain rounded-xl border border-slate-200 bg-white"
            />
          )}

          {/* Main info */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              {universityName}
            </h1>

            {universityDetails?.location && (
              <p className="mt-1 text-sm text-slate-500">
                {universityDetails.location}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <p className="text-lg font-bold text-slate-900">
                {coursesCount}
              </p>
              <p className="text-slate-500">Courses</p>
            </div>

            <div className="text-center">
              <p className="text-lg font-bold text-slate-900">
                {communityPostsCount}
              </p>
              <p className="text-slate-500">Community</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
