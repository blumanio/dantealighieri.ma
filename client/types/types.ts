// client/types/types.ts

// For form data
export interface GFormData {
  paymentOption: string | number | readonly string[] | undefined;
  academicArea: any; // Consider more specific types if possible
  courseLanguage: any; // Consider more specific types if possible
  accessType: any;     // Consider more specific types if possible
  firstName: string;
  lastName: string;
  birthDate: string;
  country: string;
  city: string;
  degreeType: string;
  program: string;
  userId: string;
}

// For course data
export interface Course {
  id: string;
  nome: string;
  tipo: string;
  accesso: string;
  language: string;
  comune: string;
  trackedCount: number;
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

export interface PaymentFormProps {
  formData: GFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// For custom hooks
export interface UseFormReturn {
  formData: GFormData; // Assuming FormData here is your GFormData or similar, not native FormData
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleDocumentUpload: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface UseCoursesReturn {
  courses: Course[];
  isLoadingCourses: boolean;
}

// --- Revised Page Prop Types ---
// These types are for when params/searchParams are resolved objects,
// which is typical for both Server and Client components.

export interface PageParams {
  lang?: string; // Optional if not all pages have lang
  slug?: string; // Optional if not all pages have slug
  [key: string]: string | undefined; // For other dynamic segments
}

export interface PageSearchParams {
  [key: string]: string | string[] | undefined;
}

// General Page Props for components that receive resolved params/searchParams
export interface ResolvedPageProps {
  params: PageParams;
  searchParams?: PageSearchParams; // searchParams is optional
}

// Example usage for a specific page:
// export interface MyBlogPageProps extends ResolvedPageProps {
//   params: { // Override to be more specific and required
//     lang: string;
//     slug: string;
//   };
//   // add other props specific to MyBlogPage
// }

// If you truly have scenarios where params/searchParams are Promises
// (e.g., being passed to React.use in a Client Component from a Server Component),
// define those types separately and use them only where appropriate.
// Avoid making these Promise-based types the default for all page props.
export interface AsyncPageProps {
  params: Promise<PageParams>;
  searchParams?: Promise<PageSearchParams>;
}

// Original Promise-based types (consider if these are truly needed or can be replaced by ResolvedPageProps)
// It's generally safer for params/searchParams to be typed as resolved objects unless explicitly dealing with promises.
export interface OriginalBasePageProps {
  params: Promise<{ lang: string; }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined; }>;
}

export interface OriginalBlogPageProps {
  params: Promise<{ lang: string; slug: string; }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined; }>;
}

export interface OriginalBlogIndexProps {
  params: Promise<{ lang: string; }>;
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

export interface IConversation {
  _id: string;
  participants: string[];
  messages: IMessage[];
}

export interface IMessage {
   _id: string;
    sender: string;
    content: string;
    readBy?: string[];
    createdAt: string | Date;
}