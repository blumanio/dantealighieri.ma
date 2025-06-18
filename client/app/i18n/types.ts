export type Locale = 'en' | 'it' | 'fr' | 'ar';

export interface CommonTranslation {
  showDeadlines: string;
  hideDeadlines: string;
  comingSoonContent: string;
  search: string;
  about: string;
  services: string;
  universities: string;
  deadline: string;
  apply: string;
  soon: string;
  contactUs: string;
  editMode: string;
  viewMode: string;
  selectOption: string;
  notProvided: string;
  saveChanges: string;
  cancel: string;
  daysRemaining: string;
  moreInfo: string;
  showAllDeadlines: string;
  hideAllDeadlines: string;
  unknownUser: string;
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
  signInToAccess: string;
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
  trackedCountTooltip: string;
  favoriteCountTooltip: string;
  viewCountTooltip: string;
  trackingStartTooltip: string;
  favoritesAddTooltip: string;
}

export interface UniversitiesTranslation {
  comingsoon: string;
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
  apply: string;
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
export interface PaymentSuccessTranslation {
  pageTitle: string;
  mainTitle: string;
  thankYouMessage: string;
  tierUpgradeMessage: string;
  accessUpdatedMessage: string;
  transactionIdLabel: string;
  emailConfirmation: string;
  nextStepsTitle: string;
  goToDashboardButton: string;
  backToPricingButton: string;
  contactSupportMessage: string;
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

export interface MessagingTranslation {
  conversationsTitle: string;
  newConversationTooltip: string;
  noConversations: string;
  draftMessage: string;
  typeMessagePlaceholder: string;
  sendMessageTooltip: string;
  selectConversationPrompt: string;
  startNewConversationTitle: string;
  searchUserPlaceholder: string;
  typeToSearchUsers: string;
  errorFetchConversations: string;
  errorFetchMessages: string;
  errorSendMessage: string;
  errorStartConversation: string;
  noMessagesYet: string;
}

export interface ProfileTranslations {
  // Journey Dashboard
  yourJourney: string;
  gettingStarted: string;
  shortlisting: string;
  documentPreparation: string;
  applying: string;
  finances: string;
  communication: string;
  preDeparture: string;
  premiumServices: string;
  loadingDashboard: string;
  loadingSection: string;
  welcomeBack: string;
  yourProgressOverview: string;
  level: string;
  dayStreak: string;
  xpToNextLevel: string;
  AmbitiousApplicant: string;
  Applicant: string;
  updateProfile: string;
  readAgain: string;
  findUniversities: string;
  viewChecklist: string;
  searchScholarships: string;
  explorePremium: string;
  completeYourProfile: string;
  provideYourAcademicAndPersonalDetails: string;
  readTheGuide: string;
  understandTheItalianApplicationProcess: string;
  shortlistUniversities: string;
  findAndSaveYourDreamUniversities: string;
  prepareDocuments: string;
  gatherAllRequiredApplicationDocuments: string;
  findScholarships: string;
  exploreFundingOptionsForYourStudies: string;
  goPremium: string;
  unlockExpertGuidanceAndSupport: string;
  Completed: string;
  InProgress: string;
  ActionRequired: string;
  NotStarted: string;

  // General Page
  pageTitle: string;
  signInPrompt: string;
  loading: string;
  addAnotherTest: string;
  loadingPage?: string;

  // Tabs
  tabsPersonalData: string;
  tabsFavorites: string;
  tabsApplicationGuide: string;
  tabsScholarships: string;
  tabsMessages: string;
  tabsPersonalizedDeadlineTracker: string;
  tabsTrackedCourses: string;
  tabsTrackedUniversities: string;

  // Personal Data Section
  personalDataTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  nationality: string;
  countryOfResidence: string;
  address: string;
  editButton: string;
  saveButton: string;
  cancelButton: string;
  personalDataClerkNote: string;

  // Account Settings
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
  userFullNameMissing: string;
  clerkAccountSettings: string;
  signOutButton: string;
  signInToViewMessages: string;

  // My Applications
  myApplicationsTitle: string;
  noApplications: string;
  applicationDate: string;
  programName: string;
  universityName: string;
  status: string;
  viewDetails: string;

