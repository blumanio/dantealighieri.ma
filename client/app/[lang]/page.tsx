// app/[lang]/page.tsx
import Header from '@/components/header';
import HeroSection from '@/components/HeroSection';
import Services from '@/components/services';
import { LanguageProvider } from './LanguageContext';
import { Suspense } from 'react';
import { BlogNavigation } from '@/components/BlogNavigation';
import { BasePageProps } from '@/types/types';

export default function Page({ params }: BasePageProps) {
  return (
    <LanguageProvider initialLang={params.lang as 'en' | 'it' | 'ar'}>
      <Suspense fallback={<div>Loading content...</div>}>
        <main>
          <HeroSection />
          <Services />
          <BlogNavigation prevPost={null} nextPost={null} lang={params.lang} />
        </main>
      </Suspense>
    </LanguageProvider>
  );
}
