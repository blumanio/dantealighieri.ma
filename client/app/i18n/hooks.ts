// lib/i18n/hooks.ts
import { useParams } from 'next/navigation';
import { translations } from './translations';
import { Locale, Translation } from './types';

export function useTranslations() {
  const params = useParams();
  const locale = (params?.lang as Locale) || 'en';
  return translations[locale] || translations.en;
}