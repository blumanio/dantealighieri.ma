// app/[lang]/feed/page.tsx (Fully Fixed)
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { useLanguage } from '@/context/LanguageContext';
import FeedHeader from '@/components/community/feed/FeedHeader';
import FeedSidebar from '@/components/community/feed/FeedSidebar';
// import FeedControls from '@/components/community/feed/FeedControls';
import PostList from '@/components/community/feed/PostList';
import CreatePostModal from '@/components/community/feed/CreatePostModal';
import { IPostWithComments, IComment } from '@/types/post';
import { Loader2, MessageSquare, AlertTriangle, Zap } from 'lucide-react';
import PostSkeleton from '@/components/community/feed/PostSkeleton';
import FeedSkeleton from '@/components/community/feed/feedSkeleton';

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const FeedPage = () => {
    const { isSignedIn, user } = useUser();
    const { t } = useLanguage();

    // State for posts and pagination
    const [posts, setPosts] = useState<IPostWithComments[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [loadingProgress, setLoadingProgress] = useState(0);

    // State for filters and search
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedQuickFilter, setSelectedQuickFilter] = useState<'recent' | 'popular' | 'trending'>('recent');

    // UI specific states
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'compact'>('list');
    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    useEffect(() => {
        const timer = setTimeout(() => setSearchTerm(debouncedSearchTerm), 500);
        return () => clearTimeout(timer);
    }, [debouncedSearchTerm]);

// Add this at the top of your component
useEffect(() => {
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('All env vars:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')));
}, []);
// Add this to detect mobile issues
useEffect(() => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log('Is mobile:', isMobile);
    console.log('User agent:', navigator.userAgent);
    console.log('Network status:', navigator.onLine);
}, []);
    // Function to fetch posts from the API
    const fetchPosts = useCallback(async (page: number, refresh = false) => {
        setIsLoading(true);
        setError(null);

        if (refresh) {
            setPosts([]);
            setCurrentPage(1);
            setLoadingProgress(0);
            const progressInterval = setInterval(() => setLoadingProgress(p => Math.min(p + 15, 85)), 150);
            setTimeout(() => {
                clearInterval(progressInterval);
                setLoadingProgress(100);
            }, 1000);
        }

        const queryParams = new URLSearchParams();
        queryParams.append('page', String(page));
        queryParams.append('limit', '10');

        if (selectedTags.length > 0) {
            selectedTags.forEach(tag => queryParams.append('category', tag));
        }
        if (selectedQuickFilter && selectedQuickFilter !== 'recent') {
            queryParams.append('filter', selectedQuickFilter);
        }
        if (searchTerm) {
            queryParams.append('search', searchTerm);
        }
        const fetchUrl = `${API_BASE_URL}/api/posts?${queryParams.toString()}`;

        // Replace the fetch logic with this safer version
        const response = await fetch(fetchUrl);
        console.log('Response status:', response.status);
        console.log('Response content-type:', response.headers.get('content-type'));

        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}`;
            try {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } else {
                    const textResponse = await response.text();
                    console.log('Non-JSON error response:', textResponse);
                    errorMessage = 'Server returned non-JSON response';
                }
            } catch (parseError) {
                console.error('Failed to parse error response:', parseError);
            }
            throw new Error(errorMessage);
        }

        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Server returned non-JSON response');
        }

        const data = await response.json();
    }, [selectedTags, selectedQuickFilter, searchTerm]);

    useEffect(() => {
        fetchPosts(1, true);
    }, [fetchPosts]);

    const loadMore = () => {
        if (!isLoading && currentPage < totalPages) {
            fetchPosts(currentPage + 1);
        }
    };

const handleCommentSubmit = async (postId: string, commentText: string) => {
    if (!isSignedIn || !user) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: commentText }),
        });

        if (!response.ok) {
            let errorMessage = 'Failed to add comment';
            try {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                }
            } catch (e) {
                console.error('Error parsing comment error response:', e);
            }
            throw new Error(errorMessage);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Invalid response format');
        }

        const newCommentRes: IComment = await response.json();
        // ... rest of the code
    } catch (err: any) {
        console.error("Error adding comment:", err);
        alert(`Error adding comment: ${err.message}`);
    }
};

    const handleRefresh = () => fetchPosts(1, true);
    const handleSearchChange = (value: string) => setDebouncedSearchTerm(value);

    const handleDeletePost = useCallback((deletedPostId: string) => {
        setPosts(prevPosts => prevPosts.filter(post => String(post._id) !== deletedPostId));
        setTotalPosts(prev => Math.max(0, prev - 1));
        console.log(`🗑️ Post ${deletedPostId} removed from state in FeedPage.`);
    }, []);

    if (isLoading && posts.length === 0) {
        return (
            <div className="space-y-4 p-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <FeedSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (error && posts.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 relative flex items-center justify-center">
                <div className="text-center max-w-lg mx-auto p-4">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-black text-red-800 mb-4">An Error Occurred</h2>
                    <p className="text-red-700 font-semibold mb-8">{error}</p>
                    <button onClick={handleRefresh} className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-2xl transition-transform hover:scale-105">
                        <Zap className="h-5 w-5" /> Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-gray-900 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className={`lg:block ${sidebarOpen ? 'block' : 'hidden'} lg:w-1/4`}>
                        <div className="lg:sticky lg:top-28">
                            <FeedSidebar
                                selectedTags={selectedTags}
                                onTagToggle={(tag: string) => {
                                    setSelectedTags(prev =>
                                        prev.includes(tag)
                                            ? prev.filter(t => t !== tag)
                                            : [...prev, tag]
                                    );
                                }}
                                selectedQuickFilter={selectedQuickFilter}
                                onQuickFilterChange={(filter: string) => setSelectedQuickFilter(filter as 'recent' | 'popular' | 'trending')}
                                onClearFilters={() => {
                                    setSelectedTags([]);
                                    setSelectedQuickFilter('recent');
                                    setDebouncedSearchTerm('');
                                }}
                            />
                        </div>
                    </div>
                    <main className="flex-1 lg:w-3/4">
                        <FeedHeader
                            sidebarOpen={sidebarOpen}
                            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                            searchTerm={debouncedSearchTerm}
                            onSearchChange={handleSearchChange}
                            onSearchSubmit={handleRefresh}
                            onOpenCreatePostModal={() => setIsCreatePostModalOpen(true)}
                            onOpenCreatePollModal={() => { /* TODO: Implement poll modal logic */ }}
                        />
                        <PostList
                            posts={posts}
                            isLoading={isLoading}
                            error={error}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            viewMode={viewMode}
                            onCommentSubmit={handleCommentSubmit}
                            loadMore={loadMore}
                            onRefresh={handleRefresh}
                            onDeletePost={handleDeletePost}
                        />
                    </main>
                </div>
            </div>

            <CreatePostModal
                isOpen={isCreatePostModalOpen}
                onClose={() => setIsCreatePostModalOpen(false)}
                onPostCreated={handleRefresh}
                communityType={'General'}
                communityId={''}
            />
        </div>
    );
};

export default FeedPage;