'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
    PlusCircle, Send, Loader2, AlertTriangle,
    MessageSquare, Sparkles, Zap
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useLanguage } from '@/context/LanguageContext';
import PostSkeleton from '@/components/community/feed/PostSkeleton';
import { IComment, IPostWithComments } from '@/types/post';

// IMPORTANT: Your imported components must also be updated to match this new design system.
// Specifically, review the styling for:
// - CommunityPostCard (background, spacing, borders, typography)
// - UniversityHeader (backgrounds, typography)
// - TabNavigation (colors, spacing)
// - AboutTab, CoursesTab, DeadlinesTab (typography, spacing)
import CommunityPostCard from '@/components/community/CommunityPostCard';
import UniversityHeader from '@/components/university-hub/UniversityHeader';
import TabNavigation, { TabId } from '@/components/university-hub/TabNavigation';
import AboutTab from '@/components/university-hub/AboutTab';
import CoursesTab from '@/components/university-hub/CoursesTab';
import DeadlinesTab from '@/components/university-hub/DeadlinesTab';

// Interfaces (assuming these are correct and do not need changes)
interface Course {
    _id: string; nome: string; link: string; tipo: string; uni: string;
    accesso: string; area: string; lingua: string; comune: string;
    uniSlug?: string;
}
type PostCategory = 'discussion' | 'housing' | 'scholarships' | 'event' | 'other' | 'academic' | 'career' | 'visa_process' | 'housing_seeking' | 'housing_offering';

