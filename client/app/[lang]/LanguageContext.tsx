'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

type Language = 'en' | 'ar' | 'it';

interface Translations {
  [key: string]: { [key: string]: string };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations: Translations = {
  en: {
    searchTitle: 'Search Programs',
    academicArea: 'Academic Area',
  },
  ar: {
    searchTitle: 'ابحث عن البرامج',
    academicArea: 'المجال الأكاديمي',
  },
  it: {
    searchTitle: 'Cerca programmi',
    academicArea: 'Area accademica',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  initialLang?: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, initialLang = 'en' }) => {
  const [language, setLanguage] = useState<Language>(initialLang);
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlLang = searchParams.get('lang') as Language;
    if (urlLang && translations[urlLang]) {
      setLanguage(urlLang);
    }
  }, [searchParams]);

  const t = (key: string): string => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
