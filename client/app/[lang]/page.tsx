import Header from '@/components/header';
import FAQ from '@/components/FAQ';
import Contact from '@/components/contact';
import Services from '@/components/services';
import ProgramSearch from '@/components/ProgramSearch';
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
          <div className="flex justify-center w-full py-8">
            <div className="w-4/5">
              <ProgramSearch />
            </div>
          </div>
          <Services />
        </main>
      </Suspense>
    </LanguageProvider>
  );
}
