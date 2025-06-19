export const scholarships = [
  {
    id: 1,
    title: 'DiSCo Lazio Scholarship (Regional)',
    provider: 'Lazio Regional Government',
    amount: 'Up to €7,442.92 + services',
    tags: ['Bachelors', 'Masters', 'PhD', 'Need-Based'],
    universities: [
      "Sapienza University of Rome", "University of Rome Tor Vergata", "Roma Tre University",
      "Foro Italico University of Rome", "LUISS University", "LUMSA University",
      "University of Cassino and Southern Lazio", "University of Tuscia",
      "And all other state-recognized institutions in the Lazio region."
    ],
    keyInfo: {
      applicationDeadline: 'July 22, 2025 (12:00 PM)',
      iseeLimit: '€27,948.60',
      ispeuLimit: '€60,757.87',
      target: 'All students in Lazio region',
    },
    overview: {
      description: 'This is a need-based scholarship provided by the Lazio region to support university students. It is the most common and comprehensive scholarship, covering tuition fees, living costs, meals, and accommodation. The final benefit is determined by your family income (ISEE) and your student status (local, commuter, or non-resident).',
      valueHighlight: 'A comprehensive package covering nearly all student expenses, making university education highly accessible.'
    },
    financials: {
      breakdown: [
        { status: 'Non-Resident (Fuori Sede)', isee: '<= €13,974.30', amount: '€7,442.92', services: 'Free accommodation & 2 daily meals', notes: 'Highest amount for students living away from home.' },
        { status: 'Non-Resident (Fuori Sede)', isee: '> €13,974.30', amount: '€6,472.10 (reduces with higher ISEE)', services: 'Free accommodation & 2 daily meals', notes: 'Amount scales down towards the ISEE limit.' },
        { status: 'Commuter (Pendolare)', isee: '<= €13,974.30', amount: '€4,062.78', services: '2 daily meals', notes: 'For students living within a certain distance.' },
        { status: 'Commuter (Pendolare)', isee: '> €13,974.30', amount: '€3,532.85 (reduces with higher ISEE)', services: '2 daily meals', notes: '' },
        { status: 'Local (In Sede)', isee: '<= €13,974.30', amount: '€2,587.80', services: '2 daily meals', notes: 'For students living in the same city as the university.' },
        { status: 'Local (In Sede)', isee: '> €13,974.30', amount: '€2,250.26 (reduces with higher ISEE)', services: '2 daily meals', notes: '' },
      ],
      additionalBenefits: [
        "Full exemption from regional and university tuition fees.",
        "Contribution for international mobility programs (€510/month).",
        "Graduation award (50% of last scholarship amount) if you graduate on time.",
        "+20% for students enrolled in two degree courses.",
        "+20% for female students in STEM courses."
      ]
    },
    eligibility: {
      merit: [
        { year: 'First Year Students (Matricole)', requirement: 'No merit needed to apply. Must earn 20 ECTS credits by August 10, 2026, to confirm the scholarship.' },
        { year: 'Second Year Students', requirement: '25 ECTS credits earned by August 10, 2025.' },
        { year: 'Third Year Students', requirement: '80 ECTS credits earned by August 10, 2025.' },
      ],
      bonus: "If you don't meet the credit requirement, you can use a 'bonus' once in your academic career. The amount of bonus credits available (5, 12, or 15) depends on when you first use it.",
      economic: "Your family's economic situation must be below the ISEE and ISPE limits. International students must get an 'ISEE Parificato' (ISEEUP) from a designated CAF center.",
      other: "You cannot receive this scholarship if you are already receiving another major scholarship (e.g., MAEICI). Open to all degree levels (Bachelor, Master, PhD)."
    },
    application: {
      timeline: [
        { date: 'June 10 - July 22, 2025', event: 'Phase 1: Initial Application Submission', description: 'Complete and submit the online application form on the DiSCo Lazio portal.' },
        { date: 'By July 22, 2025', event: 'DSU Submission (Italian Residents)', description: 'Italian residents must have submitted their DSU to get their ISEE certificate.' },
        { date: 'July 29, 2025', event: 'Provisional Rankings Published', description: 'Check your status. If "excluded", you can make corrections in Phase 2.' },
        { date: 'July 30 - Aug 11, 2025', event: 'Phase 2: Corrections & Integrations', description: 'Re-open your application to fix any errors or upload missing documents.' },
        { date: 'Oct 10, 2025', event: 'Final Rankings Published', description: 'The final list of scholarship winners is published.' },
        { date: 'By Dec 10, 2025', event: 'ISEEUP Deadline (International Students)', description: 'Non-resident students must get their ISEE Parificato from a partner CAF by this date.' },
      ],
      documents: {
        all: ["Valid ID Card or Passport."],
        international: [
          "University admission letter.",
          "Documents for ISEE Parificato: Family composition, income statement (2023), property and bank statements (Dec 31, 2023), all translated and legalized.",
          "Valid Visa and Permit of Stay (Permesso di Soggiorno). You must upload the receipt of your permit application initially, and the final card when received."
        ]
      },
      applicationLink: 'http://www.laziodisco.it/',
      officialBandoLink: 'https://www.laziodisco.it/bando2025-2026/', // Example link
    },
    gamification: {
      title: "Don't Miss Out on Your Italian Dream!",
      points: [
        "Thousands of students apply every year. The competition is fierce, and one small mistake on the application can lead to exclusion.",
        "The deadline is approaching fast! Gathering and legalizing documents for the ISEE Parificato can take weeks. Are you running out of time?",
        "Navigating the Italian bureaucracy is a challenge. We've successfully guided hundreds of students to victory. Let us be your expert guide."
      ],
      cta: "Let Me Handle the Stress",
      contactLink: "/contact" // Your contact page link
    },
    premiumServices: {
      title: "Become a Scholarship Winner. We'll Handle The Rest.",
      description: "Navigating the Italian scholarship system is a marathon of deadlines, documents, and bureaucracy. Our premium support ensures your application isn't just submitted, but that it's flawless. Choose the level of support that guarantees your peace of mind.",
      tiers: [
        {
          name: "Silver",
          price: "€149",
          features: [
            "Interactive ISEE/ISEEUP Simulator",
            "Country-Specific Document & Legalization Guides",
            "Full Video Walkthrough Library of the Application Portal",
            "Priority Email Support"
          ],
          cta: "Get the Tools"
        },
        {
          name: "Gold",
          price: "€299",
          features: [
            "Everything in Silver, plus:",
            "Personalized Application Dashboard & Timeline",
            "One-on-one 30-minute Strategy Call",
            "**Pre-submission Review of your Online Application Form**"
          ],
          cta: "Get Guided Support",
          popular: true
        },
        {
          name: "Platinum",
          price: "€499",
          features: [
            "Everything in Gold, plus:",
            "**Full Document Review (ISEE docs, Visa, etc.)**",
            "Direct Chat Support for Urgent Questions",
            "Guaranteed 24-hour response time"
          ],
          cta: "Ensure My Success"
        }
      ],
      successStories: [
        // {
        //   name: "A Student from India",
        //   story: "Was about to submit an ISEEUP with incorrect family composition data. Our Gold Tier review caught the error, which would have led to automatic disqualification. They secured the full scholarship."
        // },
        // {
        //   name: "A Student from Nigeria",
        //   story: "Struggled with the difference between an Apostille and consular legalization for their documents. Our Silver Tier country-specific guide provided the exact addresses and steps needed, saving them weeks of stress."
        // },
        // {
        //   name: "A First-Year Master's Student",
        //   story: "Felt completely overwhelmed by the portal. Our Platinum service offered peace of mind with a full document review and direct support, allowing them to focus on their exams instead of the application."
        // }
      ],
      contactLink: "/contact"
    }
  },
  {
    id: 2,
    title: 'ALiSEO Scholarship (Liguria)',
    provider: 'Liguria Regional Government',
    amount: 'Up to €7,073 + services',
    tags: ['Bachelors', 'Masters', 'PhD', 'AFAM', 'Need-Based'],
    universities: [
      "University of Genoa",
      "Accademia Ligustica di Belle Arti",
      "Accademia di Belle Arti 'Isadora Duncan'",
      "Conservatorio di Musica 'Niccolò Paganini'",
      "Conservatorio di Musica 'Giacomo Puccini'"
    ],
    keyInfo: {
      applicationDeadline: 'July 31, 2025 (12:00 PM)',
      iseeLimit: '€27,948.00',
      ispeuLimit: '€60,757.00',
      target: 'All students in Liguria region',
    },
    overview: {
      description: "ALiSEO provides this need-based scholarship to support students enrolled in universities and AFAM (Higher Education in Art, Music, and Dance) institutions in the Liguria region. Benefits include a monetary stipend, free meals, and accommodation support.",
      valueHighlight: 'Full support for students in Genoa and Liguria, including those in prestigious arts and music conservatories.'
    },
    financials: {
      breakdown: [
        { status: 'Non-Resident (Fuori Sede)', isee: '<= €18,632.00', amount: '€7,073.00 (Gross)', services: '1 free meal/day + accommodation support' },
        { status: 'Non-Resident (Fuori Sede)', isee: '> €18,632.01', amount: '€5,233.00 (Gross)', services: '1 free meal/day + accommodation support' },
        { status: 'Commuter (Pendolare)', isee: '<= €18,632.00', amount: '€4,133.00 (Gross)', services: '1 free meal/day' },
        { status: 'Commuter (Pendolare)', isee: '> €18,632.01', amount: '€2,686.00 (Gross)', services: '1 free meal/day' },
        { status: 'Local (In Sede)', isee: '<= €18,632.00', amount: '€2,851.00 (Gross)', services: '1 free meal/day' },
        { status: 'Local (In Sede)', isee: '> €18,632.01', amount: '€1,425.00 (Gross)', services: '1 free meal/day' },
      ],
      additionalBenefits: [
        "Full exemption from university contributions and the regional tax.",
        "Integration for international mobility programs (€600/month).",
        "Graduation award for finishing on time.",
        "+20% for female students in STEM courses.",
        "+20% for students enrolled in two degree courses simultaneously."
      ]
    },
    eligibility: {
      merit: [
        { year: 'First Year Students (Matricole)', requirement: 'No merit needed to apply. Must earn 20 ECTS credits by August 10, 2026 to receive the full scholarship.' },
        { year: 'Second Year Students (Laurea)', requirement: '25 ECTS credits earned by August 10, 2025.' },
        { year: 'Second Year Students (Laurea Magistrale)', requirement: '30 ECTS credits earned by August 10, 2025.' },
      ],
      bonus: "A bonus of 5, 12, or 15 credits can be used if you don't meet the merit requirement, depending on the year it's first used.",
      economic: "Your family's economic situation must be below the ISEE and ISPE limits. International students need an ISEE Parificato from a CAF.",
      other: "Incompatible with other major scholarships. Open to all degree levels, including AFAM."
    },
    application: {
      timeline: [
        { date: 'June 11 - July 31, 2025', event: 'Online Application Submission', description: 'Complete and submit the application on the ALiSEO portal.' },
        { date: 'By July 31, 2025', event: 'DSU Submission Deadline (for ISEEU)', description: 'Italian residents must have submitted their DSU to INPS.' },
        { date: 'Sept 10, 2025', event: 'Provisional Housing Rankings Published', description: 'Initial results for student accommodation.' },
        { date: 'Sept 29, 2025', event: 'Provisional Scholarship Rankings Published', description: 'Initial results for the scholarship.' },
        { date: 'Oct 30, 2025', event: 'Final Scholarship Rankings Published', description: 'The final list of scholarship winners.' },
        { date: 'By Oct 24, 2025', event: 'ISEEUP Correction Deadline', description: 'Deadline to fix any issues with your ISEE Parificato.' },
      ],
      documents: {
        all: ["Valid ID Card or Passport.", "Matriculation number from your university."],
        international: [
          "Passport and Visa.",
          "Documents for ISEE Parificato (Family status, income, property) translated and legalized.",
          "Valid Permit of Stay (Permesso di Soggiorno)."
        ]
      },
      applicationLink: 'https://www.aliseo.liguria.it/',
      officialBandoLink: 'https://www.aliseo.liguria.it/benefici-economici-e-servizi/borsa-di-studio-e-alloggio/',
    },
    gamification: {
      title: "Don't Miss Out on Your Italian Dream!",
      points: [
        "Thousands of students apply every year. The competition is fierce, and one small mistake on the application can lead to exclusion.",
        "The deadline is approaching fast! Gathering and legalizing documents for the ISEE Parificato can take weeks. Are you running out of time?",
        "Navigating the Italian bureaucracy is a challenge. We've successfully guided hundreds of students to victory. Let us be your expert guide."
      ],
      cta: "Let Me Handle the Stress",
      contactLink: "/contact" // Your contact page link
    },
    premiumServices: {
      title: "Become a Scholarship Winner. We'll Handle The Rest.",
      description: "Navigating the Italian scholarship system is a marathon of deadlines, documents, and bureaucracy. Our premium support ensures your application isn't just submitted, but that it's flawless. Choose the level of support that guarantees your peace of mind.",
      tiers: [
        {
          name: "Silver",
          price: "€149",
          features: [
            "Interactive ISEE/ISEEUP Simulator",
            "Country-Specific Document & Legalization Guides",
            "Full Video Walkthrough Library of the Application Portal",
            "Priority Email Support"
          ],
          cta: "Get the Tools"
        },
        {
          name: "Gold",
          price: "€299",
          features: [
            "Everything in Silver, plus:",
            "Personalized Application Dashboard & Timeline",
            "One-on-one 30-minute Strategy Call",
            "**Pre-submission Review of your Online Application Form**"
          ],
          cta: "Get Guided Support",
          popular: true
        },
        {
          name: "Platinum",
          price: "€499",
          features: [
            "Everything in Gold, plus:",
            "**Full Document Review (ISEE docs, Visa, etc.)**",
            "Direct Chat Support for Urgent Questions",
            "Guaranteed 24-hour response time"
          ],
          cta: "Ensure My Success"
        }
      ],
      successStories: [
        {
          name: "A Student from India",
          story: "Was about to submit an ISEEUP with incorrect family composition data. Our Gold Tier review caught the error, which would have led to automatic disqualification. They secured the full scholarship."
        },
        {
          name: "A Student from Nigeria",
          story: "Struggled with the difference between an Apostille and consular legalization for their documents. Our Silver Tier country-specific guide provided the exact addresses and steps needed, saving them weeks of stress."
        },
        {
          name: "A First-Year Master's Student",
          story: "Felt completely overwhelmed by the portal. Our Platinum service offered peace of mind with a full document review and direct support, allowing them to focus on their exams instead of the application."
        }
      ],
      contactLink: "/contact"
    }
  },
  {
    "id": 3,
    "title": "MAEICI Italian Government Scholarship",
    "provider": "Ministry of Foreign Affairs and International Cooperation (MAEICI)",
    "amount": "€900 per month + Tuition Fee Exemption",
    "tags": ["Masters", "PhD", "Research", "Arts", "Music", "Dance", "Language", "Merit-Based"],
    "universities": [
      "All public Italian Universities and legally recognized Higher Education Institutes (including AFAM institutions)."
    ],
    "keyInfo": {
      "applicationDeadline": "May 16, 2025 (2:00 PM CET)",
      "iseeLimit": "Not applicable",
      "ispeuLimit": "Not applicable",
      "target": "International students and Italian citizens living abroad (IRE)"
    },
    "overview": {
      "description": "This scholarship is offered by the Italian Government to foster international cooperation in cultural, scientific, and technological fields. It supports foreign and Italian students residing abroad to pursue study, training, or research programs at Italian public or legally recognized Higher Education Institutes.",
      "valueHighlight": "A merit-based grant offering a monthly stipend and tuition fee exemption at public universities, promoting Italy's higher education system globally."
    },
    "financials": {
      "breakdown": [
        {
          "status": "Grant Holder (9-month courses)",
          "isee": "N/A",
          "amount": "€9,000 (€900 per month)",
          "services": "Disbursed in three installments."
        },
        {
          "status": "Grant Holder (3-month language courses)",
          "isee": "N/A",
          "amount": "€2,700 (€900 per month)",
          "services": "Disbursed in a single installment."
        }
      ],
      "additionalBenefits": [
        "Exemption from enrollment and tuition fees (for public institutions).",
        "Health and medical/accident insurance for the duration of the grant."
      ]
    },
    "eligibility": {
      "nationality": "Open to foreign citizens and Italian citizens residing abroad (check the official call for the list of eligible countries).",
      "ageLimit": {
        "masters_afam_language": "Not exceeding 28 years of age by the deadline.",
        "phd": "Not exceeding 30 years of age by the deadline.",
        "research": "Not exceeding 40 years of age by the deadline."
      },
      "academicQualification": "Must hold the required academic qualification to enroll in the chosen Italian institution.",
      "languageProficiency": {
        "englishTaught": "Minimum B2 level certificate in English.",
        "italianTaught": "Minimum B2 level certificate in Italian.",
        "languageCourses": "Minimum A2 level certificate in Italian."
      },
      "ineligibility": "The grant is incompatible with any other grant offered by the Italian Government or other Italian public institutions, including regional 'Right to Study' (DSU) scholarships."
    },
    "application": {
      "portal": "Applications must be submitted online through the official 'Study in Italy' portal.",
      "process": "The application for the scholarship is separate from the university admission process. Candidates must apply for the scholarship first and, if successful, then proceed with the enrollment at their chosen institution.",
      "requiredDocuments": [
        "Copy of a valid passport.",
        "Curriculum Vitae (CV).",
        "Transcripts and diplomas of previous education.",
        "Language proficiency certificate (English or Italian).",
        "Admission letter (only if required by the specific course, e.g., for some PhD programs)."
      ]
    },
    gamification: {
      title: "Don't Miss Out on Your Italian Dream!",
      points: [
        "Thousands of students apply every year. The competition is fierce, and one small mistake on the application can lead to exclusion.",
        "The deadline is approaching fast! Gathering and legalizing documents for the ISEE Parificato can take weeks. Are you running out of time?",
        "Navigating the Italian bureaucracy is a challenge. We've successfully guided hundreds of students to victory. Let us be your expert guide."
      ],
      cta: "Let Me Handle the Stress",
      contactLink: "/contact" // Your contact page link
    },
    premiumServices: {
      title: "Become a Scholarship Winner. We'll Handle The Rest.",
      description: "Navigating the Italian scholarship system is a marathon of deadlines, documents, and bureaucracy. Our premium support ensures your application isn't just submitted, but that it's flawless. Choose the level of support that guarantees your peace of mind.",
      tiers: [
        {
          name: "Silver",
          price: "€149",
          features: [
            "Interactive ISEE/ISEEUP Simulator",
            "Country-Specific Document & Legalization Guides",
            "Full Video Walkthrough Library of the Application Portal",
            "Priority Email Support"
          ],
          cta: "Get the Tools"
        },
        {
          name: "Gold",
          price: "€299",
          features: [
            "Everything in Silver, plus:",
            "Personalized Application Dashboard & Timeline",
            "One-on-one 30-minute Strategy Call",
            "**Pre-submission Review of your Online Application Form**"
          ],
          cta: "Get Guided Support",
          popular: true
        },
        {
          name: "Platinum",
          price: "€499",
          features: [
            "Everything in Gold, plus:",
            "**Full Document Review (ISEE docs, Visa, etc.)**",
            "Direct Chat Support for Urgent Questions",
            "Guaranteed 24-hour response time"
          ],
          cta: "Ensure My Success"
        }
      ],
      successStories: [
        {
          name: "A Student from India",
          story: "Was about to submit an ISEEUP with incorrect family composition data. Our Gold Tier review caught the error, which would have led to automatic disqualification. They secured the full scholarship."
        },
        {
          name: "A Student from Nigeria",
          story: "Struggled with the difference between an Apostille and consular legalization for their documents. Our Silver Tier country-specific guide provided the exact addresses and steps needed, saving them weeks of stress."
        },
        {
          name: "A First-Year Master's Student",
          story: "Felt completely overwhelmed by the portal. Our Platinum service offered peace of mind with a full document review and direct support, allowing them to focus on their exams instead of the application."
        }
      ],
      contactLink: "/contact"
    }
  }
  ,
  {
    id: 6,
    title: 'DSU Toscana Scholarship (Tuscany)',
    provider: 'Tuscany Regional Government',
    status: 'not-open',
    amount: 'Up to €7,500 + services',
    tags: ['Bachelors', 'Masters', 'PhD', 'Need-Based'],
    universities: ["University of Florence", "University of Pisa", "University of Siena"],
    keyInfo: {
      applicationDeadline: 'Estimated: Early September 2025',
      iseeLimit: '~€26,000',
      ispeuLimit: '~€57,000',
      target: 'All students in Tuscany',
    },
    overview: {
        description: "The DSU (Diritto allo Studio Universitario) scholarship for the Tuscany region. The call for applications is not yet open. Check back for updates.",
        valueHighlight: "Renowned scholarship program for top universities like Florence, Pisa, and Siena."
    }
    // Detailed sections can be added once the official bando is released.
  },
  {
    id: 4,
    title: 'EDISU Piemonte Scholarship (Piedmont)',
    provider: 'Piedmont Regional Government',
    status: 'not-open',
    amount: 'Up to €7,200 + services',
    tags: ['Bachelors', 'Masters', 'PhD', 'Need-Based'],
    universities: ["University of Turin", "Polytechnic University of Turin"],
    keyInfo: {
      applicationDeadline: 'Estimated: Late August 2025',
      iseeLimit: '~€26,500',
      ispeuLimit: '~€58,000',
      target: 'All students in Piedmont',
    },
    overview: {
        description: "The regional scholarship for students in the Piedmont region, home to major universities in Turin. The call for applications is not yet open. Check back for updates.",
        valueHighlight: "Key financial support for students at top-ranked technical and general universities."
    }
  },
   {
    id: 5,
    title: 'ER.GO Scholarship (Emilia-Romagna)',
    provider: 'Emilia-Romagna Regional Government',
    status: 'not-open',
    amount: 'Up to €6,800 + services',
    tags: ['Bachelors', 'Masters', 'PhD', 'Need-Based'],
    universities: ["University of Bologna", "University of Modena and Reggio Emilia", "University of Parma", "University of Ferrara"],
    keyInfo: {
      applicationDeadline: 'Estimated: Early September 2025',
      iseeLimit: '~€26,300',
      ispeuLimit: '~€57,100',
      target: 'All students in Emilia-Romagna',
    },
     overview: {
        description: "The regional scholarship for students in Emilia-Romagna, covering prestigious universities like Bologna. The call for applications is not yet open. Check back for updates.",
        valueHighlight: 'Comprehensive support for one of the oldest and most famous university regions in the world.'
    }
  }
  // You can add other scholarships here
];
