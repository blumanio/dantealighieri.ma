'use client';
import React, { useState, useEffect, useMemo, Suspense, lazy, memo } from 'react';
import { useUser } from '@clerk/nextjs';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Loader2, Star, CheckCircle2, Lock, Target, Heart, FileText,
    BookmarkCheck, Award, MessageSquare, Globe, Pen, X, User, Calendar, Sparkles,
    Save,
    Bookmark,
    GraduationCap,
    List,
    User2,
    Layers,
    Route,
    BarChart2Icon,
    Crown
} from 'lucide-react'
import UserInfoSidebar from '@/components/profile/MetadataField';
import { redirect } from 'next/navigation';
import ReactCountryFlag from "react-country-flag"
import { ApplicationPhaseManager } from '@/components/profile/ApplicationPhaseManager';

// ============================================================================
// 1. LAZY-LOADED COMPONENTS (from your project structure)
// ============================================================================
const UserProfileDetails = lazy(() => import('@/components/profile/UserProfileDetails'));
const StudyInItalyFavorites = lazy(() => import('@/components/profile/FavoritesSection'));
const ApplicationGuideSection = lazy(() => import('@/components/profile/DocumentsHub'));
const ScholarshipsSection = lazy(() => import('@/components/profile/ScholarshipsSection'));
const PersonalizedDeadlineTracker = lazy(() => import('@/components/profile/MyCounselors'));
const MessagingSection = lazy(() => import('@/components/profile/MessagingSection'));
const PremiumApplicationHub = lazy(() => import('@/components/profile/PremiumApplicationHub'));
const DocumentsHub = lazy(() => import('@/components/profile/DocumentsHub'));
const SuggestedCourses = lazy(() => import('@/components/profile/SuggestedCourses')); // <-- NEWLY ADDED



// ============================================================================
// 2. TYPE DEFINITIONS (Unchanged)
// ============================================================================
interface ProfileSection {
    id: string;
    titleKey: string;
    descriptionKey: string;
    completion: number;
    statusKey: 'completed' | 'inProgress' | 'actionRequired' | 'notStarted';
    ctaKey: string;
    phase: 'About' | 'shortlisting' | 'documents' | 'My Application' | 'My Counselors' | 'My Saved Posts' | 'premium';
    urgency?: 'high' | 'medium' | 'low';
    disabled?: boolean;
}


// ============================================================================
// 3. LAYOUT & CORE UI COMPONENTS (Unchanged)
// ============================================================================
type DashboardLayoutProps = {
    rightSidebar: React.ReactNode;
    children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ rightSidebar, children }) => (
    <div className="max-w-screen-2xl mx-auto sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8 py-8">
            <main className="flex-1 min-w-0">{children}</main>
            {/* <aside className="w-full lg:w-80 lg:flex-shrink-0 mt-8 lg:mt-0 lg:sticky lg:top-8 self-start">{rightSidebar}</aside> */}
        </div>
    </div>
);

type UserProgressWidgetProps = {
    stats: {
        level: number;
        xp: number;
        nextLevelXP: number;
        streak: number;
        userName: string;
        userInitials: string;
        rankKey: string;
        country: Country;
    };
    t: (key: string) => string;
};
interface Country {
    id: string;
    name: string;
}

const UserProgressWidget = memo(({ stats, t }: UserProgressWidgetProps) => {
    if (!stats) return null;

    return (
        <div className="relative bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-md">
            {/* Background Ornaments */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-100/30 to-transparent rounded-full -translate-y-12 translate-x-12 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-100/20 to-transparent rounded-full translate-y-8 -translate-x-8 pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-10">
                {/* Avatar */}
                <div className="relative group shrink-0 self-center sm:self-start">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full blur-sm opacity-10 group-hover:opacity-20 transition-opacity" />
                    <div
                        className="relative w-20 h-20 sm:w-20 sm:h-20 rounded-full bg-cover bg-center ring-2 ring-white shadow"
                        style={{ backgroundImage: `url(${stats.userInitials})` }}
                    />
                    <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 flex items-center justify-center ring-2 ring-white">
                        <ReactCountryFlag
                            countryCode={stats.country.id}
                            svg
                            style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '3px'
                            }}
                        />
                    </div>
                </div>

                {/* Info & Stats */}
                <div className="flex-1 flex flex-col gap-4">
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
                            {t('welcomeBack')}, {stats.userName}! <span className="ml-1">👋</span>
                        </h2>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        {/* Streak */}
                        <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-2xl shadow hover:scale-[1.02] transition-transform duration-150">
                            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                                <BarChart2Icon size={16} />
                            </div>
                            <div>
                                <div className="text-base font-bold">{stats.streak}</div>
                                <div className="text-xs">{t('dayStreak')}</div>
                            </div>
                        </div>

                        {/* XP */}
                        <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-3 rounded-2xl shadow hover:scale-[1.02] transition-transform duration-150">
                            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                                <Sparkles size={16} />
                            </div>
                            <div>
                                <div className="text-base font-bold">{stats.xp}</div>
                                <div className="text-xs">XP</div>
                            </div>
                        </div>

                        {/* Phase to right */}
                        <div className="flex-1 flex justify-end">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Layers size={18} className="text-indigo-500" />
                                <ApplicationPhaseManager />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Info */}
            <div className="mt-6 pt-6 border-t border-slate-200">
                <UserInfoSidebar />
            </div>
        </div>
    );
});

