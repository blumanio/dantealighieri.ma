'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

type Language = 'en' | 'ar' | 'it';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations: Translations = {
  en: { searchTitle: 'Search Programs', academicArea: 'Academic Area', searchWithinResults: 'Search within results...', loadingMessage: 'Loading...', noResults: 'No results found.' },
  ar: { searchTitle: 'ابحث عن البرامج', academicArea: 'المجال الأكاديمي', searchWithinResults: 'ابحث ضمن النتائج...', loadingMessage: 'جاري التحميل...', noResults: 'لم يتم العثور على نتائج.' },
  it: { searchTitle: 'Cerca programmi', academicArea: 'Area accademica', searchWithinResults: 'Cerca nei risultati...', loadingMessage: 'Caricamento...', noResults: 'Nessun risultato trovato.' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
interface LanguageProviderProps {
    children: ReactNode;
    initialLang?: Language;
  }
  export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, initialLang = 'en' }) => {
    const [language, setLanguage] = useState<Language>(initialLang);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const getBrowserLanguage = (): Language => {
    if (typeof window === 'undefined') return 'en';
    const browserLang = window.navigator.language.split('-')[0];
    return (browserLang as Language) in translations ? (browserLang as Language) : 'en';
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as Language;
    const preferredLanguage = storedLanguage || getBrowserLanguage();
    setLanguage(preferredLanguage);
    document.documentElement.dir = preferredLanguage === 'ar' ? 'rtl' : 'ltr';
  }, []);

  useEffect(() => {
    const urlLang = searchParams.get('lang') as Language;
    if (urlLang && translations[urlLang]) {
      setLanguage(urlLang);
      localStorage.setItem('language', urlLang);
      document.documentElement.dir = urlLang === 'ar' ? 'rtl' : 'ltr';
    }
  }, [searchParams]);

  const t = (key: string): string => translations[language][key] || key;

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('lang', newLanguage);
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
