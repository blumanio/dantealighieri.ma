// Suggested Filename: app/i18n/dictionaries.ts
// This seems to correspond to your uploaded file: client/app/i18n/translations.ts

import 'server-only';
import type { Locale } from './i18n-config'; // Or from '@/app/config/i18n'

// Define a type for the dictionary structure.
// You would expand this with the actual keys used in your JSON files.
type Dictionary = {
    [key: string]: string | Dictionary;
};

// Object to hold loaded dictionaries, mapping locale to its dictionary content.
// Using Record<string, () => Promise<Dictionary>> to allow dynamic imports.
const dictionaries: Record<string, () => Promise<Dictionary>> = {
    en: () => import('./locales/en.json').then((module) => module.default),
    // it: () => import('./locales/it.json').then((module) => module.default),
    // fr: () => import('./locales/fr.json').then((module) => module.default),
    //    es: () => import('./locales/es.json').then((module) => module.default),
    // ar: () => import('./locales/ar.json').then((module) => module.default),
    // Add other languages here
};

/**
 * Asynchronously loads and returns the dictionary for a given locale.
 * If the dictionary for the specified locale is not found,
 * it defaults to the English dictionary.
 * @param locale The desired locale.
 * @returns A promise that resolves to the dictionary object.
 */
export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
    const loadDictionary = dictionaries[locale] || dictionaries.en;
    if (!loadDictionary) {
        console.warn(`Dictionary for locale "${locale}" not found, and default 'en' also not found.`);
        return {} as Dictionary; // Return empty object if no dictionary can be loaded
    }
    try {
        return await loadDictionary();
    } catch (error) {
        console.error(`Error loading dictionary for locale "${locale}":`, error);
        // Attempt to load default English dictionary as a fallback on error
        if (locale !== 'en' && dictionaries.en) {
            console.warn(`Falling back to 'en' dictionary for locale "${locale}".`);
            try {
                return await dictionaries.en();
            } catch (fallbackError) {
                console.error(`Error loading fallback 'en' dictionary:`, fallbackError);
            }
        }
        return {} as Dictionary; // Return empty object if all attempts fail
    }
};

// Example locale JSON file structure (e.g., app/i18n/locales/en.json)
/*
{
  "welcome": "Welcome",
  "aiAdvisorPage": {
    "title": "AI Course Advisor",
    "metaTitle": "AI Course Advisor - Find Your Course in Italy",
    "metaDescription": "Use our AI powered tool to find the best courses for you to study in Italy."
  },
  "navigation": {
    "home": "Home",
    "about": "About Us"
  }
}
*/
