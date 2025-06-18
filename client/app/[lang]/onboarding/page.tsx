// Location: app/[lang]/onboarding/page.tsx
import OnboardingForm from '@/components/onboarding/OnboardingForm';
import { currentUser } from '@clerk/nextjs/server';
import { translations } from '@/app/i18n/translations';
import { redirect } from 'next/navigation';
import { Locale } from '@/app/i18n/types';

interface PageProps {
    params: Promise<{ lang: Locale }>;
}

export default async function OnboardingPage({ params }: PageProps) {
    // FIX 1: Properly await the params (Next.js 15+ requirement)
    const { lang } = await params;
    
    // FIX 2: Add validation for lang parameter
    if (!lang || !Object.keys(translations).includes(lang)) {
        redirect('/en/onboarding'); // or your default locale
    }
    
    console.log('OnboardingPage lang:', lang); // This was logging metadata instead of lang
    
    const user = await currentUser();
    
    if (!user) {
        redirect(`/${lang}/sign-in`);
    }
    
    console.log('OnboardingPage user metadata:', user.publicMetadata);
    
    // FIX 3: Improved metadata checking with better type safety
    const hasMetadata = user.publicMetadata && typeof user.publicMetadata === 'object';
    const onboardingComplete = hasMetadata && 
        'onboardingComplete' in user.publicMetadata &&
        Boolean(user.publicMetadata.onboardingComplete);
    
    if (onboardingComplete) {
        redirect(`/${lang}/dashboard`);
    }
    
    // FIX 4: Add fallback handling for dictionary
    const dictionary = translations[lang as keyof typeof translations] || translations.en;
    
    // FIX 5: Add error boundary for missing dictionary
    if (!dictionary) {
        console.error(`Missing translations for language: ${lang}`);
        redirect('/en/onboarding');
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                    {dictionary?.profile?.pageTitle || 'Complete Your Profile'}
                </h1>
                <OnboardingForm dictionary={dictionary} lang={lang} />
            </div>
        </div>
    );
}