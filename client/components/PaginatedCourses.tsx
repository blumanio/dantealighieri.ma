import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProgramRow from './ProgramRow';

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

interface PaginatedCoursesProps {
  filteredCourses: Course[];
}

const PaginatedCourses: React.FC<PaginatedCoursesProps> = ({ filteredCourses }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Calculate page numbers to show
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const pages = [];
    
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      pages.push(i);
    }

    if (currentPage - delta > 2) {
      pages.unshift('...');
    }
    if (currentPage + delta < totalPages - 1) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.unshift(1);
      if (totalPages !== 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Courses Grid */}
      <div className="grid grid-cols-1 gap-2">
        {currentCourses.map((course: Course) => (
          <ProgramRow key={course._id} course={course} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          {/* Page Info - Mobile */}
          <div className="text-sm text-textSecondary sm:hidden">
            Page {currentPage} of {totalPages}
          </div>

          {/* Navigation Buttons and Page Numbers */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white 
                       text-textSecondary border border-neutral-200
                       hover:bg-primary/5 hover:border-primary/20
                       disabled:opacity-50 disabled:hover:bg-white
                       transition-all duration-300"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page Numbers - Desktop */}
            <div className="hidden sm:flex items-center gap-1">
              {getPageNumbers().map((pageNum, idx) => (
                <button
                  key={idx}
                  onClick={() => typeof pageNum === 'number' && setCurrentPage(pageNum)}
                  disabled={pageNum === '...'}
                  className={`min-w-[2.5rem] h-10 flex items-center justify-center rounded-lg
                            transition-all duration-300 text-sm font-medium
                            ${pageNum === currentPage
                              ? 'bg-primary text-white shadow-soft'
                              : pageNum === '...'
                                ? 'text-textSecondary cursor-default'
                                : 'text-textSecondary hover:bg-primary/5 hover:text-primary'
                            }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white 
                       text-textSecondary border border-neutral-200
                       hover:bg-primary/5 hover:border-primary/20
                       disabled:opacity-50 disabled:hover:bg-white
                       transition-all duration-300"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Results Info - Desktop */}
          <div className="hidden sm:block text-sm text-textSecondary">
            Showing {indexOfFirstCourse + 1}-{Math.min(indexOfLastCourse, filteredCourses.length)} of {filteredCourses.length} results
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginatedCourses;