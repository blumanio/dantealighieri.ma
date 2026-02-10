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

// ── Explicit Tailwind color maps (JIT-safe — no dynamic interpolation) ──
type ColorKey = 'blue' | 'emerald' | 'purple' | 'orange' | 'red' | 'green' | 'indigo' | 'pink';

const cardStyles: Record<ColorKey, { bg: string; border: string; iconBg: string; iconText: string; label: string; value: string }> = {
  blue:    { bg: 'bg-blue-50',    border: 'border-blue-200',    iconBg: 'bg-blue-200',    iconText: 'text-blue-700',    label: 'text-blue-600',    value: 'text-blue-800' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', iconBg: 'bg-emerald-200', iconText: 'text-emerald-700', label: 'text-emerald-600', value: 'text-emerald-800' },
  purple:  { bg: 'bg-purple-50',  border: 'border-purple-200',  iconBg: 'bg-purple-200',  iconText: 'text-purple-700',  label: 'text-purple-600',  value: 'text-purple-800' },
  orange:  { bg: 'bg-orange-50',  border: 'border-orange-200',  iconBg: 'bg-orange-200',  iconText: 'text-orange-700',  label: 'text-orange-600',  value: 'text-orange-800' },
  red:     { bg: 'bg-red-50',     border: 'border-red-200',     iconBg: 'bg-red-200',     iconText: 'text-red-700',     label: 'text-red-600',     value: 'text-red-800' },
  green:   { bg: 'bg-green-50',   border: 'border-green-200',   iconBg: 'bg-green-200',   iconText: 'text-green-700',   label: 'text-green-600',   value: 'text-green-800' },
  indigo:  { bg: 'bg-indigo-50',  border: 'border-indigo-200',  iconBg: 'bg-indigo-200',  iconText: 'text-indigo-700',  label: 'text-indigo-600',  value: 'text-indigo-800' },
  pink:    { bg: 'bg-pink-50',    border: 'border-pink-200',    iconBg: 'bg-pink-200',    iconText: 'text-pink-700',    label: 'text-pink-600',    value: 'text-pink-800' },
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  color = 'blue',
}: {
  icon: React.ElementType;
  label: string;
  value?: string | number;
  color?: ColorKey;
}) => {
  if (!value && typeof value !== 'number') return null;

  const s = cardStyles[color];

  return (
    <div className={`relative overflow-hidden ${s.bg} p-5 rounded-xl border ${s.border} hover:shadow-md transition-all duration-200`}>
      <div className="relative">
        <div className={`p-2.5 ${s.iconBg} rounded-lg mb-3 inline-block`}>
          <Icon className={`h-5 w-5 ${s.iconText}`} />
        </div>
        <p className={`text-sm ${s.label} font-semibold mb-1`}>{label}</p>
        <p className={`text-lg font-bold ${s.value}`}>{value}</p>
      </div>
    </div>
  );
};

const AboutTab: React.FC<AboutTabProps> = ({ universityDetails }) => {
  const hasStats = !!(
    universityDetails.establishedYear ||
    universityDetails.studentFacultyRatio ||
    universityDetails.internationalStudentPercentage
  );

  return (
    <div className="space-y-10">
      {/* About Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-blue-100 rounded-xl">
            <School className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            About {universityDetails.name}
          </h2>
        </div>

        {(universityDetails.longDescription || universityDetails.description) ? (
          <p className="text-slate-700 leading-relaxed text-base">
            {universityDetails.longDescription || universityDetails.description}
          </p>
        ) : (
          <p className="text-slate-500 italic">
            Detailed description not yet available. Visit the university's official website for more information.
          </p>
        )}
      </div>

      {/* University Stats */}
      {hasStats && (
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            Key Facts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard icon={CalendarDays} label="Established" value={universityDetails.establishedYear} color="blue" />
            <StatCard icon={UsersRound} label="Student-Faculty Ratio" value={universityDetails.studentFacultyRatio} color="emerald" />
            <StatCard
              icon={Globe}
              label="International Students"
              value={universityDetails.internationalStudentPercentage ? `${universityDetails.internationalStudentPercentage}%` : undefined}
              color="purple"
            />
          </div>
        </div>
      )}

      {/* City Data */}
      {universityDetails.cityData && (
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-600" />
            City Life in {universityDetails.location?.split(',')[0] || 'City'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={HomeIcon} label="Average Rent" value={universityDetails.cityData.averageRent} color="orange" />
            <StatCard icon={TrendingUp} label="Living Cost" value={universityDetails.cityData.livingCostIndex} color="red" />
            <StatCard icon={UsersRound} label="Students" value={universityDetails.cityData.studentPopulation} color="blue" />
            <StatCard icon={Route} label="Transport" value={universityDetails.cityData.publicTransport} color="emerald" />
            <StatCard icon={Beer} label="Nightlife" value={universityDetails.cityData.nightlife} color="purple" />
            <StatCard icon={Shield} label="Safety" value={universityDetails.cityData.safety} color="green" />
            <StatCard icon={Drama} label="Culture" value={universityDetails.cityData.culturalOfferings} color="indigo" />
            <StatCard icon={Landmark} label="Sports" value={universityDetails.cityData.sportsFacilities} color="pink" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutTab;