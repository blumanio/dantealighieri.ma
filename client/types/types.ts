// types.ts

// For form data
export interface FormData {
    firstName: string;
    lastName: string;
    birthDate: string;
    country: string;
    city: string;
    degreeType: string;
    accessType: string;
    courseLanguage: string;
    program: string;
    documents: (File | string)[];
    paymentOption: string;
    receipt: File | string;
    academicArea: string;
  }
  
  // For course data
  export interface Course {
    id: string;
    nome: string;
    tipo: string;
    accesso: string;
    language: string;
    comune: string;
  }
  
  // For academic areas
  export interface AcademicArea {
    value: string;
    label: string;
  }
  
  // For countries
  export interface Country {
    code: string;
    name: string;
  }
  
  // For form steps
  export interface Step {
    name: string;
    number: number;
  }
  
  // For form props
  export interface FormProps {
    formData: FormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  }
  
  // Specific props for each form component
  export interface GeneralInfoFormProps extends FormProps {
    courses: Course[];
    isLoadingCourses: boolean;
    isProgramSelectDisabled: boolean;
  }
  
  export interface DocumentUploadFormProps extends FormProps {
    handleDocumentUpload: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  }
  
// in types/types.ts
export interface PaymentFormProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
  
  // For custom hooks
  export interface UseFormReturn {
    formData: FormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleDocumentUpload: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  export interface UseCoursesReturn {
    courses: Course[];
    isLoadingCourses: boolean;
  }