interface IPost extends Document {
    authorId: string;
    communityId: string;
    communityType: 'University' | 'Country' | 'City' | 'General';
    communityName: string;
    communitySlug: string;
    content: string;
    category: PostCategory;
    originalAuthorFullName?: string;
    originalAuthorAvatarUrl?: string;
    originalAuthorExternalId?: string;
    isClaimable?: boolean;
    originalUserCountry?: string;
    commentsCount: number;
    likesCount: number;
    bookmarksCount: number;
    likedBy: string[];
    bookmarkedBy: string[];
    createdAt: Date;
    updatedAt: Date;
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
    id?: string;
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


export default function UniversityHubPage() {
    const params = useParams();
    const universitySlug = decodeURIComponent(params?.universitySlug as string || '');
    const { t } = useLanguage();
    const { isSignedIn, user } = useUser();

    // State Hooks
    const [universityDetails, setUniversityDetails] = useState<UniversityDetails | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [posts, setPosts] = useState<IPostWithComments[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabId>('courses');

    const [showNewPostForm, setShowNewPostForm] = useState(false);
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostCategory, setNewPostCategory] = useState<PostCategory>('discussion');
    const [isSubmittingPost, setIsSubmittingPost] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const handleDeletePost = useCallback((deletedPostId: string) => {
        setPosts(prevPosts => prevPosts.filter(post => String(post._id) !== deletedPostId));
    }, []);

    const fetchPostsForTab = useCallback(async (tab: TabId) => {
        if (!universitySlug || (tab !== 'network_discussion' && tab !== 'network_housing')) {
            setPosts([]);
            return;
        }

        const categories = tab === 'network_discussion' ? ['discussion'] : ['housing_seeking', 'housing_offering'];
        const categoryQuery = categories.map(c => `category=${c}`).join('&');
        const fetchUrl = `${API_BASE_URL}/api/posts?communityType=University&communityId=${universitySlug}&${categoryQuery}`;

        try {
            const response = await fetch(fetchUrl);
            if (response.ok) {
                const data = await response.json();
                const processedPosts: IPostWithComments[] = (data.posts || data || []).map((p: any) => ({
                    ...p,
                    createdAt: new Date(p.createdAt),
                    updatedAt: new Date(p.updatedAt),
                    comments: (p.comments || []).map((c: any) => ({
                        ...c,
                        createdAt: new Date(c.createdAt),
                        updatedAt: new Date(c.updatedAt),
                    })),
                }));
                setPosts(processedPosts);
            } else {
                setPosts([]);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setPosts([]);
        }
    }, [universitySlug, API_BASE_URL]);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (!universitySlug) return;

            setIsLoading(true);
            const progressInterval = setInterval(() => setLoadingProgress(p => Math.min(p + 15, 85)), 150);

            try {
                const universityDetailsResponse = await fetch(`${API_BASE_URL}/api/universities/${universitySlug}`);
                let fetchedDetails: UniversityDetails | null = null;
                if (universityDetailsResponse.ok) {
                    fetchedDetails = await universityDetailsResponse.json();
                    setUniversityDetails(fetchedDetails);
                } else {
                    const fallbackDetails = {
                        name: universitySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        slug: universitySlug,
                    };
                    setUniversityDetails(fallbackDetails);
                }

                const coursesResponse = await fetch(`${API_BASE_URL}/api/courses?uni=${universitySlug}`);
                if (coursesResponse.ok) {
                    const coursesData = await coursesResponse.json() || [];
                    setCourses(coursesData);
                }

                await fetchPostsForTab(activeTab);

            } catch (err: any) {
                console.error('Error in fetchInitialData:', err);
                setError(err.message || 'Failed to fetch university data.');
            } finally {
                clearInterval(progressInterval);
                setLoadingProgress(100);
                setTimeout(() => setIsLoading(false), 200);
            }
        };
        fetchInitialData();
    }, [universitySlug, API_BASE_URL, fetchPostsForTab, activeTab]);

    useEffect(() => {
        fetchPostsForTab(activeTab);
    }, [activeTab, fetchPostsForTab]);

    const handleTabChange = (tabId: TabId) => {
        setActiveTab(tabId);
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignedIn || !newPostContent.trim() || !universityDetails) {
            alert(t('universityHubs', 'pleaseSignInOrWait') || 'Please sign in and wait for data to load');
            return;
        }

        const communityName = universityDetails.name || universitySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const postData = {
            content: newPostContent,
            category: newPostCategory,
            communityType: 'University',
            communityId: universityDetails.id,
            communityName: communityName,
            communitySlug: universitySlug,
        };
        console.log('Creating post with data:ccccccccccc', universityDetails);

        setIsSubmittingPost(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to create post.');
            }

            const newPost: any = await response.json();
            const newPostWithComments: IPostWithComments = {
                ...newPost,
                _id: newPost._id,
                createdAt: new Date(newPost.createdAt),
                updatedAt: new Date(newPost.updatedAt),
                comments: [],
                author: {
                    id: user?.id || '',
                    username: user?.username || '',
                    firstName: user?.firstName || '',
                    lastName: user?.lastName || '',
                    imageUrl: user?.imageUrl || '',
                }
            };

            setPosts(prev => [newPostWithComments, ...prev]);
            setShowNewPostForm(false);
            setNewPostContent('');
        } catch (err: any) {
            console.error('Error creating post:', err);
            alert((t('universityHubs', 'errorCreatingPost') || 'Error creating post') + (err.message ? `: ${err.message}` : ""));
        } finally {
            setIsSubmittingPost(false);
        }
    };

    const handleCommentSubmit = async (postId: string, commentText: string) => {
        if (!isSignedIn || !commentText.trim()) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: commentText }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add comment.');
            }
            const newCommentRes: any = await response.json();

            setPosts(prevPosts => prevPosts.map(p => {
                if (String(p._id) === postId) {
                    const hydratedComment = {
                        ...newCommentRes,
                        createdAt: new Date(newCommentRes.createdAt),
                        updatedAt: new Date(newCommentRes.updatedAt),
                        author: {
                            id: user?.id || '',
                            username: user?.username || 'Unknown',
                            firstName: user?.firstName || '',
                            lastName: user?.lastName || '',
                            imageUrl: user?.imageUrl || '',
                        }
                    };
                    return {
                        ...p,
                        comments: [...p.comments, hydratedComment],
                        commentsCount: (p.commentsCount ?? 0) + 1
                    } as IPostWithComments;
                }
                return p;
            }));
        } catch (err: any) {
            console.error("Error adding comment:", err);
            alert((t('universityHubs', 'errorAddingComment') || 'Error adding comment') + (err.message ? `: ${err.message}` : ""));
        }
    };

    const openNewPostForm = (category: PostCategory) => {
        setNewPostCategory(category);
        setShowNewPostForm(true);
        setNewPostContent('');
    };

    const renderPostsForTab = () => {
        if (isLoading) {
            return (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <PostSkeleton key={index} />
                    ))}
                </div>
            );
        }

        if (posts.length === 0) {
            return (
                <div className="text-center py-12">
                    <div className="max-w-sm mx-auto">
                        <div className="p-4 bg-gray-50 rounded-lg mb-4 inline-block">
                            <MessageSquare className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-base font-medium text-gray-900 mb-1">No Posts Yet</h3>
                        <p className="text-sm text-gray-500">Be the first to start a conversation!</p>
                    </div>
                </div>
            );
        }

        return posts.map(post => (
            <CommunityPostCard
                key={String(post._id)}
                post={post}
                onCommentSubmit={handleCommentSubmit}
                onDeletePost={handleDeletePost}
            />
        ));
    };

    const universityName = universityDetails?.name || universitySlug.replace(/-/g, ' ');

    if (isLoading && loadingProgress < 100) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <Sparkles className="h-10 w-10 text-gray-400 mx-auto animate-pulse mb-4" />
                    <h3 className="text-base font-medium text-gray-900">Loading University Hub...</h3>
                    <div className="w-64 bg-gray-400 rounded-full h-1.5 mt-4 mx-auto">
                        <div className="bg-gray-900 h-1.5 rounded-full" style={{ width: `${loadingProgress}%` }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md mx-auto">
                    <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
                    <h2 className="text-lg font-medium text-red-700 mb-2">An Error Occurred</h2>
                    <p className="text-base text-red-500 mb-6">{error}</p>
                    <button onClick={() => window.location.reload()} className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors">
                        <Zap className="h-5 w-5 mr-2" /> Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <main>
                <UniversityHeader
                    universityDetails={universityDetails}
                    universityName={universityName}
                    coursesCount={courses.length}
                    communityPostsCount={posts.length}
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-0 py-8 sm:py-12">
                    <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} t={t} />

                    {/* Main content area for tabs */}
                    <div className="bg-white rounded-b-lg p-4 md:p-8 min-h-[600px]">
                        {activeTab === 'about' && universityDetails && <AboutTab universityDetails={universityDetails} />}
                        {activeTab === 'courses' && <CoursesTab courses={courses} isLoading={isLoading} universityName={universityName} />}
                        {activeTab === 'deadlines' && <DeadlinesTab currentUniversityName={universityName} currentUniversitySlug={universitySlug} />}

                        {(activeTab === 'network_discussion' || activeTab === 'network_housing') && (
                            <div>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        {activeTab === 'network_discussion' ? 'Community Discussions' : 'Housing Board'}
                                    </h2>
                                    {isSignedIn && (
                                        <div className="flex gap-2">
                                            {activeTab === 'network_discussion' ? (
                                                <button onClick={() => openNewPostForm('discussion')} className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors">
                                                    <PlusCircle size={16} className="mr-2" /> New Discussion
                                                </button>
                                            ) : (
                                                <>
                                                    <button onClick={() => openNewPostForm('housing_seeking')} className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors">
                                                        <PlusCircle size={16} className="mr-2" /> Seeking
                                                    </button>
                                                    <button onClick={() => openNewPostForm('housing_offering')} className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-900 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors">
                                                        <PlusCircle size={16} className="mr-2" /> Offering
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {showNewPostForm && (
                                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                        <form onSubmit={handleCreatePost} className="space-y-4">
                                            <h3 className="text-base font-medium text-gray-900 capitalize">Create New {newPostCategory.replace(/_/g, ' ')} Post</h3>
                                            <textarea
                                                value={newPostContent}
                                                onChange={e => setNewPostContent(e.target.value)}
                                                placeholder="Share your thoughts or housing details..."
                                                rows={4}
                                                className="w-full p-3 text-base text-gray-700 bg-white border border-gray-400 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                                                required
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <button type="button" onClick={() => setShowNewPostForm(false)} className="px-4 py-2 bg-gray-200 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors">Cancel</button>
                                                <button type="submit" disabled={isSubmittingPost} className="inline-flex items-center px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                                    {isSubmittingPost && <Loader2 size={16} className="animate-spin mr-2" />}
                                                    <Send size={16} className="mr-2" />
                                                    Post
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                                <div className="space-y-4">{renderPostsForTab()}</div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}