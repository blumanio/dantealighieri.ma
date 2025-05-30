// client/app/[lang]/users/[userId]/page.tsx
// New file
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useLanguage } from '@/context/LanguageContext';
import { Loader2, UserCircle, Mail, MessageSquare, Briefcase, GraduationCap, Info, ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface PublicProfileData {
    userId: string;
    fullName?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string;
    role?: string;
    aboutMe?: string;
    profileVisibility?: string;
    premiumTier?: string; // Added to fix the error
    // Add other fields you made public from UserProfileDetail
    // highestEducation?: string;
}

export default function UserPublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { lang: currentLang, userId: targetUserId } = params as { lang: string; userId: string };

    const { user: currentUser, isSignedIn } = useUser();
    const { language, t } = useLanguage();
    const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const [profileData, setProfileData] = useState<PublicProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (targetUserId) {
            const fetchProfile = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const response = await fetch(`${API_BASE_URL}/api/users/${targetUserId}/profile`);
                    if (!response.ok) {
                        const errData = await response.json().catch(() => ({ message: 'User not found or profile is private.' }));
                        throw new Error(errData.message);
                    }
                    const result = await response.json();
                    if (result.success && result.data) {
                        // Additional client-side check for visibility, though API should handle primary restriction
                        if (result.data.profileVisibility === 'private' && currentUser?.id !== targetUserId) {
                            setError(t('profile', 'profileIsPrivate', { defaultValue: "This profile is private." }));
                            setProfileData(null); // Clear any potentially loaded data
                        } else {
                            setProfileData(result.data);
                        }
                    } else {
                        throw new Error(result.message || 'Failed to load profile.');
                    }
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProfile();
        } else {
            setError("User ID not provided.");
            setIsLoading(false);
        }
    }, [targetUserId, API_BASE_URL, t, currentUser?.id]);

    const handleStartMessaging = () => {
        if (!isSignedIn) {
            // Optionally, redirect to sign-in with a redirect back URL
            router.push(`/${language}/sign-in?redirect_url=${encodeURIComponent(window.location.pathname)}`);
            return;
        }
        if (currentUser?.id === targetUserId) {
            alert(t('messaging', 'cannotMessageSelf', { defaultValue: "You cannot message yourself." }));
            return;
        }
        // Redirect to the messages tab on the current user's profile, with a query param to open/create chat with targetUserId
        router.push(`/${language}/profile?tab=messages&openConversationWith=${targetUserId}`);
    };

    const roleDisplay = profileData?.role
        ? t('profileFieldLabels', `role_${profileData.role}`, { defaultValue: profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1) })
        : "";
    const tierDisplay = profileData?.premiumTier // Assuming premiumTier is added to PublicProfileData and API
        ? t('profileFieldLabels', `tier_${profileData.premiumTier}`, { defaultValue: profileData.premiumTier })
        : "";


    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen"><main className="flex-grow flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></main></div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-neutral-100">

            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                <button onClick={() => router.back()} className="mb-6 inline-flex items-center text-primary hover:text-primary-dark transition-colors">
                    <ArrowLeft size={18} className="mr-2" /> {t('common', 'backButton', { defaultValue: "Back" })}
                </button>

                {error ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
                        <h2 className="text-2xl font-semibold text-neutral-700 mb-2">{t('common', 'errorOccurredTitle', { defaultValue: "An Error Occurred" })}</h2>
                        <p className="text-neutral-600">{error}</p>
                    </div>
                ) : profileData ? (
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-br from-primary to-teal-600 p-8 text-white">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <img
                                    src={profileData.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.fullName || 'U')}&background=random&color=fff&size=128`}
                                    alt={profileData.fullName || 'User Avatar'}
                                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                />
                                <div className={language === 'ar' ? 'text-right sm:text-right' : 'text-left sm:text-left'}>
                                    <h1 className="text-3xl sm:text-4xl font-bold">{profileData.fullName}</h1>
                                    {roleDisplay && (
                                        <span className={`mt-1 inline-block text-sm font-semibold px-3 py-1 rounded-full shadow-sm
                                            ${profileData.role === 'mentor' ? 'bg-sky-400 text-sky-900' :
                                                profileData.role === 'alumni' ? 'bg-emerald-400 text-emerald-900' :
                                                    'bg-white/30 text-white'}`}>
                                            {roleDisplay}
                                        </span>
                                    )}
                                    {/* tierDisplay can be added here if premiumTier is part of PublicProfileData */}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 space-y-6">
                            {profileData.aboutMe && (
                                <div>
                                    <h3 className="text-lg font-semibold text-neutral-700 mb-2 flex items-center">
                                        <Info size={20} className="mr-2 text-primary" /> {t('profileFieldLabels', 'aboutMeLabel', { defaultValue: "About Me" })}
                                    </h3>
                                    <p className="text-neutral-600 whitespace-pre-line leading-relaxed">{profileData.aboutMe}</p>
                                </div>
                            )}

                            {/* Example of other public fields you might add to PublicProfileData and display */}
                            {/* {profileData.highestEducation && (
                                <div>
                                    <h3 className="text-lg font-semibold text-neutral-700 mb-2 flex items-center">
                                        <GraduationCap size={20} className="mr-2 text-primary"/> {t('profileFieldLabels','highestLevelOfEducationLabel')}
                                    </h3>
                                    <p className="text-neutral-600">{t('profileFieldLabels',`educationLevel${profileData.highestEducation.replace(/\s+/g, '')}`)}</p>
                                </div>
                            )} */}

                            {currentUser?.id !== targetUserId && (
                                <div className="pt-6 border-t border-neutral-200">
                                    <button
                                        onClick={handleStartMessaging}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg"
                                    >
                                        <MessageSquare size={20} /> {t('messaging', 'startChatWith', { name: profileData.firstName || 'this user' })}
                                    </button>
                                </div>
                            )}

                            {currentUser?.id === targetUserId && (
                                <div className="pt-6 border-t border-neutral-200">
                                    <Link
                                        href={`/${language}/profile?tab=userProfileDetails`}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors shadow-md hover:shadow-lg"
                                    >
                                        <UserCircle size={20} /> {t('profile', 'editYourProfile', { defaultValue: "Edit Your Profile" })}
                                    </Link>
                                </div>
                            )}


                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <UserCircle size={48} className="mx-auto text-neutral-400 mb-4" />
                        <h2 className="text-2xl font-semibold text-neutral-700 mb-2">{t('profile', 'profileUnavailableTitle', { defaultValue: "Profile Not Available" })}</h2>
                        <p className="text-neutral-600">{t('profile', 'profileUnavailableMessage', { defaultValue: "The requested user profile could not be loaded or does not exist." })}</p>
                    </div>
                )}
            </main>

        </div>
    );
}
