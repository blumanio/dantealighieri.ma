// app/[lang]/page.tsx
import Header from '@/components/header';
import HeroSection from '@/components/HeroSection';
import Services from '@/components/services';
import { LanguageProvider } from './LanguageContext';
import { Suspense } from 'react';
import { BlogNavigation } from '@/components/BlogNavigation';
import { BasePageProps } from '@/types/types';

const VALID_LANGUAGES = ['en', 'it', 'ar'] as const;
type ValidLanguage = typeof VALID_LANGUAGES[number];

function getValidLanguage(lang: string | undefined): ValidLanguage {
  return VALID_LANGUAGES.includes(lang as ValidLanguage)
    ? (lang as ValidLanguage)
    : 'en';
}

export default async function Page({ params }: BasePageProps) {
  // Properly await and destructure params
  const resolvedParams = await params;
  const validatedLang = getValidLanguage(resolvedParams.lang);

  return (
    <LanguageProvider initialLang={validatedLang}>
      <Suspense fallback={<div>Loading content...</div>}>
        <main>
          <HeroSection />
          <Services />
          <BlogNavigation 
            prevPost={null} 
            nextPost={null} 
            lang={validatedLang} 
          />
        </main>
      </Suspense>
    </LanguageProvider>
  );
}

// Static params generation remains unchanged
export async function generateStaticParams() {
  const locales = ['en', 'it', 'ar']; // Your supported locales
  return locales.map((lang) => ({
    lang: lang,
  }));
}

// Metadata generation with proper params handling
export async function generateMetadata({ params }: BasePageProps) {
  const resolvedParams = await params;
  const validatedLang = getValidLanguage(resolvedParams.lang);
  
  const titles: Record<ValidLanguage, string> = {
    en: 'Studentitaly.it - Study in Italy',
    it: 'Studentitaly.it - Study in Italy',
    ar: 'Studentitaly.it - Study in Italy'
  };

  return {
    title: titles[validatedLang],
    // Add other metadata as needed
  };
}