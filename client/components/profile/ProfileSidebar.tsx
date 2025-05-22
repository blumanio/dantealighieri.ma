// components/profile/ProfileSidebar.tsx
'use client';

import React from 'react';
import { User as UserData } from '@clerk/nextjs/server'; // For User type from Clerk
import { User as UserIcon, Heart, ListChecks, Award } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext'; // Only if 't' or 'language' is not passed as prop

interface ProfileSidebarProps {
    user: UserData; // Or the specific type from useUser() if different
    activeTab: string;
    setActiveTab: (tabId: string) => void;
    t: (namespace: string, key: string) => string; // Or your specific t function type
    language: string; // Or your specific language type
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ user, activeTab, setActiveTab, t, language }) => {
    const tabs = [
        { id: 'personalData', labelKey: 'tabsPersonalData', icon: UserIcon },
        { id: 'favorites', labelKey: 'tabsFavorites', icon: Heart },
        { id: 'applicationGuide', labelKey: 'tabsApplicationGuide', icon: ListChecks },
        { id: 'scholarships', labelKey: 'tabsScholarships', icon: Award },
    ];

    return (
        <aside className="lg:w-1/4 xl:w-1/5">
            <div className="sticky top-8 bg-white p-3 md:p-4 rounded-xl shadow-lg">
                <div className="flex flex-col items-center p-3 border-b mb-3">
                    <img
                        src={user.imageUrl}
                        alt={user.fullName || user.username || t('profile', 'userAvatarAlt') || 'User Avatar'}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full mb-3 border-2 border-primary shadow-sm"
                    />
                    <h2 className="text-lg md:text-xl font-semibold text-neutral-700 text-center">
                        {user.fullName || user.username}
                    </h2>
                    <p className="text-xs md:text-sm text-neutral-500 truncate max-w-full px-1">
                        {user.primaryEmailAddress?.emailAddress}
                    </p>
                </div>
                <nav className="space-y-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm md:text-base transition-colors duration-200
                                ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-neutral-600 hover:bg-primary/10 hover:text-primary'
                                }
                                ${language === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}
                        >
                            <tab.icon size={18} className="flex-shrink-0" />
                            <span className={language === 'ar' ? 'mr-3' : ''}>{t('profile', tab.labelKey)}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default ProfileSidebar;