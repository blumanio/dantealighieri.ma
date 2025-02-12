// types.ts

// For form data
export interface GFormData {
  paymentOption: string | number | readonly string[] | undefined;
  academicArea: any;
  courseLanguage: any;
  accessType: any;
  firstName: string;
  lastName: string;
  birthDate: string;
  country: string;
  city: string;
  degreeType: string;
  program: string;
  userId:string
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
    formData: GFormData;
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
  formData: GFormData;
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
// types/types.ts
export interface BasePageProps {
  params: Promise<{
    lang: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined; }>;
}

// For blog pages
export interface BlogPageProps {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined; }>;
}

export interface BlogIndexProps {
  params: Promise<{
      lang: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined; }>;
}