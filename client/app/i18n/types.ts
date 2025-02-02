// lib/i18n/types.ts
export type Locale = 'en' | 'it' | 'ar';

export interface Translation {
  common: {
    search: string;
    about: string;
    services: string;
    universities: string;
    deadline: string;
    apply: string;
    soon: string;
    contactUs: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaButton: string;
  };
  programs: {
    searchTitle: string;
    degreeType: string;
    accessType: string;
    courseLanguage: string;
    academicArea: string;
    searchPlaceholder: string;
    noResults: string;
    loadingMessage: string;
  };
  universities: {
    status: string;
    requirements: string;
    deadline: string;
    fee: string;
    location: string;
  };
}