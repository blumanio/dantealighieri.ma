// components/university-hub/DeadlinesTab.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar, Clock, AlertTriangle, CheckCircle, Award,
  BookOpen, Loader2, ExternalLink, MapPin, Globe, TrendingUp,
  Users, GraduationCap, FileText, DollarSign, Target, Info,
  Building, Phone, Mail, Home
} from 'lucide-react';

// Updated interface to match your actual database structure
interface University {
  _id: string;
  id?: number;
  name: string; // Changed from 'nome' to 'name'
  location?: string;
  description?: string;
  logoUrl?: string;
  application_link?: string; // Your DB uses this instead of websiteUrl
  establishedYear?: number;
  studentFacultyRatio?: string;
  internationalStudentPercentage?: number;
  ranking?: string;
  // Your actual database fields
  deadline?: string; // Main application deadline
  admission_fee?: number;
  english_requirement?: string;
  status?: string;
  cgpa_requirement?: string;
  housing_available?: boolean;
  scholarship_available?: boolean;
  intakes?: Intakes[]
  // Additional fields that might exist
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

const DeadlinesTab: React.FC<DeadlinesTabProps> = ({
  currentUniversityName,
  currentUniversitySlug
}) => {
  const [university, setUniversity] = useState<University | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const formatDeadline = (deadline?: string): string => {
    if (!deadline) return 'Not specified';
    try {
      return new Date(deadline).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return deadline;
    }
  };

  const getDeadlineStatus = (deadline?: string): 'upcoming' | 'soon' | 'passed' | 'unknown' => {
    if (!deadline) return 'unknown';
    try {
      const deadlineDate = new Date(deadline);
      const now = new Date();
      const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return 'passed';
      if (diffDays <= 30) return 'soon';
      return 'upcoming';
    } catch {
      return 'unknown';
    }
  };

  const getDeadlineStatusColor = (status: string): string => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'soon': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'passed': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const fetchUniversityDeadlines = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setNotFound(false);

    try {
      console.log('Fetching university data for:', currentUniversityName);

      // Try to search by name first
      const searchQuery = encodeURIComponent(currentUniversityName);
      let response = await fetch(`/api/universities?search=${searchQuery}&limit=10`);

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);

        if (data.success && data.data) {
          // Handle both single object and array responses
          let universities = Array.isArray(data.data) ? data.data : [data.data];

          if (universities.length > 0) {
            // Find the best match
            let matchedUniversity = universities.find((uni: University) =>
              uni.name && uni.name.toLowerCase().includes(currentUniversityName.toLowerCase())
            );

            // If no exact match, take the first one
            if (!matchedUniversity && universities.length > 0) {
              matchedUniversity = universities[0];
            }

            if (matchedUniversity) {
              console.log('Found university:', matchedUniversity.name);
              setUniversity(matchedUniversity);
              return;
            }
          }
        }
      }

      // If search fails, try with a more generic approach
      response = await fetch('/api/universities?limit=50');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const universities = Array.isArray(data.data) ? data.data : [data.data];

          // Try to find by partial name match
          const matchedUniversity = universities.find((uni: University) => {
            if (!uni.name) return false;
            const uniName = uni.name.toLowerCase();
            const searchName = currentUniversityName.toLowerCase();
            return uniName.includes(searchName) || searchName.includes(uniName);
          });

