// components/university-hub/UniversityHeader.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { 
  School, Crown, CheckCircle, MapPin, CalendarDays, 
  UsersRound, Globe, BookOpen, Users, Award, ExternalLink 
} from 'lucide-react';

interface UniversityDetails {
  name: string;
  slug: string;
  location?: string;
  description?: string;
  longDescription?: string;
  logoUrl?: string;
  bannerImageUrl?: string;
  websiteUrl?: string;
  establishedYear?: number;
  studentFacultyRatio?: string;
  internationalStudentPercentage?: number;
  ranking?: string;
}

interface UniversityHeaderProps {
  universityDetails: UniversityDetails | null;
  universityName: string;
  coursesCount: number;
  communityPostsCount: number;
  isLoading?: boolean;
}

const PremiumBannerSkeleton = () => (
  <div className="w-full h-64 sm:h-80 md:h-96 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-pulse relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-shimmer" />
  </div>
);

const PremiumLogoSkeleton = ({ className }: { className?: string }) => (
  <div className={`bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse rounded-full shadow-2xl relative overflow-hidden ${className || 'w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48'}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] animate-shimmer" />
  </div>
);

const UniversityHeader: React.FC<UniversityHeaderProps> = ({
  universityDetails,
  universityName,
  coursesCount,
  communityPostsCount,
  isLoading = false
}) => {
  if (isLoading && !universityDetails) {
    return (
      <div className="relative overflow-hidden">
        <div className="relative">
          <PremiumBannerSkeleton />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20 md:-mt-24 relative z-10">
            <div className="mb-4 sm:mb-0 sm:mr-6">
              <PremiumLogoSkeleton className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 border-4 border-white" />
            </div>
            <div className="text-center sm:text-left pb-6 flex-grow">
              <div className="h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl w-3/4 mb-3 animate-pulse" />
              <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl w-1/2 mb-2 animate-pulse" />
              <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-1/3 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Banner */}
      <div className="relative h-64 sm:h-80 md:h-96">
        {universityDetails?.bannerImageUrl ? (
          <Image
            src={universityDetails.bannerImageUrl}
            alt={`${universityName} banner`}
            layout="fill"
            objectFit="cover"
            priority
            className="transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

        {/* Premium Badge */}
        <div className="absolute top-6 right-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full shadow-lg">
            <Crown className="h-4 w-4 text-yellow-300" />
            <span className="text-white font-bold text-sm">Premium</span>
          </div>
        </div>
      </div>

      {/* University Profile Section */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20 md:-mt-24 relative z-10">
          {/* Logo Section */}
          <div className="mb-6 sm:mb-0 sm:mr-8 relative">
            {universityDetails?.logoUrl ? (
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 border-4 border-white rounded-full shadow-2xl overflow-hidden bg-white group hover:scale-105 transition-all duration-300">
                <Image
                  src={universityDetails.logoUrl}
                  alt={`${universityName} logo`}
                  layout="fill"
                  objectFit="contain"
                  className="p-2"
                />
                <div className="absolute inset-0 ring-4 ring-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
            ) : (
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 border-4 border-white rounded-full shadow-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group hover:scale-105 transition-all duration-300">
                <School className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 text-white" />
                <div className="absolute inset-0 ring-4 ring-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
            )}

            {/* Status Indicator */}
            <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 border-4 border-white rounded-full shadow-lg">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* University Info */}
          <div className="text-center sm:text-left py-6 flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text text-transparent">
                {universityName}
              </h1>
              {universityDetails?.ranking && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 rounded-full shadow-lg">
                  <Award className="h-4 w-4 text-yellow-600" />
                  <span className="text-yellow-800 font-bold text-sm">{universityDetails.ranking}</span>
                </div>
              )}
            </div>

            {universityDetails?.location && (
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <MapPin className="h-4 w-4 text-slate-600" />
                </div>
                <span className="text-lg text-slate-700 font-semibold">{universityDetails.location}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
              {universityDetails?.websiteUrl && (
                <a
                  href={universityDetails.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Globe className="h-4 w-4" />
                  Website
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}

              {universityDetails?.establishedYear && (
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">
                  <CalendarDays className="h-4 w-4 text-slate-600" />
                  <span className="text-slate-800 font-semibold">Est. {universityDetails.establishedYear}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* University Stats Bar */}
      {universityDetails && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {universityDetails.studentFacultyRatio && (
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                  <UsersRound className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-xl font-black text-blue-800">{universityDetails.studentFacultyRatio}</div>
                  <div className="text-xs text-blue-600 font-semibold">Student:Faculty</div>
                </div>
              )}
              {universityDetails.internationalStudentPercentage && (
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                  <Globe className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <div className="text-xl font-black text-emerald-800">{universityDetails.internationalStudentPercentage}%</div>
                  <div className="text-xs text-emerald-600 font-semibold">International</div>
                </div>
              )}
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                <BookOpen className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-xl font-black text-purple-800">{coursesCount}</div>
                <div className="text-xs text-purple-600 font-semibold">Courses</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                <Users className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="text-xl font-black text-orange-800">{communityPostsCount}</div>
                <div className="text-xs text-orange-600 font-semibold">Posts</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default UniversityHeader;