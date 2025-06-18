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
    Route,
    BarChart2Icon,
    Crown
} from 'lucide-react';
import { MetadataField, UserInfoSidebar } from '@/components/profile/MetadataField';
import { redirect } from 'next/navigation';


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
            <aside className="w-full lg:w-80 lg:flex-shrink-0 mt-8 lg:mt-0 lg:sticky lg:top-8 self-start">{rightSidebar}</aside>
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
    };
    t: (key: string) => string;
};

const UserProgressWidget = memo(({ stats, t }: UserProgressWidgetProps) => {
    if (!stats) return null;
    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">{stats.userInitials}</div>
                <div className="flex-1 w-full">
                    <h3 className="text-xl font-bold text-slate-900">{t('welcomeBack')}, {stats.userName}!</h3>
                    <div className="flex justify-between text-xs text-slate-500 font-medium mt-2">
                        <div className='flex items-center gap-1'><BarChart2Icon size={14} className='text-orange-500' /><span>{stats.streak} {t('dayStreak')}</span></div>
                        <div className='flex items-center gap-1'><Sparkles size={14} className='text-orange-500 ' />{stats.xp}  </div>
                    </div>
                </div>
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
        if (user?.publicMetadata) {
            setIsOnboardingComplete(!!user.publicMetadata.onboardingComplete);
        }
        if (isLoaded && user && !user.publicMetadata.onboardingComplete) {
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
                    const userInitials = user?.firstName?.[0] || 'U';

                    setProfileData({
                        userStats: {
                            ...userStats,
                            userName,
                            userInitials,
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
            requiredXp: id === 'finances' ? 111111 : id === 'premium' || id === 'MyCounselors' ? 1000000 : 0
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
                rightSidebar={<UserInfoSidebar isEditingEnabled={isEditingEnabled} />}
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