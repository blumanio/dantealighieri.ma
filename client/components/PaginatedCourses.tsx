import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProgramRow from './ProgramRow';

const PaginatedCourses = ({ filteredCourses }: any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
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
  return (
    <>
      <div className="mt-6 flex items-center justify-center space-x-4">
        <button
          onClick={() => setCurrentPage(prev => prev - 1)}
          disabled={currentPage === 1}
          className="flex items-center rounded-md bg-white px-4 py-2 text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </button>

        <span className="text-gray-600">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center rounded-md bg-white px-4 py-2 text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-1">
        {currentCourses.map((course: Course) => (
          <ProgramRow key={course._id} course={course} />
        ))}
      </div>



    </>
  );
};

export default PaginatedCourses;