  // Tracked Items / Saved Programs
  trackedCoursesAndDeadlines: string;
  savedProgramsTitle: string;
  noSavedPrograms: string;
  removeButton: string; // For saved programs
  noTrackedItemsTitle: string;
  noTrackedItemsPrompt: string;

  // Favorites Section
  favoritesTitle: string;
  favoritesUniversities: string;
  favoritesCourses: string;
  favoritesRemove: string;
  favoritesNoUniversities: string;
  favoritesNoCourses: string;
  favoritesExploreNow: string;
  addAnotherInstitution: string;

  // Application Guide Section
  applicationGuideTitle: string;
  applicationGuideSubtitle: string;
  applicationGuidePhase: string;
  applicationGuideMarkAsComplete: string;
  applicationGuideMarkAsIncomplete: string;
  applicationGuideLearnMore: string;

  // Scholarships Section
  scholarshipsTitle: string;
  scholarshipsProvider: string;
  scholarshipsDeadline: string;
  scholarshipsViewDetails: string;
  scholarshipsNoScholarships: string;
  scholarshipsCheckResources: string;

  // New profile details
  customPersonalDataTitle: string;
  clerkProfileOverviewTitle: string;
  editCoreProfileLink: string;
  customPersonalDataMissingPrompt: string;
  addInfoPrompt: string;
  educationalInformationTitle: string;
  customEducationalDataMissingPrompt: string;
  favoritesConfirmRemoveCourse: string;
  loadingYourDetails: string;
  personalizedDeadlineTrackerTitle: string;
  deadlineTrackerDescription: string;
  findAndTrackCourses: string;
  upcomingDeadlines: string;
  premiumApplicationHub: string;
  personalizedDeadlineTracker: string;

  // Tracked Universities
  trackedUniversitiesTitle: string;
  trackedUniversitiesAddMore: string;
  trackedUniversitiesNone: string;
  trackedUniversitiesErrorFetch: string;
  trackedUniversitiesUntrackTooltip: string;
  trackedUniversitiesNoUpcomingDeadlines: string;
}

export interface ActionsTranslation {
  unfavorite: string;
  favorite: string;
  untrack: string;
  track: string;
}
export interface ProgramRowTranslation {
  viewCountTooltip: string;
  favoriteCountTooltip: string;
  trackedCountTooltip: string;
}
export interface IProfileFieldPlaceholders {
  firstNamePlaceholder: string;
  lastNamePlaceholder: string;
  nationalityPlaceholder: string;
  countryOfResidencePlaceholder: string;
  streetAddressPlaceholder: string;
  cityPlaceholder: string;
  stateProvincePlaceholder: string;
  postalCodePlaceholder: string;
  countryPlaceholder: string;
  passportNumberPlaceholder: string;
  emergencyContactNamePlaceholder: string;
  emergencyContactRelationshipPlaceholder: string;
  emergencyContactPhonePlaceholder: string;
  emergencyContactEmailPlaceholder: string;
  institutionNamePlaceholder: string;
  degreeNamePlaceholder: string;
  fieldOfStudyPlaceholder: string;
  graduationYearPlaceholder: string;
  gpaPlaceholder: string;
  gradingScalePlaceholder: string;
}
export interface IProfileFieldLabels {
  // From JSON direct structure
  firstName: string;
  lastName: string;
  transcriptUploadNote: string;
  englishCertUploadNote: string;
  testReportUploadNote: string;
  yes: string;
  no: string;
  tier_Michelangelo: string;
  role_viaggiatore: string;
  role_studente: string;
  role_accademico: string;
  role_mentore: string;
  role_coordinatore: string;

  tier_freetier: string;
  tier_michelangelo: string;
  tier_dante: string;
  tier_davinci: string;
  tier_michelangelo_tooltip: string;
  tier_dante_tooltip: string;
  tier_davinci_tooltip: string;

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
  applicationStatusLabel: string;
  NotStarted: string;
  Researching: string;
  PreparingDocuments: string;
  AwaitingPreEnrollment: string;
  Applied: string;
  AwaitingResults: string;
  Accepted: string;
  Rejected: string;
  Enrolled: string;
  notesLabel: string;
  nextDeadline: string;

