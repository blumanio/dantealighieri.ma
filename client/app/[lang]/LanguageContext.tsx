// LanguageContext.tsx
'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { translations } from '../../../client/app/i18n/translations';
import { Locale } from '../../../client/app/i18n/types';

interface LanguageContextType {
    language: Locale;
    setLanguage: (language: Locale) => void;
    t: (section: string, key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
    initialLang?: Locale;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
    children,
    initialLang = 'en'
}) => {
    const [language, setInternalLanguage] = useState<Locale>(initialLang);
    const pathname = usePathname();

    // Sync with URL path
    useEffect(() => {
        const urlLang = pathname.split('/')[1] as Locale;
        if (urlLang && ['en', 'ar', 'it'].includes(urlLang) && urlLang !== language) {
            console.log('Setting language from URL:', urlLang);
            setInternalLanguage(urlLang);
            document.documentElement.dir = urlLang === 'ar' ? 'rtl' : 'ltr';
        }
    }, [pathname]);

    const setLanguage = (newLanguage: Locale) => {
        console.log('Setting language:', newLanguage);
        setInternalLanguage(newLanguage);
        document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    };

    const t = (section: string, key: string): string => {
        if (!translations[language]) {
            console.warn(`Missing translations for language: ${language}`);
            return translations.en[section]?.[key] || key;
        }
        
        if (!translations[language][section]) {
            console.warn(`Missing section "${section}" for language: ${language}`);
            return translations.en[section]?.[key] || key;
        }
        
        const translation = translations[language][section]?.[key];
        if (!translation) {
            console.warn(`Missing translation for key "${key}" in section "${section}" for language: ${language}`);
            return translations.en[section]?.[key] || key;
        }
        
        return translation;
    };

    const value = {
        language,
        setLanguage,
        t
    };

    return (
        <LanguageContext.Provider value={value}>
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