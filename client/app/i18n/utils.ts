// lib/i18n/utils.ts
import { translations } from './translations';
import { Locale } from './types';

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
    return locale === 'ar' ? 'rtl' : 'ltr';
}

export function getLocalizedPath(path: string, locale: Locale): string {
    const segments = path.split('/').filter(Boolean);
    const isLocalized = segments[0] && Object.keys(translations).includes(segments[0]);

    if (isLocalized) {
        segments[0] = locale;
    } else {
        segments.unshift(locale);
    }

    return `/${segments.join('/')}`;
}