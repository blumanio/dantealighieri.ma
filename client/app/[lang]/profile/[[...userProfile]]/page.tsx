// app/[lang]/profile/[[...userProfile]]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useLanguage } from '@/context/LanguageContext';

import ProfileSidebar from '@/components/profile/ProfileSidebar';
import PersonalDataSection from '@/components/profile/PersonalDataSection';
import FavoritesSection from '@/components/profile/FavoritesSection';
import ApplicationGuideSection from '@/components/profile/ApplicationGuideSection';
import ScholarshipsSection from '@/components/profile/ScholarshipsSection';
import PersonalizedDeadlineTracker from '@/components/profile/PersonalizedDeadlineTracker';
import { Loader2 } from 'lucide-react';
import UserProfileDetails from '@/components/profile/UserProfileDetails';
import PremiumApplicationHub from '@/components/profile/PremiumApplicationHub';
import MessagingSection from '@/components/profile/MessagingSection'; // IMPORT NEW COMPONENT
import { useSearchParams } from 'next/navigation';

export interface FavoriteUniversity { /* ... */ }
export interface Scholarship { /* ... */ }
export interface ChecklistItem { /* ... */ }
export interface ChecklistPhase { /* ... */ }

type Props = { params: { locale: string; userProfile?: string[] } };

const ProfilePage = ({ params }: Props) => {
    const { locale } = params;
    const { user, isSignedIn, isLoaded } = useUser();
    const { language, t } = useLanguage();
    const [activeTab, setActiveTab] = useState('userProfileDetails');

    const [favoriteUniversities, setFavoriteUniversities] = useState<FavoriteUniversity[]>([]);
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [applicationChecklist, setApplicationChecklist] = useState<ChecklistPhase[]>([]);
    const searchParams = useSearchParams(); // For deep-linking
    const [initialConversationId, setInitialConversationId] = useState<string | null>(null);

    useEffect(() => {
        const conversationIdFromQuery = searchParams?.get('openConversationId');
        if (conversationIdFromQuery) {
            setInitialConversationId(conversationIdFromQuery);
            setActiveTab('messages'); // Automatically switch to messages tab
        }
    }, [searchParams]);
    useEffect(() => { /* ... existing useEffect ... */ }, [isLoaded, isSignedIn, user]);
    const handleChecklistItemToggle = (phaseId: string, itemId: string, subItemId?: string) => { /* ... */ };
    const handlePhaseToggle = (phaseId: string) => { /* ... */ };

    if (!isLoaded) { /* ... loading ... */
        return <div className="flex items-center justify-center min-h-[calc(100vh-200px)]"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
    }
    if (!isSignedIn) { /* ... not signed in ... */
        return <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4"><p className="text-xl text-neutral-600 text-center">{t('profile', 'signInPrompt')}</p></div>;
    }
    if (!user) { /* ... user null ... */
        return <div className="flex items-center justify-center min-h-[calc(100vh-200px)]"><Loader2 className="animate-spin h-10 w-10 text-primary" /><span className="ml-3">{t('profile', 'loadingUserData', { defaultValue: "Loading user data..." })}</span></div>;
    }

    return (
        <div className={`min-h-screen bg-neutral-50 p-4 md:p-8 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
            <div className="container mx-auto max-w-6xl">
                <header className="mb-6 md:mb-10 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">
                        {t('profile', 'pageTitle')}
                    </h1>
                </header>

                <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                    <ProfileSidebar
                        user={user}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        t={t}
                        language={language}
                    />
                    <main className="lg:w-3/4 xl:w-4/5 bg-white rounded-xl shadow-lg min-h-[60vh] overflow-hidden"> {/* Added overflow-hidden for messaging layout */}
                        {activeTab === 'messages' && <MessagingSection initialConversationId={initialConversationId} />}
                        {activeTab === 'userProfileDetails' && <div className="p-5 md:p-8"><UserProfileDetails t={t} lang={locale} /></div>}
                        {activeTab === 'messages' && <MessagingSection />} {/* RENDER MESSAGING SECTION - NO EXTRA PADDING */}
                        {activeTab === 'favorites' && <div className="p-5 md:p-8"><FavoritesSection universities={favoriteUniversities} t={t} /></div>}
                        {activeTab === 'applicationGuide' && <div className="p-5 md:p-8"><ApplicationGuideSection checklistData={applicationChecklist} onToggleItem={handleChecklistItemToggle} onPhaseToggle={handlePhaseToggle} t={t} language={language} /></div>}
                        {activeTab === 'scholarships' && <div className="p-5 md:p-8"><ScholarshipsSection scholarships={scholarships} t={t} /></div>}
                        {activeTab === 'personalizedDeadlineTracker' && <div className="p-5 md:p-8"><PersonalizedDeadlineTracker t={t} lang={locale} /></div>}
                        {activeTab === 'premiumApplicationHub' && <div className="p-5 md:p-8"><PremiumApplicationHub t={t} lang={locale} /></div>}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;