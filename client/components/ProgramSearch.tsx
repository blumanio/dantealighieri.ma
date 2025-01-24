import React, { useState, useMemo } from 'react';
import { Search, Filter, Loader, Building2, MapPin, Lock, Unlock } from 'lucide-react';
import _ from 'lodash';
import PaginatedCourses from './PaginatedCourses';

const academicAreas = [
  { value: 'scientific', label: 'Scientific' },
  { value: 'humanistic', label: 'Humanistic' },
  { value: 'social', label: 'Social Sciences' },
  { value: 'medical', label: 'Medical' },
  { value: 'engineering', label: 'Engineering' }
];

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



const ProgramSearch: React.FC = () => {
  const [formData, setFormData] = useState({
    degreeType: '',
    accessType: '',
    courseLanguage: '',
    academicArea: ''
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const hasActiveFilters = Object.values(formData).some(value => value !== '');

  const fetchCourses = async (reset = false) => {
    if (!hasActiveFilters) return;
    
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        ...formData,
        page: reset ? '1' : page.toString(),
        limit: '9'
      });

      const response = await fetch(
        `https://backend-jxkf29se8-mohamed-el-aammaris-projects.vercel.app/api/courses?${params.toString()}`
      );
      const data = await response.json();

      setCourses(reset ? data : prev => [...prev, ...data]);
      setPage(reset ? 1 : prev => prev + 1);
      setHasMore(data.length === 9);
    } catch (error) {
      console.error('Error:', error);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(course =>
      Object.values(course).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [courses, searchTerm]);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newFormData);
    setPage(1);
    setCourses([]);
    
    if (Object.values(newFormData).some(value => value !== '')) {
      await fetchCourses(true);
    }
  };

  return (
    <div className="space-y-6 rounded-lg bg-gray-100 p-6">
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">Search Programs</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Filters */}
          <select
            name="degreeType"
            value={formData.degreeType}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200"
          >
            <option value="">Select Degree Type</option>
            <option value="Triennale">Triennale - bachelor</option>
            <option value="Magistrale">Magistrale - Master</option>
            <option value="Ciclo Unico">Ciclo Unico - 5 years</option>
          </select>
          
          <select
            name="accessType"
            value={formData.accessType}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200"
          >
            <option value="">Select Access Type</option>
            <option value="Libero">Libero - Open Access</option>
            <option value="Test d'ingresso">Test d'ingresso - Exam </option>
          </select>
          
          <select
            name="courseLanguage"
            value={formData.courseLanguage}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200"
          >
            <option value="">Select Language</option>
            <option value="IT">Italian</option>
            <option value="EN">English</option>
          </select>
          
          <select
            name="academicArea"
            value={formData.academicArea}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200"
          >
            <option value="">Select Academic Area</option>
            {academicAreas.map(area => (
              <option key={area.value} value={area.value}>{area.label}</option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Search within results..."
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-full border p-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400 h-4 w-4" />
          </div>
        )}
      </div>

      {!hasActiveFilters ? (
        <div className="py-8 text-center text-gray-600">
          <Filter className="mx-auto mb-4 h-12 w-12" />
          <p className="text-xl">Please select at least one filter to start searching.</p>
        </div>
      ) : isLoading && page === 1 ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
        </div>
      ) : filteredCourses.length > 0 ? (
        <>
          <PaginatedCourses filteredCourses={filteredCourses} />
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => fetchCourses()}
                className="flex items-center rounded-full bg-indigo-600 px-4 py-2 font-bold text-white transition duration-300 hover:bg-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="py-8 text-center text-gray-600">
          <Filter className="mx-auto mb-4 h-12 w-12" />
          <p className="text-xl">No courses found. Please adjust your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ProgramSearch;