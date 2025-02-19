// lib/i18n/translations.ts
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
      contactUs: "Contact Us"
    },
    hero: {
      title: "Start Your Italian Dream Education",
      subtitle: "Get expert guidance, step-by-step resources, and premium services to make your study journey to Italy simple, clear, and successful.",
      ctaButton: "Explore All Italian Programs"
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
        "Web Developer for top Italian consultancy firm, working with global brands",
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
      pageTitle: "About danteMa Educational Services",
      subtitle: "Your Gateway to Italian Higher Education",
      missionTitle: "Our Mission",
      missionDescription: "At danteMa, we are dedicated to bridging the gap between international students and prestigious Italian universities. Our mission is to empower students with the knowledge, resources, and support they need to successfully pursue their academic dreams in Italy.",
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
      ourStoryFoundingStory: "Founded in 2020, danteMa Educational Services was born out of a passion for education and a desire to create opportunities for International students. Our founders, having experienced the transformative power of studying abroad, recognized the need for specialized support for students aspiring to study in Italy.",
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
      email: "Email: contact@dantealighieri.com",
      phone: "Phone: +393519000615",
      location: "Location: Milan, Italy",
      copyright: "Made with a lot of ☕️ and ❤️ in Milan 🇮🇹",
      linkAbout: "About",
      linkUniversities: "Universities",
      linkCourses: "Courses"
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
      protectedContent:'members only'

      
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
        "Sviluppatore Web per primaria società di consulenza italiana, collaborando con marchi globali",
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
      pageTitle: "Chi è danteMa Servizi Educativi",
      subtitle: "La Tua Porta d'Accesso all'Istruzione Superiore Italiana",
      missionTitle: "La Nostra Missione",
      missionDescription: "In danteMa, ci dedichiamo a colmare il divario tra studenti internazionali e prestigiose università italiane. La nostra missione è fornire agli studenti le conoscenze, le risorse e il supporto necessari per perseguire con successo i loro sogni accademici in Italia.",
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
      ourStoryFoundingStory: "Fondato nel 2020, danteMa Servizi Educativi è nato dalla passione per l'istruzione e dal desiderio di creare opportunità per gli studenti internazionali. I nostri fondatori, avendo sperimentato il potere trasformativo dello studio all'estero, hanno riconosciuto la necessità di un supporto specializzato per gli studenti che aspirano a studiare in Italia.",
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
      email: "Email: contact@dantealighieri.com",
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
      paid:'Pagato',
      protectedContent:'riservato ai membri' 

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
        "مطور ويب لشركة استشارات إيطالية رائدة، العمل مع علامات تجارية عالمية",
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
      email: "البريد الإلكتروني: contact@dantealighieri.com",
      phone: "الهاتف: +393519000615",
      location: "الموقع: ميلانو، إيطاليا",
      copyright: "صنع بالكثير من ☕️ و ❤️ في ميلانو 🇮🇹",
      linkAbout: "عن الشركة",
      linkUniversities: "الجامعات",
      linkCourses: "البرامج"



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
      protectedContent: " خاص بالاعضاء المسجلين فقط"
    }
  }
}


