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
      title: "Your Journey To Italy Begins Here",
      subtitle: "Navigate Italian university admissions with expert guidance",
      ctaButton: "Get Started"
    },
    programs: {
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
      status: "Status",
      requirements: "Requirements",
      deadline: "Application Deadline",
      fee: "Application Fee",
      location: "Location"
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
      loadingMessage: "Caricamento programmi..."
    },
    universities: {
      status: "Stato",
      requirements: "Requisiti",
      deadline: "Scadenza",
      fee: "Tassa",
      location: "Località"
    }
  },
  ar: {
    common: {
      search: "بحث",
      about: "حول",
      services: "الخدمات",
      universities: "الجامعات",
      deadline: "المواعيد النهائية",
      apply: "تقديم",
      soon: "قريباً",
      contactUs: "اتصل بنا"
    },
    hero: {
      title: "رحلتك إلى إيطاليا تبدأ هنا",
      subtitle: "تنقل في القبول بالجامعات الإيطالية مع توجيه الخبراء",
      ctaButton: "ابدأ الآن"
    },
    programs: {
      searchTitle: "البحث عن البرامج",
      degreeType: "نوع الدرجة",
      accessType: "نوع القبول",
      courseLanguage: "لغة الدراسة",
      academicArea: "المجال الأكاديمي",
      searchPlaceholder: "البحث في النتائج...",
      noResults: "لم يتم العثور على برامج",
      loadingMessage: "جاري تحميل البرامج..."
    },
    universities: {
      status: "الحالة",
      requirements: "المتطلبات",
      deadline: "الموعد النهائي",
      fee: "الرسوم",
      location: "الموقع"
    }
  }
};
