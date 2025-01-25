import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Loader } from 'lucide-react';
import _ from 'lodash';
import PaginatedCourses from './PaginatedCourses';

const academicAreas = [
  { value: '01', label: 'Scienze Matematiche e Informatiche' },
  { value: '02', label: 'Scienze fisiche' },
  { value: '03', label: 'Scienze chimiche' },
  { value: '04', label: 'Scienze della Terra' },
  { value: '05', label: 'Scienze biologiche' },
  { value: '06', label: 'Scienze mediche' },
  { value: '07', label: 'Scienze agrarie e veterinarie' },
  { value: '08', label: 'Ingegneria civile e Architettura' },
  { value: '09', label: "Ingegneria industriale e dell'informazione" },
  { value: '10', label: "Scienze dell'antichità, filologico-letterarie e storico-artistiche" },
  { value: '11', label: 'Scienze storiche, filosofiche, pedagogiche e psicologiche' },
  { value: '12', label: 'Scienze giuridiche' },
  { value: '13', label: 'Scienze economiche e statistiche' },
  { value: '14', label: 'Scienze politiche e sociali' }
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

  const hasActiveFilters = Object.values(formData).some(value => value !== '');

  return (
    <div className="space-y-6 rounded-lg bg-gray-100 p-6">
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">Search Programs</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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

        <div className="relative mt-4">
          <input
            type="text"
            placeholder="Search within results..."
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-full border p-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400 h-4 w-4" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
        </div>
      ) : filteredCourses.length > 0 ? (
        <PaginatedCourses filteredCourses={filteredCourses} />
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