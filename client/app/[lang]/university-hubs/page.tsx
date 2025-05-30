// app/[lang]/university-hubs/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { School, Loader2, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DanteAlighieriLogo } from '@/components/SocialIcons';

interface CourseForHubList {
  _id: string;
  uni: string; // Original university name from DB
  uniSlug?: string; // Slug from DB (if populated and returned by API)
  comune?: string;
}

interface UniversityDisplayInfo {
  name: string; // Original university name for display
  slug: string; // URL-friendly slug, MUST MATCH uniSlug in DB for querying
  courseCount: number;
  location?: string;
}

// THIS SLUGIFICATION FUNCTION MUST BE IDENTICAL (OR VERY SIMILAR)
// TO THE ONE USED IN YOUR Course.js MODEL'S PRE-SAVE HOOK
// OR THE ONE USED TO POPULATE Course.uniSlug IN YOUR DB.
const generateConsistentUniSlug = (uniName: string): string => {
  if (!uniName) return 'unknown-university';
  return uniName.toString().toLowerCase() // Ensure it's a string
    .replace(/\s+/g, '-')
    .replace(/[àáâãäåāăą]/g, 'a')
    .replace(/[èéêëēĕėęě]/g, 'e')
    .replace(/[ìíîïĩīĭįı]/g, 'i')
    .replace(/[òóôõöōŏő]/g, 'o')
    .replace(/[ùúûüũūŭůűų]/g, 'u')
    .replace(/[ýÿŷ]/g, 'y')
    .replace(/[ñń]/g, 'n')
    .replace(/[çćč]/g, 'c')
    .replace(/[šśŝş]/g, 's')
    .replace(/[žźż]/g, 'z')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function UniversityHubsPage() {
  const { language, t } = useLanguage();
  const [universities, setUniversities] = useState<UniversityDisplayInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchUniversities = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch all courses. Ensure your /api/courses returns uniSlug if available
        // If not, you rely solely on client-side slug generation from `uni` name.
        const response = await fetch(`${API_BASE_URL}/api/courses`);
        if (!response.ok) {
          throw new Error(t('universityHubs', 'errorFetchingUniversities', { defaultValue: 'Failed to fetch university data' }));
        }
        const coursesData: CourseForHubList[] = await response.json();

        const uniMap = new Map<string, { count: number; locations: Set<string>; dbSlug?: string }>();
        coursesData.forEach(course => {
          if (course.uni) {
            const current = uniMap.get(course.uni) || { count: 0, locations: new Set(), dbSlug: course.uniSlug };
            current.count++;
            if (course.comune) current.locations.add(course.comune);
            // If uniSlug comes from DB, prefer it. Otherwise, it will be generated.
            if (course.uniSlug && !current.dbSlug) {
                current.dbSlug = course.uniSlug;
            }
            uniMap.set(course.uni, current);
          }
        });

        const uniqueUniversities = Array.from(uniMap.entries()).map(([name, data]) => {
            // IMPORTANT: Prioritize slug from DB if available, otherwise generate it.
            // This generated slug MUST match what the detail page will use to query the API.
            const slugToUse = data.dbSlug || generateConsistentUniSlug(name);
            console.log(`[HubList] University: "${name}", DB Slug: "${data.dbSlug}", Generated/Used Slug: "${slugToUse}"`);
            return {
                name, // Original name for display
                slug: slugToUse,
                courseCount: data.count,
                location: data.locations.size > 0 ? Array.from(data.locations)[0] : undefined
            };
        });

        setUniversities(uniqueUniversities.sort((a,b) => a.name.localeCompare(b.name)));
      } catch (err: any) {
        setError(err.message);
        setUniversities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUniversities();
  }, [t, API_BASE_URL]);

  if (isLoading) { /* ... loading JSX ... */ 
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (error) { /* ... error JSX ... */
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow flex items-center justify-center p-4 text-center text-red-600">
            <p>{t('common','errorLoadingData', {context: 'universities'})} Detail: {error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <DanteAlighieriLogo className="h-24 w-auto mx-auto text-primary mb-4" />
          <h1 className="text-4xl font-bold text-primary mb-3">
            {t('universityHubs', 'pageTitle', { defaultValue: 'University Hubs' })}
          </h1>
          <p className="text-lg text-textSecondary max-w-2xl mx-auto">
            {t('universityHubs', 'pageSubtitle', { defaultValue: 'Connect with students and explore courses at your chosen Italian university.' })}
          </p>
        </div>

        {universities.length === 0 ? (
          <p className="text-center text-textSecondary">
            {t('universityHubs', 'noUniversitiesFound', { defaultValue: 'No university data available at the moment.' })}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((uni) => (
              <Link
                key={uni.slug} // Slug should be unique now
                href={`/${language}/university-hubs/${uni.name}`} // Use the slug for the link
                className="block bg-white p-6 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 group hover:border-primary border-transparent border"
              >
                <div className="flex items-center mb-3">
                  <School className="h-8 w-8 text-primary mr-3 transition-transform duration-300 group-hover:scale-110" />
                  <h2 className="text-xl font-semibold text-textPrimary group-hover:text-primary transition-colors duration-300 truncate" title={uni.name}>
                    {uni.name} {/* Display original name */}
                  </h2>
                </div>
                {uni.location && (
                    <p className="text-sm text-textSecondary mb-1 truncate" title={uni.location}><MapPin size={14} className="inline mr-1 opacity-70"/>{uni.location}</p>
                )}
                <p className="text-sm text-textSecondary">
                  {uni.courseCount} {t('universityHubs', 'coursesAvailable', { count: uni.courseCount, defaultValue: 'courses available' })}
                </p>
                <div className="mt-4 text-right">
                    <span className="text-xs font-medium text-primary group-hover:underline">
                        {t('universityHubs', 'viewHub', { defaultValue: 'View Hub' })} &rarr;
                    </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}