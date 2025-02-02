// src/i18n/settings.ts
import { Locale } from './types';

export const defaultLocale: Locale = 'en';
export const locales: Locale[] = ['en', 'it', 'fr', 'ar'];

export const getLocaleDirection = (locale: Locale): 'ltr' | 'rtl' => {
  return locale === 'ar' ? 'rtl' : 'ltr';
};  