  role_student: string;
  role_alumni: string;
  role_mentor: string;
  role_admin: string;

  tier_Amico: string;
  tier_Artista: string;
  tier_Maestro: string;
}

export interface PricingTranslation {
  mainTitle: string;
  mainSubtitle: string;
  title: string;
  subtitle: string;
  featuresComparisonTitle: string;
  featureHeader: string;
  faqTitle: string;
  faq1_q: string;
  faq1_a: string;
  faq2_q: string;
  faq2_a: string;
  faq3_q: string;
  faq3_a_1: string;
  faq3_a_link: string;
  faq3_a_2: string;
  finalCtaTitle: string;
  finalCtaSubtitle: string;
  finalCtaButton: string;
  andMoreFeatures: string;
}

export interface TiersTranslation {
  tier_michelangelo: string;
  michelangeloInspiration: string;
  tierPriceFree: string;
  michelangeloPriceDetails: string;
  michelangeloHoverTooltip: string;
  michelangeloDescription: string;
  michelangeloCTAText: string;
  michelangeloCTALink: string;
  michelangeloHighlight: string;

  tier_dante: string;
  danteInspiration: string;
  dantePriceDetails: string;
  danteHoverTooltip: string;
  danteDescription: string;
  danteCTAText: string;
  danteCTALink: string;
  danteHighlight: string;

  tier_davinci: string;
  davinciInspiration: string;
  davinciPriceDetails: string;
  davinciHoverTooltip: string;
  davinciDescription: string;
  davinciCTAText: string;
  davinciCTALink: string;
  davinciHighlight: string;

