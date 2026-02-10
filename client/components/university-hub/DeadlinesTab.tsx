// components/university-hub/DeadlinesTab.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar, Clock, AlertTriangle, Award,
  Loader2, ExternalLink, MapPin, Globe,
  GraduationCap, DollarSign, Info,
  Building, Phone, Mail, Home
} from 'lucide-react';

interface University {
  _id: string;
  id?: number;
  name: string;
  location?: string;
  description?: string;
  logoUrl?: string;
  application_link?: string;
  establishedYear?: number;
  studentFacultyRatio?: string;
  internationalStudentPercentage?: number;
  ranking?: string;
  deadline?: string;
  admission_fee?: number;
  english_requirement?: string;
  status?: string;
  cgpa_requirement?: string;
  housing_available?: boolean;
  scholarship_available?: boolean;
  intakes?: Intakes[];
  email?: string;
  phone?: string;
  address?: string;
  updatedAt?: string;
}

interface Intakes {
  name: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
  application_start?: string;
  application_end?: string;
}

interface DeadlinesTabProps {
  currentUniversityName: string;
  currentUniversitySlug: string;
}

// ── Helpers ──

const formatDeadline = (deadline?: string): string => {
  if (!deadline) return 'Not specified';
  try {
    return new Date(deadline).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    return deadline;
  }
};

type DeadlineStatus = 'upcoming' | 'soon' | 'passed' | 'unknown';

const getDeadlineStatus = (deadline?: string): DeadlineStatus => {
  if (!deadline) return 'unknown';
  try {
    const diffDays = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'passed';
    if (diffDays <= 30) return 'soon';
    return 'upcoming';
  } catch {
    return 'unknown';
  }
};

// JIT-safe: no dynamic interpolation
const statusStyles: Record<DeadlineStatus, string> = {
  upcoming: 'bg-blue-100 text-blue-700 border-blue-200',
  soon:     'bg-amber-100 text-amber-700 border-amber-200',
  passed:   'bg-red-100 text-red-700 border-red-200',
  unknown:  'bg-slate-100 text-slate-600 border-slate-200',
};

const statusLabels: Record<DeadlineStatus, string> = {
  upcoming: 'Upcoming',
  soon: 'Due Soon',
  passed: 'Passed',
  unknown: 'TBD',
};

// ── Sub-components ──

const InfoCard = ({
  icon: Icon,
  label,
  value,
  description,
  isDeadline,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  description?: string;
  isDeadline?: boolean;
}) => {
  const status = isDeadline ? getDeadlineStatus(value) : null;
  const displayValue = isDeadline ? formatDeadline(value) : value;

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Icon className="h-4 w-4 text-slate-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">{label}</h3>
            {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
          </div>
        </div>
        {status && (
          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${statusStyles[status]}`}>
            {statusLabels[status]}
          </span>
        )}
      </div>
      <p className="text-base font-semibold text-slate-900">{displayValue}</p>
    </div>
  );
};

const IntakeCard = ({ intake }: { intake: Intakes }) => {
  const status = intake.end_date ? getDeadlineStatus(intake.end_date) : 'unknown';

  return (
    <div className="p-4 bg-white border border-slate-200 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-slate-800 text-sm capitalize">{intake.name}</h4>
        {intake.end_date && (
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${statusStyles[status]}`}>
            {statusLabels[status]}
          </span>
        )}
      </div>

      {intake.application_start && intake.application_end && (
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>{formatDeadline(intake.application_start)} — {formatDeadline(intake.application_end)}</span>
        </div>
      )}

      {intake.end_date && !intake.application_end && (
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>Deadline: {formatDeadline(intake.end_date)}</span>
        </div>
      )}

      {intake.notes && (
        <p className="text-xs text-slate-500 mt-2 italic">{intake.notes}</p>
      )}
    </div>
  );
};

// ── Main Component ──

