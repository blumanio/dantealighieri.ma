// src/hooks/useForm.ts

import { useState, ChangeEvent } from 'react';
import { FormData } from '../types/types';

const useForm = (initialState: FormData) => {
  const [formData, setFormData] = useState<FormData>(initialState);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'degreeType' || name === 'accessType' ? { program: '' } : {})
    }));
  };

  const handleDocumentUpload = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setFormData(prev => {
        const updatedDocuments = [...prev.documents];
        updatedDocuments[index] = file;
        return { ...prev, documents: updatedDocuments };
      });
    } else {
      // Handle error (e.g., show a toast notification)
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({ ...prev, [e.target.name]: file }));
    } else {
      // Handle error (e.g., show a toast notification)
    }
  };

  return {  formData, handleChange, handleDocumentUpload, handleFileChange };
};

export default useForm;