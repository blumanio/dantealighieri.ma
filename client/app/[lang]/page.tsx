import Header from '@/components/header';
import HeroSection from '@/components/HeroSection';
import Services from '@/components/services';
import { LanguageProvider } from './LanguageContext';
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;

  return (
    <LanguageProvider initialLang={resolvedParams.lang as 'en' | 'it' | 'ar'}>
      <Suspense fallback={<div>Loading content...</div>}>
        <main>
          <HeroSection />
          <Services />
        </main>
      </Suspense>
    </LanguageProvider>
  );
}