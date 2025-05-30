// app/[lang]/university-hubs/[universitySlug]/page.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    School, BookOpen, Users, MessageSquare, Home as HomeIcon, Briefcase,
    Loader2, AlertTriangle, ExternalLink, MapPin, PlusCircle, Send,
    CalendarDays, UsersRound, Target, TrendingUp, Shield, Beer, Building, Star, BookCopy, Landmark, Drama, Route
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useLanguage } from '@/context/LanguageContext';
import PaginatedCourses from '@/components/PaginatedCourses';
import CommunityPostCard, { CommunityPost } from '@/components/university-hub/CommunityPostCard';

// Interfaces (Course, CityStudentData, UniversityDetails) remain the same as the previous version
interface Course {
    _id: string; nome: string; link: string; tipo: string; uni: string;
    accesso: string; area: string; lingua: string; comune: string;
    uniSlug?: string;
}

interface CityStudentData {
    averageRent?: string;
    livingCostIndex?: string;
    studentPopulation?: string;
    publicTransport?: string;
    nightlife?: string;
    safety?: string;
    culturalOfferings?: string;
    sportsFacilities?: string;
}

interface UniversityDetails {
    name: string;
    slug: string;
    location?: string;
    description?: string;
    longDescription?: string;
    logoUrl?: string;
    bannerImageUrl?: string;
    websiteUrl?: string;
    establishedYear?: number;
    studentFacultyRatio?: string;
    internationalStudentPercentage?: number;
    ranking?: string;
    cityData?: CityStudentData;
}


// Mock data store - in a real app, this would come from an API
const mockUniversityDataStore: Record<string, UniversityDetails> = {
    'university-of-bologna': {
        name: 'University of Bologna',
        slug: 'university-of-bologna',
        location: 'Bologna, Emilia-Romagna',
        description: 'The oldest university in continuous operation in the Western world.',
        longDescription: 'Founded in 1088, the Alma Mater Studiorum - University of Bologna is considered the oldest university in the Western world. It is a comprehensive public university that offers a wide range of programs across various disciplines. Known for its rich history, cultural significance, and high academic standards, it attracts students from all over Italy and the world.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/04/SigilloUniversitaBologna.svg/1200px-SigilloUniversitaBologna.svg.png',
        bannerImageUrl: 'https://images.unsplash.com/photo-1583394800089-b19fafcb0582?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9sb2duYSUyMGl0YWx5fGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=60',
        websiteUrl: 'https://www.unibo.it/en',
        establishedYear: 1088,
        studentFacultyRatio: '20:1',
        internationalStudentPercentage: 15,
        ranking: "World's Oldest University",
        cityData: {
            averageRent: '€450 - €700 (single room)',
            livingCostIndex: 'Moderate',
            studentPopulation: '~87,000',
            publicTransport: 'Good (Bus, Bike-sharing)',
            nightlife: 'Vibrant & Historic',
            safety: 'Generally Safe',
            culturalOfferings: 'Museums, Theaters, Historical Sites',
            sportsFacilities: 'University sports center (CUSB), various gyms',
        },
    },
    'politecnico-di-milano': {
        name: 'Politecnico di Milano',
        slug: 'politecnico-di-milano',
        location: 'Milan, Lombardy',
        description: 'A leading science and technology university in Europe.',
        longDescription: 'Established in 1863, Politecnico di Milano is one of the most outstanding technical universities in Europe. It trains engineers, architects, and industrial designers, with a strong focus on research and innovation. The university has several campuses in Milan and other nearby Italian cities. It boasts strong international links and a high graduate employment rate.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Politecnico_di_Milano_logo.svg/1280px-Politecnico_di_Milano_logo.svg.png',
        bannerImageUrl: 'https://images.unsplash.com/photo-1521750284269-f172db997a6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWlsYW4lMjBkdW9tb3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1200&q=60',
        websiteUrl: 'https://www.polimi.it/en/',
        establishedYear: 1863,
        studentFacultyRatio: '18:1',
        internationalStudentPercentage: 28,
        ranking: "Top 20 Technical Universities Worldwide (QS)",
        cityData: {
            averageRent: '€600 - €900 (single room)',
            livingCostIndex: 'High',
            studentPopulation: '~47,000',
            publicTransport: 'Excellent (Metro, Tram, Bus)',
            nightlife: 'Dynamic & Diverse',
            safety: 'Good, typical big city awareness needed',
            culturalOfferings: 'World-class Museums, Fashion, Design Events',
            sportsFacilities: 'Multiple sports centers (Giuriati, Mancinelli), agreements with private gyms',
        },
    },
};

