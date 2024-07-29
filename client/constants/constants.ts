// src/constants/index.ts

// Form steps
export const steps = [
  { name: 'General Info', number: 1 },
  { name: 'Upload Documents', number: 2 },
  { name: 'Payment', number: 3 }
];

// Academic areas
export const academicAreas = [
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

// Arab countries
export const arabCountries = [
  { code: 'MA', name: 'Morocco' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'QA', name: 'Qatar' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'OM', name: 'Oman' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'JO', name: 'Jordan' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'SY', name: 'Syria' },
  { code: 'YE', name: 'Yemen' },
  { code: 'LY', name: 'Libya' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SO', name: 'Somalia' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'KM', name: 'Comoros' },
  { code: 'MR', name: 'Mauritania' }
];

// API endpoints (if you're using environment variables)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export const COURSES_ENDPOINT = `${API_BASE_URL}/api/courses`;
export const APPLICATIONS_ENDPOINT = `${API_BASE_URL}/applications`;

// Degree types
export const degreeTypes = [
  { value: 'Triennale', label: 'Bachelor' },
  { value: 'Magistrale', label: 'Master' }
];

// Access types
export const accessTypes = [
  { value: "Test d'ingresso", label: "Entrance Test" },
  { value: 'Libero', label: 'Open Access' }
];

// Course languages
export const courseLanguages = [
  { value: 'EN', label: 'English' },
  { value: 'IT', label: 'Italian' }
];

// Payment options
export const paymentOptions = [
  { value: 'creditCard', label: 'Credit Card' },
  { value: 'bankTransfer', label: 'Bank Transfer' },
  { value: 'paypal', label: 'PayPal' }
];