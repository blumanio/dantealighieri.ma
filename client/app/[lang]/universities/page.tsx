// universities-page.tsx
'use client';

import { UniversityTable, University } from '@/components/UniversityTable';
import { italianUniversities } from '../../../lib/data';
import { useUser } from '@clerk/nextjs';

// Validate and transform the data to match the University type
const validateUniversities = (data: any[]): University[] => {
  return data.map(uni => ({
    ...uni,
    // Ensure status is one of the allowed values
    status: validateStatus(uni.status),
    // Ensure other required properties are present and correctly typed
    programs_offered: uni.programs_offered?.map((program:any) => ({
      ...program,
      type: validateProgramType(program.type)
    })) || []
  }));
};

// Helper function to validate status
const validateStatus = (status: string): 'Open' | 'Closed' | 'Coming Soon' => {
  const validStatuses = ['Open', 'Closed', 'Coming Soon'] as const;
  if (validStatuses.includes(status as any)) {
    return status as 'Open' | 'Closed' | 'Coming Soon';
  }
  // Default to 'Coming Soon' if invalid status
  return 'Coming Soon';
};

// Helper function to validate program type
const validateProgramType = (type: string): 'Bachelor' | 'Master' => {
  return type === 'Master' ? 'Master' : 'Bachelor';
};

export default function UniversitiesPage() {
  const { isSignedIn } = useUser();

  // Validate and transform the universities data
  const validatedUniversities = validateUniversities(italianUniversities);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <UniversityTable 
        universities={validatedUniversities} 
        isSignedIn={isSignedIn ?? false} 
      />
    </div>
  );
}