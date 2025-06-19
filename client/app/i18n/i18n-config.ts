// Suggested Filename: app/i18n/i18n-config.ts
// This seems to correspond to your uploaded file: client/app/config/i18n.ts

// Defines the supported locales for your application.
export const locales = ['en', 'fr', 'ar'] as const;

// Defines the default locale if no locale is matched.
export const defaultLocale = 'en';

// Type representing one of the supported locales.
export type Locale = (typeof locales)[number];

// Configuration object for i18n settings.
export const i18n = {
  defaultLocale,
  locales,
} as const;

/**
 * Checks if a given string is a supported locale.
 * @param locale The string to check.
 * @returns True if the string is a supported locale, false otherwise.
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Returns a valid locale, defaulting to the defaultLocale if the provided one is invalid.
 * @param locale The locale string to validate.
 * @returns A valid Locale.
 */
export function getValidLanguage(locale: string | undefined | null): Locale {
  if (locale && isValidLocale(locale)) {
    return locale;
  }
  return defaultLocale;
}
