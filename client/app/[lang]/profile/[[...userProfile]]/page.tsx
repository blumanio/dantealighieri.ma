'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useLanguage } from '@/context/LanguageContext'; // Assuming your LanguageContext path

// Import section components
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import PersonalDataSection from '@/components/profile/PersonalDataSection';
import FavoritesSection from '@/components/profile/FavoritesSection';
import ApplicationGuideSection from '@/components/profile/ApplicationGuideSection';
import ScholarshipsSection from '@/components/profile/ScholarshipsSection';
import { Loader2 } from 'lucide-react'; // For a consistent loading spinner
import UserProfileDetails from '@/components/profile/UserProfileDetails'; // Adjust path

// --- Data Types (Consider moving to a dedicated types file e.g., types/profile.ts) ---
// export interface FavoriteCourse { id: string; name: string; universityName: string; degreeType: string; link: string; } // Not needed if FavoritesSection fetches its own
export interface FavoriteUniversity { id: string; name: string; city: string; logoUrl?: string; link: string; } // Example
export interface Scholarship { _id: string; /* or id */ title: string; provider: string; eligibilitySummary: string; deadline: string; amount?: string; link: string; }
export interface ChecklistItem {
    id: string;
    labelKey: string;
    descriptionKey?: string;
    isCompleted: boolean;
    link?: string;
    subItems?: ChecklistItem[];
    icon?: React.ElementType;
}
export interface ChecklistPhase {
    id: string;
    titleKey: string;
    items: ChecklistItem[];
    isOpen?: boolean;
}

// --- Page Props ---
type Props = {
    params: {
        locale: string;
        userProfile?: string[]; // This will be populated by Next.js for the catch-all route
    };
};

// --- Main Profile Page Component ---
const ProfilePage = ({ params }: Props) => {
    const { locale } = params;
    const { user, isSignedIn, isLoaded } = useUser(); // Use isLoaded
    const { language, t } = useLanguage(); // Assuming 'language' from context aligns with 'locale'
    const [activeTab, setActiveTab] = useState('userProfileDetails');

    // --- State for dynamic content (fetched by ProfilePage) ---
    // FavoritesSection now fetches its own courses.
    // ProfilePage might fetch other specific data.
    const [favoriteUniversities, setFavoriteUniversities] = useState<FavoriteUniversity[]>([]); // Example
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [applicationChecklist, setApplicationChecklist] = useState<ChecklistPhase[]>([]); // TODO: Fetch initial structure & user progress

    useEffect(() => {
        if (!isLoaded) return; // Wait for Clerk to finish loading

        if (isSignedIn && user) {
            // TODO: Fetch favoriteUniversities for user.id from your backend
            // e.g., fetch(`/api/users/${user.id}/favorite-universities`).then(res => res.json()).then(data => setFavoriteUniversities(data));
            // TODO: Fetch scholarships
            // e.g., fetch(`/api/scholarships?userId=${user.id}`).then(res => res.json()).then(data => setScholarships(data));
            // TODO: Fetch user's checklist progress and merge with applicationChecklist structure
        } else if (isLoaded && !isSignedIn) {
            // Clear data if user is not signed in after Clerk has loaded
            setFavoriteUniversities([]);
            setScholarships([]);
            setApplicationChecklist([]);
        }
    }, [isLoaded, isSignedIn, user]);

    const handleChecklistItemToggle = (phaseId: string, itemId: string, subItemId?: string) => {
        setApplicationChecklist(prevChecklist =>
            // ... (your existing logic for toggling, ensure it's correct)
            prevChecklist.map(phase => {
                if (phase.id === phaseId) {
                    return {
                        ...phase,
                        items: phase.items.map(item => {
                            if (item.id === itemId) {
                                if (subItemId && item.subItems) {
                                    return {
                                        ...item,
                                        subItems: item.subItems.map(sub =>
                                            sub.id === subItemId ? { ...sub, isCompleted: !sub.isCompleted } : sub
                                        ),
                                    };
                                }
                                return { ...item, isCompleted: !item.isCompleted };
                            }
                            return item;
                        }),
                    };
                }
                return phase;
            })
        );
        // TODO: API call to save checklist progress to backend for user?.id
    };

    const handlePhaseToggle = (phaseId: string) => {
        setApplicationChecklist(prev =>
            prev.map(phase =>
                phase.id === phaseId ? { ...phase, isOpen: !phase.isOpen } : phase
            )
        );
    };

    // Handle Clerk's loading state
    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <Loader2 className="animate-spin h-10 w-10 text-primary" />
            </div>
        );
    }

    // Handle not signed in state
    if (!isSignedIn) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
                <p className="text-xl text-neutral-600 text-center">{t('profile', 'signInPrompt')}</p>
            </div>
        );
    }

    // User is signed in, but user object might still be briefly null after isLoaded & isSignedIn true.
    // This also ensures user object is passed correctly.
    if (!user) {
        return ( // Fallback if user is null unexpectedly after checks
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <Loader2 className="animate-spin h-10 w-10 text-primary" />
                <span className="ml-3">{t('profile', 'loadingUserData')}</span>
            </div>
        );
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
                        user={user} // user object is now confirmed to be available
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        t={t}
                        language={language} // Or pass `locale` from params if `language` from context is different
                    />
                    <main className="lg:w-3/4 xl:w-4/5 bg-white p-5 md:p-8 rounded-xl shadow-lg min-h-[60vh]">
                        {/* Pass `locale` (from params) to PersonalDataSection as `lang` */}
                        {activeTab === 'personalData' && <PersonalDataSection t={t} lang={locale} />}

                        {/* FavoritesSection fetches its own favorite courses.
                            Pass favoriteUniversities if this page fetches them. */}
                        {activeTab === 'favorites' && <FavoritesSection universities={favoriteUniversities} t={t} />}

                        {activeTab === 'applicationGuide' &&
                            <ApplicationGuideSection
                                checklistData={applicationChecklist}
                                onToggleItem={handleChecklistItemToggle}
                                onPhaseToggle={handlePhaseToggle}
                                t={t}
                                language={language} // Or pass `locale`
                            />}
                        {activeTab === 'scholarships' && <ScholarshipsSection scholarships={scholarships} t={t} />}
                        {activeTab === 'userProfileDetails' && <UserProfileDetails t={t} lang={locale} />}

                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;