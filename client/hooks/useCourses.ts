// src/hooks/useCourses.ts

import { useState, useEffect } from 'react';
import axios from 'axios';
import { GFormData, Course } from '../types/types';

const useCourses = (formData: GFormData) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      if (
        !formData.degreeType ||
        !formData.accessType ||
        !formData.courseLanguage ||
        !formData.academicArea
      )
        return;

      setIsLoadingCourses(true);
      try {
        const params = new URLSearchParams({
          tipo: formData.degreeType,
          accesso: formData.accessType,
          lingua: formData.courseLanguage,
          area: formData.academicArea
        });
        const response = await axios.get<Course[]>(
          `/api/courses?${params.toString()}`
        );
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        // Handle error (e.g., show a toast notification)
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [
    formData.degreeType,
    formData.accessType,
    formData.courseLanguage,
    formData.academicArea
  ]);

  return { courses, isLoadingCourses };
};

export default useCourses;