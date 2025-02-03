'use client';

import React, { Suspense } from 'react';
import { LanguageProvider } from './LanguageContext';
import { Language } from '@/types';

export default function ClientLanguageProvider({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang: Language;
}) {
  return (
    <Suspense fallback={<div>Loading language settings...</div>}>
      <LanguageProvider initialLang={initialLang}>{children}</LanguageProvider>
    </Suspense>
  );
}
