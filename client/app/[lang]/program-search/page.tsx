'use client';

import { useSearchParams } from 'next/navigation';
import ProgramSearch from '@/components/ProgramSearch';
import { LanguageProvider } from '../LanguageContext';

export default function SearchPage() {
  const searchParams = useSearchParams();

  return (
    <main className="pt-24">
      <div className="flex justify-center w-full py-8">
        <div className="w-4/5">
          <ProgramSearch initialFilters={{
            degreeType: searchParams.get('degreeType') || '',
            accessType: searchParams.get('accessType') || '',
            courseLanguage: searchParams.get('courseLanguage') || '',
            academicArea: searchParams.get('academicArea') || ''
          }} />
        </div>
      </div>
    </main>
  );
}