// client/app/[lang]/layout.tsx
//'use client'; // MUST BE THE VERY FIRST LINE
import React, { Suspense } from 'react'; // Removed 'use' as it was not used in your last version
import { LanguageProvider, defaultLang, supportedLanguages } from '@/context/LanguageContext';
import ClientLayout from '@/components/ClientLayout';
import { getValidLanguage } from '../config/i18n';

function LangLayoutLoadingFallback() {
  console.log('[LangLayout_LOG] LangLayoutLoadingFallback rendered (Suspense)');
  return <div>LANG LAYOUT SUSPENSE FALLBACK...</div>;
}

// Define props specifically for this component
interface LangSpecificLayoutProps {
  children: React.ReactNode;
  params: { lang: string }; // CORRECT: params is an object for Client Components
}

export default  async function LangSpecificLayout({ children, params }: LangSpecificLayoutProps) {
  //console.log('[LangLayout_LOG] START. Received params:', JSON.stringify(params));

  if (!params || typeof (await params).lang !== 'string') {
    console.error('[LangLayout_LOG] ERROR: params.lang is invalid or missing!', params);
    const langToUse = defaultLang;
    console.warn(`[LangLayout_LOG] Using default language "${langToUse}" due to invalid params.lang`);
    return (
      <LanguageProvider initialLang={langToUse}>
        <ClientLayout lang={langToUse}>
          <div>Error: Invalid language parameter. Displaying default content.</div>
        </ClientLayout>
      </LanguageProvider>
    );
  }

  const currentLangInput = getValidLanguage((await params)?.lang);
  const currentLang = getValidLanguage(currentLangInput);

  return (
    <LanguageProvider initialLang={currentLang}>
      <Suspense fallback={<LangLayoutLoadingFallback />}>
        <ClientLayout lang={currentLang}>
          {children}
        </ClientLayout>
      </Suspense>
    </LanguageProvider>
  );
}