// Skeleton Components
const BannerSkeleton = () => (
    <div className="w-full h-48 sm:h-60 md:h-72 bg-neutral-300 dark:bg-neutral-700 animate-pulse"></div>
);

const LogoSkeleton = ({ className }: { className?: string }) => (
    <div className={`bg-neutral-300 dark:bg-neutral-700 animate-pulse rounded-full shadow-lg ${className || 'w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40'}`}></div>
);


export default function UniversityHubPage() {
    const params = useParams();
    console.log('UniversityHubPage params:', params);
    const universitySlug = decodeURIComponent(params?.universitySlug as string || '');

    const { language, t } = useLanguage();
    const { isSignedIn, user } = useUser();

    const [universityDetails, setUniversityDetails] = useState<UniversityDetails | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
    // Start with isLoading true to show skeletons initially
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'about' | 'courses' | 'network_discussion' | 'network_housing' | 'network_studygroups'>('courses');

    const [showNewPostForm, setShowNewPostForm] = useState(false);
    const [newPostType, setNewPostType] = useState<CommunityPost['postType']>('discussion');
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [isSubmittingPost, setIsSubmittingPost] = useState(false);

    const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const fetchCommunityPosts = useCallback(async (filterType?: CommunityPost['postType'] | string[]) => {
        // ... (same as previous version)
        if (!universitySlug) return;
        let effectiveFilterTypeQuery = '';
        if (typeof filterType === 'string') {
            effectiveFilterTypeQuery = `?type=${filterType}`;
        } else if (Array.isArray(filterType)) {
            effectiveFilterTypeQuery = filterType.map(ft => `type=${ft}`).join('&');
             if(effectiveFilterTypeQuery) effectiveFilterTypeQuery = `?${effectiveFilterTypeQuery}`;
        }
        const url = `${API_BASE_URL}/api/university-hubs/${universitySlug}/community-posts${effectiveFilterTypeQuery}`;
        try {
            const postsResponse = await fetch(url);
            if (!postsResponse.ok) {
                const errorData = await postsResponse.json().catch(() => ({ message: "Error fetching community posts" }));
                setCommunityPosts([]); return;
            }
            const postsData = await postsResponse.json();
            setCommunityPosts(postsData.data || []);
        } catch (fetchError: any) {
            setError(prev => prev ? `${prev}; FetchPostsError: ${fetchError.message}` : `WorkspacePostsError: ${fetchError.message}`);
            setCommunityPosts([]);
        }
    }, [API_BASE_URL, universitySlug]);

    useEffect(() => {
        const fetchData = async () => {
            if (!universitySlug) {
                setIsLoading(false);
                setError("University slug not found.");
                return;
            }
            // Keep isLoading true until all initial data is attempted
            // setIsLoading(true); // Already set initially

            // Simulate API delay for fetching university details
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

            const detailsFromMock = mockUniversityDataStore[universitySlug];
            if (false) {
                setUniversityDetails(detailsFromMock);
            } else {
                const fallbackName = universitySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                setUniversityDetails({
                    name: fallbackName,
                    slug: universitySlug,
                    location: t('universityHubs', 'unknownLocation', { defaultValue: 'Location not specified' }),
                    description: t('universityHubs', 'noDescription', { defaultValue: 'No detailed description available.' }),
                    longDescription: t('universityHubs', 'noDetailedDescription', { defaultValue: 'Detailed information about this university is not yet available.' }),
                });
            }

            try {
                const coursesApiUrl = `${API_BASE_URL}/api/courses?uni=${universityDetails?.slug || universitySlug}`;
                console.log(`Fetching courses from universityDetails: ${universityDetails}`);
                const coursesResponse = await fetch(coursesApiUrl);
                if (!coursesResponse.ok) {
                    const uniDisplayNameForError = universityDetails?.name || universitySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    throw new Error(t('universityHubs', 'errorFetchingCourses', { uni: uniDisplayNameForError }));
                }
                const coursesData = await coursesResponse.json();
                setCourses(coursesData || []);

                if (activeTab === 'network_discussion') await fetchCommunityPosts('discussion');
                else if (activeTab === 'network_housing') await fetchCommunityPosts(['housing_seeking', 'housing_offering']);
                else if (activeTab === 'network_studygroups') await fetchCommunityPosts(['study_group_looking', 'study_group_forming']);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false); // Set loading to false after all data fetching attempts
            }
        };
        fetchData();
    }, [universitySlug, t, API_BASE_URL, fetchCommunityPosts, activeTab]); // Removed universityDetails?.name from deps to avoid re-fetch loops

    const handleTabChange = (tabId: string) => {
        // ... (same as previous, ensures posts are fetched for new tab if needed)
        const newActiveTab = tabId as typeof activeTab;
        setActiveTab(newActiveTab);
        setShowNewPostForm(false);
        if (newActiveTab === 'network_discussion') fetchCommunityPosts('discussion');
        else if (newActiveTab === 'network_housing') fetchCommunityPosts(['housing_seeking', 'housing_offering']);
        else if (newActiveTab === 'network_studygroups') fetchCommunityPosts(['study_group_looking', 'study_group_forming']);
    };

    // handleCreatePost, handleCommentSubmit, openNewPostForm, renderPostsForTab functions remain the same
        const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignedIn || !user || !universitySlug) {
            alert(t('universityHubs', 'signInToPost', { defaultValue: "Please sign in to post." }));
            return;
        }
        if (!newPostContent.trim()) {
            alert(t('universityHubs', 'postContentRequired', { defaultValue: "Post content cannot be empty." }));
            return;
        }
        setIsSubmittingPost(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/university-hubs/${universitySlug}/community-posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postType: newPostType,
                    title: newPostTitle || undefined,
                    content: newPostContent
                }),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Failed to post." }));
                throw new Error(errorData.message);
            }
            const newPostData = await response.json();
            if (newPostData.success && newPostData.data) {
                 if (
                    (activeTab === 'network_discussion' && newPostData.data.postType === 'discussion') ||
                    (activeTab === 'network_housing' && (newPostData.data.postType === 'housing_seeking' || newPostData.data.postType === 'housing_offering')) ||
                    (activeTab === 'network_studygroups' && (newPostData.data.postType === 'study_group_looking' || newPostData.data.postType === 'study_group_forming'))
                ) {
                    setCommunityPosts(prev => [newPostData.data, ...prev]);
                } else {
                     await fetchCommunityPosts(newPostData.data.postType);
                }
            }
            setShowNewPostForm(false); setNewPostTitle(''); setNewPostContent('');
        } catch (error: any) {
            alert(t('universityHubs', 'errorCreatingPost', { defaultValue: "Error creating post: " }) + (error.message || ""));
        }
        finally { setIsSubmittingPost(false); }
    };

    const handleCommentSubmit = async (postId: string, commentText: string) => {
        if (!isSignedIn || !postId || !commentText.trim() || !universitySlug) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/university-hubs/${universitySlug}/community-posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: commentText }),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Failed to add comment." }));
                throw new Error(errorData.message);
            }
            const addedComment = await response.json();
            setCommunityPosts(prevPosts => prevPosts.map(p =>
                p._id === postId ? { ...p, comments: [...(p.comments || []), addedComment.data] } : p
            ));
        } catch (error: any) {
            alert(t('universityHubs', 'errorAddingComment', { defaultValue: "Failed to add comment:" }) + error.message);
        }
    };

    const openNewPostForm = (type: CommunityPost['postType']) => {
        setNewPostType(type);
        setShowNewPostForm(true);
        setNewPostTitle('');
        setNewPostContent('');
    };

    const renderPostsForTab = (currentTab: typeof activeTab) => {
        let postsToRender: CommunityPost[] = [];
        let noPostsMessageKey = 'noPostsYet';
        let typeForMessage: any = 'items';

        if (currentTab === 'network_discussion') {
            postsToRender = communityPosts.filter(p => p.postType === 'discussion');
            noPostsMessageKey = 'noDiscussionsYet';
            typeForMessage = t('universityHubs', 'discussionsTitle', { defaultValue: 'Discussions' });
        } else if (currentTab === 'network_housing') {
            postsToRender = communityPosts.filter(p => p.postType === 'housing_seeking' || p.postType === 'housing_offering');
            noPostsMessageKey = 'noHousingPostsYet';
            typeForMessage = t('universityHubs', 'housingBoardTitle', { defaultValue: 'Housing Ads' });
        } else if (currentTab === 'network_studygroups') {
            postsToRender = communityPosts.filter(p => p.postType === 'study_group_looking' || p.postType === 'study_group_forming');
            noPostsMessageKey = 'noStudyGroupsYet';
            typeForMessage = t('universityHubs', 'studyGroupsTitle', { defaultValue: 'Study Groups' });
        }

        if (postsToRender.length === 0 && isLoading) { // Show loader while fetching posts for a tab
             return <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /></div>;
        }
        if (postsToRender.length === 0 && !isLoading) {
            return <p className="text-textSecondary dark:text-neutral-400 text-center py-10">{t('universityHubs', noPostsMessageKey, { type: typeForMessage, defaultValue: `No ${typeForMessage} yet. Be the first!` })}</p>;
        }

        return postsToRender.map(post => (
            <CommunityPostCard
                key={post._id}
                post={{ ...post, universitySlug: universitySlug }}
                onCommentSubmit={handleCommentSubmit}
            />
        ));
    };


    const renderStatCard = (IconComponent: React.ElementType, label: string, value?: string | number) => {
        // ... (same as previous version)
        if (!value && typeof value !== 'number') return null; // Allow 0 to be displayed
        return (
            <div className="bg-neutral-100 dark:bg-neutral-700/50 p-4 rounded-lg shadow flex items-center">
                <IconComponent size={24} className="text-primary mr-3 flex-shrink-0" />
                <div>
                    <p className="text-sm text-textSecondary dark:text-neutral-400">{label}</p>
                    <p className="text-md font-semibold text-textPrimary dark:text-neutral-100">{value}</p>
                </div>
            </div>
        );
    };

    const universityName = universityDetails?.name || universitySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    // Global loading state for the initial page structure (skeletons)
    if (isLoading && !universityDetails) return (
         <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900">
            <main className="flex-grow">
                <div className="relative h-48 sm:h-60 md:h-72_"><BannerSkeleton /></div>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 sm:-mt-16 md:-mt-20 relative z-10">
                        <div className="mb-4 sm:mb-0 sm:mr-6">
                            <LogoSkeleton className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 border-4 border-white dark:border-neutral-800" />
                        </div>
                        <div className="text-center sm:text-left pb-4 flex-grow">
                            <div className="h-8 bg-neutral-300 dark:bg-neutral-700 rounded w-3/4 sm:w-1/2 mb-2 animate-pulse"></div>
                            <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-1/2 sm:w-1/3 mb-2 animate-pulse"></div>
                            <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-1/3 sm:w-1/4 animate-pulse"></div>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-2 sm:px-4 py-8">
                    <div className="mb-8 h-12 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div> {/* Tab skeleton */}
                    <div className="bg-white dark:bg-neutral-800 p-4 sm:p-6 md:p-8 rounded-xl shadow-xl min-h-[400px]">
                        <div className="h-8 bg-neutral-300 dark:bg-neutral-700 rounded w-1/2 mb-6 animate-pulse"></div>
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>)}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );

    if (error && !isLoading) return ( // Show error only if not loading anymore
        <div className="flex flex-col min-h-screen"><main className="flex-grow flex items-center justify-center p-4 text-center text-red-600 dark:text-red-400"><AlertTriangle className="inline mr-2" />{error}</main></div>
    );


    return (
        <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 text-textPrimary dark:text-neutral-100">
            <main className="flex-grow">
                {/* New Header Profile Section */}
                <div className="bg-white dark:bg-neutral-800 shadow-sm">
                    <div className="relative h-48 sm:h-60 md:h-72">
                        {isLoading && !universityDetails?.bannerImageUrl ? (
                            <BannerSkeleton />
                        ) : universityDetails?.bannerImageUrl ? (
                            <Image
                                src={universityDetails.bannerImageUrl}
                                alt={`${universityName} banner`}
                                layout="fill"
                                objectFit="cover"
                                priority // For LCP
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary via-teal-600 to-secondary"></div> // Fallback gradient
                        )}
                    </div>
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 sm:-mt-16 md:-mt-20 relative z-10">
                            {/* Logo Section (Left) */}
                            <div className="mb-2 sm:mb-0 sm:mr-6 flex-shrink-0">
                                {isLoading && !universityDetails?.logoUrl ? (
                                    <LogoSkeleton className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 border-4 border-white dark:border-neutral-800" />
                                ) : universityDetails?.logoUrl ? (
                                    <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 border-4 border-white dark:border-neutral-800 rounded-full shadow-lg overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                                        <Image
                                            src={universityDetails.logoUrl}
                                            alt={`${universityName} logo`}
                                            layout="fill"
                                            objectFit="contain"
                                        />
                                    </div>
                                ) : (
                                     <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 border-4 border-white dark:border-neutral-800 rounded-full shadow-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                                        <School size={48} className="text-neutral-500 dark:text-neutral-400" />
                                    </div>
                                )}
                            </div>
                            {/* Info Section (Right) */}
                            <div className="text-center sm:text-left py-4 flex-grow">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-textPrimary dark:text-white mb-1">{universityName}</h1>
                                {universityDetails?.location && (
                                    <p className="text-sm sm:text-md text-textSecondary dark:text-neutral-400 flex items-center justify-center sm:justify-start mb-1">
                                        <MapPin size={16} className="mr-1.5" />{universityDetails.location}
                                    </p>
                                )}
                                <div className="flex items-center justify-center sm:justify-start space-x-4">
                                    {universityDetails?.websiteUrl && (
                                        <a
                                            href={universityDetails.websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs sm:text-sm text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary transition-colors flex items-center"
                                        >
                                            {t('universityHubs', 'visitWebsite', { defaultValue: 'Website' })} <ExternalLink size={12} className="ml-1" />
                                        </a>
                                    )}
                                    {universityDetails?.ranking && (
                                        <p className="text-xs sm:text-sm text-textSecondary dark:text-neutral-400 flex items-center">
                                            <Star size={14} className="inline mr-1.5 text-yellow-500" />
                                            {universityDetails.ranking}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="container mx-auto px-2 sm:px-4 py-8">
                     <div className="mb-8 border-b border-neutral-300 dark:border-neutral-700 flex items-center justify-start sm:justify-start overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-600 scrollbar-track-transparent">
                        {[
                            //{ id: 'about', labelKey: 'aboutTab', icon: School },
                            { id: 'courses', labelKey: 'coursesTab', icon: BookOpen },
                            { id: 'network_discussion', labelKey: 'discussionsTab', icon: MessageSquare },
                            { id: 'network_housing', labelKey: 'housingTab', icon: HomeIcon },
                            //{ id: 'network_studygroups', labelKey: 'studyGroupsTab', icon: Users },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex-shrink-0 flex items-center px-3 py-3 sm:px-5 sm:py-3 -mb-px text-sm sm:text-base font-medium border-b-2 transition-all duration-150 ease-in-out whitespace-nowrap transform focus:outline-none
                                    ${activeTab === tab.id
                                        ? 'border-primary text-primary bg-primary/10 dark:bg-primary/20 scale-105'
                                        : 'text-white border-transparent text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary-light hover:bg-neutral-100 dark:hover:bg-neutral-700/50 hover:border-primary/70'}`
                                }
                            >
                                <tab.icon size={18} className="mr-2" />
                                {t('universityHubs', tab.labelKey, { defaultValue: tab.id.charAt(0).toUpperCase() + tab.id.slice(1).replace('_', ' ') })}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white dark:bg-neutral-800 p-4 sm:p-6 md:p-8 rounded-xl shadow-xl min-h-[400px]">
                        {/* About Tab Content - remains the same */}
                        {activeTab === 'about' && universityDetails && (
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-semibold text-textPrimary dark:text-neutral-100 mb-6">{t('universityHubs', 'aboutUniversityTitle', { uni: universityDetails.name })}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                                    {renderStatCard(CalendarDays, t('universityHubs', 'establishedLabel', { defaultValue: "Established" }), universityDetails.establishedYear)}
                                    {renderStatCard(UsersRound, t('universityHubs', 'studentFacultyRatioLabel', { defaultValue: "Student-Faculty Ratio" }), universityDetails.studentFacultyRatio)}
                                    {renderStatCard(Target, t('universityHubs', 'internationalStudentsLabel', { defaultValue: "Int'l Students" }), universityDetails.internationalStudentPercentage ? `${universityDetails.internationalStudentPercentage}%` : undefined)}
                                </div>
                                <p className="text-textSecondary dark:text-neutral-300 leading-relaxed whitespace-pre-line mb-8">{universityDetails.longDescription || universityDetails.description}</p>

                                {universityDetails.cityData && (
                                    <>
                                        <h3 className="text-xl sm:text-2xl font-semibold text-textPrimary dark:text-neutral-100 mb-6 border-t border-neutral-200 dark:border-neutral-700 pt-6 mt-6">{t('universityHubs', 'citySnapshotTitle', { city: universityDetails.location?.split(',')[0] || 'City' })}</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                            {renderStatCard(HomeIcon, t('universityHubs', 'avgRentLabel', { defaultValue: "Avg. Rent (Single Room)" }), universityDetails.cityData.averageRent)}
                                            {renderStatCard(TrendingUp, t('universityHubs', 'livingCostLabel', { defaultValue: "Living Cost Index" }), universityDetails.cityData.livingCostIndex)}
                                            {renderStatCard(Users, t('universityHubs', 'studentPopulationLabel', { defaultValue: "Student Population" }), universityDetails.cityData.studentPopulation)}
                                            {renderStatCard(Route, t('universityHubs', 'publicTransportLabel', { defaultValue: "Public Transport" }), universityDetails.cityData.publicTransport)}
                                            {renderStatCard(Beer, t('universityHubs', 'nightlifeLabel', { defaultValue: "Nightlife" }), universityDetails.cityData.nightlife)}
                                            {renderStatCard(Shield, t('universityHubs', 'safetyLabel', { defaultValue: "Safety" }), universityDetails.cityData.safety)}
                                            {renderStatCard(Drama, t('universityHubs', 'culturalOfferingsLabel', { defaultValue: "Cultural Offerings" }), universityDetails.cityData.culturalOfferings)}
                                            {renderStatCard(Landmark, t('universityHubs', 'sportsFacilitiesLabel', { defaultValue: "Sports Facilities" }), universityDetails.cityData.sportsFacilities)}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                        {/* Courses Tab Content - remains the same */}
                        {activeTab === 'courses' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-semibold text-textPrimary dark:text-neutral-100">
                                        {t('universityHubs', 'coursesOfferedTitle', { uni: universityName })}
                                    </h2>
                                    {isLoading && courses.length === 0 && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
                                </div>
                                {!isLoading && courses.length === 0 ?
                                    <p className="text-textSecondary dark:text-neutral-400 text-center py-10">{t('universityHubs', 'noCoursesListed', { uni: universityName })}</p>
                                    : <PaginatedCourses filteredCourses={courses} />
                                }
                            </div>
                        )}
                        {/* Network Discussion Tab Content - remains the same */}
                        {activeTab === 'network_discussion' && (
                             <div>
                                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                                    <h2 className="text-2xl font-semibold text-textPrimary dark:text-neutral-100">{t('universityHubs', 'discussionsTitle')}</h2>
                                    {isSignedIn ? <button onClick={() => openNewPostForm('discussion')} className="btn-primary text-sm py-2 px-4"><PlusCircle size={16} className="inline mr-1.5" /> {t('universityHubs', 'newDiscussionButton')}</button>
                                        : <p className="text-sm text-textSecondary dark:text-neutral-400">{t('universityHubs', 'signInToPost')}</p>}
                                </div>
                                {showNewPostForm && newPostType === 'discussion' && (
                                    <form onSubmit={handleCreatePost} className="mb-6 p-4 border dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-700/30 space-y-4 shadow-sm">
                                        <h3 className="text-lg font-medium text-textPrimary dark:text-neutral-100">{t('universityHubs', 'newDiscussionFormTitle')}</h3>
                                        <input type="text" value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} placeholder={t('universityHubs', 'postTitlePlaceholder')} className="w-full p-2.5 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-1 focus:ring-primary focus:border-primary bg-white dark:bg-neutral-700 dark:text-neutral-100" />
                                        <textarea value={newPostContent} onChange={e => setNewPostContent(e.target.value)} placeholder={t('universityHubs', 'postContentPlaceholder')} rows={4} className="w-full p-2.5 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-1 focus:ring-primary focus:border-primary bg-white dark:bg-neutral-700 dark:text-neutral-100" required></textarea>
                                        <div className="flex gap-2 justify-end">
                                            <button type="button" onClick={() => setShowNewPostForm(false)} className="btn bg-neutral-200 dark:bg-neutral-600 text-textPrimary dark:text-neutral-100 hover:bg-neutral-300 dark:hover:bg-neutral-500 text-sm py-1.5 px-3">{t('common', 'cancel')}</button>
                                            <button type="submit" disabled={isSubmittingPost} className="btn-primary text-sm py-1.5 px-3 disabled:opacity-70 flex items-center">
                                                {isSubmittingPost && <Loader2 className="animate-spin h-4 w-4 mr-2" />} {t('universityHubs', 'submitPost')}
                                            </button>
                                        </div>
                                    </form>
                                )}
                                <div className="space-y-4">
                                    {renderPostsForTab('network_discussion')}
                                </div>
                            </div>
                        )}
                        {/* Network Housing Tab Content - remains the same */}
                        {activeTab === 'network_housing' && (
                             <div>
                                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                                    <h2 className="text-2xl font-semibold text-textPrimary dark:text-neutral-100">{t('universityHubs', 'housingBoardTitle')}</h2>
                                    {isSignedIn ? (
                                        <div className="flex gap-2">
                                            <button onClick={() => openNewPostForm('housing_seeking')} className="btn bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3"><PlusCircle size={14} className="inline mr-1" /> {t('universityHubs', 'seekingHousingButton')}</button>
                                            <button onClick={() => openNewPostForm('housing_offering')} className="btn bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3"><PlusCircle size={14} className="inline mr-1" /> {t('universityHubs', 'offeringHousingButton')}</button>
                                        </div>
                                    ) : <p className="text-sm text-textSecondary dark:text-neutral-400">{t('universityHubs', 'signInToPost')}</p>}
                                </div>
                                {showNewPostForm && (newPostType === 'housing_seeking' || newPostType === 'housing_offering') && (
                                     <form onSubmit={handleCreatePost} className="mb-6 p-4 border dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-700/30 space-y-4 shadow-sm">
                                        <h3 className="text-lg font-medium text-textPrimary dark:text-neutral-100">{newPostType === 'housing_seeking' ? t('universityHubs', 'newSeekingPostTitle') : t('universityHubs', 'newOfferingPostTitle')}</h3>
                                        <textarea value={newPostContent} onChange={e => setNewPostContent(e.target.value)} placeholder={t('universityHubs', 'housingPostPlaceholder')} rows={4} className="w-full p-2.5 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-primary focus:border-primary bg-white dark:bg-neutral-700 dark:text-neutral-100" required></textarea>
                                        <div className="flex gap-2 justify-end">
                                            <button type="button" onClick={() => setShowNewPostForm(false)} className="btn bg-neutral-200 dark:bg-neutral-600 text-textPrimary dark:text-neutral-100 hover:bg-neutral-300 dark:hover:bg-neutral-500 text-sm py-1.5 px-3">{t('common', 'cancel')}</button>
                                            <button type="submit" disabled={isSubmittingPost} className="btn-primary text-sm py-1.5 px-3 disabled:opacity-70 flex items-center">
                                                {isSubmittingPost && <Loader2 className="animate-spin h-4 w-4 mr-2" />} {t('universityHubs', 'submitAdButton')}
                                            </button>
                                        </div>
                                    </form>
                                )}
                                <div className="space-y-4">
                                   {renderPostsForTab('network_housing')}
                                </div>
                            </div>
                        )}
                        {/* Network Study Groups Tab Content - remains the same */}
                        {activeTab === 'network_studygroups' && (
                            <div>
                                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                                    <h2 className="text-2xl font-semibold text-textPrimary dark:text-neutral-100">{t('universityHubs', 'studyGroupsTitle')}</h2>
                                    {isSignedIn ? (
                                        <div className="flex gap-2">
                                            <button onClick={() => openNewPostForm('study_group_looking')} className="btn bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-3"><PlusCircle size={14} className="inline mr-1" /> {t('universityHubs', 'lookingForGroupButton')}</button>
                                            <button onClick={() => openNewPostForm('study_group_forming')} className="btn bg-orange-500 hover:bg-orange-600 text-white text-sm py-2 px-3"><PlusCircle size={14} className="inline mr-1" /> {t('universityHubs', 'formingGroupButton')}</button>
                                        </div>
                                    ) : <p className="text-sm text-textSecondary dark:text-neutral-400">{t('universityHubs', 'signInToPost')}</p>}
                                </div>
                                {showNewPostForm && (newPostType === 'study_group_looking' || newPostType === 'study_group_forming') && (
                                     <form onSubmit={handleCreatePost} className="mb-6 p-4 border dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-700/30 space-y-4 shadow-sm">
                                        <h3 className="text-lg font-medium text-textPrimary dark:text-neutral-100">{newPostType === 'study_group_looking' ? t('universityHubs', 'newLookingPostTitle') : t('universityHubs', 'newFormingPostTitle')}</h3>
                                        <input type="text" value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} placeholder={t('universityHubs', 'studyGroupTitlePlaceholder')} className="w-full p-2.5 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-primary focus:border-primary bg-white dark:bg-neutral-700 dark:text-neutral-100" required />
                                        <textarea value={newPostContent} onChange={e => setNewPostContent(e.target.value)} placeholder={t('universityHubs', 'studyGroupDescPlaceholder')} rows={3} className="w-full p-2.5 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-primary focus:border-primary bg-white dark:bg-neutral-700 dark:text-neutral-100" required></textarea>
                                        <div className="flex gap-2 justify-end">
                                            <button type="button" onClick={() => setShowNewPostForm(false)} className="btn bg-neutral-200 dark:bg-neutral-600 text-textPrimary dark:text-neutral-100 hover:bg-neutral-300 dark:hover:bg-neutral-500 text-sm py-1.5 px-3">{t('common', 'cancel')}</button>
                                            <button type="submit" disabled={isSubmittingPost} className="btn-primary text-sm py-1.5 px-3 disabled:opacity-70 flex items-center">
                                                {isSubmittingPost && <Loader2 className="animate-spin h-4 w-4 mr-2" />} {t('universityHubs', 'createPostButton')}
                                            </button>
                                        </div>
                                    </form>
                                )}
                                <div className="space-y-4">
                                    {renderPostsForTab('network_studygroups')}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}