  feature_view_basic_programs: string;
  feature_view_basic_programs_desc: string;
  feature_email_tips: string;
  feature_email_tips_desc: string;
  feature_limited_content: string;
  feature_limited_content_desc: string;
  feature_application_tools: string;
  feature_application_tools_desc: string;
  feature_webinars_workshops: string;
  feature_webinars_workshops_desc: string;
  feature_cultural_guides: string;
  feature_cultural_guides_desc: string;
  feature_language_minicourse: string;
  feature_language_minicourse_desc: string;
  feature_personalized_roadmap: string;
  feature_personalized_roadmap_desc: string;
  feature_document_checklist: string;
  feature_document_checklist_desc: string;
  feature_mentorship_access: string;
  feature_mentorship_access_desc: string;
  feature_career_services: string;
  feature_career_services_desc: string;
  feature_premium_content: string;
  feature_premium_content_desc: string;
  feature_priority_support: string;
  feature_priority_support_desc: string;
  feature_community_access: string;
  feature_basic_guides: string;
  feature_program_search: string;
  feature_program_search_desc: string;
  feature_basic_guides_desc: string;
  feature_community_access_desc: string;
}

export interface AdminLayoutTranslation {
  loadingAdminPanel: string;
  unauthorizedAccess: string;
}

export interface AdminNavTranslation {
  dashboard: string;
  users: string;
  courses: string;
  universities: string;
  content: string;
  blogPosts: string;
  communityPosts: string;
  staticPages: string;
  applications: string;
  userActivity: string;
  favorites: string;
  trackedItems: string;
  tiersAndFeatures: string;
  manageTiers: string;
  manageFeatures: string;
  analytics: string;
  settings: string;
  signOut: string;
}

export interface AdminHeaderTranslation {
  viewProfile: string;
  adminSettings: string;
  signOut: string;
}

export interface AdminDashboardTranslation {
  title: string;
  totalUsers: string;
  totalCourses: string;
  blogPosts: string;
  pendingApplications: string;
  recentActivity: string;
  quickActions: string;
  createNewCourse: string;
  viewPendingApps: string;
  moderateContent: string;
  siteAnalyticsPlaceholder: string;
  analyticsChartComingSoon: string;
}

export interface AdminUsersPageTranslation {
  title: string;
  searchPlaceholder: string;
  allRoles: string;
  allTiers: string;
  columnUser: string;
  columnRole: string;
  columnTier: string;
  columnJoined: string;
  columnActions: string;
  noUsersFound: string;
}

export interface UniversityHubsTranslation {
  pageTitle: string;
  pageSubtitle: string;
  coursesAvailable: string;
  viewHub: string;
  noUniversitiesFound: string;
  errorFetchingUniversities: string;
  errorFetchingCourses: string;
  coursesOfferedTitle: string;
  noCoursesListed: string;
  studentNetworkTitle: string;
  networkDescription: string;
  discussionsTitle: string;
  housingBoardTitle: string;
  studyGroupsTitle: string;
  newDiscussionButton: string;
  newDiscussionFormTitle: string;
  postTitlePlaceholder: string;
  postContentPlaceholder: string;
  submitPost: string;
  noPostsYet: string;
  noDiscussionsYet: string;
  showComments: string;
  hideComments: string;
  addCommentPlaceholder: string;
  errorCreatingPost: string;
  errorAddingComment: string;
  signInToPost: string;
  postContentRequired: string;
  visitOfficialWebsite: string;
  coursesTab: string;
  networkTab: string;
  discussionsTab: string;
  housingTab: string;
  studyGroupsTab: string;
  careerTab: string;
  aboutTab: string;
  seekingHousing: string;
  offeringHousing: string;
  seekingHousingButton: string;
  offeringHousingButton: string;
  newSeekingPostTitle: string;
  newOfferingPostTitle: string;
  housingPostPlaceholder: string;
  submitAdButton: string;
  lookingForGroupButton: string;
  formingGroupButton: string;
  newLookingPostTitle: string;
  newFormingPostTitle: string;
  studyGroupTitlePlaceholder: string;
  studyGroupDescPlaceholder: string;
  createPostButton: string;
  postType_discussion: string;
  postType_housing_seeking: string;
  postType_housing_offering: string;
  postType_study_group_looking: string;
  postType_study_group_forming: string;
  newPostTitle_discussion: string;
  newPostTitle_housing_seeking: string;
  newPostTitle_housing_offering: string;
  newPostTitle_study_group_looking: string;
  newPostTitle_study_group_forming: string;
  comingSoonContent: string;
  startDiscussion: string;
  housingTitle: string;
  noHousingPostsYet: string;
  housingDescription: string;
  postType_discussion_desc: string;
  // New keys from implementation
  searchCoursesPlaceholder: string;
  coursesFound: string;
  pageInfo: string;
  showingResults: string;
  availableCourses: string;
  discoverPrograms: string;
  searchPlaceholder: string;
  advancedFilters: string;
  deadlinesTab: string;
}

export interface PremiumHubTranslation {


  pageTitle: string;
  title: string;
  subtitle: string;
  overallProgress: string;
  loadingMessage: string;

  roadmapSectionTitle: string;
  roadmapPhase1Title: string;
  stepResearchProgramsTitle: string;
  stepResearchProgramsDesc: string;
  subtaskUseSearch: string;
  stepCheckRequirementsTitle: string;
  stepCheckRequirementsDesc: string;
  roadmapPhase2Title: string;
  roadmapPhase3Title_UniversitalyVisa: string;
  stepUniversitalyTitle: string;
  stepUniversitalyDesc: string;
  stepVisaDTitle: string;
  stepVisaDDesc: string;
  stepDoVCIMEATitle: string;
  stepDoVCIMEA: string;

  docChecklistSectionTitle: string;
  docChecklistLoadingOrNotApplicable: string;
  docPassport: string;
  docPassportDetails: string;
  docAcademicTranscripts: string;
  docAcademicTranscriptsDetails: string;
  docBachelorsDegree: string;
  docBachelorsDegreeDetails: string;
  docVisaApplicationForm: string;
  docVisaApplicationFormDetails: string;
  docFinancialProof: string;
  docFinancialProofDetails: string;
  docEnglishProficiency: string;
  docEnglishProficiencyDetails: string;
  docChecklistNote: string;

  timelineSectionTitle: string;
  timelineGeneralDatesNote: string;
  timelinePreEnrollOpen: string;
  timelinePreEnrollOpenDate: string;
  timelineVisaApplicationStart: string;
  timelineVisaApplicationStartDate: string;
  timelineDSUScholarship: string;
  timelineDSUScholarshipDate: string;
  timelineCheckOfficialNote: string;

