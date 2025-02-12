// app/[lang]/page.tsx
import { BasePageProps } from '@/types/types';
import { LanguageProvider } from './LanguageContext';
import { Suspense } from 'react';
import { BlogNavigation } from '@/components/BlogNavigation';
import HeroSection from '@/components/HeroSection';
import Services from '@/components/services';

const VALID_LANGUAGES = ['en', 'it', 'ar'] as const;
type ValidLanguage = typeof VALID_LANGUAGES[number];

function getValidLanguage(lang: string | undefined): ValidLanguage {
  return VALID_LANGUAGES.includes(lang as ValidLanguage)
    ? (lang as ValidLanguage)
    : 'en';
}

export default async function Page({ params, searchParams }: BasePageProps) {
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

export function generateStaticParams() {
  return VALID_LANGUAGES.map(lang => ({ lang }));
}

export async function generateMetadata({ params }: BasePageProps) {
  const resolvedParams = await params;
  const validatedLang = getValidLanguage(resolvedParams.lang);
  
  const titles: Record<ValidLanguage, string> = {
    en: 'Welcome',
    it: 'Benvenuto',
    ar: 'مرحباً'
  };

  return {
    title: titles[validatedLang]
  };
}