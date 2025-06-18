// File: client/components/profile/ProfileSidebar.tsx
'use client';

import React, {useState, useEffect } from 'react';
import { User } from '@clerk/nextjs/server';
import {
    User as UserIcon, Heart, ListChecks, Award, LogOut, Settings, MessageSquare, Mail as MailIcon, Briefcase, Bookmark, Crown, CheckCircle, Sparkles // Added Crown, CheckCircle, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useClerk } from '@clerk/nextjs';

interface UserProfileDetails {
    role?: string;
    premiumTier?: string;
}

interface ProfileSidebarProps {
    user: User;
    activeTab: string;
    setActiveTab: (tabId: string) => void;
    t: (namespace: string, key: string, options?: any) => string;
    language: string;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ user, activeTab, setActiveTab, t, language }) => {
    const { signOut } = useClerk();
    const [userProfileDetails, setUserProfileDetails] = useState<UserProfileDetails | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoadingDetails(true);
            try {
                const response = await fetch('/api/user-profile-details');
                if (response.ok) {
                    const data = await response.json();
                    setUserProfileDetails(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch user profile details:", error);
            } finally {
                setIsLoadingDetails(false);
            }
        };
        if (user?.id) {
            fetchDetails();
        } else {
            setIsLoadingDetails(false);
        }
    }, [user?.id]);

    const tabs = [
        { disabled: false, id: 'favorites', labelKey: 'tabsFavorites', icon: Heart },
        { disabled: false, id: 'trackedCourses', labelKey: 'tabsTrackedCourses', icon: ListChecks },
        { disabled: false, id: 'trackedUniversities', labelKey: 'tabsTrackedUniversities', icon: Bookmark },
        { disabled: true, id: 'messages', labelKey: 'tabsMessages', icon: MailIcon }, // Assuming Premium/Future
        { disabled: true, id: 'scholarships', labelKey: 'tabsScholarships', icon: Award }, // Assuming Premium/Future
        { disabled: true, id: 'premiumApplicationHub', labelKey: 'premiumApplicationHub', icon: MessageSquare }, // Clearly Premium
    ];

    // Updated to use design system colors
    const getTierColorName = (tier: string | undefined): string => {
        switch (tier?.toLowerCase()) {
            case 'dante': return 'purple'; // Premium
            case 'da vinci': return 'blue'; // Primary
            case 'michelangelo': return 'emerald'; // Success-like
            default: return 'slate';
        }
    };
    
    const getTierStyling = (tier: string | undefined) => {
        const color = getTierColorName(tier);
        return {
            shadow: `shadow-${color}-200/40`, // Colored shadow
            border: `border-${color}-300`,
            gradient: `from-${color}-500 to-${color}-600`, // Example for badges or accents
            text: `text-${color}-700`
        };
    };


    const getRoleIcon = (role: string | undefined) => {
        switch (role) {
            case 'mentor': return <Briefcase className="h-3 w-3" />; // Using Briefcase for a more professional look
            case 'alumni': return <Award className="h-3 w-3" />; // Using Award for alumni
            case 'student': return <UserIcon className="h-3 w-3" />;
            default: return <UserIcon className="h-3 w-3" />;
        }
    };

    const roleDisplay = userProfileDetails?.role
        ? t('profileFieldLabels', `role_${userProfileDetails.role}`, { defaultValue: userProfileDetails.role.charAt(0).toUpperCase() + userProfileDetails.role.slice(1) })
        : t('profileFieldLabels', 'role_student', { defaultValue: "Student" });

    const tierDisplay = userProfileDetails?.premiumTier
        ? t('profileFieldLabels', `tier_${userProfileDetails.premiumTier}`, { defaultValue: userProfileDetails.premiumTier })
        : t('profileFieldLabels', 'tier_Amico', { defaultValue: "Amico" }); // Default to a base tier if none

    // Define primary color for active states and accents
    const primaryGradient = "from-blue-600 to-indigo-600";
    const primaryColor = "blue"; // for simpler hover states if needed

    return (
        <aside className="lg:w-1/4 xl:w-1/5 animate-fade-in-up">
            {/* Main sidebar container with premium styling */}
            <div className="sticky top-8 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 md:p-6 rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden">
                {/* Floating Background Elements - subtle decoration */}
                <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>
                
                {/* Premium accent line at the top */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

                {/* User Profile Section */}
                <div className="relative flex flex-col items-center pb-6 border-b-2 border-slate-200 mb-6">
                    <div className="relative mb-4">
                        <div className="relative group">
                            <img
                                src={user.imageUrl}
                                alt={user.fullName || user.username || t('profile', 'userAvatarAlt') || 'User Avatar'}
                                className={`w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 shadow-xl group-hover:shadow-2xl transition-all duration-300 hover:scale-105
                                ${isLoadingDetails ? 'animate-pulse bg-slate-300 border-slate-200' : `${getTierStyling(userProfileDetails?.premiumTier).border} ${getTierStyling(userProfileDetails?.premiumTier).shadow}`}`}
                            />
                             {/* Premium "Verified" or Status badge on Avatar */}
                            <div className={`absolute -bottom-2 -right-2 p-1.5 bg-emerald-500 border-4 border-white rounded-full shadow-lg ${getTierStyling(userProfileDetails?.premiumTier).shadow}`}>
                                <CheckCircle className="h-4 w-4 text-white" />
                            </div>

                            {/* Role badge with premium styling */}
                            {!isLoadingDetails && userProfileDetails?.role && (
                                <div className="absolute -top-1 -left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 hover:shadow-md transition-shadow duration-300">
                                    <span className="text-slate-600">{getRoleIcon(userProfileDetails.role)}</span>
                                    <span className="text-xs font-bold text-slate-700 tracking-wider">
                                        {roleDisplay.substring(0, 3).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User Info with premium typography */}
                    <div className="text-center space-y-1 w-full">
                        <h2 className="text-xl md:text-2xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent truncate max-w-full px-2 leading-tight">
                            {user.fullName || user.username || t('profile', 'userFullNameMissing', { defaultValue: "User Name" })}
                        </h2>
                        <p className="text-sm font-medium text-slate-500 truncate max-w-full px-2">
                            {user.primaryEmailAddress?.emailAddress}
                        </p>

                        {/* Premium tier badge with gradient and icon */}
                        {!isLoadingDetails && ( // Show default or actual tier
                            <div className={`inline-flex items-center gap-2 px-4 py-2 mt-2 rounded-xl bg-gradient-to-r ${getTierStyling(userProfileDetails?.premiumTier).gradient} text-white font-bold text-sm shadow-lg hover:shadow-xl transition-shadow duration-300 hover:scale-[1.02]`}>
                                <Crown className="h-4 w-4" />
                                <span>{tierDisplay}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-1.5">
                    {/* Account Settings Link */}
                    <Link
                        href={`/${language}/profile/account`}
                        className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm md:text-base font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                             text-slate-700 hover:bg-slate-100 hover:text-blue-700 hover:shadow-lg hover:shadow-slate-200/40
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            ${language === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}
                    >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-100 transition-colors duration-200">
                            <Settings size={18} className="flex-shrink-0 text-slate-600 group-hover:text-blue-600" />
                        </div>
                        <span className={`flex-grow ${language === 'ar' ? 'mr-3' : ''}`}>
                            {t('profile', 'clerkAccountSettings', { defaultValue: "Account Settings" })}
                        </span>
                    </Link>

                    {/* Tab Navigation */}
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            disabled={tab.disabled}
                            aria-disabled={tab.disabled}
                            onClick={() => setActiveTab(tab.id)}
                            className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm md:text-base font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                                ${activeTab === tab.id
                                    ? `bg-gradient-to-r ${primaryGradient} text-white shadow-xl shadow-blue-200/40 ring-2 ring-blue-300`
                                    : tab.disabled
                                        ? 'text-slate-400 opacity-60 cursor-not-allowed bg-slate-50'
                                        : 'text-slate-700 hover:bg-slate-100 hover:text-blue-700 hover:shadow-lg hover:shadow-slate-200/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500'
                                }
                                ${language === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}
                                ${tab.disabled ? 'pointer-events-none' : ''}
                            `}
                        >
                            <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 
                                ${activeTab === tab.id
                                    ? 'bg-white/20'
                                    : tab.disabled
                                        ? 'bg-slate-200'
                                        : 'bg-slate-100 group-hover:bg-blue-100'
                                }`}>
                                <tab.icon size={18} className={`flex-shrink-0 transition-colors duration-200
                                    ${activeTab === tab.id
                                        ? 'text-white'
                                        : tab.disabled
                                            ? 'text-slate-400'
                                            : 'text-slate-600 group-hover:text-blue-600'
                                    }`} />
                            </div>
                            <span className={`flex-grow ${language === 'ar' ? 'mr-3' : ''}`}>
                                {t('profile', tab.labelKey)}
                            </span>
                            {tab.disabled && (
                                <span className="px-2.5 py-1 text-xs bg-slate-200 text-slate-500 rounded-lg font-medium shadow-sm">
                                    Soon
                                </span>
                            )}
                        </button>
                    ))}

                    {/* Sign Out Button */}
                    <div className="pt-4 border-t-2 border-slate-200 mt-4">
                        <button
                            onClick={() => signOut(() => { window.location.href = `/${language}`; })}
                            className={`group relative overflow-hidden w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm md:text-base font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                                 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl shadow-red-200/40
                                ${language === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" /> {/* Shimmer */}
                            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 transition-colors duration-200">
                                <LogOut size={18} className="flex-shrink-0 text-white" />
                            </div>
                            <span className={`relative flex-grow ${language === 'ar' ? 'mr-3' : ''}`}>
                                {t('profile', 'signOutButton', { defaultValue: "Sign Out" })}
                            </span>
                        </button>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default ProfileSidebar;