const DeadlinesTab: React.FC<DeadlinesTabProps> = ({
  currentUniversityName,
  currentUniversitySlug,
}) => {
  const [university, setUniversity] = useState<University | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const fetchUniversityDeadlines = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const searchQuery = encodeURIComponent(currentUniversityName);
      let response = await fetch(`/api/universities?search=${searchQuery}&limit=10`);

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const universities = Array.isArray(data.data) ? data.data : [data.data];
          if (universities.length > 0) {
            const matched = universities.find((uni: University) =>
              uni.name?.toLowerCase().includes(currentUniversityName.toLowerCase())
            ) || universities[0];

            if (matched) {
              setUniversity(matched);
              return;
            }
          }
        }
      }

      // Fallback: broader search
      response = await fetch('/api/universities?limit=50');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const universities = Array.isArray(data.data) ? data.data : [data.data];
          const matched = universities.find((uni: University) => {
            if (!uni.name) return false;
            const uniName = uni.name.toLowerCase();
            const searchName = currentUniversityName.toLowerCase();
            return uniName.includes(searchName) || searchName.includes(uniName);
          });

          if (matched) {
            setUniversity(matched);
            return;
          }
        }
      }

      setNotFound(true);
    } catch (err: any) {
      setError(err.message || 'Failed to load deadline information');
    } finally {
      setIsLoading(false);
    }
  }, [currentUniversityName, currentUniversitySlug]);

  useEffect(() => {
    fetchUniversityDeadlines();
  }, [fetchUniversityDeadlines]);

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400 mb-4" />
        <p className="text-sm text-slate-500">Loading deadlines for {currentUniversityName}...</p>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-red-800 mb-1">Error Loading Deadlines</h3>
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchUniversityDeadlines}
          className="px-5 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ── Not Found ──
  if (notFound || !university) {
    return (
      <div className="text-center py-16">
        <Info className="h-8 w-8 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-700 mb-1">No Deadline Data Available</h3>
        <p className="text-sm text-slate-500 mb-4">
          We don't have deadline information for "{currentUniversityName}" yet.
        </p>
        <button
          onClick={fetchUniversityDeadlines}
          className="px-5 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const hasDeadlineInfo = !!(
    university.deadline ||
    university.admission_fee ||
    university.english_requirement ||
    university.cgpa_requirement ||
    (university.intakes && university.intakes.length > 0) ||
    university.housing_available ||
    university.scholarship_available
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-orange-100 rounded-xl">
          <Clock className="h-6 w-6 text-orange-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Deadlines & Requirements</h2>
          <p className="text-sm text-slate-500">
            Important dates and admission info for {university.name}
          </p>
        </div>
      </div>

      {/* University Info Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <Building className="h-5 w-5 text-slate-500" />
          <h3 className="font-bold text-slate-900">{university.name}</h3>
          {university.status && (
            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
              university.status.toLowerCase() === 'open'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {university.status}
            </span>
          )}
        </div>

        {university.location && (
          <p className="text-sm text-slate-600 flex items-center gap-1.5 mb-2">
            <MapPin className="h-3.5 w-3.5" /> {university.location}
          </p>
        )}

        {university.description && (
          <p className="text-sm text-slate-600 mb-3">{university.description}</p>
        )}

        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
          {university.email && (
            <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{university.email}</span>
          )}
          {university.phone && (
            <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{university.phone}</span>
          )}
        </div>
      </div>

      {/* No deadline info */}
      {!hasDeadlineInfo && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-amber-900 text-sm mb-1">Limited Information</h3>
            <p className="text-sm text-amber-800 mb-3">
              Detailed deadline information for {university.name} is not yet in our database.
            </p>
            {university.application_link && (
              <a
                href={university.application_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Visit Official Website
              </a>
            )}
          </div>
        </div>
      )}

      {/* Deadline sections */}
      {hasDeadlineInfo && (
        <>
          {university.deadline && (
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-red-500" /> Application Deadline
              </h3>
              <InfoCard icon={Calendar} label="Main Deadline" value={university.deadline} description="General application deadline" isDeadline />
            </section>
          )}

          {university.intakes && university.intakes.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" /> Intake Deadlines
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {university.intakes.map((intake, index) => (
                  <IntakeCard key={index} intake={intake} />
                ))}
              </div>
            </section>
          )}

          {(university.admission_fee || university.scholarship_available) && (
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-500" /> Financial Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {university.admission_fee !== undefined && (
                  <InfoCard icon={DollarSign} label="Admission Fee" value={`€${university.admission_fee}`} description="Application processing fee" />
                )}
                {university.scholarship_available && (
                  <InfoCard icon={Award} label="Scholarships" value="Available" description="Financial aid available for eligible students" />
                )}
              </div>
            </section>
          )}

          {(university.cgpa_requirement || university.english_requirement) && (
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-500" /> Academic Requirements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {university.cgpa_requirement && (
                  <InfoCard icon={Award} label="CGPA Requirement" value={university.cgpa_requirement} description="Minimum CGPA for admission" />
                )}
                {university.english_requirement && (
                  <InfoCard icon={Globe} label="English Requirement" value={university.english_requirement} description="Language proficiency requirement" />
                )}
              </div>
            </section>
          )}

          {university.housing_available && (
            <section>
              <InfoCard icon={Home} label="University Housing" value="Available" description="On-campus or affiliated accommodation available" />
            </section>
          )}
        </>
      )}

      {/* Apply CTA */}
      {university.application_link && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Ready to apply?</h3>
            <p className="text-sm text-slate-500 mt-0.5">Visit the official website to start your application.</p>
            {university.updatedAt && (
              <p className="text-xs text-slate-400 mt-1">Last updated: {formatDeadline(university.updatedAt)}</p>
            )}
          </div>
          <a
            href={university.application_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="h-4 w-4" /> Apply Now
          </a>
        </div>
      )}
    </div>
  );
};

export default DeadlinesTab;