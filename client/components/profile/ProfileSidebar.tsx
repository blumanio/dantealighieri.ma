// File: client/components/profile/ProfileSidebar.tsx
// Add 'tabsTrackedUniversities' to the tabs array
// Ensure the corresponding translation key is added to client/app/i18n/translations.ts
'use client';

import React, { useState, useEffect } from 'react';
import { User as UserData } from '@clerk/nextjs/server';
import {
    User as UserIcon, Heart, ListChecks, Award, LogOut, Settings, MessageSquare, Mail as MailIcon, Briefcase, Bookmark // Added Bookmark for tracked unis
} from 'lucide-react';
import Link from 'next/link';
import { useClerk } from '@clerk/nextjs';

interface UserProfileDetails {
    role?: string;
    premiumTier?: string;
}

interface ProfileSidebarProps {
    user: UserData;
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
        //{ id: 'userProfileDetails', labelKey: 'tabsUserProfileDetails', icon: UserIcon },
        { id: 'messages', labelKey: 'tabsMessages', icon: MailIcon },
        { id: 'favorites', labelKey: 'tabsFavorites', icon: Heart },
        // Renaming for clarity and adding new one
        { id: 'trackedCourses', labelKey: 'tabsTrackedCourses', icon: ListChecks },
        { id: 'trackedUniversities', labelKey: 'tabsTrackedUniversities', icon: Bookmark }, // New Tab
        { id: 'scholarships', labelKey: 'tabsScholarships', icon: Award },
        //{ id: 'applicationGuide', labelKey: 'tabsApplicationGuide', icon: Briefcase }, // Changed icon
        { id: 'premiumApplicationHub', labelKey: 'premiumApplicationHub', icon: MessageSquare },
    ];

    const getTierColorClass = (tier: string | undefined) => {
        switch (tier) {
            case 'Maestro': return 'ring-yellow-400 shadow-yellow-300/50';
            case 'Artista': return 'ring-sky-400 shadow-sky-300/50';
            case 'Amico': return 'ring-green-400 shadow-green-300/50';
            default: return 'ring-neutral-300';
        }
    };

    const roleDisplay = userProfileDetails?.role
        ? t('profileFieldLabels', `role_${userProfileDetails.role}`, { defaultValue: userProfileDetails.role.charAt(0).toUpperCase() + userProfileDetails.role.slice(1) })
        : t('profileFieldLabels', 'role_student', { defaultValue: "Student" });

    const tierDisplay = userProfileDetails?.premiumTier
        ? t('profileFieldLabels', `tier_${userProfileDetails.premiumTier}`, { defaultValue: userProfileDetails.premiumTier })
        : t('profileFieldLabels', 'tier_Amico', { defaultValue: "Amico" });

    return (
        <aside className="lg:w-1/4 xl:w-1/5">
            <div className="sticky top-8 bg-white p-3 md:p-4 rounded-xl shadow-xl border border-neutral-200">
                <div className="flex flex-col items-center p-3 border-b border-neutral-200 mb-3">
                    <div className="relative mb-3">
                        <img
                            src={user.imageUrl}
                            alt={user.fullName || user.username || t('profile', 'userAvatarAlt') || 'User Avatar'}
                            className={`w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 shadow-md 
                                        ${isLoadingDetails ? 'animate-pulse bg-neutral-300' : getTierColorClass(userProfileDetails?.premiumTier)}`}
                        />
                        {!isLoadingDetails && userProfileDetails?.role && (
                            <span title={roleDisplay} className={`absolute -bottom-1 -right-2 text-[0.6rem] font-semibold px-1.5 py-0.5 rounded-full shadow
                                         ${userProfileDetails.role === 'mentor' ? 'bg-blue-500 text-white' :
                                    userProfileDetails.role === 'alumni' ? 'bg-green-500 text-white' :
                                        userProfileDetails.role === 'student' ? 'bg-teal-500 text-white' : 'bg-gray-400 text-white'}`}>
                                {roleDisplay.substring(0, 3).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <h2 className="text-lg md:text-xl font-semibold text-neutral-800 text-center truncate max-w-full px-1">
                        {user.fullName || user.username || t('profile', 'userFullNameMissing', { defaultValue: "User Name" })}
                    </h2>
                    <p className="text-xs md:text-sm text-neutral-500 truncate max-w-full px-1">
                        {user.primaryEmailAddress?.emailAddress}
                    </p>
                    {!isLoadingDetails && userProfileDetails?.premiumTier && (
                        <span className={`mt-1.5 text-xs font-bold px-2 py-0.5 rounded-full
                                        ${userProfileDetails.premiumTier === 'Maestro' ? 'bg-yellow-100 text-yellow-700' :
                                userProfileDetails.premiumTier === 'Artista' ? 'bg-sky-100 text-sky-700' :
                                    'bg-green-100 text-green-700'}`}>
                            {tierDisplay} Tier
                        </span>
                    )}
                </div>
                <nav className="space-y-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`text-white w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm md:text-base transition-all duration-200 ease-in-out
                                ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-md scale-105'
                                    : 'text-neutral-600 hover:bg-primary/10 hover:text-primary hover:translate-x-1'
                                }
                                ${language === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}
                        >
                            <tab.icon size={18} className="flex-shrink-0" />
                            <span className={`flex-grow ${language === 'ar' ? 'mr-3' : ''}`}>{t('profile', tab.labelKey)}</span>
                        </button>
                    ))}
                    <Link
                        href={`/${language}/profile/account`}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm md:text-base transition-all duration-200 ease-in-out mt-4 border-t pt-3
                            text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 hover:translate-x-1
                            ${language === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}
                    >
                        <Settings size={18} className="flex-shrink-0" />
                        <span className={`flex-grow ${language === 'ar' ? 'mr-3' : ''}`}>{t('profile', 'clerkAccountSettings', { defaultValue: "Account Settings" })}</span>
                    </Link>
                    <button
                        onClick={() => signOut(() => { window.location.href = `/${language}`; })}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm md:text-base transition-all duration-200 ease-in-out text-red-600 hover:bg-red-50 hover:text-red-700 hover:translate-x-1
                            ${language === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}
                    >
                        <LogOut size={18} className="flex-shrink-0" />
                        <span className={`flex-grow ${language === 'ar' ? 'mr-3' : ''}`}>{t('profile', 'signOutButton', { defaultValue: "Sign Out" })}</span>
                    </button>
                </nav>
            </div>
        </aside>
    );
};

export default ProfileSidebar;
