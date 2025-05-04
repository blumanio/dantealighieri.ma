'use client';

import React, { useState, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  School, GraduationCap, Euro, Calendar, AlertTriangle,
  ChevronDown, ChevronUp, ExternalLink, MapPin, Search
} from 'lucide-react';

interface University {
  id: string;
  name: string;
  status: string;
  admission_fee: number;
  cgpa_requirement: string;
  deadline: string;
  english_requirement: string;
  location?: string;
  programs_offered?: string[];
  student_population?: number;
  acceptance_rate?: string;
  housing_available?: boolean;
  scholarship_available?: boolean;
  application_link?: string;
  virtual_tour_available?: boolean;
  orientation_date?: string;
  course_start_date?: string;
  campus_facilities?: string[];
}

interface UniversityTableProps {
  universities: University[];
}

export function UniversityTable({ universities }: UniversityTableProps) {
  const { isSignedIn } = useUser();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    hasScholarship: false,
    hasHousing: false
  });

  // Process and sort universities
  const processedUniversities = useMemo(() => {
    return universities
      .filter(uni => {
        const matchesSearch = !searchTerm || 
          uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          uni.location?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = !filters.status || uni.status === filters.status;
        const matchesScholarship = !filters.hasScholarship || uni.scholarship_available;
        const matchesHousing = !filters.hasHousing || uni.housing_available;

        return matchesSearch && matchesStatus && matchesScholarship && matchesHousing;
      })
      .sort((a, b) => {
        if (a.status !== b.status) return a.status === 'Open' ? -1 : 1;
        if (a.deadline && b.deadline) {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        return 0;
      });
  }, [universities, searchTerm, filters]);

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    expandedRows.has(id) ? newExpanded.delete(id) : newExpanded.add(id);
    setExpandedRows(newExpanded);
  };

  if (!universities.length) {
    return (
      <div className="p-8 text-center bg-white rounded-xl shadow-soft">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
          <School className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-primary mb-2">No Universities Found</h3>
        <p className="text-textSecondary">Try adjusting your search criteria.</p>
      </div>
    );
  }

  const SearchBar = () => (
    <div className="mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search universities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-12 py-3 bg-white rounded-full border border-neutral-200
                   focus:ring-2 focus:ring-primary/20 focus:border-primary/30
                   transition-all duration-300 placeholder:text-textSecondary"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
      </div>
    </div>
  );

  const FilterTags = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {Object.entries(filters).map(([key, value]) => {
        if (!value) return null;
        return (
          <button
            key={key}
            onClick={() => setFilters(prev => ({ ...prev, [key]: false }))}
            className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary
                     rounded-full text-sm hover:bg-primary/20 transition-colors duration-300"
          >
            {key.replace(/^has/, '')}
            <span className="text-xs">×</span>
          </button>
        );
      })}
    </div>
  );

  const UniversityCard = ({ university: uni }: { university: University }) => (
    <div className="bg-white rounded-xl shadow-soft hover:shadow-medium 
                  transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start gap-4 mb-4">
          <h3 className="text-lg font-medium text-primary hover:text-primary-dark 
                       transition-colors duration-300">
            {uni.name}
          </h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium
            ${uni.status === 'Open' 
              ? 'bg-primary/10 text-primary' 
              : 'bg-secondary/10 text-secondary'}`}>
            {uni.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-textSecondary">
            <MapPin className="h-4 w-4 text-primary/70" />
            <span>{uni.location || 'TBA'}</span>
          </div>
          <div className={`flex items-center gap-2 text-textSecondary ${!isSignedIn && 'blur-sm'}`}>
            <Calendar className="h-4 w-4 text-primary/70" />
            <span>{uni.deadline || 'TBA'}</span>
          </div>
        </div>

        <button
          onClick={() => toggleRow(uni.id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 
                   text-sm font-medium text-primary bg-primary/5 rounded-lg
                   hover:bg-primary/10 transition-all duration-300"
        >
          {expandedRows.has(uni.id) ? 'Show less' : 'Show more'}
          {expandedRows.has(uni.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {expandedRows.has(uni.id) && (
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Requirements Section */}
              <div className="bg-neutral-50 rounded-lg p-4">
                <h4 className="font-medium text-primary mb-4">Requirements</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between text-sm">
                    <span className="text-textSecondary">CGPA:</span>
                    <span className="font-medium text-primary">{uni.cgpa_requirement}</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-textSecondary">English:</span>
                    <span className="font-medium text-primary">{uni.english_requirement}</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-textSecondary">Fee:</span>
                    <span className="font-medium text-primary">
                      {uni.admission_fee === 0 ? 'Free' : `€${uni.admission_fee}`}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Features Section */}
              <div className="bg-neutral-50 rounded-lg p-4">
                <h4 className="font-medium text-primary mb-4">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {uni.housing_available && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Housing
                    </span>
                  )}
                  {uni.scholarship_available && (
                    <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                      Scholarship
                    </span>
                  )}
                  {uni.virtual_tour_available && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Virtual Tour
                    </span>
                  )}
                </div>
              </div>

              {/* Actions Section */}
              {uni.application_link && (
                <div className="bg-neutral-50 rounded-lg p-4">
                  <a
                    href={uni.application_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full gap-2 px-4 py-2
                           bg-primary text-white rounded-full hover:bg-primary-dark
                           transition-all duration-300 text-sm font-medium"
                  >
                    Apply Now
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <SearchBar />
      <FilterTags />
      
      <div className="grid grid-cols-1 gap-6">
        {processedUniversities.map(university => (
          <UniversityCard key={university.id} university={university} />
        ))}
      </div>
    </div>
  );
}