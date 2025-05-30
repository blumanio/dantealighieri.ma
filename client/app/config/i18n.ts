// app/config/i18n.ts
export const LANGUAGES = ['en', 'it','fr', 'ar'] as const;
export type SupportedLanguage = typeof LANGUAGES[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export function isValidLanguage(lang: string | undefined): lang is SupportedLanguage {
  return LANGUAGES.includes(lang as SupportedLanguage);
}

export function getValidLanguage(lang: string | undefined): SupportedLanguage {
  return isValidLanguage(lang) ? lang : DEFAULT_LANGUAGE;
}

export function generateLanguageStaticParams() {
  return LANGUAGES.map(lang => ({ lang }));
}
