// components/university-hub/AboutTab.tsx
'use client';

import React from 'react';
import { 
  School, TrendingUp, CalendarDays, UsersRound, Globe, MapPin,
  HomeIcon, Beer, Shield, Drama, Route, Landmark
} from 'lucide-react';

interface CityStudentData {
  averageRent?: string;
  livingCostIndex?: string;
  studentPopulation?: string;
  publicTransport?: string;
  nightlife?: string;
  safety?: string;
  culturalOfferings?: string;
  sportsFacilities?: string;
}

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
  cityData?: CityStudentData;
}

interface AboutTabProps {
  universityDetails: UniversityDetails;
}

const AboutTab: React.FC<AboutTabProps> = ({ universityDetails }) => {
  const renderStatCard = (
    IconComponent: React.ElementType, 
    label: string, 
    value?: string | number, 
    colorClass: string = 'blue'
  ) => {
    if (!value && typeof value !== 'number') return null;
    
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-${colorClass}-50 to-${colorClass}-100 p-6 rounded-2xl border border-${colorClass}-200 hover:border-${colorClass}-300 transition-all duration-300 group`}>
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/30 to-transparent rounded-bl-3xl" />
        <div className="relative">
          <div className={`p-3 bg-${colorClass}-200 rounded-xl mb-3 inline-block group-hover:scale-110 transition-transform duration-300`}>
            <IconComponent className={`h-6 w-6 text-${colorClass}-700`} />
          </div>
          <p className={`text-sm text-${colorClass}-600 font-semibold mb-1`}>{label}</p>
          <p className={`text-xl font-black text-${colorClass}-800`}>{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* About Section */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-100 rounded-2xl">
            <School className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900">
            About {universityDetails.name}
          </h2>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-slate-700 leading-relaxed text-lg">
            {universityDetails.longDescription || universityDetails.description}
          </p>
        </div>
      </div>

      {/* University Stats */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-emerald-600" />
          Coming soon
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderStatCard(CalendarDays, "Established", universityDetails.establishedYear, 'blue')}
          {renderStatCard(UsersRound, "Student-Faculty Ratio", universityDetails.studentFacultyRatio, 'emerald')}
          {renderStatCard(Globe, "International Students", 
            universityDetails.internationalStudentPercentage ? `${universityDetails.internationalStudentPercentage}%` : undefined, 'purple')}
        </div>
      </div>

      {/* City Data */}
      {universityDetails.cityData && (
        <div>
          <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <MapPin className="h-6 w-6 text-orange-600" />
            City Life in {universityDetails.location?.split(',')[0] || 'City'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {renderStatCard(HomeIcon, "Average Rent", universityDetails.cityData.averageRent, 'orange')}
            {renderStatCard(TrendingUp, "Living Cost", universityDetails.cityData.livingCostIndex, 'red')}
            {renderStatCard(UsersRound, "Students", universityDetails.cityData.studentPopulation, 'blue')}
            {renderStatCard(Route, "Transport", universityDetails.cityData.publicTransport, 'emerald')}
            {renderStatCard(Beer, "Nightlife", universityDetails.cityData.nightlife, 'purple')}
            {renderStatCard(Shield, "Safety", universityDetails.cityData.safety, 'green')}
            {renderStatCard(Drama, "Culture", universityDetails.cityData.culturalOfferings, 'indigo')}
            {renderStatCard(Landmark, "Sports", universityDetails.cityData.sportsFacilities, 'pink')}
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutTab;