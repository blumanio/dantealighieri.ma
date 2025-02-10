// ProgramSearch.tsx

'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Loader } from 'lucide-react';
import _ from 'lodash';
import PaginatedCourses from './PaginatedCourses';
import { useLanguage } from '../app/[lang]/LanguageContext';
import { academicAreas, accessTypes, courseLanguages, degreeTypes } from '../constants/constants';

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
type Language = 'en' | 'ar' | 'it'

const defaultLanguage: Language = 'ar' // Default language should be 'en'
interface ProgramSearchProps {
  initialFilters?: {
    degreeType: string;
    accessType: string;
    courseLanguage: string;
    academicArea: string;
  };
}
const ProgramSearch: React.FC<ProgramSearchProps> = ({ initialFilters }) => {
  const { language = defaultLanguage, t } = useLanguage();
  
  useEffect(() => {
    setFormData(prev => ({ ...prev }));
  }, [language]);

  const [formData, setFormData] = useState({
    degreeType: initialFilters?.degreeType || '',
    accessType: initialFilters?.accessType || '',
    courseLanguage: initialFilters?.courseLanguage || '',
    academicArea: initialFilters?.academicArea || ''
  });
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllCourses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        'https://backend-jxkf29se8-mohamed-el-aammaris-projects.vercel.app/api/courses'
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

  const isRTL = language === 'ar';
  console.log(language, isRTL);

  return (
    <div className={`space-y-6 rounded-lg bg-gray-100 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">{t('searchTitle')}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <select
            name="degreeType"
            value={formData.degreeType}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200"
          >
            {degreeTypes.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label[language]}
              </option>
            ))}
          </select>

          <select
            name="accessType"
            value={formData.accessType}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200"
          >
            {accessTypes.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label[language]}
              </option>
            ))}
          </select>

          <select
            name="courseLanguage"
            value={formData.courseLanguage}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200"
          >
            {courseLanguages.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label[language]}
              </option>
            ))}
          </select>

          <select
            name="academicArea"
            value={formData.academicArea}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200"
          >
            <option value="">{t('academicArea')}</option>
            {academicAreas.map(area => (
              <option key={area.value} value={area.value}>
                {area.label[language]}
              </option>
            ))}
          </select>
        </div>

        <div className="relative mt-4">
          <input
            type="text"
            placeholder={t('searchWithinResults')}
            onChange={e => setSearchTerm(e.target.value)}
            className={`w-full rounded-full border p-2 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
          />
          <Search className={`absolute top-1/2 -translate-y-1/2 transform text-gray-400 h-4 w-4 ${isRTL ? 'right-3' : 'left-3'}`} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
          <span className="ml-3">{t('loadingMessage')}</span>
        </div>
      ) : filteredCourses.length > 0 ? (
        <PaginatedCourses filteredCourses={filteredCourses} />
      ) : (
        <div className="py-8 text-center text-gray-600">
          <Filter className="mx-auto mb-4 h-12 w-12" />
          <p className="text-xl">{t('noResults')}</p>
        </div>
      )}
    </div>
  );
};

export default ProgramSearch;