UserProgressWidget.displayName = 'UserProgressWidget';


// ============================================================================
// 4. HORIZONTAL NAVIGATION COMPONENT (Updated for URL Hash)
// ============================================================================
type HorizontalPhaseMenuProps = {
    phases: Array<{ id: string; titleKey: string; requiredXp: number; completion?: number }>;
    activePhase: string;
    onPhaseChange: (phaseId: string) => void;
    userXp: number;
    t: (key: string) => string;
};

const HorizontalPhaseMenu = memo(({ phases, activePhase, onPhaseChange, userXp, t }: HorizontalPhaseMenuProps) => {
    const phaseIcons: { [key: string]: React.ElementType } = {
        About: User2,
        MyPlanner: Route,
        shortlisting: Heart,
        documents: FileText,
        MyApplication: GraduationCap,
        // finances: Award,
        MySavedPosts: Bookmark,
        MyCounselors: Crown,
        premium: Star,
    };

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, phaseId: string, isLocked: boolean) => {
        e.preventDefault();
        if (!isLocked) {
            onPhaseChange(phaseId);
        }
    };

    return (
        // className="lg:hidden"
        <div >

            <nav className="flex space-x-6 overflow-x-auto px-4 scrollbar-hide" aria-label="Tabs">
                {phases.map((phase) => {
                    const Icon = phaseIcons[phase.id] || Star;
                    const isActive = activePhase === phase.id;
                    const isLocked = userXp < phase.requiredXp;

                    return (
                        <a
                            key={phase.id}
                            href={`#${phase.id}`}
                            onClick={(e) => handleLinkClick(e, phase.id, isLocked)}
                            title={isLocked ? `Requires ${phase.requiredXp} XP` : t(phase.titleKey)}
                            className={`group flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors
                        ${isActive ? 'border-blue-500 text-blue-600' : 'border-transparent'}
                        ${isLocked ? 'text-slate-400 cursor-not-allowed' : 'text-slate-500 hover:text-slate-700'}
                    `}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <Icon className={`w-5 h-5 mr-2 flex-shrink-0 ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                            {t(phase.titleKey)}
                            {isLocked && <Lock className="w-4 h-4 ml-2 text-slate-400 flex-shrink-0" />}
                        </a>
                    );
                })}
            </nav>
        </div>
    );
});
HorizontalPhaseMenu.displayName = 'HorizontalPhaseMenu';


// ============================================================================
// 5. MAIN DASHBOARD COMPONENT (Updated with URL Hash Logic)
// ============================================================================

const YocketProfileDashboard = ({ isEditingEnabled = true }) => {
    const { isLoaded, user } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [activePhase, setActivePhase] = useState('About');
    const [profileData, setProfileData] = useState<any>(null);
    const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
    console.log('YocketProfileDashboard rendered', profileData, isOnboardingComplete);
    const phaseIds = useMemo(() => ['MyPlanner',
        'About', 'shortlisting', 'documents',
        'MySavedPosts', 'MyCounselors', 'premium'
    ], []);

    // Effect to sync component state WITH the URL hash
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.substring(1);
            if (hash && phaseIds.includes(hash)) {
                setActivePhase(hash);
            } else {
                // Default to the first phase if hash is invalid or missing
                setActivePhase(phaseIds[0]);
            }
        };

        handleHashChange(); // Run on initial load
        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [phaseIds]);

    // Effect for user data and redirection
    useEffect(() => {
        if (!isLoaded) return; // Wait for user data to load completely

        if (user?.publicMetadata) {
            setIsOnboardingComplete(!!user.publicMetadata.onboardingComplete);
            console.log('cccccccc User public metadata:', user.publicMetadata);
            // Only redirect if we have metadata and onboarding is NOT complete
            if (!user.publicMetadata.onboardingComplete) {
                console.log('cccccccccRedirecting to onboarding');
                redirect('/onboarding');
            }
        } else if (user) {
            console.log('cccccccc User exists but no public metadata:', user);
            // If user exists but no publicMetadata, redirect to onboarding
            redirect('/onboarding');
        }
    }, [isLoaded, user]);

    const t = (key: any) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase());

    // Effect for fetching dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!isLoaded) return;
            setIsLoading(true);
            try {
                await new Promise(res => setTimeout(res, 500)); // Optional delay
                const response = await fetch('/api/dashboard');
                if (!response.ok) throw new Error('Network response was not ok');

                const result = await response.json();

                if (result.success && result.data) {
                    const { userStats, profileSections } = result.data;
                    const userName = user?.firstName || 'User';
                    const userInitials = user?.imageUrl || 'U';
                    const country = user?.publicMetadata?.countryOfOrigin || 'Unknown';

                    setProfileData({
                        userStats: {
                            ...userStats,
                            userName,
                            userInitials,
                            country,
                        },
                        profileSections,
                    });
                } else {
                    console.error("Unexpected response format:", result);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [isLoaded, user]);


    // Function to handle phase changes and update URL
    const handlePhaseChange = (phaseId: string) => {
        // Update state, which will be picked up by the other effect
        // or directly set the hash for immediate URL update.
        window.location.hash = phaseId;
    };

    const journeyPhases = useMemo(() => {
        const phaseConfig = phaseIds.map(id => ({
            id,
            titleKey: t(id),
            requiredXp: id === 'finances' ? 111111 : id === 'premium' || id === 'MySavedPosts' || id === 'MyCounselors' ? 1000000 : 0
        }));

        if (!profileData || !profileData.profileSections) return phaseConfig.map(p => ({ ...p, completion: 0 }));

        const { profileSections } = profileData;
        return phaseConfig.map(phase => {
            const sectionsInPhase = profileSections.filter((s: any) => s.phase === phase.id);
            if (sectionsInPhase.length === 0) return { ...phase, completion: 100 };
            const completedCount = sectionsInPhase.filter((s: any) => s.completion === 100).length;
            const completionPercentage = (completedCount / sectionsInPhase.length) * 100;
            return { ...phase, completion: completionPercentage };
        });
    }, [profileData, phaseIds, t]);

    const phaseComponentMap = useMemo(() => ({
        About: UserProfileDetails,
        MyPlanner: SuggestedCourses,
        shortlisting: StudyInItalyFavorites,
        documents: DocumentsHub,
        MyApplication: PremiumApplicationHub,
        finances: ScholarshipsSection,
        MyCounselors: PersonalizedDeadlineTracker,
        MySavedPosts: MessagingSection,
        premium: PremiumApplicationHub,
    }), []);

    const renderActivePhaseComponent = () => {
        const ActiveComponent = phaseComponentMap[activePhase as keyof typeof phaseComponentMap];
        if (ActiveComponent) {
            return (
                <AnimatePresence mode="wait">
                    <motion.div key={activePhase} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
                        {/* @ts-ignore */}
                        <ActiveComponent t={t} initialData={profileData} />
                    </motion.div>
                </AnimatePresence>
            );
        }
        return <div className="bg-white rounded-2xl p-8 text-center"><h2 className="text-xl font-bold">Component for '{t(activePhase)}' not yet mapped.</h2></div>;
    };

    if (!isLoaded || isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

    const userStats = profileData?.userStats;


    return (
        <div className="min-h-screen bg-slate-50">
            <DashboardLayout
                rightSidebar={<>    </>}
            >
                {userStats && <UserProgressWidget stats={userStats} t={t} />}

                <HorizontalPhaseMenu
                    phases={journeyPhases}
                    activePhase={activePhase}
                    onPhaseChange={handlePhaseChange}
                    userXp={userStats?.xp || 0}
                    t={t}
                />

                <Suspense fallback={<div className="flex justify-center p-20 bg-white rounded-2xl border border-slate-200/80"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
                    {renderActivePhaseComponent()}
                </Suspense>
            </DashboardLayout>
        </div>
    );
};

export default YocketProfileDashboard;