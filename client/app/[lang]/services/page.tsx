'use client';

import { UniversityTable } from '@/components/UniversityTable';
import { italianUniversities } from '../../../lib/data';
import { useUser } from '@clerk/nextjs';

export default function UniversitiesPage() {
  const { isSignedIn } = useUser();

  interface UniversityTableProps {
    universities: University[];
    isSignedIn: boolean;
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <UniversityTable universities={italianUniversities} isSignedIn={isSignedIn} />
    </div>
  );
} 