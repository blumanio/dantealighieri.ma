'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Loader, GraduationCap } from 'lucide-react';
import _ from 'lodash';
import PaginatedCourses from './PaginatedCourses';
import { useLanguage } from '@/context/LanguageContext'
import { academicAreas, accessTypes, courseLanguages, degreeTypes } from '../constants/constants';
import AnimatedLogos from './AnimatedLogos';

interface Course {
  _id: string;
  nome: string;
  link: string;
  tipo: string;
  uni: string;
  accesso: string;
  area: string;
  lingua: string;
  comune: string;
}

interface ProgramSearchProps {
  initialFilters?: {
    degreeType: string;
    accessType: string;
    courseLanguage: string;
    academicArea: string;
  };
}

const ProgramSearch: React.FC<ProgramSearchProps> = ({ initialFilters }) => {
  const { language = 'en', t } = useLanguage();
  const isRTL = language === 'ar';

  const [formData, setFormData] = useState({
    degreeType: initialFilters?.degreeType || '',
    accessType: initialFilters?.accessType || '',
    courseLanguage: initialFilters?.courseLanguage || '',
    academicArea: initialFilters?.academicArea || ''
  });
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(prev => ({ ...prev }));
  }, [language]);
  const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'; // Fallback to localhost for local dev
  const fetchAllCourses = async () => {
    const targetUrl = `${API_BASE_URL}/api/courses`;
    setIsLoading(true);
    try {
      const response = await fetch(
        targetUrl
      );
      const data = await response.json();
      setAllCourses(data);
    } catch (error) {
      console.error('Error:', error);
      setAllCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      const matchesFilters = (
        (!formData.degreeType || course.tipo === formData.degreeType) &&
        (!formData.accessType || course.accesso === formData.accessType) &&
        (!formData.courseLanguage || course.lingua === formData.courseLanguage) &&
        (!formData.academicArea || course.area === formData.academicArea)
      );

      const matchesSearch = !searchTerm ||
        Object.values(course).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );

      return matchesFilters && matchesSearch;
    });
  }, [allCourses, formData, searchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className={`min-h-screen bg-neutral-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="w-full">
        <AnimatedLogos />
      </div>

      {/* Search Container */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-soft p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary">
              {t('programSearch', 'searchTitle')}
            </h2>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: 'degreeType',
                options: degreeTypes,
                value: formData.degreeType
              },
              {
                name: 'accessType',
                options: accessTypes,
                value: formData.accessType
              },
              {
                name: 'courseLanguage',
                options: courseLanguages,
                value: formData.courseLanguage
              },
              {
                name: 'academicArea',
                options: academicAreas,
                value: formData.academicArea,
                placeholder: t('programSearch', 'academicArea')
              }
            ].map((filter) => (
              <select
                key={filter.name}
                name={filter.name}
                value={filter.value}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-neutral-50 border border-neutral-200
                         text-textPrimary focus:ring-2 focus:ring-primary/20 focus:border-primary/30
                         transition-all duration-300"
              >
                {filter.placeholder && <option value="">{filter.placeholder}</option>}
                {filter.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label[language as keyof typeof option.label] ?? option.label['en']}
                  </option>
                ))}
              </select>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative mt-6">
            <input
              type="text"
              placeholder={t('programSearch', 'searchPlaceholder')}
              onChange={e => setSearchTerm(e.target.value)}
              className={`w-full rounded-full px-12 py-3 bg-neutral-50 border border-neutral-200
                       text-textPrimary placeholder-textSecondary
                       focus:ring-2 focus:ring-primary/20 focus:border-primary/30
                       transition-all duration-300`}
            />
            <Search className={`absolute top-1/2 -translate-y-1/2 transform text-primary/70 
                            h-5 w-5 ${isRTL ? 'right-4' : 'left-4'}`} />
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin">
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary rounded-full animate-spin-fast"></div>
                </div>
              </div>
              <p className="text-textSecondary">{t('programSearch', 'loadingMessage')}</p>
            </div>
          ) : filteredCourses.length > 0 ? (
            <PaginatedCourses filteredCourses={filteredCourses} />
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
                <Filter className="h-8 w-8 text-primary" />
              </div>
              <p className="text-xl text-textPrimary">{t('programSearch', 'noResults')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramSearch;