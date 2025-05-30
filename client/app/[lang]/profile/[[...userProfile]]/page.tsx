// File: client/app/[lang]/profile/[[...userProfile]]/page.tsx
// Update to include the new section and tab logic

'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useLanguage } from '@/context/LanguageContext';

import ProfileSidebar from '@/components/profile/ProfileSidebar';
import PersonalDataSection from '@/components/profile/PersonalDataSection';
import FavoritesSection from '@/components/profile/FavoritesSection';
import ApplicationGuideSection from '@/components/profile/ApplicationGuideSection';
import ScholarshipsSection from '@/components/profile/ScholarshipsSection';
import PersonalizedDeadlineTracker from '@/components/profile/PersonalizedDeadlineTracker'; // For Courses
import TrackedUniversitiesSection from '@/components/profile/TrackedUniversitiesSection'; // New component
import { Loader2 } from 'lucide-react';
import UserProfileDetails from '@/components/profile/UserProfileDetails';
import PremiumApplicationHub from '@/components/profile/PremiumApplicationHub';
import MessagingSection from '@/components/profile/MessagingSection';
import { useParams, useSearchParams } from 'next/navigation';

// Assuming these types are defined or imported from a shared types file
export interface FavoriteUniversity { id: string; name: string; logoUrl?: string; link: string; city: string; }
export interface Scholarship { id: string; title: string; provider: string; eligibilitySummary: string; deadline: string; amount?: string; link: string; }
export interface ChecklistItem { id: string; labelKey: string; descriptionKey?: string; link?: string; isCompleted: boolean; icon?: React.ElementType; subItems?: ChecklistItem[]; }
export interface ChecklistPhase { id: string; titleKey: string; isOpen: boolean; items: ChecklistItem[]; }

type Props = { params: { lang: string; userProfile?: string[] } }; // lang is lang from folder structure

const ProfilePage = ({ params }: Props) => {
    //const { lang: lang } = params; // Use 'lang' from params as the current language string
    const routeParams = useParams();
    const lang = routeParams && typeof routeParams.lang === 'string' ? routeParams.lang : 'en'; // Default to 'en' if not found or array
    const { user, isSignedIn, isLoaded } = useUser();
    const { language, t } = useLanguage(); // Language context for translations
    const _user : any = user; // Type assertion to match expected user type
    const _t:any = t; // Type assertion for translation function
    // Default to 'userProfileDetails', but 'trackedCourses' will be the old 'personalizedDeadlineTracker'
    const [activeTab, setActiveTab] = useState('userProfileDetails');

    // State for data fetched by child components (example, might be managed within children)
    const [favoriteUniversities, setFavoriteUniversities] = useState<FavoriteUniversity[]>([]);
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);

    // State for ApplicationGuide (example structure)
    const [applicationChecklist, setApplicationChecklist] = useState<ChecklistPhase[]>([
        // Initial empty or mock structure, to be populated by API/logic
        {
            id: 'phase1', titleKey: 'profile.checklistPhase1Title', isOpen: true, items: [
                { id: 'item1.1', labelKey: 'profile.checklistPassportCopyLabel', descriptionKey: 'profile.checklistPassportCopyDescription', isCompleted: false },
            ]
        }
    ]);


    const searchParams = useSearchParams();
    const [initialConversationId, setInitialConversationId] = useState<string | null>(null);

    useEffect(() => {
        const conversationIdFromQuery = searchParams?.get('openConversationId');
        if (conversationIdFromQuery) {
            setInitialConversationId(conversationIdFromQuery);
            setActiveTab('messages'); // Automatically switch to messages tab
        }
    }, [searchParams]);


    // Example data fetching (normally done in respective sections or via context)
    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            // Mock fetching some data
            // setFavoriteUniversities([{id: '1', name: 'Mock Uni', city: 'Mock City', link: '#'}]);
            // setScholarships([{id: 's1', title: 'Mock Scholarship', provider: 'Mock Gov', eligibilitySummary: 'All', deadline: 'Tomorrow', link: '#'}]);
        }
    }, [isLoaded, isSignedIn, user]);

    const handleChecklistItemToggle = (phaseId: string, itemId: string, subItemId?: string) => {
        setApplicationChecklist(prevList =>
            prevList.map(phase =>
                phase.id === phaseId
                    ? {
                        ...phase,
                        items: phase.items.map(item =>
                            item.id === itemId
                                ? subItemId
                                    ? { ...item, subItems: item.subItems?.map(sub => sub.id === subItemId ? { ...sub, isCompleted: !sub.isCompleted } : sub) }
                                    : { ...item, isCompleted: !item.isCompleted }
                                : item
                        )
                    }
                    : phase
            )
        );
        // TODO: API call to save checklist progress
    };

    const handlePhaseToggle = (phaseId: string) => {
        setApplicationChecklist(prevList =>
            prevList.map(phase =>
                phase.id === phaseId ? { ...phase, isOpen: !phase.isOpen } : phase
            )
        );
    };


    if (!isLoaded) {
        return <div className="flex items-center justify-center min-h-[calc(100vh-200px)]"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
    }
    if (!isSignedIn) {
        return <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4"><p className="text-xl text-neutral-600 text-center">{t('profile', 'signInPrompt')}</p></div>;
    }
    if (!user) {
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
                        user={_user}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        t={_t}
                        language={language} // language context might provide 'en', 'ar', 'it'
                    />
                    <main className="lg:w-3/4 xl:w-4/5 bg-white rounded-xl shadow-lg min-h-[60vh] overflow-hidden">
                        {/* Conditional rendering based on activeTab */}
                        {activeTab === 'userProfileDetails' && <div className="p-5 md:p-8"><UserProfileDetails t={_t} lang={lang} /></div>}
                        {activeTab === 'messages' && <MessagingSection />}
                        {activeTab === 'favorites' && <div className="p-5 md:p-8"><FavoritesSection universities={favoriteUniversities} t={_t} /></div>}
                        {activeTab === 'trackedCourses' && <div className="p-5 md:p-8"><PersonalizedDeadlineTracker t={_t} lang={lang} /></div>}
                        {activeTab === 'trackedUniversities' && <div className="p-5 md:p-8"><TrackedUniversitiesSection /></div>}
                        {activeTab === 'applicationGuide' && <div className="p-5 md:p-8"><ApplicationGuideSection checklistData={applicationChecklist} onToggleItem={handleChecklistItemToggle} onPhaseToggle={handlePhaseToggle} t={_t} language={language} /></div>}
                        {activeTab === 'scholarships' && <div className="p-5 md:p-8"><ScholarshipsSection scholarships={scholarships} t={_t} /></div>}
                        {activeTab === 'premiumApplicationHub' && <div className="p-5 md:p-8"><PremiumApplicationHub t={_t} lang={lang} /></div>}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;