          if (matchedUniversity) {
            console.log('Found university by partial match:', matchedUniversity.name);
            setUniversity(matchedUniversity);
            return;
          }
        }
      }

      console.log('No university found');
      setNotFound(true);

    } catch (err: any) {
      console.error('Error fetching university deadlines:', err);
      setError(err.message || 'Failed to load deadline information');
    } finally {
      setIsLoading(false);
    }
  }, [currentUniversityName, currentUniversitySlug]);

  useEffect(() => {
    fetchUniversityDeadlines();
  }, [fetchUniversityDeadlines]);

  const renderDeadlineCard = (
    icon: React.ElementType,
    title: string,
    value: string | number | undefined,
    type: 'deadline' | 'info' | 'requirement' = 'info',
    colorScheme: string = 'blue',
    description?: string
  ) => {
    if (!value && value !== 0) return null;

    const IconComponent = icon;
    let statusBadge = null;
    let displayValue = String(value);

    if (type === 'deadline') {
      const status = getDeadlineStatus(String(value));
      statusBadge = (
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getDeadlineStatusColor(status)}`}>
          {status === 'upcoming' && 'Upcoming'}
          {status === 'soon' && 'Due Soon'}
          {status === 'passed' && 'Passed'}
          {status === 'unknown' && 'TBD'}
        </div>
      );
      displayValue = formatDeadline(String(value));
    }

    return (
      <div className={`p-6 bg-gradient-to-br from-${colorScheme}-50 to-${colorScheme}-100 border border-${colorScheme}-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 bg-${colorScheme}-200 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
              <IconComponent className={`h-6 w-6 text-${colorScheme}-700`} />
            </div>
            <div>
              <h3 className={`text-lg font-bold text-${colorScheme}-900`}>{title}</h3>
              {description && (
                <p className={`text-sm text-${colorScheme}-700 mt-1`}>{description}</p>
              )}
            </div>
          </div>
          {statusBadge}
        </div>

        <div className={`text-${colorScheme}-800`}>
          <p className="text-lg font-semibold">{displayValue}</p>
        </div>
      </div>
    );
  };

  const renderIntakeCard = (intake: Intakes, index: number) => {
    const colorSchemes = ['blue', 'green', 'purple', 'indigo', 'pink'];
    const colorScheme = colorSchemes[index % colorSchemes.length];

    return (
      <div key={index} className={`p-4 bg-gradient-to-br from-${colorScheme}-50 to-${colorScheme}-100 border border-${colorScheme}-200 rounded-xl`}>
        <h4 className={`font-bold text-${colorScheme}-900 mb-2 capitalize`}>
          {intake.name}
        </h4>

        {intake.end_date && (
          <div className="flex items-center gap-2 mb-2">
            <Calendar className={`h-4 w-4 text-${colorScheme}-600`} />
            <span className={`text-sm text-${colorScheme}-800 font-medium`}>
              Deadline: {formatDeadline(intake.end_date)}
            </span>
          </div>
        )}

        {intake.notes && (
          <p className={`text-xs text-${colorScheme}-700 mt-2 italic`}>
            {intake.notes}
          </p>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="p-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl mb-6">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Loading Deadline Information</h3>
        <p className="text-slate-600">Fetching deadline data for {currentUniversityName}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="p-6 bg-gradient-to-br from-red-100 to-red-200 rounded-3xl mb-6 max-w-md mx-auto">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto" />
        </div>
        <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Deadlines</h3>
        <p className="text-red-600 mb-6">{error}</p>
        <button
          onClick={fetchUniversityDeadlines}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (notFound || !university) {
    return (
      <div className="text-center py-16">
        <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl mb-6 max-w-md mx-auto">
          <AlertTriangle className="h-12 w-12 text-gray-600 mx-auto" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">University Not Found</h3>
        <p className="text-gray-600 mb-4">
          Could not find deadline information for "{currentUniversityName}"
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Slug searched: {currentUniversitySlug}
        </p>
        <button
          onClick={fetchUniversityDeadlines}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Check if university has any deadline-related information
  const hasDeadlineInfo = !!(
    university.deadline ||
    university.admission_fee ||
    university.english_requirement ||
    university.cgpa_requirement ||
    (university.intakes && university.intakes.length > 0) ||
    university.housing_available ||
    university.scholarship_available
  );

  const hasContactInfo = !!(university.email || university.phone || university.address);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-100 rounded-2xl">
          <Clock className="h-8 w-8 text-orange-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-black text-slate-900">
            Deadlines & Requirements
          </h2>
          <p className="text-slate-600">
            Important dates and admission requirements for {university.name}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
          <Target className="h-4 w-4" />
          <span className="font-bold text-sm">Current University</span>
        </div>
      </div>

      {/* University Basic Info */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-slate-200 rounded-xl">
            <Building className="h-6 w-6 text-slate-700" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{university.name}</h3>
            {university.location && (
              <p className="text-slate-600 flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4" />
                {university.location}
              </p>
            )}
            {university.status && (
              <div className={`inline-flex items-center gap-2 px-3 py-1 mt-2 rounded-full text-sm font-bold ${university.status.toLowerCase() === 'open'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
                }`}>
                <div className={`w-2 h-2 rounded-full ${university.status.toLowerCase() === 'open' ? 'bg-green-600' : 'bg-red-600'
                  }`} />
                {university.status}
              </div>
            )}
          </div>
        </div>

        {university.description && (
          <p className="text-slate-700 mb-4">{university.description}</p>
        )}

        {hasContactInfo && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {university.email && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="h-4 w-4" />
                <span>{university.email}</span>
              </div>
            )}
            {university.phone && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="h-4 w-4" />
                <span>{university.phone}</span>
              </div>
            )}
            {university.address && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="h-4 w-4" />
                <span>{university.address}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {!hasDeadlineInfo && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
              <Info className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 mb-2">Limited Deadline Information</h3>
              <p className="text-amber-800 text-sm mb-3">
                Detailed deadline information for {university.name} is not yet available in our database.
                We recommend visiting the official university website for the most up-to-date information.
              </p>
              {university.application_link && (
                <a
                  href={university.application_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-all duration-300"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit Official Website
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {hasDeadlineInfo && (
        <>
          {/* Main Application Deadline */}
          {university.deadline && (
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <Calendar className="h-6 w-6 text-red-600" />
                Main Application Deadline
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {renderDeadlineCard(
                  Calendar,
                  'Application Deadline',
                  university.deadline,
                  'deadline',
                  'red',
                  'General application deadline'
                )}
              </div>
            </div>
          )}

          {/* Specific Intake Deadlines */}
          {university.intakes && university.intakes.length > 0 && (
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <Calendar className="h-6 w-6 text-blue-600" />
                Intake Deadlines
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {university.intakes.map((intake: Intakes, index: number) => renderIntakeCard(intake, index))}
              </div>
            </div>
          )}

          {/* Financial Information */}
          <div>
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-green-600" />
              Financial Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderDeadlineCard(
                DollarSign,
                'Admission Fee',
                university.admission_fee ? `$${university.admission_fee}` : undefined,
                'info',
                'green',
                'Application processing fee'
              )}
              {university.scholarship_available && renderDeadlineCard(
                Award,
                'Scholarships Available',
                'Yes',
                'info',
                'yellow',
                'Scholarships are available for eligible students'
              )}
            </div>
          </div>

          {/* Academic Requirements */}
          <div>
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-purple-600" />
              Academic Requirements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderDeadlineCard(
                Award,
                'CGPA Requirement',
                university.cgpa_requirement,
                'requirement',
                'purple',
                'Minimum CGPA required for admission'
              )}
              {renderDeadlineCard(
                Globe,
                'English Requirement',
                university.english_requirement,
                'requirement',
                'indigo',
                'English language proficiency requirement'
              )}
            </div>
          </div>

          {/* Additional Services */}
          {university.housing_available && (
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <Home className="h-6 w-6 text-blue-600" />
                Additional Services
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderDeadlineCard(
                  Home,
                  'Housing Available',
                  'Yes',
                  'info',
                  'blue',
                  'University housing is available for students'
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Action Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-blue-900 mb-2">
              Ready to Apply?
            </h3>
            <p className="text-blue-800">
              Visit the official university website to start your application process.
            </p>
            {university.updatedAt && (
              <p className="text-sm text-blue-600 mt-2">
                Last updated: {formatDeadline(university.updatedAt)}
              </p>
            )}
          </div>
          {university.application_link && (
            <a
              href={university.application_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <ExternalLink className="h-5 w-5" />
              Apply Now
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeadlinesTab;