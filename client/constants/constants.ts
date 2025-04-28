// src/constants/index.ts

// Form steps
export const steps = [
  { name: 'General Info', number: 1 },
  { name: 'Upload Documents', number: 2 },
  { name: 'Payment', number: 3 }
];

// Academic areas
export const academicAreas = [
  {
    value: '01',
    label: {
      en: 'Mathematics and Computer Science',
      ar: 'الرياضيات وعلوم الحاسوب',
      it: 'Scienze Matematiche e Informatiche'
    }
  },
  {
    value: '02',
    label: {
      en: 'Physical Sciences',
      ar: 'العلوم الفيزيائية',
      it: 'Scienze fisiche'
    }
  },
  {
    value: '03',
    label: {
      en: 'Chemical Sciences',
      ar: 'العلوم الكيميائية',
      it: 'Scienze chimiche'
    }
  },
  {
    value: '04',
    label: {
      en: 'Earth Sciences',
      ar: 'علوم الأرض',
      it: 'Scienze della Terra'
    }
  },
  {
    value: '05',
    label: {
      en: 'Biological Sciences',
      ar: 'العلوم البيولوجية',
      it: 'Scienze biologiche'
    }
  },
  {
    value: '06',
    label: {
      en: 'Medical Sciences',
      ar: 'العلوم الطبية',
      it: 'Scienze mediche'
    }
  },
  {
    value: '07',
    label: {
      en: 'Agricultural and Veterinary Sciences',
      ar: 'العلوم الزراعية والبيطرية',
      it: 'Scienze agrarie e veterinarie'
    }
  },
  {
    value: '08',
    label: {
      en: 'Civil Engineering and Architecture',
      ar: 'الهندسة المدنية والعمارة',
      it: 'Ingegneria civile e Architettura'
    }
  },
  {
    value: '09',
    label: {
      en: 'Industrial and Information Engineering',
      ar: 'الهندسة الصناعية وهندسة المعلومات',
      it: "Ingegneria industriale e dell'informazione"
    }
  },
  {
    value: '10',
    label: {
      en: 'Ancient, Philological-Literary and Historical-Artistic Sciences',
      ar: 'العلوم القديمة والفيلولوجية-الأدبية والتاريخية-الفنية',
      it: "Scienze dell'antichità, filologico-letterarie e storico-artistiche"
    }
  },
  {
    value: '11',
    label: {
      en: 'Historical, Philosophical, Pedagogical and Psychological Sciences',
      ar: 'العلوم التاريخية والفلسفية والتربوية والنفسية',
      it: 'Scienze storiche, filosofiche, pedagogiche e psicologiche'
    }
  },
  {
    value: '12',
    label: {
      en: 'Legal Sciences',
      ar: 'العلوم القانونية',
      it: 'Scienze giuridiche'
    }
  },
  {
    value: '13',
    label: {
      en: 'Economic and Statistical Sciences',
      ar: 'العلوم الاقتصادية والإحصائية',
      it: 'Scienze economiche e statistiche'
    }
  },
  {
    value: '14',
    label: {
      en: 'Political and Social Sciences',
      ar: 'العلوم السياسية والاجتماعية',
      it: 'Scienze politiche e sociali'
    }
  }
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
export const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000'  // Use HTTP for local development
  : 'https://backend-jxkf29se8-mohamed-el-aammaris-projects.vercel.app'; 
export const COURSES_ENDPOINT = `${API_BASE_URL}/api/courses`;
export const APPLICATIONS_ENDPOINT = `${API_BASE_URL}/api/applications`;

// Degree types 'Open Access' "Entrance Test"
export const degreeTypes = [
  {
    value: 'Triennale', label: {
      en: 'Bachlor',
      ar: 'بكالوريوس ',
      it: 'Triennale'
    }
  },
  {
    value: 'Magistrale', label: {
      en: 'Master',
      ar: 'ماستر',
      it: 'Magistrale'
    },
  }, {
    value: 'Unique Cycle', label: {
      en: 'Unique Cycle',
      ar: 'دورة موحدة',
      it: 'ciclo unico'
    },
  }
];


// Access types
export const accessTypes = [
  {
    value: "Test d'ingresso", label: {
      en: 'Entrance Test',
      ar: 'امتحان القبول',
      it: 'Esame di ammissione'
    }
  },
  {
    value: 'Libero', label: {
      en: 'Open Access',
      ar: 'ولوج مفتوح',
      it: 'Accesso libero'
    }
  }
];

// Course languages
export const courseLanguages = [
  {
    value: 'EN', label: {
      en: 'English',
      ar: 'الإنجليزية',
      it: 'Inglese'
    }
  },
  {
    value: 'IT', label: {
      en: 'Italian',
      ar: 'الإيطالية',
      it: 'Italiano'
    }
  }
];

// Payment options
export const paymentOptions = [
  { value: 'creditCard', label: 'Credit Card' },
  { value: 'bankTransfer', label: 'Bank Transfer' },
  { value: 'paypal', label: 'PayPal' }
];