'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useLanguage } from '../app/[lang]/LanguageContext';
import { academicAreas, accessTypes, courseLanguages, degreeTypes } from '../constants/constants';
import AnimatedLogos from './AnimatedLogos';

interface FilterOption {
  value: string;
  label: Record<string, string>;
}

interface Filters {
  degreeType: string;
  accessType: string;
  courseLanguage: string;
  academicArea: string;
}

const initialFilters: Filters = {
  degreeType: '',
  accessType: '',
  courseLanguage: '',
  academicArea: ''
};

const SelectField: React.FC<{
  name: keyof Filters;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: FilterOption[];
  label: string;
  placeholder: string;
  language: string;
}> = ({ name, value, onChange, options, label, placeholder, language }) => (
  <div className="space-y-2">
    <label htmlFor={name} className="text-white text-sm">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border border-white/20 bg-white/10 text-white p-3 focus:border-teal-300 focus:ring focus:ring-teal-200/50"
      aria-label={label}
    >
      <option value="">{placeholder}</option>
      {options.map(option => (
        <option key={option.value} value={option.value} className="text-gray-900">
          {option.label[language]}
        </option>
      ))}
    </select>
  </div>
);

const HeroSection: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { language = 'en', t } = useLanguage();
  const isRTL = language === 'ar';

  const [filters, setFilters] = useState<Filters>(initialFilters);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    router.push(`/${language}/program-search?${queryParams.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section 
      className="relative min-h-screen bg-gradient-to-b from-teal-600/80 to-teal-700/80 pt-24"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <AnimatedLogos />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-16 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              {t('findYourPerfectProgram')}
            </h1>
            <p className="text-xl text-teal-50">
              {t('explorePrograms')}
            </p>
          </div>

          <div 
            className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 lg:p-8"
            role="search"
            aria-label={t('programSearch')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <SelectField
                name="degreeType"
                value={filters.degreeType}
                onChange={handleFilterChange}
                options={degreeTypes}
                label={t('selectDegreeType')}
                placeholder={t('selectDegreeType')}
                language={language}
              />
              
              <SelectField
                name="accessType"
                value={filters.accessType}
                onChange={handleFilterChange}
                options={accessTypes}
                label={t('selectAccessType')}
                placeholder={t('selectAccessType')}
                language={language}
              />
              
              <SelectField
                name="courseLanguage"
                value={filters.courseLanguage}
                onChange={handleFilterChange}
                options={courseLanguages}
                label={t('selectLanguage')}
                placeholder={t('selectLanguage')}
                language={language}
              />
              
              <SelectField
                name="academicArea"
                value={filters.academicArea}
                onChange={handleFilterChange}
                options={academicAreas}
                label={t('selectAcademicArea')}
                placeholder={t('selectAcademicArea')}
                language={language}
              />
            </div>

            <button
              onClick={handleSearch}
              onKeyDown={handleKeyDown}
              className="w-full bg-white hover:bg-teal-50 text-teal-600 font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-300"
              aria-label={t('searchPrograms')}
            >
              <Search className="w-5 h-5" aria-hidden="true" />
              <span>{t('searchPrograms')}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;