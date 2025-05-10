'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from 'react';

import { translations } from '@/app/i18n/translations';
import type { Translation, Locale as Lang } from '@/app/i18n/types';

export const supportedLanguages: Lang[] = ['en', 'it', 'ar'];
export const defaultLang: Lang = 'en';

interface LanguageContextType {
    language: Lang;
    setLanguage: (language: Lang) => void;
    t: (
        namespace: keyof Translation,
        key: string,
        interpolations?: Record<string, string | number>
    ) => string;
    // Add the new tArray function signature
    tArray: (
        namespace: keyof Translation,
        key: string
    ) => string[]; // It will return an array of strings
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({
    children,
    initialLang,
}: {
    children: ReactNode;
    initialLang: Lang;
}) => {
    const [language, setLanguage] = useState<Lang>(initialLang);

    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    const setLanguageSafe = useCallback((lang: Lang) => {
        if (supportedLanguages.includes(lang)) {
            setLanguage(lang);
        } else {
            console.warn(`Unsupported language: ${lang}`);
        }
    }, []);

    const t = useCallback(
        (
            namespace: keyof Translation,
            key: string,
            interpolations?: Record<string, string | number>
        ): string => {
            const langData = translations[language];
            if (!langData) return `${namespace}.${key} (lang_missing)`;

            const nsData = langData[namespace];
            if (!nsData) return `${namespace}.${key} (ns_missing)`;

            let text = ((nsData as unknown) as Record<string, unknown>)[key]; // Explicitly cast to unknown first, then to Record<string, unknown>
            if (typeof text !== 'string') {
                // For arrays or other types, t will return this placeholder
                return `${namespace}.${key} (key_missing_or_not_string)`;
            }

            if (interpolations) {
                Object.entries(interpolations).forEach(([k, v]) => {
                    text = (text as string).replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
                });
            }
            return text;
        },
        [language]
    );

    // Implement the new tArray function
    const tArray = useCallback(
        (namespace: keyof Translation, key: string): string[] => {
            const langData = translations[language];
            if (!langData) {
                console.warn(`[tArray] Language data missing for language: ${language} (namespace: ${namespace}, key: ${key})`);
                return []; // Return empty array as a fallback
            }

            const nsData = langData[namespace];
            if (!nsData) {
                console.warn(`[tArray] Namespace data missing for namespace: ${namespace} (key: ${key}, lang: ${language})`);
                return [];
            }

            const items = ((nsData as unknown) as Record<string, unknown>)[key];

            if (Array.isArray(items) && items.every(item => typeof item === 'string')) {
                return items as string[]; // We've checked it's an array of strings
            } else {
                console.warn(`[tArray] Translation for ${namespace}.${key} (lang: ${language}) is not an array of strings or is missing. Found:`, items);
                return []; // Fallback to empty array
            }
        },
        [language]
    );

    return (
        <LanguageContext.Provider value={{ language, setLanguage: setLanguageSafe, t, tArray }}> {/* Add tArray to provider value */}
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