// lib/i18n/types.ts

export type Locale = 'en' | 'it' | 'ar';

export interface CommonTranslation {
  search: string;
  about: string;
  services: string;
  universities: string;
  deadline: string;
  apply: string;
  soon: string;
  contactUs: string;
  editMode: string;
  notProvided: string;
  viewMode: string;
  selectOption: string;
  saveChanges: string;
  cancel: string;
  daysRemaining: string,
      moreInfo: string;
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

  clickLink: string;
  signInToAccess: string
}

export interface UniversitiesTranslation {
  status: string;
  requirements: string;
  deadline: string;
  fee: string;
  location: string;
  pageTitle: string;
  found: string;
  university: string;

  lastUpdate: string;
  login: string;
  loginPrompt: string;
  showMore: string;
  showLess: string;
  locationTBA: string;
  tba: string;
  free: string;
  open: string;
  closed: string;
  comingSoon: string;
  availableIntakes: string;
  start: string;
  end: string;
  notes: string;
  resources: string;
  watchTutorial: string;
  readBlog: string;
  visitWebsite: string;
  searchPlaceholder: string;
  filters: string;
  feeFilter: string;
  clearFilters: string;
  clearAllFilters: string;
  noResults: string;
  filterByStatus: string;
  filterByFee: string;
  paid: string;
  protectedContent: string;
  apply: string
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
  imageAltGraduation: string;
  imageAltDiploma: string;
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

export interface ProgramSearchTranslation {
  searchTitle: string;
  degreeType: string;
  accessType: string;
  courseLanguage: string;
  academicArea: string;
  searchPlaceholder: string;
  noResults: string;
  loadingMessage: string;
}


interface ProfileTranslations {
  // General Page
  pageTitle: string;
  signInPrompt: string;
  loading: string;

  // Tabs
  tabsPersonalData: string;
  tabsFavorites: string;
  tabsApplicationGuide: string;
  tabsScholarships: string;

  // Personal Data Section (from your last i18n structure)
  personalDataTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  nationality: string;
  countryOfResidence: string;
  address: string;
  editButton: string; // Assuming these are for a manual form if not using Clerk's UI fully
  saveButton: string;
  cancelButton: string;
  personalDataClerkNote: string; // New specific key for the note

  // Account Settings (from your last i18n structure, if used directly)
  accountSettingsTitle: string;
  changePassword: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  languagePreference: string;
  notifications: string;
  emailNotifications: string;
  deleteAccount: string;
  deleteAccountWarning: string;

  // My Applications (from your last i18n structure, if used directly)
  myApplicationsTitle: string;
  noApplications: string;
  applicationDate: string;
  programName: string;
  universityName: string;
  status: string;
  viewDetails: string;

  // Saved Programs (from your last i18n structure, if used directly)
  savedProgramsTitle: string;
  noSavedPrograms: string;
  removeButton: string; // This was for saved programs

  // Favorites Section specific keys
  favoritesTitle: string;
  favoritesUniversities: string;
  favoritesCourses: string;
  favoritesRemove: string; // Specific remove for favorites
  favoritesNoUniversities: string;
  favoritesNoCourses: string;
  favoritesExploreNow: string;

  // Application Guide Section specific keys
  applicationGuideTitle: string;
  applicationGuideSubtitle: string;
  applicationGuidePhase: string; // For the "Phase X:" part
  applicationGuideMarkAsComplete: string;
  applicationGuideMarkAsIncomplete: string;
  applicationGuideLearnMore: string;
  // Dynamic keys like 'profile.checklistPhase1Title' or 'profile.checklistSomeItemLabel'
  // used in `phase.titleKey` or `item.labelKey` would also be defined here if they are statifie  c.
  // Example:
  // checklistPhase1Title?: string;
  // checklistPassportCopyLabel?: string;
  // checklistPassportCopyDescription?: string;

  // Scholarships Section specific keys
  scholarshipsTitle: string;
  scholarshipsProvider: string;
  scholarshipsDeadline: string;
  scholarshipsViewDetails: string;
  scholarshipsNoScholarships: string;
  scholarshipsCheckResources: string;

