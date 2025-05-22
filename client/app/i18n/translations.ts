// \client\app\i18n\translations.ts
import { Locale, Translation } from './types';

export const translations: Record<Locale, Translation> = {
  en: {
    common: {
      search: "Search",
      about: "About",
      services: "Services",
      universities: "Universities",
      deadline: "Deadlines",
      apply: "Apply",
      soon: "Soon",
      contactUs: "Contact Us",
      editMode: "Edit Mode",
      viewMode: "View Mode",
      selectOption: "-- Select an option --",
      notProvided: "Not Provided",
      saveChanges: "Save Changes",
      cancel: "Cancel"
    },
    hero: {
      title: "Start Your Italian Dream Education",
      subtitle: "Get expert guidance, step-by-step resources, and premium services to make your study journey to Italy simple, clear, and successful.",
      ctaButton: "Start Here"
    },
    programs: {
      searchTitle: "Search Programs",
      degreeType: "Degree Type",
      accessType: "Access Type",
      courseLanguage: "Course Language",
      academicArea: "Academic Area",
      searchPlaceholder: "Search within results...",
      noResults: "No programs found",
      loadingMessage: "Loading programs...",
      clickLink: 'Click to open official page',
      signInToAccess: 'Sign in to access protected content'
    },

    services: {
      title: "Our Services",
      description: "At our consultancy, we specialize in providing guidance for students seeking educational opportunities in Italy. Our services range from university admissions to scholarship assistance.",
      helpedMoreThan: "helped more than",
      students: "Students",
      admissionsTitle: "University Admissions",
      admissionsDescription: "We help you navigate the admissions process and secure a spot at your dream university in Italy.",
      scholarshipTitle: "Scholarship Assistance",
      scholarshipDescription: "Our experts assist you in finding and applying for scholarships to support your studies in Italy."
    },
    founder: {
      title: "Meet Our Founder",
      intro: "My journey combines academic excellence with professional success in Italy's tech industry. As a web developer at a leading Italian consultancy, I've contributed to projects for global industry leaders including Luxottica, Ray-Ban, UniCredit, and Whirlpool.",
      achievementsTitle: "Professional & Academic Achievements:",
      achievements: [

        "Graduated with perfect score (110/110) in Master's Degree",
        "Secured 4 prestigious scholarships throughout my academic journey",
        "Successfully balanced professional work with academic excellence"
      ],
      experienceTitle: "Why My Experience Matters For You",
      experienceDesc: "I've faced and overcome the exact challenges you're about to encounter. From navigating bureaucracy to finding accommodation, from language barriers to scholarship applications - I've been there, succeeded, and now help others do the same.",
      stats: [
        "Helped over 200 students secure scholarships",
        "95% success rate in DSU scholarship applications",
        "Comprehensive support from application to graduation"
      ],
      connectWith: "Connect With Me:",
      imageAltGraduation: "Founder Graduation",
      imageAltDiploma: "Founder Diploma"

    },
    about: {
      pageTitle: "About Studentitaly.it Educational Services",
      subtitle: "Your Gateway to Italian Higher Education",
      missionTitle: "Our Mission",
      missionDescription: "At Studentitaly.it, we are dedicated to bridging the gap between international students and prestigious Italian universities. Our mission is to empower students with the knowledge, resources, and support they need to successfully pursue their academic dreams in Italy.",
      whyChooseUsTitle: "Why Choose Us?",
      featureTitle1: "Specialized Expertise",
      featureDescription1: "Deep understanding of both Moroccan and Italian educational systems",
      featureTitle2: "Personalized Approach",
      featureDescription2: "Tailored guidance for each student's unique circumstances",
      featureTitle3: "Extensive Network",
      featureDescription3: "Direct partnerships with leading Italian universities",
      featureTitle4: "Proven Track Record",
      featureDescription4: "High success rates in university admissions and scholarship applications",
      ourStoryTitle: "Our Story",
      ourStoryFoundingStory: "Founded in 2020, Studentitaly.it Educational Services was born out of a passion for education and a desire to create opportunities for International students. Our founders, having experienced the transformative power of studying abroad, recognized the need for specialized support for students aspiring to study in Italy.",
      ourStoryImpact: "Over the years, we have helped hundreds of students navigate the complex process of applying to Italian universities, securing scholarships, and adapting to life in Italy. Our team of experienced advisors, many of whom have studied in Italy themselves, bring a wealth of knowledge and personal insights to guide students through every step of their journey.",
      ctaTitle: "Ready to Start Your Italian Academic Journey?",
      ctaButtonText: "Contact Us Today",
      imageAltUniversity: "Italian University"
    },
    footer: {
      description: "Your trusted partner in navigating Italian university admissions and education opportunities.",
      quickLinks: "Quick Links",
      contactUs: "Contact Us",
      followUs: "Follow Us",
      email: "Email: contact@STUDENTITALY.com",
      phone: "Phone: +393519000615",
      location: "Location: Milan, Italy",
      copyright: "Made with a lot of ☕️ and ❤️ in Milan 🇮🇹",
      linkAbout: "About",
      linkUniversities: "Universities",
      linkCourses: "Search programs"
    },
    programSearch: {
      searchTitle: "Search Programs",
      degreeType: "Degree Type",
      accessType: "Access Type",
      courseLanguage: "Course Language",
      academicArea: "Academic Area",
      searchPlaceholder: "Search within results...",
      noResults: "No programs found",
      loadingMessage: "Loading programs..."
    },
    universities: {
      pageTitle: "Italian Universities Deadlines 2025/2026",
      found: "Found",
      university: "university",

      lastUpdate: "Last update",
      login: "Log in",
      loginPrompt: "to unlock detailed information about programs, fees, and requirements.",
      showMore: "Show more",
      showLess: "Show less",
      locationTBA: "Location TBA",
      tba: "TBA",
      free: "Free",
      open: "Open",
      closed: "Closed",
      comingSoon: "Coming Soon",
      availableIntakes: "Available Intakes",
      start: "Start",
      end: "End",
      notes: "Notes",
      resources: "Resources",
      watchTutorial: "Watch Tutorial",
      readBlog: "Read Blog Post",
      visitWebsite: "Visit University Website",
      status: "Status",
      requirements: "Requirements",
      deadline: "Application Deadline",
      fee: "Application Fee",
      location: "Location",
      searchPlaceholder: "Search universities by name or location...",
      filters: "Filters",
      feeFilter: "Fee Type",
      clearFilters: "Clear filters",
      clearAllFilters: "Clear all filters and search",
      noResults: "No universities found matching your criteria",
      filterByStatus: "Filter by status",
      filterByFee: "Filter by fee type",
      paid: "Paid",
      protectedContent: 'members only',
      apply: 'apply'


    },
    profile: {
      pageTitle: "My Profile & Journey",
      signInPrompt: "Please sign in to view your profile.",
      loading: "Loading profile...",

      tabsPersonalData: "Personal Data",
      tabsFavorites: "Favorites",
      tabsApplicationGuide: "Application Guide",
      tabsScholarships: "Scholarships",

      personalDataTitle: "Account Information",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      phoneNumber: "Phone Number",
      dateOfBirth: "Date of Birth",
      nationality: "Nationality",
      countryOfResidence: "Country of Residence",
      address: "Address",
      editButton: "Edit Information",
      saveButton: "Save Changes",
      cancelButton: "Cancel",
      personalDataClerkNote: "Your personal data is securely managed by Clerk. You can update your information, manage security settings, and connected accounts here.",

      accountSettingsTitle: "Account Settings",
      changePassword: "Change Password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmNewPassword: "Confirm New Password",
      languagePreference: "Language Preference",
      notifications: "Notifications",
      emailNotifications: "Receive email notifications",
      deleteAccount: "Delete Account",
      deleteAccountWarning: "Are you sure you want to delete your account? This action cannot be undone.",

      myApplicationsTitle: "My Applications",
      noApplications: "You have not submitted any applications yet.",
      applicationDate: "Application Date",
      programName: "Program Name",
      universityName: "University Name",
      status: "Status",
      viewDetails: "View Details",

      savedProgramsTitle: "Saved Programs",
      noSavedPrograms: "You have not saved any programs yet.",
      removeButton: "Remove", // For saved programs

      favoritesTitle: "My Favorites",
      favoritesUniversities: "Favorite Universities",
      favoritesCourses: "Favorite Courses",
      favoritesRemove: "Remove", // Specific for removing a favorite item
      favoritesNoUniversities: "No favorite universities yet.",
      favoritesNoCourses: "No favorite courses yet.",
      favoritesExploreNow: "Explore now!",

      applicationGuideTitle: "Guide: Applying to Italy from Abroad",
      applicationGuideSubtitle: "Your step-by-step checklist for a smooth application process.",
      applicationGuidePhase: "Phase",
      applicationGuideMarkAsComplete: "Mark as Complete",
      applicationGuideMarkAsIncomplete: "Mark as Incomplete",
      applicationGuideLearnMore: "Learn More",
      //   // Example static keys for checklist items (these would be part of your data structure if static)
      //   // checklistPhase1Title: "Phase 1: Pre-application & Document Gathering",
      //   // checklistPassportCopyLabel: "Prepare a valid passport copy",
      //   // checklistPassportCopyDescription: "Ensure your passport is valid for at least 6 months beyond your intended stay.",

      scholarshipsTitle: "Scholarship Opportunities",
      scholarshipsProvider: "Provider",
      scholarshipsDeadline: "Deadline",
      scholarshipsViewDetails: "View Details",
      scholarshipsNoScholarships: "No specific scholarships listed at the moment.",
      scholarshipsCheckResources: "We recommend checking official university websites and government portals for opportunities.",

      // new for details profile
      customPersonalDataTitle: "Detailed Personal Data",
      clerkProfileOverviewTitle: "Clerk Profile Overview",
      editCoreProfileLink: "Edit Core Profile (via Clerk)",
      customPersonalDataMissingPrompt: "Help us know you better! Please add your detailed personal information.",
      addInfoPrompt: "Add Information",
      educationalInformationTitle: "Educational Background",
      customEducationalDataMissingPrompt: "Your educational background is important for applications. Please add your education details.",
      favoritesConfirmRemoveCourse: "Are you sure you want to remove this course from your favorites?",
      loadingYourDetails: "Loading your details...",
    },
    profileFieldLabels: {
      clerkProfileOverviewTitle: "Clerk Profile Overview",
      customPersonalDataTitle: "Detailed Personal Data",
      educationalInformationTitle: "Educational Background",

      profilePictureAlt: "Profile Picture",
      emailLabel: "Email",
      phoneLabel: "Phone",
      joinedDateLabel: "Joined Date",
      lastSignInLabel: "Last Sign In",

      dateOfBirthLabel: "Date of Birth",
      genderLabel: "Gender",
      nationalityLabel: "Nationality",
      countryOfResidenceLabel: "Country of Residence",

      addressSubHeader: "Full Address",
      streetAddressLabel: "Street Address",
      cityLabel: "City",
      stateProvinceLabel: "State/Province/Region",
      postalCodeLabel: "Postal Code",
      addressCountryLabel: "Country (Address)",

      passportSubHeader: "Passport Information",
      passportNumberLabel: "Passport Number",
      passportExpiryDateLabel: "Passport Expiry Date",

      emergencyContactSubHeader: "Emergency Contact",
      emergencyContactNameLabel: "Full Name",
      emergencyContactRelationshipLabel: "Relationship",
      emergencyContactPhoneLabel: "Phone Number",
      emergencyContactEmailLabel: "Email (Emergency Contact)",

      highestLevelOfEducationLabel: "Highest Level of Education Achieved",
      previousEducationSubHeader: "Previous Education",
      institutionNameLabel: "Institution Name",
      institutionCountryLabel: "Country of Institution",
      institutionCityLabel: "City of Institution",
      degreeNameLabel: "Program/Degree Name",
      fieldOfStudyLabel: "Field of Study/Major",
      graduationYearLabel: "Graduation Year",
      graduationMonthLabel: "Month of Graduation",
      gpaLabel: "GPA / Grade",
      gradingScaleLabel: "Grading Scale",

      englishProficiencySubHeader: "English Language Proficiency",
      isNativeEnglishSpeakerLabel: "Is English your first language?",
      englishTestTakenLabel: "Test Taken",
      englishOverallScoreLabel: "Overall Score",
      englishTestDateLabel: "Test Date",

      otherTestsSubHeader: "Other Standardized Tests",
      testNameLabel: "Test Name",
      testScoreLabel: "Test Score",
      testDateTakenLabel: "Date Taken",

      genderMale: "Male",
      genderFemale: "Female",
      genderNonBinary: "Non-binary",
      genderPreferNotToSay: "Prefer not to say",

      educationLevelHighSchool: "High School Diploma/GED",
      educationLevelAssociate: "Associate's Degree",
      educationLevelBachelor: "Bachelor's Degree",
      educationLevelMaster: "Master's Degree",
      educationLevelPhD: "Doctorate (PhD)",
      educationLevelOther: "Other",

      monthJanuary: "January",
      monthFebruary: "February",
      monthMarch: "March",
      monthApril: "April",
      monthMay: "May",
      monthJune: "June",
      monthJuly: "July",
      monthAugust: "August",
      monthSeptember: "September",
      monthOctober: "October",
      monthNovember: "November",
      monthDecember: "December",

      optionYes: "Yes",
      optionNo: "No",

      testTOEFL: "TOEFL",
      testIELTS: "IELTS",
      testDuolingo: "Duolingo",
      testCambridge: "Cambridge English",
      testOtherEnglish: "Other (English Test)",

      selectOption: "-- Select an option --",
      notProvided: "Not Provided",
      genderLabel: "Gender",
  genderMale: "Male",
  genderFemale: "Female",
  genderNonBinary: "Non-binary",
  genderPreferNotToSay: "Prefer not to say"
    }

  },
  it: {
    common: {
      search: "Cerca",
      about: "Chi Siamo",
      services: "Servizi",
      universities: "Università",
      deadline: "Scadenze",
      apply: "Applica",
      soon: "Presto",
      contactUs: "Contattaci"
    },
    hero: {
      title: "Il Tuo Percorso in Italia Inizia Qui",
      subtitle: "Naviga le ammissioni universitarie italiane con una guida esperta",
      ctaButton: "Inizia Ora"
    },
    programs: {
      searchTitle: "Cerca Programmi",
      degreeType: "Tipo di Laurea",
      accessType: "Tipo di Accesso",
      courseLanguage: "Lingua del Corso",
      academicArea: "Area Accademica",
      searchPlaceholder: "Cerca nei risultati...",
      noResults: "Nessun programma trovato",
      loadingMessage: "Caricamento programmi...",

      clickLink: 'Clicca per aprire la pagina ufficiale',
      signInToAccess: 'Accedi per accedere al contenuto protetto'
    },

    services: {
      title: "I Nostri Servizi",
      description: "La nostra consulenza è specializzata nel fornire orientamento agli studenti che cercano opportunità di studio in Italia. I nostri servizi spaziano dalle ammissioni universitarie all'assistenza per le borse di studio.",
      helpedMoreThan: "aiutato più di",
      students: "Studenti",
      admissionsTitle: "Ammissioni Universitarie",
      admissionsDescription: "Ti aiutiamo a navigare nel processo di ammissione e ad assicurarti un posto nella tua università dei sogni in Italia.",
      scholarshipTitle: "Assistenza Borse di Studio",
      scholarshipDescription: "I nostri esperti ti assistono nella ricerca e nella richiesta di borse di studio per sostenere i tuoi studi in Italia."
    },
    founder: {
      title: "Incontra il Nostro Fondatore",
      intro: "Il mio percorso combina l'eccellenza accademica con il successo professionale nel settore tecnologico italiano. Come sviluppatore web presso una delle principali società di consulenza italiane, ho contribuito a progetti per leader mondiali del settore tra cui Luxottica, Ray-Ban, UniCredit e Whirlpool.",
      achievementsTitle: "Risultati Professionali e Accademici:",
      achievements: [
        "Laureato con il massimo dei voti (110/110) nella Laurea Magistrale",
        "Ottenuto 4 prestigiose borse di studio durante il percorso accademico",
        "Bilanciato con successo lavoro professionale ed eccellenza accademica"
      ],
      experienceTitle: "Perché La Mia Esperienza È Importante Per Te",
      experienceDesc: "Ho affrontato e superato le stesse sfide che stai per incontrare. Dalla navigazione della burocrazia alla ricerca di alloggio, dalle barriere linguistiche alle domande di borsa di studio - ci sono passato, ho avuto successo e ora aiuto altri a fare lo stesso.",
      stats: [
        "Aiutato oltre 200 studenti a ottenere borse di studio",
        "95% di successo nelle domande di borsa di studio DSU",
        "Supporto completo dall'application alla laurea"
      ],
      connectWith: "Connettiti Con Me:",
      imageAltGraduation: "Laurea del Fondatore",
      imageAltDiploma: "Diploma del Fondatore"

    },
    about: {
      pageTitle: "Chi è Studentitaly.it Servizi Educativi",
      subtitle: "La Tua Porta d'Accesso all'Istruzione Superiore Italiana",
      missionTitle: "La Nostra Missione",
      missionDescription: "In Studentitaly.it, ci dedichiamo a colmare il divario tra studenti internazionali e prestigiose università italiane. La nostra missione è fornire agli studenti le conoscenze, le risorse e il supporto necessari per perseguire con successo i loro sogni accademici in Italia.",
      whyChooseUsTitle: "Perché Sceglierci?",
      featureTitle1: "Competenza Specializzata",
      featureDescription1: "Profonda comprensione dei sistemi educativi marocchino e italiano",
      featureTitle2: "Approccio Personalizzato",
      featureDescription2: "Guida su misura per le circostanze uniche di ogni studente",
      featureTitle3: "Network Esteso",
      featureDescription3: "Partnership dirette con le principali università italiane",
      featureTitle4: "Comprovata Esperienza",
      featureDescription4: "Alto tasso di successo nelle ammissioni universitarie e nelle domande di borsa di studio",
      ourStoryTitle: "La Nostra Storia",
      ourStoryFoundingStory: "Fondato nel 2020, Studentitaly.it Servizi Educativi è nato dalla passione per l'istruzione e dal desiderio di creare opportunità per gli studenti internazionali. I nostri fondatori, avendo sperimentato il potere trasformativo dello studio all'estero, hanno riconosciuto la necessità di un supporto specializzato per gli studenti che aspirano a studiare in Italia.",
      ourStoryImpact: "Nel corso degli anni, abbiamo aiutato centinaia di studenti a navigare nel complesso processo di iscrizione alle università italiane, ottenendo borse di studio e adattandosi alla vita in Italia. Il nostro team di consulenti esperti, molti dei quali hanno studiato in Italia, porta una ricchezza di conoscenze e intuizioni personali per guidare gli studenti in ogni fase del loro percorso.",
      ctaTitle: "Pronto per Iniziare il Tuo Percorso Accademico in Italia?",
      ctaButtonText: "Contattaci Oggi",
      imageAltUniversity: "Università Italiana"
    },
    footer: {
      description: "Il tuo partner di fiducia per le ammissioni universitarie e le opportunità di studio in Italia.",
      quickLinks: "Link Rapidi",
      contactUs: "Contattaci",
      followUs: "Seguici",
      email: "Email: contact@STUDENTITALY.com",
      phone: "Telefono: +393519000615",
      location: "Sede: Milano, Italia",
      copyright: "Realizzato con tanto ☕️ e ❤️ a Milano 🇮🇹",
      linkAbout: "Chi Siamo",
      linkUniversities: "Università",
      linkCourses: "corsi"

    },
    programSearch: {
      searchTitle: "Cerca Programmi",
      degreeType: "Tipo di Laurea",
      accessType: "Tipo di Accesso",
      courseLanguage: "Lingua del Corso",
      academicArea: "Area Accademica",
      searchPlaceholder: "Cerca nei risultati...",
      noResults: "Nessun programma trovato",
      loadingMessage: "Caricamento programmi..."
    },
    universities: {
      pageTitle: "Scadenza Università Italiane 2025/2026",
      found: "Trovate",
      university: "università",

      lastUpdate: "Ultimo aggiornamento",
      login: "Accedi",
      loginPrompt: "per sbloccare informazioni dettagliate su programmi, tasse e requisiti.",
      showMore: "Mostra di più",
      showLess: "Mostra meno",
      locationTBA: "Località da definire",
      tba: "Da definire",
      free: "Gratuito",
      open: "Aperto",
      closed: "Chiuso",
      comingSoon: "Prossimamente",
      availableIntakes: "Periodi di Ammissione",
      start: "Inizio",
      end: "Fine",
      notes: "Note",
      resources: "Risorse",
      watchTutorial: "Guarda il Tutorial",
      readBlog: "Leggi il Blog",
      visitWebsite: "Visita il Sito Web",
      status: "Stato",
      requirements: "Requisiti",
      deadline: "Scadenza",
      fee: "Tassa",
      location: "Località",
      searchPlaceholder: "Cerca università per nome o località...",
      filters: "Filtri",
      feeFilter: "Tipo di Tassa",
      clearFilters: "Cancella filtri",
      clearAllFilters: "Cancella tutti i filtri e la ricerca",
      noResults: "Nessuna università trovata con i criteri selezionati",
      filterByStatus: "Filtra per stato",
      filterByFee: "Filtra per tipo di tassa",
      paid: 'Pagato',
      protectedContent: 'riservato ai membri',
      apply: 'iscriviti'

    },
    // Italian
    profile: {
      pageTitle: "Il Mio Profilo e Percorso",
      signInPrompt: "Effettua il login per visualizzare il tuo profilo.",
      loading: "Caricamento profilo...",

      tabsPersonalData: "Dati Personali",
      tabsFavorites: "Preferiti",
      tabsApplicationGuide: "Guida all'Ammissione",
      tabsScholarships: "Borse di Studio",

      personalDataTitle: "Informazioni Account",
      firstName: "Nome",
      lastName: "Cognome",
      email: "Indirizzo Email",
      phoneNumber: "Numero di Telefono",
      dateOfBirth: "Data di Nascita",
      nationality: "Nazionalità",
      countryOfResidence: "Paese di Residenza",
      address: "Indirizzo",
      editButton: "Modifica Informazioni",
      saveButton: "Salva Modifiche",
      cancelButton: "Annulla",
      personalDataClerkNote: "I tuoi dati personali sono gestiti in modo sicuro da Clerk. Puoi aggiornare le tue informazioni, gestire le impostazioni di sicurezza e gli account collegati qui.",

      accountSettingsTitle: "Impostazioni Account",
      changePassword: "Cambia Password",
      currentPassword: "Password Attuale",
      newPassword: "Nuova Password",
      confirmNewPassword: "Conferma Nuova Password",
      languagePreference: "Preferenza Lingua",
      notifications: "Notifiche",
      emailNotifications: "Ricevi notifiche via email",
      deleteAccount: "Elimina Account",
      deleteAccountWarning: "Sei sicuro di voler eliminare il tuo account? Questa azione non può essere annullata.",

      myApplicationsTitle: "Le Mie Candidature",
      noApplications: "Non hai ancora inviato nessuna candidatura.",
      applicationDate: "Data Candidatura",
      programName: "Nome Programma",
      universityName: "Nome Università",
      status: "Stato",
      viewDetails: "Visualizza Dettagli",

      savedProgramsTitle: "Programmi Salvati",
      noSavedPrograms: "Non hai ancora salvato nessun programma.",
      removeButton: "Rimuovi", // For saved programs

      favoritesTitle: "I Miei Preferiti",
      favoritesUniversities: "Università Preferite",
      favoritesCourses: "Corsi Preferiti",
      favoritesRemove: "Rimuovi", // Specific for removing a favorite item
      favoritesNoUniversities: "Nessuna università preferita ancora.",
      favoritesNoCourses: "Nessun corso preferito ancora.",
      favoritesExploreNow: "Esplora ora!",

      applicationGuideTitle: "Guida: Fare domanda per l'Italia dall'estero",
      applicationGuideSubtitle: "La tua checklist passo-passo per un processo di candidatura agevole.",
      applicationGuidePhase: "Fase",
      applicationGuideMarkAsComplete: "Segna come Completato",
      applicationGuideMarkAsIncomplete: "Segna come Non Completato",
      applicationGuideLearnMore: "Scopri di più",

      scholarshipsTitle: "Opportunità di Borse di Studio",
      scholarshipsProvider: "Ente Erogatore",
      scholarshipsDeadline: "Scadenza",
      scholarshipsViewDetails: "Visualizza Dettagli",
      scholarshipsNoScholarships: "Nessuna borsa di studio specifica elencata al momento.",
      scholarshipsCheckResources: "Ti consigliamo di controllare i siti web ufficiali delle università e i portali governativi per le opportunità."
    }
  },
  ar: {
    common: {
      search: "بحث",
      about: "من نحن",
      services: "الخدمات",
      universities: "الجامعات",
      deadline: "المواعيد النهائية",
      apply: "تقديم",
      soon: "قريباً",
      contactUs: "اتصل بنا"
    },
    hero: {
      title: "رحلتك إلى إيطاليا تبدأ هنا",
      subtitle: "احصل على إرشادات الخبراء والموارد خطوة بخطوة والخدمات المميزة لجعل رحلة دراستك إلى إيطاليا بسيطة وواضحة وناجحة.",

      ctaButton: "استكشف جميع البرامج الإيطالية"

    },
    programs: {
      searchTitle: "البحث عن البرامج",
      degreeType: "نوع الدرجة",
      accessType: "نوع القبول",
      courseLanguage: "لغة الدراسة",
      academicArea: "المجال الأكاديمي",
      searchPlaceholder: "البحث في النتائج...",
      noResults: "لم يتم العثور على برامج",
      loadingMessage: "جاري تحميل البرامج...",
      clickLink: "انقر هنا للتحقق من البرنامج",
      signInToAccess: "تسجيل الدخول للوصول إلى المحتوى المحمي"
    },

    services: {
      title: "خدماتنا",
      description: "نحن متخصصون في تقديم التوجيه للطلاب الباحثين عن فرص تعليمية في إيطاليا. تتنوع خدماتنا من القبول الجامعي إلى المساعدة في المنح الدراسية.",
      helpedMoreThan: "ساعدنا أكثر من",
      students: "طالب",
      admissionsTitle: "القبول الجامعي",
      admissionsDescription: "نساعدك في التنقل خلال عملية القبول وتأمين مكان في جامعتك المفضلة في إيطاليا.",
      scholarshipTitle: "المساعدة في المنح الدراسية",
      scholarshipDescription: "يساعدك خبراؤنا في العثور على المنح الدراسية والتقدم إليها لدعم دراستك في إيطاليا."
    },
    founder: {
      title: "تعرف على مؤسسنا",
      intro: "تجمع رحلتي بين التفوق الأكاديمي والنجاح المهني في قطاع التكنولوجيا الإيطالي. كمطور ويب في شركة استشارات إيطالية رائدة، ساهمت في مشاريع لشركات عالمية رائدة منها Luxottica وRay-Ban وUniCredit وWhirlpool.",
      achievementsTitle: "الإنجازات المهنية والأكاديمية:",
      achievements: [
        "تخرجت بدرجة كاملة (110/110) في درجة الماجستير",
        "حصلت على 4 منح دراسية مرموقة خلال رحلتي الأكاديمية",
      ],
      experienceTitle: "لماذا تجربتي مهمة لك",
      experienceDesc: "لقد واجهت وتغلبت على نفس التحديات التي أنت على وشك مواجهتها. من التعامل مع البيروقراطية إلى إيجاد السكن، من حواجز اللغة إلى طلبات المنح الدراسية - لقد مررت بها، ونجحت، والآن أساعد الآخرين على تحقيق نفس النجاح.",
      stats: [
        "ساعدت أكثر من 200 طالب في الحصول على منح دراسية",
        "معدل نجاح 95٪ في طلبات منح DSU",
        "دعم شامل من التقديم حتى التخرج"
      ],
      connectWith: "تواصل معي:",
      imageAltGraduation: "تخرج المؤسس",
      imageAltDiploma: "شهادة المؤسس"

    }
    ,
    about: {
      pageTitle: "عن خدمات دانتيما التعليمية",
      subtitle: "بوابتك للتعليم العالي في إيطاليا",
      missionTitle: "مهمتنا",
      missionDescription: "في دانتيما، نكرس أنفسنا لسد الفجوة بين الطلاب الدوليين والجامعات الإيطالية المرموقة. مهمتنا هي تمكين الطلاب بالمعرفة والموارد والدعم الذي يحتاجونه لمتابعة أحلامهم الأكاديمية في إيطاليا بنجاح.",
      whyChooseUsTitle: "لماذا تختارنا؟",
      featureTitle1: "خبرة متخصصة",
      featureDescription1: "فهم عميق للنظامين التعليميين المغربي والإيطالي",
      featureTitle2: "نهج شخصي",
      featureDescription2: "توجيه مخصص لظروف كل طالب الفريدة",
      featureTitle3: "شبكة واسعة",
      featureDescription3: "شراكات مباشرة مع الجامعات الإيطالية الرائدة",
      featureTitle4: "سجل حافل",
      featureDescription4: "معدلات نجاح عالية في القبول الجامعي وطلبات المنح الدراسية",
      ourStoryTitle: "قصتنا",
      ourStoryFoundingStory: "تأسست خدمات دانتيما التعليمية في عام 2020 من شغف بالتعليم ورغبة في خلق فرص للطلاب الدوليين. أدرك مؤسسونا، الذين اختبروا القوة التحويلية للدراسة في الخارج، الحاجة إلى دعم متخصص للطلاب الطامحين للدراسة في إيطاليا.",
      ourStoryImpact: "على مر السنين، ساعدنا مئات الطلاب في التنقل خلال العملية المعقدة للتقدم إلى الجامعات الإيطالية، وتأمين المنح الدراسية، والتكيف مع الحياة في إيطاليا. يجلب فريقنا من المستشارين ذوي الخبرة، العديد منهم درسوا في إيطاليا، ثروة من المعرفة والرؤى الشخصية لتوجيه الطلاب في كل خطوة من رحلتهم.",
      ctaTitle: "هل أنت مستعد لبدء رحلتك الأكاديمية في إيطاليا؟",
      ctaButtonText: "تواصل معنا اليوم",
      imageAltUniversity: "الجامعة الإيطالية"
    },
    footer: {
      description: "شريكك الموثوق به في التنقل عبر القبول الجامعي الإيطالي وفرص التعليم.",
      quickLinks: "روابط سريعة",
      contactUs: "اتصل بنا",
      followUs: "تابعنا",
      email: "البريد الإلكتروني: contact@STUDENTITALY.com",
      phone: "الهاتف: +393519000615",
      location: "الموقع: ميلانو، إيطاليا",
      copyright: "صنع بالكثير من ☕️ و ❤️ في ميلانو 🇮🇹",
      linkAbout: "عن الشركة",
      linkUniversities: "الجامعات",
      linkCourses: "ابحث عن تخصصك"



    },
    programSearch: {
      searchTitle: "البحث عن البرامج",
      degreeType: "نوع الدرجة",
      accessType: "نوع الوصول",
      courseLanguage: "لغة الدورة",
      academicArea: "المجال الأكاديمي",
      searchPlaceholder: "البحث في النتائج...",
      noResults: "لم يتم العثور على برامج",
      loadingMessage: "جاري تحميل البرامج..."
    },
    universities: {
      pageTitle: " التسجيل بالجامعات الايطالية لسنة 2025/2026",
      found: "تم العثور على",
      university: "جامعة",

      lastUpdate: "آخر تحديث",
      login: "تسجيل الدخول",
      loginPrompt: "لفتح معلومات مفصلة عن البرامج والرسوم والمتطلبات.",
      showMore: "عرض المزيد",
      showLess: "عرض أقل",
      locationTBA: "الموقع قيد التحديد",
      tba: "قيد التحديد",
      free: "مجاني",
      open: "التسجيل مفتوح",
      closed: "مغلق",
      comingSoon: "قريباً",
      availableIntakes: "فترات القبول المتاحة",
      start: "البداية",
      end: "النهاية",
      notes: "ملاحظات",
      resources: "الموارد",
      watchTutorial: "مشاهدة الشرح",
      readBlog: "قراءة المدونة",
      visitWebsite: "زيارة موقع الجامعة",
      status: "الحالة",
      requirements: "المتطلبات",
      deadline: "الموعد النهائي",
      fee: "الرسوم",
      location: "الموقع",
      searchPlaceholder: "ابحث عن الجامعات حسب الاسم أو الموقع...",
      filters: "فيلتر",
      feeFilter: "نوع الرسوم",
      clearFilters: "مسح الفيلتر",
      clearAllFilters: "مسح كل عوامل الفيلتر والبحث",
      noResults: "لم يتم العثور على جامعات تطابق المعايير المحددة",
      filterByStatus: "فيلتر حسب الحالة",
      filterByFee: "فيلتر حسب نوع الرسوم",
      paid: "مدفوع",
      protectedContent: " خاص بالاعضاء المسجلين فقط",
      apply: 'التسجيل'
    },
    // Arabic
    profile: {
      pageTitle: "ملفي الشخصي ورحلتي",
      signInPrompt: "الرجاء تسجيل الدخول لعرض ملفك الشخصي.",
      loading: "جاري تحميل الملف الشخصي...",

      tabsPersonalData: "البيانات الشخصية",
      tabsFavorites: "المفضلة",
      tabsApplicationGuide: "دليل التقديم",
      tabsScholarships: "المنح الدراسية",

      personalDataTitle: "معلومات الحساب",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      email: "البريد الإلكتروني",
      phoneNumber: "رقم الهاتف",
      dateOfBirth: "تاريخ الميلاد",
      nationality: "الجنسية",
      countryOfResidence: "بلد الإقامة",
      address: "العنوان",
      editButton: "تعديل المعلومات",
      saveButton: "حفظ التغييرات",
      cancelButton: "إلغاء",
      personalDataClerkNote: "تتم إدارة بياناتك الشخصية بشكل آمن بواسطة Clerk. يمكنك تحديث معلوماتك وإدارة إعدادات الأمان والحسابات المتصلة هنا.",

      accountSettingsTitle: "إعدادات الحساب",
      changePassword: "تغيير كلمة المرور",
      currentPassword: "كلمة المرور الحالية",
      newPassword: "كلمة المرور الجديدة",
      confirmNewPassword: "تأكيد كلمة المرور الجديدة",
      languagePreference: "تفضيلات اللغة",
      notifications: "الإشعارات",
      emailNotifications: "استقبال إشعارات البريد الإلكتروني",
      deleteAccount: "حذف الحساب",
      deleteAccountWarning: "هل أنت متأكد أنك تريد حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.",

      myApplicationsTitle: "طلباتي",
      noApplications: "لم تقم بتقديم أي طلبات بعد.",
      applicationDate: "تاريخ التقديم",
      programName: "اسم البرنامج",
      universityName: "اسم الجامعة",
      status: "الحالة",
      viewDetails: "عرض التفاصيل",

      savedProgramsTitle: "البرامج المحفوظة",
      noSavedPrograms: "لم تقم بحفظ أي برامج بعد.",
      removeButton: "إزالة", // For saved programs

      favoritesTitle: "مفضلتي",
      favoritesUniversities: "الجامعات المفضلة",
      favoritesCourses: "الدورات المفضلة",
      favoritesRemove: "إزالة", // Specific for removing a favorite item
      favoritesNoUniversities: "لا توجد جامعات مفضلة بعد.",
      favoritesNoCourses: "لا توجد دورات مفضلة بعد.",
      favoritesExploreNow: "استكشف الآن!",

      applicationGuideTitle: "دليل: التقديم للدراسة في إيطاليا من الخارج",
      applicationGuideSubtitle: "قائمة مرجعية خطوة بخطوة لعملية تقديم سلسة.",
      applicationGuidePhase: "مرحلة",
      applicationGuideMarkAsComplete: "وضع علامة كمكتمل",
      applicationGuideMarkAsIncomplete: "وضع علامة كغير مكتمل",
      applicationGuideLearnMore: "اعرف المزيد",

      scholarshipsTitle: "فرص المنح الدراسية",
      scholarshipsProvider: "مقدم المنحة",
      scholarshipsDeadline: "الموعد النهائي",
      scholarshipsViewDetails: "عرض التفاصيل",
      scholarshipsNoScholarships: "لا توجد منح دراسية محددة مدرجة في الوقت الحالي.",
      scholarshipsCheckResources: "نوصي بمراجعة المواقع الرسمية للجامعات والبوابات الحكومية للبحث عن الفرص."
    }
  }
}


