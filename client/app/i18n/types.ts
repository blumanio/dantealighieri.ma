// lib/i18n/types.ts

export type Locale = 'en' | 'it' | 'ar';

export interface ImageAlt {
  graduation: string;
  diploma: string;
}

export interface FeatureTranslation {
  title: string;
  description: string;
}

export interface CommonTranslation {
  search: string;
  about: string;
  services: string;
  universities: string;
  deadline: string;
  apply: string;
  soon: string;
  contactUs: string;
}

export interface HeroTranslation {
  title: string;
  subtitle: string;
  ctaButton: string;
}

export interface ProgramsTranslation {
  searchTitle: string;
  degreeType: string;
  accessType: string;
  courseLanguage: string;
  academicArea: string;
  searchPlaceholder: string;
  noResults: string;
  loadingMessage: string;
}

export interface UniversitiesTranslation {
  status: string;
  requirements: string;
  deadline: string;
  fee: string;
  location: string;
}

export interface ServicesTranslation {
  title: string;
  description: string;
  helpedMoreThan: string;
  students: string;
  admissionsTitle: string;
  admissionsDescription: string;
  scholarshipTitle: string;
  scholarshipDescription: string;
}

export interface FounderTranslation {
  title: string;
  intro: string;
  achievementsTitle: string;
  achievements: string[];
  experienceTitle: string;
  experienceDesc: string;
  stats: string[];
  connectWith: string;
  imageAlt: ImageAlt;
}
export interface AboutTranslation {
  pageTitle: string;
  subtitle: string;
  missionTitle: string;
  missionDescription: string;
  whyChooseUsTitle: string;
  featureTitle1: string;
  featureDescription1: string;
  featureTitle2: string;
  featureDescription2: string;
  featureTitle3: string;
  featureDescription3: string;
  featureTitle4: string;
  featureDescription4: string;
  ourStoryTitle: string;
  ourStoryFoundingStory: string;
  ourStoryImpact: string;
  ctaTitle: string;
  ctaButtonText: string;
  imageAltUniversity: string;
}
export interface FooterTranslation {
  description: string;
  quickLinks: string;
  contactUs: string;
  followUs: string;
  email: string;
  phone: string;
  location: string;
  copyright: string;
  linkAbout: string;
  linkUniversities: string;
  linkCourses: string;
}

export interface Translation {
  common: CommonTranslation;
  hero: HeroTranslation;
  programs: ProgramsTranslation;
  universities: UniversitiesTranslation;
  services: ServicesTranslation;
  founder: FounderTranslation;
  about: AboutTranslation;
  footer: FooterTranslation;

}

// Type guard for checking valid locale
export function isLocale(value: string): value is Locale {
  return ['en', 'ar', 'it'].includes(value);
}

// Helper type for accessing nested translation keys
export type TranslationKey<
  T extends keyof Translation,
  K extends keyof Translation[T]
> = `${T}.${K & string}`;