  visaGuidanceSectionTitle: string;
  universitalyTitle: string;
  universitalyDesc: string;
  'dovCIMEAChứngTitle': string;
  'dovCIMEAChứngDesc': string;
  visaDTitle: string;
  visaDDesc_NonEU: string;

  scholarshipTuitionSectionTitle: string;
  scholarshipTuitionIntro: string;
  scholarshipInsightDSU: string;
  scholarshipInsightGov: string;
  tuitionFeeInsight: string;

  faqSectionTitle: string;
  faqVisaWhenToApplyQ: string;
  faqVisaWhenToApplyA: string;
  linkOfficialVisaInfo: string;
  faqAccommodationBestWayQ: string;
  faqAccommodationBestWayA: string;

  needMoreHelpTitle: string;
  needMoreHelpDesc: string;
  exploreServicesButton: string;
}

// START: New Interfaces for untyped sections
export interface CreatePostModalTranslation {
  title: string;
  errorCommunityRequired: string;
  errorFetchCommunities: string;
  contentPlaceholder: string;
}

export interface AdminPostTranslation {
  title: string;
  errorCommunityDetails: string;
  errorContent: string;
  errorUserFullName: string;
  errorUserIdClaimable: string;
  errorCreateFailed: string;
  successCreate: string;
  userFullNameLabel: string;
  userAvatarUrlLabel: string;
  userIdLabel: string;
  userIdHelp: string;
  contentLabel: string;
  communityTypeLabel: string;
  communityIdLabel: string;
  communityNameLabel: string;
  communitySlugLabel: string;
  categoryLabel: string;
  userCountryLabel: string;
  tagsLabel: string;
  claimableLabel: string;
  submitButton: string;
}

export interface AdminCommentTranslation {
  title: string;
  errorPostId: string;
  errorCommentContent: string;
  errorCommenterFullName: string;
  errorCommenterId: string;
  errorCreateFailed: string;
  successCreate: string;
  targetPostIdLabel: string;
  commenterFullNameLabel: string;
  commenterAvatarUrlLabel: string;
  commenterUserIdLabel: string;
  commentContentLabel: string;
  submitButton: string;
}

export interface PostTypeTranslation {
  discussion: string;
  general: string;
  housingSeeking: string;
  studyGroup: string;
  academic: string;
  career: string;
}
// END: New Interfaces

// Main Translation interface
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
  messaging: MessagingTranslation;
  profile: ProfileTranslations;
  profileFieldLabels: IProfileFieldLabels;
  pricing: PricingTranslation;
  tiers: TiersTranslation;
  adminLayout: AdminLayoutTranslation;
  adminNav: AdminNavTranslation;
  adminHeader: AdminHeaderTranslation;
  adminDashboard: AdminDashboardTranslation;
  adminUsersPage: AdminUsersPageTranslation;
  universityHubs: UniversityHubsTranslation;
  premiumHub: PremiumHubTranslation;
  actions: ActionsTranslation;
  programRow: ProgramRowTranslation;
  profileFieldPlaceholders: IProfileFieldPlaceholders;
  paymentSuccess: PaymentSuccessTranslation;
  // Added new types
  createPostModal: CreatePostModalTranslation;
  adminPost: AdminPostTranslation;
  adminComment: AdminCommentTranslation;
  postType: PostTypeTranslation;
}

// Type guard for checking valid locale
export function isLocale(value: string): value is Locale {
  return ['en', 'ar', 'fr', 'it'].includes(value);
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

export interface CityData {
  id: string;
  cityName: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  monthlyEstimateEUR: number;
  currencySymbol?: string;
  overallScore: number;
  safetyScore: number;
  studentFriendliness: number;
  universityNames: string[];
  heroImage?: string;
  metrics: {
    label: string;
    value: number;
    unit: string;
    icon: React.ElementType;
    barColor?: string;
  }[];
  internetSpeedMbps?: number;
  nomadListStyleTags?: { label: string; color: string }[];
  dataSourceNotes?: string;
  currentWeather?: any;
  annualMinTempC: number;
  annualMaxTempC: number;
}