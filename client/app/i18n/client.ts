// src/i18n/client.ts
'use client';

import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';
import { Translation } from './types';

const TranslationsContext = createContext<Translation | null>(null);

export const TranslationsProvider = TranslationsContext.Provider;

export function useTranslations(p0: string) {
  const translations = useContext(TranslationsContext);
  if (!translations) {
    throw new Error('useTranslations must be used within a TranslationsProvider');
  }
  return translations;
}
