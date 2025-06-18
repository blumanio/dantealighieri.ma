import { ChecklistPhase } from "@/types/checklist";

export const italyChecklistData: ChecklistPhase[] = [
  {
    id: 'research',
    titleKey: 'Research & University Selection',
    description: 'Discover your perfect Italian university and study program',
    icon: 'BookOpen',
    estimatedTime: '3-4 weeks',
    priority: 'high',
    isOpen: true,
    completionReward: 'Research Master Badge',
    nextPhaseUnlocked: true,
    items: [
      {
        id: 'university-research',
        title: 'Research Italian Universities',
        description: 'Find universities that match your academic goals and preferences',
        completed: false,
        priority: 'critical',
        estimatedTime: '5-7 days',
        tips: 'Focus on 3-5 universities max to avoid decision paralysis. Consider QS World University Rankings.',
        resources: [
          'Universitaly.it (official portal)',
          'QS World University Rankings',
          'Times Higher Education',
          'StudyPortals.com'
        ],
        category: 'research',
        subItems: [
          {
            id: 'public-universities',
            title: 'Research Public Universities',
            description: 'Explore state universities with lower tuition fees',
            completed: false,
            priority: 'high',
            estimatedTime: '2-3 days',
            tips: 'Public universities in Italy have very affordable tuition (€150-4,000/year)',
            resources: ['List of Italian public universities', 'Tuition fee comparisons']
          },
          {
            id: 'private-universities',
            title: 'Research Private Universities',
            description: 'Explore private institutions with specialized programs',
            completed: false,
            priority: 'medium',
            estimatedTime: '2-3 days',
            tips: 'Private universities often offer more English-taught programs',
            resources: ['Bocconi University', 'LUISS University', 'Private institution directory']
          },
          {
            id: 'program-comparison',
            title: 'Compare Specific Programs',
            description: 'Analyze curriculum, faculty, and career outcomes',
            completed: false,
            priority: 'critical',
            estimatedTime: '3-4 days',
            tips: 'Look for programs with industry partnerships and internship opportunities'
          }
        ]
      },
      {
        id: 'city-selection',
        title: 'Choose Your Italian City',
        description: 'Select the city that best fits your lifestyle and budget',
        completed: false,
        priority: 'high',
        estimatedTime: '3-4 days',
        tips: 'Consider cost of living, climate, cultural offerings, and job opportunities',
        resources: [
          'Numbeo cost of living index',
          'Italian city guides',
          'Student city rankings',
          'Climate comparison tools'
        ],
        subItems: [
          {
            id: 'rome-research',
            title: 'Research Rome',
            description: 'Capital city with rich history and many universities',
            completed: false,
            priority: 'medium',
            estimatedTime: '1 day',
            tips: 'Higher cost of living but excellent cultural opportunities and job market'
          },
          {
            id: 'milan-research',
            title: 'Research Milan',
            description: 'Economic capital with strong business and fashion programs',
            completed: false,
            priority: 'medium',
            estimatedTime: '1 day',
            tips: 'Best for business, economics, and fashion studies. Higher living costs but better job prospects'
          },
          {
            id: 'florence-research',
            title: 'Research Florence',
            description: 'Renaissance city perfect for arts and humanities',
            completed: false,
            priority: 'medium',
            estimatedTime: '1 day',
            tips: 'Ideal for art, architecture, and history students. Smaller but very cultural'
          },
          {
            id: 'other-cities',
            title: 'Research Other Cities',
            description: 'Explore Bologna, Turin, Naples, and other university cities',
            completed: false,
            priority: 'low',
            estimatedTime: '1-2 days',
            tips: 'Smaller cities often have lower costs and strong student communities'
          }
        ]
      },
      {
        id: 'program-selection',
        title: 'Select Your Study Program',
        description: 'Choose specific degree programs and courses',
        completed: false,
        priority: 'critical',
        estimatedTime: '4-5 days',
        tips: 'Ensure programs are taught in your preferred language and meet your career goals',
        resources: [
          'Program curricula',
          'Course descriptions',
          'Faculty profiles',
          'Graduate outcomes data'
        ],
        subItems: [
          {
            id: 'language-check',
            title: 'Check Language Requirements',
            description: 'Verify if programs are taught in English or Italian',
            completed: false,
            priority: 'critical',
            estimatedTime: '1 day',
            tips: 'Many programs offer both English and Italian tracks'
          },
          {
            id: 'prerequisites',
            title: 'Review Prerequisites',
            description: 'Ensure you meet academic and language requirements',
            completed: false,
            priority: 'critical',
            estimatedTime: '1-2 days',
            tips: 'Check if you need to take additional courses or exams'
          }
        ]
      },
      {
        id: 'budget-planning',
        title: 'Create Detailed Budget Plan',
        description: 'Calculate all costs including tuition, living expenses, and travel',
        completed: false,
        priority: 'critical',
        estimatedTime: '2-3 days',
        tips: 'Include emergency fund of €3,000-5,000. Public transport is very affordable in Italy.',
        resources: [
          'Italian cost of living calculator',
          'University tuition fee lists',
          'Student budget templates',
          'Scholarship databases'
        ],
        subItems: [
          {
            id: 'tuition-costs',
            title: 'Calculate Tuition Costs',
            description: 'Research exact tuition fees for your chosen programs',
            completed: false,
            priority: 'critical',
            estimatedTime: '1 day',
            tips: 'Public universities: €150-4,000/year, Private: €6,000-20,000/year'
          },
          {
            id: 'living-costs',
            title: 'Estimate Living Costs',
            description: 'Budget for accommodation, food, transport, and personal expenses',
            completed: false,
            priority: 'critical',
            estimatedTime: '1-2 days',
            tips: 'Budget €700-1,200/month depending on city. Rome/Milan more expensive.'
          },
          {
            id: 'scholarship-research',
            title: 'Research Scholarships',
            description: 'Find available scholarships and funding opportunities',
            completed: false,
            priority: 'high',
            estimatedTime: '2-3 days',
            tips: 'Check government scholarships, university grants, and private foundations'
          }
        ]
      }
    ]
  },
  {
    id: 'application',
    titleKey: 'University Application Process',
    description: 'Submit strong applications to your chosen Italian universities',
    icon: 'Target',
    estimatedTime: '6-8 weeks',
    priority: 'critical',
    isOpen: false,
    completionReward: 'Application Champion Badge',
    nextPhaseUnlocked: false,
    items: [
      {
        id: 'document-preparation',
        title: 'Prepare Academic Documents',
        description: 'Gather and prepare all required academic transcripts and certificates',
        completed: false,
        priority: 'critical',
        estimatedTime: '2-3 weeks',
        tips: 'Start early as official transcripts can take 2-4 weeks to obtain',
        resources: [
          'Academic transcript request forms',
          'Degree certificate copies',
          'Official translation services',
          'Apostille services'
        ],
        subItems: [
          {
            id: 'transcripts',
            title: 'Obtain Official Transcripts',
            description: 'Request official transcripts from all attended institutions',
            completed: false,
            priority: 'critical',
            estimatedTime: '1-2 weeks',
            tips: 'Request multiple copies as you may need them for visa applications too'
          },
          {
            id: 'degree-certificates',
            title: 'Get Degree Certificates',
            description: 'Obtain official degree/diploma certificates',
            completed: false,
            priority: 'critical',
            estimatedTime: '1-2 weeks',
            tips: 'Ensure certificates are recent and in good condition'
          },
          {
            id: 'translation',
            title: 'Translate Documents',
            description: 'Get official translations of non-English/Italian documents',
            completed: false,
            priority: 'critical',
            estimatedTime: '1-2 weeks',
            tips: 'Use certified translation services recognized by Italian authorities'
          },
          {
            id: 'apostille',
            title: 'Get Apostille Certification',
            description: 'Obtain apostille for documents to be used in Italy',
            completed: false,
            priority: 'critical',
            estimatedTime: '1-2 weeks',
            tips: 'Required for legal recognition of foreign documents in Italy'
          }
        ]
      },
      {
        id: 'language-certification',
        title: 'Obtain Language Certification',
        description: 'Take required language proficiency tests',
        completed: false,
        priority: 'critical',
        estimatedTime: '4-6 weeks',
        tips: 'Book test dates early as slots fill up quickly, especially for IELTS/TOEFL',
        resources: [
          'IELTS test centers',
          'TOEFL registration',
          'Italian language test info',
          'Test preparation materials'
        ],
        subItems: [
          {
            id: 'english-test',
            title: 'Take English Proficiency Test',
            description: 'Complete IELTS, TOEFL, or equivalent for English programs',
            completed: false,
            priority: 'critical',
            estimatedTime: '3-4 weeks',
            tips: 'Minimum scores: IELTS 6.0-6.5, TOEFL 80-90 (varies by program)'
          },
          {
            id: 'italian-test',
            title: 'Take Italian Language Test',
            description: 'Complete CILS, CELI, or PLIDA for Italian programs',
            completed: false,
            priority: 'high',
            estimatedTime: '3-4 weeks',
            tips: 'Usually need B1-B2 level for undergraduate, B2-C1 for graduate programs'
          }
        ]
      },
      {
        id: 'personal-statement',
        title: 'Write Personal Statement/Essays',
        description: 'Craft compelling personal statements for each application',
        completed: false,
        priority: 'high',
        estimatedTime: '2-3 weeks',
        tips: 'Tailor each statement to the specific program and university',
        resources: [
          'Personal statement examples',
          'Essay writing guides',
          'University-specific prompts',
          'Professional review services'
        ],
        subItems: [
          {
            id: 'motivation-letter',
            title: 'Write Motivation Letter',
            description: 'Explain why you want to study in Italy and your chosen program',
            completed: false,
            priority: 'high',
            estimatedTime: '1-2 weeks',
            tips: 'Be specific about your goals and how Italy fits into your career plans'
          },
          {
            id: 'statement-of-purpose',
            title: 'Write Statement of Purpose',
            description: 'Detail your academic and professional objectives',
            completed: false,
            priority: 'high',
            estimatedTime: '1-2 weeks',
            tips: 'Focus on your achievements, goals, and how the program will help you'
          }
        ]
      },
      {
        id: 'recommendation-letters',
        title: 'Secure Recommendation Letters',
        description: 'Obtain 2-3 strong letters of recommendation',
        completed: false,
        priority: 'high',
        estimatedTime: '3-4 weeks',
        tips: 'Give recommenders at least 4-6 weeks notice and provide them with your resume',
        resources: [
          'Recommendation request templates',
          'Guidelines for recommenders',
          'University requirements'
        ],
        subItems: [
          {
            id: 'academic-references',
            title: 'Get Academic References',
            description: 'Secure letters from professors or academic advisors',
            completed: false,
            priority: 'high',
            estimatedTime: '2-3 weeks',
            tips: 'Choose professors who know your work well and can speak to your abilities'
          },
          {
            id: 'professional-references',
            title: 'Get Professional References',
            description: 'Obtain letters from employers or supervisors',
            completed: false,
            priority: 'medium',
            estimatedTime: '2-3 weeks',
            tips: 'Especially important for MBA or professional programs'
          }
        ]
      },
      {
        id: 'application-submission',
        title: 'Submit University Applications',
        description: 'Complete and submit all application materials',
        completed: false,
        priority: 'critical',
        estimatedTime: '1-2 weeks',
        tips: 'Submit well before deadlines and keep copies of all documents',
        resources: [
          'University application portals',
          'Application deadline calendar',
          'Submission checklists'
        ],
        dependencies: ['document-preparation', 'language-certification', 'personal-statement', 'recommendation-letters'],
        subItems: [
          {
            id: 'online-applications',
            title: 'Complete Online Applications',
            description: 'Fill out university application forms online',
            completed: false,
            priority: 'critical',
            estimatedTime: '3-5 days',
            tips: 'Save drafts frequently and double-check all information before submitting'
          },
          {
            id: 'application-fees',
            title: 'Pay Application Fees',
            description: 'Submit required application fees for each university',
            completed: false,
            priority: 'critical',
            estimatedTime: '1 day',
            tips: 'Fees typically range from €30-100 per application'
          },
          {
            id: 'document-upload',
            title: 'Upload Required Documents',
            description: 'Submit all supporting documents through application portals',
            completed: false,
            priority: 'critical',
            estimatedTime: '2-3 days',
            tips: 'Ensure all documents are in the correct format and size'
          }
        ]
      }
    ]
  },
  {
    id: 'visa-documentation',
    titleKey: 'Visa & Legal Documentation',
    description: 'Secure your student visa and prepare legal documents for Italy',
    icon: 'FileText',
    estimatedTime: '8-12 weeks',
    priority: 'critical',
    isOpen: false,
    completionReward: 'Visa Master Badge',
    nextPhaseUnlocked: false,
    items: [
      {
        id: 'university-acceptance',
        title: 'Receive University Acceptance',
        description: 'Wait for and receive official acceptance letters',
        completed: false,
        priority: 'critical',
        estimatedTime: '4-8 weeks',
        tips: 'Universities typically respond 2-4 months after application deadlines',
        resources: [
          'University contact information',
          'Application status portals',
          'Acceptance timeline guides'
        ],
        dependencies: ['application-submission']
      },
      {
        id: 'passport-preparation',
        title: 'Prepare Valid Passport',
        description: 'Ensure passport is valid for at least 6 months beyond stay',
        completed: false,
        priority: 'critical',
        estimatedTime: '2-6 weeks',
        tips: 'Renew passport if it expires within 12 months of your Italy arrival',
        resources: [
          'Passport renewal services',
          'Embassy/consulate information',
          'Passport photo requirements'
        ],
        subItems: [
          {
            id: 'passport-validity',
            title: 'Check Passport Validity',
            description: 'Verify passport expiration date and condition',
            completed: false,
            priority: 'critical',
            estimatedTime: '1 day',
            tips: 'Passport must be valid for at least 6 months beyond your intended stay'
          },
          {
            id: 'passport-renewal',
            title: 'Renew Passport if Needed',
            description: 'Apply for passport renewal if expiring soon',
            completed: false,
            priority: 'critical',
            estimatedTime: '2-6 weeks',
            tips: 'Passport renewal can take 2-6 weeks depending on your country'
          }
        ]
      },
      {
        id: 'visa-application',
        title: 'Apply for Student Visa',
        description: 'Submit student visa application at Italian consulate',
        completed: false,
        priority: 'critical',
        estimatedTime: '4-6 weeks',
        tips: 'Book consulate appointment early as wait times can be 2-4 weeks',
        resources: [
          'Italian consulate locations',
          'Visa application forms',
          'Appointment booking systems',
          'Visa requirements checklist'
        ],
        dependencies: ['university-acceptance', 'passport-preparation'],
        subItems: [
          {
            id: 'consulate-appointment',
            title: 'Book Consulate Appointment',
            description: 'Schedule visa appointment at Italian consulate',
            completed: false,
            priority: 'critical',
            estimatedTime: '1-2 weeks',
            tips: 'Book as soon as you have acceptance letter - appointments fill up quickly'
          },
          {
            id: 'visa-forms',
            title: 'Complete Visa Application Forms',
            description: 'Fill out official visa application forms',
            completed: false,
            priority: 'critical',
            estimatedTime: '1-2 days',
            tips: 'Double-check all information matches your other documents exactly'
          },
          {
            id: 'visa-photos',
            title: 'Take Visa Photos',
            description: 'Get passport-style photos meeting Italian requirements',
            completed: false,
            priority: 'medium',
            estimatedTime: '1 day',
            tips: 'Photos must be recent, professional, and meet specific size requirements'
          }
        ]
      },
      {
        id: 'financial-documentation',
        title: 'Prepare Financial Proof',
        description: 'Gather documents proving financial capability for studies',
        completed: false,
        priority: 'critical',
        estimatedTime: '2-3 weeks',
        tips: 'Need to show €5,824.91 for living expenses plus tuition coverage',
        resources: [
          'Bank statement requirements',
          'Scholarship documentation',
          'Financial guarantee templates',
          'Sponsor documentation'
        ],
        subItems: [
          {
            id: 'bank-statements',
            title: 'Obtain Recent Bank Statements',
            description: 'Get last 3-6 months of bank statements',
            completed: false,
            priority: 'critical',
            estimatedTime: '1 week',
            tips: 'Statements should show consistent balance and regular income'
          },
          {
            id: 'financial-guarantee',
            title: 'Prepare Financial Guarantee',
            description: 'Get financial guarantee from sponsor if applicable',
            completed: false,
            priority: 'high',
            estimatedTime: '1-2 weeks',
            tips: 'Sponsor must provide income proof, bank statements, and guarantee letter'
          },
          {
            id: 'scholarship-proof',
            title: 'Gather Scholarship Documentation',
            description: 'Collect official scholarship award letters',
            completed: false,
            priority: 'medium',
            estimatedTime: '1 week',
            tips: 'Include any government, university, or private scholarships'
          }
        ]
      },
      {
        id: 'health-insurance',
        title: 'Obtain Health Insurance',
        description: 'Secure comprehensive health insurance coverage for Italy',
        completed: false,
        priority: 'high',
        estimatedTime: '1-2 weeks',
        tips: 'European Health Insurance Card (EHIC) or private insurance both accepted',
        resources: [
          'Insurance provider comparisons',
          'Coverage requirement details',
          'EHIC application process',
          'Private insurance options'
        ],
        subItems: [
          {
            id: 'ehic-card',
            title: 'Apply for EHIC Card',
            description: 'Get European Health Insurance Card if from EU country',
            completed: false,
            priority: 'medium',
            estimatedTime: '1-2 weeks',
            tips: 'Free for EU citizens and covers basic medical needs'
          },
          {
            id: 'private-insurance',
            title: 'Get Private Health Insurance',
            description: 'Purchase comprehensive private health insurance',
            completed: false,
            priority: 'high',
            estimatedTime: '1 week',
            tips: 'Ensure coverage includes emergency care, hospitalization, and repatriation'
          }
        ]
      }
    ]
  },
  {
    id: 'preparation',
    titleKey: 'Pre-Departure Preparation',
    description: 'Prepare for your move to Italy and student life',
    icon: 'Plane',
    estimatedTime: '6-8 weeks',
    priority: 'high',
    isOpen: false,
    completionReward: 'Preparation Pro Badge',
    nextPhaseUnlocked: false,
    items: [
      {
        id: 'accommodation',
        title: 'Secure Accommodation',
        description: 'Find and book housing for your stay in Italy',
        completed: false,
        priority: 'critical',
        estimatedTime: '3-4 weeks',
        tips: 'Book temporary housing for first 2 weeks if you want to see places in person',
        resources: [
          'Student housing portals',
          'University accommodation',
          'Private rental platforms',
          'Roommate matching services'
        ],
        subItems: [
          {
            id: 'university-housing',
            title: 'Apply for University Housing',
            description: 'Apply for on-campus or university-managed accommodation',
            completed: false,
            priority: 'high',
            estimatedTime: '1-2 weeks',
            tips: 'University housing is often cheaper and includes utilities'
          },
          {
            id: 'private-rental',
            title: 'Search Private Rentals',
            description: 'Look for apartments or shared housing options',
            completed: false,
            priority: 'medium',
            estimatedTime: '2-3 weeks',
            tips: 'Popular sites: Idealista.it, Immobiliare.it, SpotAHome.com'
          },
          {
            id: 'temporary-housing',
            title: 'Book Temporary Housing',
            description: 'Reserve short-term accommodation for apartment hunting',
            completed: false,
            priority: 'medium',
            estimatedTime: '1 week',
            tips: 'Hostels, Airbnb, or hotels for first 1-2 weeks while you search'
          }
        ]
      },
      {
        id: 'flight-booking',
        title: 'Book Flight Tickets',
        description: 'Purchase flights to Italy for your study program',
        completed: false,
        priority: 'medium',
        estimatedTime: '1-2 weeks',
        tips: 'Book 2-3 months in advance for better prices. Consider flexible dates.',
        resources: [
          'Flight comparison websites',
          'Student discount programs',
          'Airline baggage policies',
          'Travel insurance options'
        ],
        subItems: [
          {
            id: 'flight-comparison',
            title: 'Compare Flight Options',
            description: 'Research different airlines and routes to Italy',
            completed: false,
            priority: 'medium',
            estimatedTime: '2-3 days',
            tips: 'Consider flying into Rome, Milan, or nearby European cities'
          },
          {
            id: 'travel-insurance',
            title: 'Purchase Travel Insurance',
            description: 'Get comprehensive travel insurance for your trip',
            completed: false,
            priority: 'medium',
            estimatedTime: '1 day',
            tips: 'Ensure coverage includes flight cancellation, baggage, and medical emergencies'
          }
        ]
      },
      {
        id: 'banking-setup',
        title: 'Prepare Banking Solutions',
        description: 'Set up banking for your time in Italy',
        completed: false,
        priority: 'high',
        estimatedTime: '2-3 weeks',
        tips: 'Some Italian banks allow online pre-registration for international students',
        resources: [
          'Italian bank comparisons',
          'Student account options',
          'International banking services',
          'Currency exchange options'
        ],
        subItems: [
          {
            id: 'bank-research',
            title: 'Research Italian Banks',
            description: 'Compare student banking options in Italy',
            completed: false,
            priority: 'high',
            estimatedTime: '1 week',
            tips: 'Popular student-friendly banks: UniCredit, Intesa Sanpaolo, BNL'
          },
          {
            id: 'international-card',
            title: 'Get International Debit Card',
            description: 'Ensure your current bank card works internationally',
            completed: false,
            priority: 'medium',
            estimatedTime: '1-2 weeks',
            tips: 'Notify your bank of travel plans to avoid card blocks'
          },
          {
            id: 'currency-planning',
            title: 'Plan Currency Exchange',
            description: 'Prepare euros for initial expenses',
            completed: false,
            priority: 'medium',
            estimatedTime: '1 week',
            tips: 'Bring €500-1000 cash for initial expenses and emergencies'
          }
        ]
      },
      {
        id: 'communication-setup',
        title: 'Set Up Communication',
        description: 'Arrange phone and internet connectivity for Italy',
        completed: false,
        priority: 'medium',
        estimatedTime: '1-2 weeks',
        tips: 'EU roaming is free within Europe, but local SIM might be cheaper long-term',
        resources: [
          'Italian mobile operators',
          'EU roaming policies',
          'Student phone plans',
          'Internet providers'
        ],
        subItems: [
          {
            id: 'mobile-plan',
            title: 'Choose Mobile Plan',
            description: 'Select between EU roaming and Italian SIM card',
            completed: false,
            priority: 'medium',
            estimatedTime: '1 week',
            tips: 'Major operators: TIM, Vodafone, WindTre, Iliad'
          },
          {
            id: 'internet-research',
            title: 'Research Internet Options',
            description: 'Plan internet connectivity for your accommodation',
            completed: false,
            priority: 'low',
            estimatedTime: '1-2 days',
            tips: 'Many student accommodations include WiFi'
          }
        ]
      },
      {
        id: 'language-preparation',
        title: 'Improve Italian Language Skills',
        description: 'Study Italian to ease your transition',
        completed: false,
        priority: 'medium',
        estimatedTime: '6-8 weeks',
        tips: 'Focus on practical daily conversation and university-related vocabulary',
        resources: [
          'Language learning apps',
          'Online Italian courses',
          'Italian conversation groups',
          'Language exchange platforms'
        ],
        subItems: [
          {
            id: 'basic-italian',
            title: 'Learn Basic Italian Phrases',
            description: 'Master essential phrases for daily life',
            completed: false,
            priority: 'medium',
            estimatedTime: '2-3 weeks',
            tips: 'Focus on greetings, directions, shopping, and emergency phrases'
          },
          {
            id: 'academic-italian',
            title: 'Study Academic Italian',
            description: 'Learn university-related vocabulary and phrases',
            completed: false,
            priority: 'medium',
            estimatedTime: '3-4 weeks',
            tips: 'Essential for navigating university bureaucracy and classes'
          },
          {
            id: 'cultural-preparation',
            title: 'Learn About Italian Culture',
            description: 'Study Italian customs, etiquette, and social norms',
            completed: false,
            priority: 'low',
            estimatedTime: '2-3 weeks',
            tips: 'Understanding culture helps with social integration and daily life'
          }
        ]
      }
    ]
  },
  {
    id: 'arrival',
    titleKey: 'Arrival & Settlement in Italy',
    description: 'Complete essential tasks in your first weeks in Italy',
    icon: 'Home',
    estimatedTime: '4-6 weeks',
    priority: 'critical',
    isOpen: false,
    completionReward: 'Italy Resident Badge',
    nextPhaseUnlocked: false,
    items: [
      {
        id: 'permesso-soggiorno',
        title: 'Apply for Permesso di Soggiorno',
        description: 'Get your residence permit within 8 days of arrival',
        completed: false,
        priority: 'critical',
        estimatedTime: '2-3 weeks',
        tips: 'MUST apply within 8 days of arrival - this is legally required!',
        resources: [
          'Poste Italiane (for application kit)',
          'Questura office locations',
          'Permesso application guide',
          'Required documents list'
        ],
        subItems: [
          {
            id: 'get-kit',
            title: 'Get Application Kit',
            description: 'Pick up the "Permesso di Soggiorno" kit from a post office (Poste Italiane) with a "Sportello Amico" counter.',
            completed: false,
            priority: 'critical',
            estimatedTime: '1 day',
            tips: 'The kit is a large envelope with forms and instructions. It is free.'
          },
          {
            id: 'fill-forms',
            title: 'Fill Out Application Forms',
            description: 'Complete the forms (Modulo 1) in the kit. Seek help from a university international office or a "patronato".',
            completed: false,
            priority: 'critical',
            estimatedTime: '1-3 days',
            tips: 'Write clearly in black ink. Do not sign the forms or seal the envelope.'
          },
          {
            id: 'pay-fees',
            title: 'Pay Application Fees',
            description: 'Pay the application fee and the cost of the electronic permit via a payment slip (bollettino) at the post office.',
            completed: false,
            priority: 'critical',
            estimatedTime: '1 day',
            tips: 'Keep the receipt as it is proof of your application.'
          },
          {
            id: 'submit-kit',
            title: 'Submit Kit at Post Office',
            description: 'Submit the unsealed envelope with the completed forms and documents at the "Sportello Amico".',
            completed: false,
            priority: 'critical',
            estimatedTime: '1 day',
            tips: 'The clerk will give you a receipt and an appointment for fingerprinting at the Questura (police headquarters).'
          },
          {
            id: 'questura-appointment',
            title: 'Attend Questura Appointment',
            description: 'Go to your scheduled appointment at the Questura for photo and fingerprinting.',
            completed: false,
            priority: 'critical',
            estimatedTime: '1 day',
            tips: 'Bring your passport, all original documents, and the post office receipt.'
          }
        ]
      },
      {
        id: 'codice-fiscale',
        title: 'Obtain Codice Fiscale',
        description: 'Get your Italian tax code, essential for contracts and official paperwork.',
        completed: false,
        priority: 'critical',
        estimatedTime: '1-2 weeks',
        tips: 'The Codice Fiscale is required for university enrollment, opening a bank account, and renting an apartment.',
        resources: [
          'Agenzia delle Entrate office locator',
          'Codice Fiscale application form',
          'University international student office'
        ]
      },
      {
        id: 'university-enrollment',
        title: 'Finalize University Enrollment',
        description: 'Complete your in-person registration at the university.',
        completed: false,
        priority: 'critical',
        estimatedTime: '1-2 weeks',
        tips: 'Visit the university\'s international student office or "segreteria studenti" as soon as you arrive.',
        resources: [
          'University international office contacts',
          'Enrollment deadlines',
          'Required documents for enrollment'
        ]
      },
      {
        id: 'ssn-registration',
        title: 'Register with National Health Service (SSN)',
        description: 'Register with the Servizio Sanitario Nazionale for healthcare access.',
        completed: false,
        priority: 'high',
        estimatedTime: '1-3 weeks',
        tips: 'This is an alternative to private insurance and is often more comprehensive and affordable.',
        resources: [
          'Local ASL (Azienda Sanitaria Locale) office locator',
          'SSN registration guide for students',
          'Required payment information (bollettino postale)'
        ]
      }
    ]
  }
]