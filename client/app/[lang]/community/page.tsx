// app/[lang]/feed/page.tsx (Fully Fixed & Updated)
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { useLanguage } from '@/context/LanguageContext';
import FeedHeader from '@/components/community/feed/FeedHeader';
import FeedSidebar from '@/components/community/feed/FeedSidebar';
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

    // Function to fetch posts from the API
    const fetchPosts = useCallback(async (page: number, refresh = false) => {
        setIsLoading(true);
        setError(null);

        if (refresh) {
            setPosts([]);
            // We set currentPage to 1 here to ensure the API call is correct
            setCurrentPage(1);
        }

        const queryParams = new URLSearchParams();
        // Use the correct page number for the request
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

        try {
            const response = await fetch(fetchUrl);

            if (!response.ok) {
                let errorMessage = `API Error: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    errorMessage = await response.text();
                }
                throw new Error(errorMessage);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server returned an invalid response format.');
            }

            const data = await response.json();

            // <<< FIX START: Update component state with the fetched data
            setPosts(prevPosts => refresh ? data.posts : [...prevPosts, ...data.posts]);
            setTotalPages(data.totalPages || 1);
            setTotalPosts(data.totalPosts || 0);
            setCurrentPage(data.currentPage || page);
            // <<< FIX END

        } catch (err: any) {
            console.error("Failed to fetch posts:", err);
            setError(err.message || 'An unknown error occurred.');
            // Ensure posts are cleared on a failed refresh attempt
            if (refresh) setPosts([]);
        } finally {
            // <<< FIX: Always set loading to false after the operation completes
            setIsLoading(false);
        }
    }, [selectedTags, selectedQuickFilter, searchTerm]); // API_BASE_URL is constant, no need for it as a dependency

    useEffect(() => {
        // Fetch posts on initial load or when filters/search change
        fetchPosts(1, true);
    }, [fetchPosts]); // fetchPosts is memoized and only changes when its dependencies do

    const loadMore = () => {
        if (!isLoading && currentPage < totalPages) {
            fetchPosts(currentPage + 1, false); // Fetch the next page, don't refresh
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
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add comment');
            }

            const newComment: IComment = await response.json();

            // <<< FIX START: Update the post's comments in the state for an instant UI update
            setPosts(prevPosts =>
                prevPosts.map(post => {
                    if (String(post._id) === postId) {
                        // Only replace the comments property, keep the original post instance
                        (post.comments ??= []).push(newComment);
                    }
                    return post;
                })
            );
            // <<< FIX END

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

    // Initial loading state (shows full page skeleton)
    if (isLoading && posts.length === 0) {
        return (
            <div className="space-y-4 p-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <FeedSkeleton key={index} />
                ))}
            </div>
        );
    }

    // Error state when no posts could be loaded
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

    // Main content display
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
                                    setSearchTerm(''); // Clear immediately for re-fetch
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
                            isLoading={isLoading} // This now correctly reflects loading more posts
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