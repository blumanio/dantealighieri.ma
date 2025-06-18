'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useLanguage } from '@/context/LanguageContext';
import { Loader2, UserCircle, Mail, MessageSquare, Briefcase, GraduationCap, Info, ArrowLeft, AlertTriangle, Star, FileText, Activity, Lock } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Assuming you have a Tabs component
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

// Extended interface to match the API response
interface TieredPublicProfileData {
    userId: string;
    fullName?: string | null;
    firstName?: string | null;
    imageUrl?: string;
    role?: string;
    aboutMe?: string;
    premiumTier?: string;
    profileVisibility?: string;
    favorites?: any[];
    applications?: any[];
    activity?: any[];
    favoritesCount?: number;
    applicationsCount?: number;
    viewerTier: 'guest' | 'michelangelo' | 'dante' | 'davinci';
}

// A simple component to prompt users to upgrade
const UpgradePrompt = ({ message }: { message: string }) => (
    <div className="text-center p-8 bg-neutral-100 rounded-lg my-4 border border-dashed">
        <Lock className="mx-auto h-8 w-8 text-primary mb-2" />
        <p className="font-semibold text-neutral-700">{message}</p>
        <Link href="/pricing">
            <Button className="mt-4">Upgrade Your Plan</Button>
        </Link>
    </div>
);

export default function UserPublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { lang: currentLang, userId: targetUserId } = params as { lang: string; userId: string };

    const { user: currentUser, isSignedIn } = useUser();
    const { language, t } = useLanguage();
    const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const [profileData, setProfileData] = useState<TieredPublicProfileData | null>(null);
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
                        setProfileData(result.data);
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
        }
    }, [targetUserId, API_BASE_URL]);


    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
                <h2 className="text-2xl font-semibold">An Error Occurred</h2>
                <p className="text-neutral-600">{error}</p>
                <button onClick={() => router.back()} className="mt-6 inline-flex items-center text-primary hover:text-primary-dark">
                    <ArrowLeft size={18} className="mr-2" /> Back
                </button>
            </div>
        );
    }

    return (
        <div className="bg-neutral-50 min-h-screen">
            <main className="container mx-auto px-4 py-8 md:py-12">
                <button onClick={() => router.back()} className="mb-6 inline-flex items-center text-primary hover:text-primary-dark transition-colors">
                    <ArrowLeft size={18} className="mr-2" /> {t('common', 'backButton', { defaultValue: "Back" })}
                </button>

                {profileData && (
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                        {/* Profile Header */}
                        <div className="bg-gradient-to-br from-primary to-teal-600 p-8 text-white">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <img
                                    src={profileData.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.fullName || 'U')}`}
                                    alt={profileData.fullName || 'User Avatar'}
                                    className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
                                />
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-bold">{profileData.fullName}</h1>
                                    <span className="text-white/80">{profileData.role}</span>
                                </div>
                            </div>
                        </div>

                        {/* Profile Content */}
                        <div className="p-6 md:p-8">
                            <Tabs defaultValue="about" className="w-full">
                                <TabsList>
                                    <TabsTrigger value="about"><Info className="mr-2 h-4 w-4" />About</TabsTrigger>
                                    <TabsTrigger value="favorites"><Star className="mr-2 h-4 w-4" />Favorites</TabsTrigger>
                                    <TabsTrigger value="applications"><FileText className="mr-2 h-4 w-4" />Applications</TabsTrigger>
                                    <TabsTrigger value="activity" disabled><Activity className="mr-2 h-4 w-4" />Activity</TabsTrigger>
                                </TabsList>

                                <TabsContent value="about" className="mt-4">
                                    <h3 className="text-lg font-semibold text-neutral-700 mb-2">About Me</h3>
                                    <p className="text-neutral-600 whitespace-pre-line">{profileData.aboutMe || 'No biography provided.'}</p>
                                </TabsContent>

                                <TabsContent value="favorites" className="mt-4">
                                    {profileData.viewerTier === 'guest' && <UpgradePrompt message="Log in to see this user's favorites." />}
                                    {profileData.viewerTier === 'michelangelo' && (
                                        <UpgradePrompt message={`This user has ${profileData.favoritesCount} favorite(s). Upgrade to Dante to see them.`} />
                                    )}
                                    {(profileData.viewerTier === 'dante' || profileData.viewerTier === 'davinci') && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                                                {profileData.viewerTier === 'dante' ? 'Recent Favorites' : 'All Favorites'}
                                            </h3>
                                            <ul className="space-y-2">
                                                {profileData.favorites && profileData.favorites.length > 0 ? (
                                                    profileData.favorites.map((fav: any) => (
                                                        <li key={fav._id} className="p-2 bg-neutral-100 rounded-md">{fav.universityId?.name || 'A university'}</li>
                                                    ))
                                                ) : <p>No favorites to show.</p>}
                                            </ul>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="applications" className="mt-4">
                                    {profileData.viewerTier === 'guest' && <UpgradePrompt message="Log in to see this user's applications." />}
                                    {profileData.viewerTier === 'michelangelo' && (
                                        <UpgradePrompt message={`This user has ${profileData.applicationsCount} application(s). Upgrade to Dante to see them.`} />
                                    )}
                                    {(profileData.viewerTier === 'dante' || profileData.viewerTier === 'davinci') && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                                                {profileData.viewerTier === 'dante' ? 'Recent Applications' : 'All Applications'}
                                            </h3>
                                            <ul className="space-y-2">
                                                {profileData.applications && profileData.applications.length > 0 ? (
                                                    profileData.applications.map((app: any) => (
                                                        <li key={app._id} className="p-2 bg-neutral-100 rounded-md">
                                                            {app.programName} at {app.universityName} - <span className="font-semibold">{app.status}</span>
                                                        </li>
                                                    ))
                                                ) : <p>No applications to show.</p>}
                                            </ul>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="activity" className="mt-4">
                                    <p>User activity feed is coming soon.</p>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}