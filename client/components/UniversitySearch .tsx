import React from 'react';
import { Building2, GraduationCap, Euro, Calendar } from 'lucide-react';

const formatCGPA = (requirement :any) => {
  if (!requirement) return 'No CGPA Required';
  if (requirement === 'NO CGPA REQUIREMENT') return 'No CGPA Required';
  return requirement
    .replace('MINIMUM ', '')
    .replace(' FOR PAKISTAN', '')
    .replace('DIFFERENT CGPA REQUIREMENTS', 'Various Requirements');
};

const UniversitySearch = ({ universities = [] }: any) => {
  if (!universities.length) {
    return (
      <div className="rounded-lg bg-yellow-50 p-4 text-center">
        <p className="text-yellow-700">No universities found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="mb-4 md:mb-8 text-center px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Italian Universities</h1>
        <p className="mt-2 text-gray-600">Found {universities.length} univ.</p>
      </header>
      
      <div className="flex justify-center">
        <div className="w-full md:w-[90%] max-w-5xl overflow-x-auto">
          <div className="min-w-[800px]"> {/* Minimum width container for mobile */}
            <table className="w-full border-collapse table-auto bg-white">
              <thead className="sticky top-0 z-10 bg-gray-50">
                <tr>
                  <th className="border-b p-3 md:p-4 text-left font-medium text-gray-900 w-[35%]">Univ.</th>
                  <th className="whitespace-nowrap border-b p-3 md:p-4 text-left font-medium text-gray-900 w-20">Status</th>
                  <th className="whitespace-nowrap border-b p-3 md:p-4 text-left font-medium text-gray-900 w-28">Fee</th>
                  <th className="whitespace-nowrap border-b p-3 md:p-4 text-left font-medium text-gray-900 w-32">CGPA</th>
                  <th className="whitespace-nowrap border-b p-3 md:p-4 text-left font-medium text-gray-900 w-28">Deadline</th>
                  <th className="whitespace-nowrap border-b p-3 md:p-4 text-left font-medium text-gray-900 w-40">English</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {universities.map((uni :any) => (
                  <tr 
                    key={uni.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="p-3 md:p-4">
                      <div className="font-medium text-gray-900 pr-4 text-sm md:text-base">
                        {uni.name}
                      </div>
                    </td>
                    <td className="p-3 md:p-4">
                      <span className={`inline-flex items-center rounded-full px-2 md:px-2.5 py-0.5 text-xs font-medium ${
                        uni.status === 'Open' 
                          ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' 
                          : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                      }`}>
                        {uni.status || 'TBA'}
                      </span>
                    </td>
                    <td className="p-3 md:p-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Euro className="h-3 w-3 md:h-4 md:w-4 text-gray-500" />
                        <span className="text-xs md:text-sm">
                          {uni.admission_fee === 0 ? 'Free' : `€${uni.admission_fee}`}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 md:p-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <GraduationCap className="h-3 w-3 md:h-4 md:w-4 text-gray-500" />
                        <span className="text-xs md:text-sm">{formatCGPA(uni.cgpa_requirement)}</span>
                      </div>
                    </td>
                    <td className="p-3 md:p-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4 text-gray-500" />
                        <span className="text-xs md:text-sm">{uni.deadline || 'TBA'}</span>
                      </div>
                    </td>
                    <td className="p-3 md:p-4">
                      <div className="flex items-center space-x-1">
                        <Building2 className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                        <span className="text-xs md:text-sm truncate max-w-[120px] md:max-w-[160px]">
                          {uni.english_requirement}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversitySearch;