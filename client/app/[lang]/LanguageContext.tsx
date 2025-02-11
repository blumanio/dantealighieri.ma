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
        // Add all your English translations here
    },
    ar: {
        searchTitle: 'ابحث عن البرامج',
        academicArea: 'المجال الأكاديمي',
        // Add all your Arabic translations here
    },
    it: {
        searchTitle: 'Cerca programmi',
        academicArea: 'Area accademica',
        // Add all your Italian translations here
    },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
    initialLang?: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
    children,
    initialLang = 'en'
}) => {
    const [language, setLanguage] = useState<Language>(initialLang);
    const searchParams = useSearchParams();

    useEffect(() => {
        const urlLang = searchParams.get('lang') as Language;
        if (urlLang && translations[urlLang]) {
            setLanguage(urlLang);
            document.documentElement.dir = urlLang === 'ar' ? 'rtl' : 'ltr';
        }
    }, [searchParams]);

    // Add missing translations
    const translations: Translations = {
        en: {
            searchTitle: 'Search Programs',
            academicArea: 'Academic Area',
            searchWithinResults: 'Search within results...',
            loadingMessage: 'Loading...',
            noResults: 'No results found',
            selectLanguage:'Select Language',
            selectDegreeType:'Select Degree',
            programSearch:'Program Search',
            explorePrograms:'All-in-One study in Italy platform, programs, scholarships, and more',
            findYourPerfectProgram:'Find your perfect program',
        },
        ar: {
            searchTitle: 'ابحث عن البرامج',
            academicArea: 'المجال الأكاديمي',
            searchWithinResults: 'البحث في النتائج...',
            loadingMessage: 'جار التحميل...',
            noResults: 'لم يتم العثور على نتائج'
        },
        it: {
            searchTitle: 'Cerca programmi',
            academicArea: 'Area accademica',
            searchWithinResults: 'Cerca nei risultati...',
            loadingMessage: 'Caricamento...',
            noResults: 'Nessun risultato trovato'
        }
    };

    const t = (key: string): string => {
        return translations[language]?.[key] || key;
    };

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