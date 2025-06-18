// components/community/feed/PostList.tsx
import React from 'react';
import { IPostWithComments } from '@/types/post';
import CommunityPostCard from '@/components/community/CommunityPostCard';
import { Loader2, MessageSquare, AlertTriangle } from 'lucide-react';
import PostSkeleton from './PostSkeleton';
interface PostListProps {
    posts: IPostWithComments[];
    isLoading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    viewMode: 'list' | 'compact';
    onCommentSubmit: (postId: string, commentText: string) => Promise<void>;
    loadMore: () => void;
    onRefresh: () => void;
    onDeletePost: (postId: string) => void;
}

// Skeleton loader component for individual posts
// const PostSkeleton: React.FC = () => (
//     <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
//         {/* Header skeleton */}
//         <div className="flex items-center space-x-3 mb-3">
//             <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
//             <div className="flex-1">
//                 <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
//                 <div className="h-3 bg-gray-200 rounded w-16"></div>
//             </div>
//         </div>
        
//         {/* Content skeleton */}
//         <div className="space-y-2 mb-4">
//             <div className="h-4 bg-gray-200 rounded w-full"></div>
//             <div className="h-4 bg-gray-200 rounded w-4/5"></div>
//             <div className="h-4 bg-gray-200 rounded w-3/5"></div>
//         </div>
        
//         {/* Actions skeleton */}
//         <div className="flex items-center space-x-4 pt-3 border-t border-gray-100">
//             <div className="h-8 bg-gray-200 rounded w-16"></div>
//             <div className="h-8 bg-gray-200 rounded w-16"></div>
//             <div className="h-8 bg-gray-200 rounded w-16"></div>
//         </div>
//     </div>
// );

const PostList: React.FC<PostListProps> = ({
    posts,
    isLoading,
    error,
    currentPage,
    totalPages,
    viewMode,
    onCommentSubmit,
    loadMore,
    onRefresh,
    onDeletePost
}) => {
    if (isLoading && posts.length === 0) {
        return (
            <div className="space-y-4 sm:px-0">
                {Array.from({ length: 3 }).map((_, index) => (
                    <PostSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (error && posts.length === 0) {
        return (
            <div className="mx-4 my-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-center">
                    <AlertTriangle className="h-6 w-6 mx-auto text-red-500 mb-3" />
                    <p className="text-sm text-gray-700 mb-4">{error}</p>
                    <button
                        onClick={onRefresh}
                        className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-16 px-4">
                <MessageSquare className="h-8 w-8 text-gray-300 mx-auto mb-4" />
                <p className="text-base text-gray-600 mb-4">No posts found.</p>
                <button
                    onClick={onRefresh}
                    className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                    Refresh Feed
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:px-0">
            {posts.map(post => (
                <CommunityPostCard
                    key={String(post._id)}
                    post={post}
                    onCommentSubmit={onCommentSubmit}
                    onDeletePost={onDeletePost}
                />
            ))}

            {isLoading && posts.length > 0 && (
                <div className="flex justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
            )}

            {currentPage < totalPages && !isLoading && (
                <div className="text-center py-6">
                    <button
                        onClick={loadMore}
                        className="px-6 py-3 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                        disabled={isLoading}
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostList;