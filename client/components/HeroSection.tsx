'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useLanguage } from '../app/[lang]/LanguageContext';
import { academicAreas, accessTypes, courseLanguages, degreeTypes } from '../constants/constants';
import AnimatedLogos from './AnimatedLogos';
import Image from 'next/image';

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

      <div className="relative z-10 mt-6 mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section - Search */}
            <div className="flex flex-col justify-center">
              <div className="text-center lg:text-left mb-12">
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                  {t('findYourPerfectProgram')}
                </h1>
                <p className="text-xl text-teal-50">
                  {t('explorePrograms')}
                </p>
              </div>

              <div
                className=""
                role="search"
                aria-label={t('programSearch')}
              >
                <div className=" bg-white/10 rounded-2xl shadow-xl p-6 lg:p-8 flex flex-col sm:flex-row items-stretch sm:items-end gap-4 mb-6 p-2 sm:p-4 rounded-xl shadow-lg relative z-10">
                  <div className="w-full sm:w-[40%] relative z-20">
                    <SelectField
                      name="degreeType"
                      value={filters.degreeType}
                      onChange={handleFilterChange}
                      options={degreeTypes}
                      label={t('selectDegreeType')}
                      placeholder={t('selectDegreeType')}
                      language={language}
                    />
                  </div>

                  <div className="w-full sm:w-[40%] relative z-20">
                    <SelectField
                      name="courseLanguage"
                      value={filters.courseLanguage}
                      onChange={handleFilterChange}
                      options={courseLanguages}
                      label={t('selectLanguage')}
                      placeholder={t('selectLanguage')}
                      language={language}
                    />
                  </div>

                  <button
                    onClick={handleSearch}
                    onKeyDown={handleKeyDown}
                    className="w-full sm:w-12 h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-full sm:rounded-full transition-colors flex items-center justify-center shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-300 relative z-20"
                    aria-label={t('searchPrograms')}
                  >
                    <Search className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Section - Map */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full h-96">
                <img
                  src="/italy-map.svg"
                  alt="Map of Italy"
                  className="filter drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;