  // new profile details 
  customPersonalDataTitle: string
  clerkProfileOverviewTitle: string
  editCoreProfileLink: string
  customPersonalDataMissingPrompt: string
  addInfoPrompt: string
  educationalInformationTitle: string
  customEducationalDataMissingPrompt: string
  favoritesConfirmRemoveCourse: string
  loadingYourDetails: string
  personalizedDeadlineTrackerTitle: string
  deadlineTrackerDescription : string
  findAndTrackCourses: string
  upcomingDeadlines: string
}


// This is the main interface for the entire object structure
// you requested in the previous step (e.g., content of en.js, ar.js)
interface IProfileFieldLabels {
  clerkProfileOverviewTitle: string;
  customPersonalDataTitle: string;
  educationalInformationTitle: string;

  profilePictureAlt: string;
  emailLabel: string;
  phoneLabel: string;
  joinedDateLabel: string;
  lastSignInLabel: string;

  dateOfBirthLabel: string;
  genderLabel: string;
  nationalityLabel: string;
  countryOfResidenceLabel: string;

  addressSubHeader: string;
  streetAddressLabel: string;
  cityLabel: string;
  stateProvinceLabel: string;
  postalCodeLabel: string;
  addressCountryLabel: string;

  passportSubHeader: string;
  passportNumberLabel: string;
  passportExpiryDateLabel: string;

  emergencyContactSubHeader: string;
  emergencyContactNameLabel: string;
  emergencyContactRelationshipLabel: string;
  emergencyContactPhoneLabel: string;
  emergencyContactEmailLabel: string;

  highestLevelOfEducationLabel: string;
  previousEducationSubHeader: string;
  institutionNameLabel: string;
  institutionCountryLabel: string;
  institutionCityLabel: string;
  degreeNameLabel: string;
  fieldOfStudyLabel: string;
  graduationYearLabel: string;
  graduationMonthLabel: string;
  gpaLabel: string;
  gradingScaleLabel: string;

  englishProficiencySubHeader: string;
  isNativeEnglishSpeakerLabel: string;
  englishTestTakenLabel: string;
  englishOverallScoreLabel: string;
  englishTestDateLabel: string;

  otherTestsSubHeader: string;
  testNameLabel: string;
  testScoreLabel: string;
  testDateTakenLabel: string;

  genderMale: string;
  genderFemale: string;
  genderNonBinary: string;
  genderPreferNotToSay: string;

  educationLevelHighSchool: string;
  educationLevelAssociate: string;
  educationLevelBachelor: string;
  educationLevelMaster: string;
  educationLevelPhD: string;
  educationLevelOther: string;

  monthJanuary: string;
  monthFebruary: string;
  monthMarch: string;
  monthApril: string;
  monthMay: string;
  monthJune: string;
  monthJuly: string;
  monthAugust: string;
  monthSeptember: string;
  monthOctober: string;
  monthNovember: string;
  monthDecember: string;

  optionYes: string;
  optionNo: string;

  testTOEFL: string;
  testIELTS: string;
  testDuolingo: string;
  testCambridge: string;
  testOtherEnglish: string;

  selectOption: string;
  notProvided: string;
  startDateLabel: string;
  deadlineTypeLabel: string;
  applicationStatusLabel:string
  NotStarted:string
  Researching:string
  PreparingDocuments:string
  AwaitingPreEnrollment:string
  Applied:string
  AwaitingResults:string
  Accepted:string
  Rejected:string
  Enrolled:string
  notesLabel: string;

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
  programSearch: ProgramSearchTranslation;
  profile: ProfileTranslations;
  profileFieldLabels: IProfileFieldLabels;

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


 export interface CityCostMetric {
    label: string;
    value: string | number;
    unit?: string;
    icon: React.ElementType;
    barPercentage?: number;
    barColor?: string;
  }
}; 

export interface CityData {
  id: string;
  cityName: string;
  country: string;
  region: string;
  universityNames: string[];
  heroImage: string;
  overallScore: number;
  monthlyEstimateEUR: number;
  safetyScore: number;
  studentFriendliness: number;
  internetSpeedMbps?: number;
  metrics: CityCostMetric[];
  nomadListStyleTags?: { label: string; color: string }[];
  dataSourceNotes?: string;
  currencySymbol?: string;
  latitude: number;
  longitude: number;
}