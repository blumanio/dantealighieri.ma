// app/[lang]/university-hubs/[universitySlug]/page.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
// ... other imports from previous version (Link, Lucide icons, useUser, useLanguage, PaginatedCourses, Header, Footer, CommunityPostCard)
import {
    School, BookOpen, Users, MessageSquare, Home as HomeIcon, Briefcase,
    Loader2, AlertTriangle, ExternalLink, MapPin, PlusCircle, Send
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useLanguage } from '@/context/LanguageContext';
import PaginatedCourses from '@/components/PaginatedCourses';
import CommunityPostCard, { CommunityPost } from '@/components/university-hub/CommunityPostCard';


interface Course {
    _id: string; nome: string; link: string; tipo: string; uni: string;
    accesso: string; area: string; lingua: string; comune: string;
    uniSlug?: string;
}
interface UniversityDetails {
    name: string;
    slug: string;
    location?: string;
    description?: string;
    logoUrl?: string;
    websiteUrl?: string;
}

export default function UniversityHubPage() {
    const params = useParams();
    const langParam = params && typeof params['lang'] === 'string' ? params['lang'] : '';
    const encodedUniversitySlug = params && typeof params['universitySlug'] === 'string' ? params['universitySlug'] : '';
    const universitySlug = decodeURIComponent(encodedUniversitySlug);

    // For display purposes, still derive a readable name from the slug.
    // The actual DB query will use the slug.
    const universityDisplayName = universitySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const { language, t } = useLanguage();
    const { isSignedIn, user } = useUser();

    // Initialize with derived name and slug
    const [universityDetails, setUniversityDetails] = useState<UniversityDetails | null>({ name: universityDisplayName, slug: universitySlug });
    const [courses, setCourses] = useState<Course[]>([]);
    const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'courses' | 'network_discussion' | 'network_housing' | 'network_studygroups' | 'about'>('courses');

    const [showNewPostForm, setShowNewPostForm] = useState(false);
    const [newPostType, setNewPostType] = useState<CommunityPost['postType']>('discussion');
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [isSubmittingPost, setIsSubmittingPost] = useState(false);

    const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const fetchCommunityPosts = useCallback(async (filterType?: CommunityPost['postType'] | string[]) => {
        if (!universitySlug) return;
        let effectiveFilterTypeQuery = '';
        if (typeof filterType === 'string') {
            effectiveFilterTypeQuery = `?type=${filterType}`;
        }

        const url = `${API_BASE_URL}/api/university-hubs/${universitySlug}/community-posts${effectiveFilterTypeQuery}`;
        console.log(`[UniversityHubPage] Fetching community posts from: ${url}`);
        try {
            const postsResponse = await fetch(url);
            if (!postsResponse.ok) {
                const errorData = await postsResponse.json().catch(() => ({ message: "Error fetching community posts" }));
                console.error("Failed to fetch community posts:", errorData.message);
                setCommunityPosts([]);
                return;
            }
            const postsData = await postsResponse.json();
            setCommunityPosts(postsData.data || []);
        } catch (fetchError: any) {
            console.error("Error fetching community posts:", fetchError.message);
            setError(prev => prev ? `${prev}; FetchPostsError: ${fetchError.message}` : `WorkspacePostsError: ${fetchError.message}`);
            setCommunityPosts([]);
        }
    }, [API_BASE_URL, universitySlug]);

    useEffect(() => {
        const fetchData = async () => {
            if (!universitySlug) return;
            setIsLoading(true);
            setError(null);
            console.log(`[UniversityHubPage] useEffect: Fetching data for uniSlug: "${universitySlug}"`);
            try {
                // Fetch courses for this university USING THE SLUG with uniSlug parameter
                const coursesApiUrl = `${API_BASE_URL}/api/courses?uni=${universitySlug}`; // CORRECTED PARAMETER NAME
                console.log(`[UniversityHubPage] useEffect: Fetching courses from: ${coursesApiUrl}`);

                const coursesResponse = await fetch(coursesApiUrl);
                if (!coursesResponse.ok) {
                    const errText = await coursesResponse.text();
                    console.error(`[UniversityHubPage] useEffect: Error fetching courses. Status: ${coursesResponse.status}. Body: ${errText}`);
                    throw new Error(t('universityHubs', 'errorFetchingCourses', { uni: universityDisplayName }));
                }
                const coursesData = await coursesResponse.json();
                console.log(`[UniversityHubPage] useEffect: Fetched ${coursesData?.length || 0} courses for slug ${universitySlug}.`);
                setCourses(coursesData || []);

                // If you have a dedicated API for university details by slug, fetch it here:
                // const uniDetailsResponse = await fetch(`${API_BASE_URL}/api/universities/${universitySlug}`);
                // if (uniDetailsResponse.ok) {
                //     const details = await uniDetailsResponse.json();
                //     if (details.success && details.data) {
                //         setUniversityDetails(details.data); // This would update universityDisplayName if it comes from API
                //     }
                // }


                await fetchCommunityPosts('discussion');

            } catch (err: any) {
                console.error(`[UniversityHubPage] useEffect: General error in fetchData for slug ${universitySlug}: `, err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [universitySlug, universityDisplayName, langParam, t, API_BASE_URL, fetchCommunityPosts]); // universityDisplayName is for t() calls

    // ... (handleTabChange, handleCreatePost, handleCommentSubmit, openNewPostForm, renderPostsForTab,
    //      and the main JSX return structure remain IDENTICAL to the previous full response for this file)
    // No changes needed in those functions as they were already robust.
    const handleTabChange = (tabId: string) => {
        const newActiveTab = tabId as typeof activeTab;
        setActiveTab(newActiveTab);
        setShowNewPostForm(false);
        if (newActiveTab === 'network_discussion') fetchCommunityPosts('discussion');
        else if (newActiveTab === 'network_housing') fetchCommunityPosts();
        else if (newActiveTab === 'network_studygroups') fetchCommunityPosts();
    };

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
                    setCommunityPosts(prev => [newPostData.data, ...prev]);
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
            console.error("Error adding comment from parent:", error);
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

        if (postsToRender.length === 0 && !isLoading) {
            return <p className="text-textSecondary text-center py-10">{t('universityHubs', noPostsMessageKey, { type: typeForMessage, defaultValue: `No ${typeForMessage} yet. Be the first!` })}</p>;
        }

        return postsToRender.map(post => (
            <CommunityPostCard
                key={post._id}
                post={{ ...post, universitySlug: universitySlug }}
                onCommentSubmit={handleCommentSubmit}
            />
        ));
    };

    if (isLoading && !courses.length && !communityPosts.length) return (
        <div className="flex flex-col min-h-screen"><main className="flex-grow flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></main></div>
    );
    if (error && !courses.length && !communityPosts.length) return (
        <div className="flex flex-col min-h-screen"><main className="flex-grow flex items-center justify-center p-4 text-center text-red-600"><AlertTriangle className="inline mr-2" />{error}</main></div>
    );
    // The rest of the JSX structure is the same as the previous answer.
    // The key change is the API call: `coursesApiUrl = `${API_BASE_URL}/api/courses?uniSlug=${universitySlug}`;`
    return (
        <div className="flex flex-col min-h-screen bg-neutral-50">
            <main className="flex-grow">
                <div className="bg-gradient-to-br from-primary via-teal-600 to-secondary text-white py-12 sm:py-16 md:py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-3">{universityDisplayName} Hub</h1>
                        {universityDetails?.location && <p className="text-lg opacity-90 flex items-center justify-center"><MapPin size={18} className="mr-2" />{universityDetails.location || universityDisplayName.split(' ').pop()}</p>}
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8 border-b border-neutral-200 flex items-center justify-center sm:justify-start overflow-x-auto scrollbar-hide">
                        {[
                            { id: 'courses', labelKey: 'coursesTab', icon: BookOpen },
                            { id: 'network_discussion', labelKey: 'discussionsTab', icon: MessageSquare },
                            { id: 'network_housing', labelKey: 'housingTab', icon: HomeIcon },
                            { id: 'network_studygroups', labelKey: 'studyGroupsTab', icon: Users },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`px-3 py-3 sm:px-4 sm:py-3 -mb-px text-sm sm:text-base font-medium border-b-2 transition-colors duration-200 whitespace-nowrap
                                    ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-textSecondary hover:border-neutral-400 hover:text-textPrimary'}`}
                            >
                                <tab.icon size={16} className="inline mr-1.5 mb-0.5" />
                                {t('universityHubs', tab.labelKey, { defaultValue: tab.labelKey.replace('Tab', '').replace('network_', '').replace(/([A-Z])/g, ' $1').trim() })}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl min-h-[400px]">
                        {activeTab === 'courses' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-semibold text-textPrimary">
                                        {t('universityHubs', 'coursesOfferedTitle', { uni: universityDisplayName })}
                                    </h2>
                                    {isLoading && courses.length === 0 && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
                                </div>
                                {courses.length > 0 ? <PaginatedCourses filteredCourses={courses} />
                                    : !isLoading && <p className="text-textSecondary text-center py-10">{t('universityHubs', 'noCoursesListed', { uni: universityDisplayName })}</p>}
                            </div>
                        )}

                        {activeTab === 'network_discussion' && (
                            <div>
                                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                                    <h2 className="text-2xl font-semibold text-textPrimary">{t('universityHubs', 'discussionsTitle')}</h2>
                                    {isSignedIn ? <button onClick={() => openNewPostForm('discussion')} className="btn-primary text-sm py-2 px-4"><PlusCircle size={16} className="inline mr-1.5" /> {t('universityHubs', 'newDiscussionButton')}</button>
                                        : <p className="text-sm text-textSecondary">{t('universityHubs', 'signInToPost')}</p>}
                                </div>
                                {showNewPostForm && newPostType === 'discussion' && (
                                    <form onSubmit={handleCreatePost} className="mb-6 p-4 border rounded-lg bg-neutral-50 space-y-4 shadow-sm">
                                        <h3 className="text-lg font-medium text-textPrimary">{t('universityHubs', 'newDiscussionFormTitle')}</h3>
                                        <input type="text" value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} placeholder={t('universityHubs', 'postTitlePlaceholder')} className="w-full p-2.5 border border-neutral-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary" />
                                        <textarea value={newPostContent} onChange={e => setNewPostContent(e.target.value)} placeholder={t('universityHubs', 'postContentPlaceholder')} rows={4} className="w-full p-2.5 border border-neutral-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary" required></textarea>
                                        <div className="flex gap-2 justify-end">
                                            <button type="button" onClick={() => setShowNewPostForm(false)} className="btn bg-neutral-200 text-textPrimary hover:bg-neutral-300 text-sm py-1.5 px-3">{t('common', 'cancel')}</button>
                                            <button type="submit" disabled={isSubmittingPost} className="btn-primary text-sm py-1.5 px-3 disabled:opacity-70 flex items-center">
                                                {isSubmittingPost && <Loader2 className="animate-spin h-4 w-4 mr-2" />} {t('universityHubs', 'submitPost')}
                                            </button>
                                        </div>
                                    </form>
                                )}
                                <div className="space-y-4">
                                    {isLoading && communityPosts.length === 0 && <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /></div>}
                                    {renderPostsForTab('network_discussion')}
                                </div>
                            </div>
                        )}

                        {activeTab === 'network_housing' && (
                            <div>
                                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                                    <h2 className="text-2xl font-semibold text-textPrimary">{t('universityHubs', 'housingBoardTitle')}</h2>
                                    {isSignedIn ? (
                                        <div className="flex gap-2">
                                            <button onClick={() => openNewPostForm('housing_seeking')} className="btn bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3"><PlusCircle size={14} className="inline mr-1" /> {t('universityHubs', 'seekingHousingButton')}</button>
                                            <button onClick={() => openNewPostForm('housing_offering')} className="btn bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3"><PlusCircle size={14} className="inline mr-1" /> {t('universityHubs', 'offeringHousingButton')}</button>
                                        </div>
                                    ) : <p className="text-sm text-textSecondary">{t('universityHubs', 'signInToPost')}</p>}
                                </div>
                                {showNewPostForm && (newPostType === 'housing_seeking' || newPostType === 'housing_offering') && (
                                    <form onSubmit={handleCreatePost} className="mb-6 p-4 border rounded-lg bg-neutral-50 space-y-4 shadow-sm">
                                        <h3 className="text-lg font-medium text-textPrimary">{newPostType === 'housing_seeking' ? t('universityHubs', 'newSeekingPostTitle') : t('universityHubs', 'newOfferingPostTitle')}</h3>
                                        <textarea value={newPostContent} onChange={e => setNewPostContent(e.target.value)} placeholder={t('universityHubs', 'housingPostPlaceholder')} rows={4} className="w-full p-2.5 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary" required></textarea>
                                        <div className="flex gap-2 justify-end">
                                            <button type="button" onClick={() => setShowNewPostForm(false)} className="btn bg-neutral-200 text-textPrimary hover:bg-neutral-300 text-sm py-1.5 px-3">{t('common', 'cancel')}</button>
                                            <button type="submit" disabled={isSubmittingPost} className="btn-primary text-sm py-1.5 px-3 disabled:opacity-70 flex items-center">
                                                {isSubmittingPost && <Loader2 className="animate-spin h-4 w-4 mr-2" />} {t('universityHubs', 'submitAdButton')}
                                            </button>
                                        </div>
                                    </form>
                                )}
                                <div className="space-y-4">
                                    {isLoading && communityPosts.length === 0 && <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /></div>}
                                    {renderPostsForTab('network_housing')}
                                </div>
                            </div>
                        )}

                        {activeTab === 'network_studygroups' && (
                            <div>
                                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                                    <h2 className="text-2xl font-semibold text-textPrimary">{t('universityHubs', 'studyGroupsTitle')}</h2>
                                    {isSignedIn ? (
                                        <div className="flex gap-2">
                                            <button onClick={() => openNewPostForm('study_group_looking')} className="btn bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-3"><PlusCircle size={14} className="inline mr-1" /> {t('universityHubs', 'lookingForGroupButton')}</button>
                                            <button onClick={() => openNewPostForm('study_group_forming')} className="btn bg-orange-500 hover:bg-orange-600 text-white text-sm py-2 px-3"><PlusCircle size={14} className="inline mr-1" /> {t('universityHubs', 'formingGroupButton')}</button>
                                        </div>
                                    ) : <p className="text-sm text-textSecondary">{t('universityHubs', 'signInToPost')}</p>}
                                </div>
                                {showNewPostForm && (newPostType === 'study_group_looking' || newPostType === 'study_group_forming') && (
                                    <form onSubmit={handleCreatePost} className="mb-6 p-4 border rounded-lg bg-neutral-50 space-y-4 shadow-sm">
                                        <h3 className="text-lg font-medium text-textPrimary">{newPostType === 'study_group_looking' ? t('universityHubs', 'newLookingPostTitle') : t('universityHubs', 'newFormingPostTitle')}</h3>
                                        <input type="text" value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} placeholder={t('universityHubs', 'studyGroupTitlePlaceholder')} className="w-full p-2.5 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary" required />
                                        <textarea value={newPostContent} onChange={e => setNewPostContent(e.target.value)} placeholder={t('universityHubs', 'studyGroupDescPlaceholder')} rows={3} className="w-full p-2.5 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary" required></textarea>
                                        <div className="flex gap-2 justify-end">
                                            <button type="button" onClick={() => setShowNewPostForm(false)} className="btn bg-neutral-200 text-textPrimary hover:bg-neutral-300 text-sm py-1.5 px-3">{t('common', 'cancel')}</button>
                                            <button type="submit" disabled={isSubmittingPost} className="btn-primary text-sm py-1.5 px-3 disabled:opacity-70 flex items-center">
                                                {isSubmittingPost && <Loader2 className="animate-spin h-4 w-4 mr-2" />} {t('universityHubs', 'createPostButton')}
                                            </button>
                                        </div>
                                    </form>
                                )}
                                <div className="space-y-4">
                                    {isLoading && communityPosts.length === 0 && <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /></div>}
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