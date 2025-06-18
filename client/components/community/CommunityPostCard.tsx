'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useLanguage } from '@/context/LanguageContext';
import PostHeader from './post/PostHeader';
import PostContent from './post/PostContent';
import PostImage from './post/PostImage';
import PostTags from './post/PostTags';
import PostActions from './post/PostActions';
import CommentsSection from './comments/CommentsSection';
import { IPostWithComments, IComment } from '@/types/post';
import { Trash2, Loader2, Heart, Bookmark, MessageCircle } from 'lucide-react';
import { triggerGamificationAction } from '@/services/gamificationService';
import toast from 'react-hot-toast';

interface CommunityPostCardProps {
    post: IPostWithComments;
    onCommentSubmit: (postId: string, commentText: string) => Promise<void>;
    onDeletePost?: (postId: string) => void;
}

const CommunityPostCard: React.FC<CommunityPostCardProps> = ({ post, onCommentSubmit, onDeletePost }) => {
    const { language, t } = useLanguage();
    const { isSignedIn, user: currentSignedInUser } = useUser();

    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [localLikesCount, setLocalLikesCount] = useState(0);
    const [localBookmarksCount, setLocalBookmarksCount] = useState(0);

    const [isLikeInProgress, setIsLikeInProgress] = useState(false);
    const [isBookmarkInProgress, setIsBookmarkInProgress] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const ADMIN_USER_ID = 'user_2jNm312ve6JOhN0YXyzfSolcggp';

    const canDeletePost = isSignedIn && (
        currentSignedInUser?.id === ADMIN_USER_ID ||
        currentSignedInUser?.id === post.author.id
    );

    useEffect(() => {
        const signedInUserId = currentSignedInUser?.id;
        setIsLiked(!!(signedInUserId && post.likedBy?.includes(signedInUserId)));
        setLocalLikesCount(post.likesCount || 0);
        setIsBookmarked(!!(signedInUserId && post.bookmarkedBy?.includes(signedInUserId)));
        setLocalBookmarksCount(post.bookmarksCount || 0);
    }, [post, currentSignedInUser]);

    const handleInternalCommentSubmit = async () => {
        if (!newComment.trim() || !currentSignedInUser) {
            console.warn('Cannot submit comment: content empty or user not signed in.');
            return;
        }
        setIsSubmittingComment(true);
        try {
            await onCommentSubmit((post._id as any).toString(), newComment);
            setNewComment('');
        } catch (error) {
            console.error("Failed to submit comment:", error);
            alert(t('comment.errorSubmit' as any, 'Failed to submit comment.'));
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const formatTimeAgo = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(language);
    };

    const handleToggleAction = async (
        url: string,
        stateSetter: React.Dispatch<React.SetStateAction<boolean>>,
        countSetter: React.Dispatch<React.SetStateAction<number>>,
        inProgressSetter: React.Dispatch<React.SetStateAction<boolean>>,
        currentState: boolean,
        currentCount: number,
        gamificationAction: 'LIKE_POST' | 'BOOKMARK_POST' | null
    ) => {
        if (!isSignedIn || !currentSignedInUser || inProgressSetter === undefined) {
            console.warn('handleToggleAction: User not signed in or inProgressSetter is invalid.');
            return;
        }

        inProgressSetter(true);

        stateSetter(!currentState);
        countSetter(prev => currentState ? Math.max(0, prev - 1) : prev + 1);

        try {
            const response = await fetch(url, { method: 'POST' });
            if (!response.ok) {
                // existing error handling
            }
            const data = await response.json();

            stateSetter(data.likedByCurrentUser !== undefined ? data.likedByCurrentUser : (data.bookmarkedByCurrentUser !== undefined ? data.bookmarkedByCurrentUser : !currentState));
            countSetter(data.likesCount !== undefined ? data.likesCount : (data.bookmarksCount !== undefined ? data.bookmarksCount : currentCount));

            if (!currentState && gamificationAction) {
                triggerGamificationAction(gamificationAction);
                if (gamificationAction === 'LIKE_POST') {
                    toast('✨ +2 XP');
                } else if (gamificationAction === 'BOOKMARK_POST') {
                    toast.success('✨ +5 XP! Post saved.');
                }
            }

        } catch (error) {
            console.error("Failed to toggle action (catch block):", error);
            stateSetter(currentState);
            countSetter(currentCount);
            alert(t('action.errorToggle' as any, 'Failed to perform action.'));
        } finally {
            inProgressSetter(false);
        }
    };

    const handleLike = () =>
        handleToggleAction(
            `/api/posts/${post._id as any}/toggle-like`,
            setIsLiked,
            setLocalLikesCount,
            setIsLikeInProgress,
            isLiked,
            localLikesCount,
            'LIKE_POST'
        );

    const handleBookmark = () =>
        handleToggleAction(
            `/api/posts/${post._id as any}/toggle-bookmark`,
            setIsBookmarked,
            setLocalBookmarksCount,
            setIsBookmarkInProgress,
            isBookmarked,
            localBookmarksCount,
            'BOOKMARK_POST'
        );

    const handleDelete = async () => {
        if (!confirm(t('post.confirmDelete' as any, 'Are you sure you want to delete this post? This action cannot be undone.'))) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/posts/${post._id as any}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || response.statusText || t('post.errorDeleteFailed' as any, 'Failed to delete post.'));
            }

            if (onDeletePost) {
                onDeletePost((post._id as any).toString());
            } else {
                alert(t('post.deleteSuccess' as any, 'Post deleted successfully!'));
            }

        } catch (error: any) {
            console.error("Error deleting post:", error);
            alert(error.message || t('post.errorDelete' as any, 'Error deleting post.'));
        } finally {
            setIsDeleting(false);
        }
    };

    const currentUserProfileLink = `/${language}/users/${currentSignedInUser?.id}`;
    const currentUserAvatar = currentSignedInUser?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentSignedInUser?.fullName || 'User')}&background=random&color=fff&size=128`;

    return (
        <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 sm:p-6 mb-4 relative">
            {/* Delete button - positioned absolute for clean layout */}
            {canDeletePost && (
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="absolute top-3 right-3 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-full transition-colors"
                    title={t('post.deleteButton' as any, 'Delete Post')}
                >
                    {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Trash2 className="h-4 w-4" />
                    )}
                </button>
            )}

            {/* Post Header */}
            <PostHeader post={post} formatTimeAgo={formatTimeAgo} />

            {/* Post Content */}
            <div className="mt-3">
                <PostContent post={post as any} />
            </div>

            {/* Post Image */}
            {/* {post.imageUrl && <PostImage imageUrl={post.imageUrl} alt={post.title || 'Post image'} />} */}

            {/* Post Tags */}
            {post.tags && post.tags.length > 0 && (
                <div className="mt-3">
                    <PostTags tags={post.tags} />
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-6 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                {/* Like Button */}
                <button
                    onClick={handleLike}
                    disabled={isLikeInProgress}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked
                        ? 'text-red-600 dark:text-red-500'
                        : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500'
                        }`}
                >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{localLikesCount}</span>
                </button>

                {/* Bookmark Button */}
                <button
                    onClick={handleBookmark}
                    disabled={isBookmarkInProgress}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${isBookmarked
                        ? 'text-blue-600 dark:text-blue-500'
                        : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500'
                        }`}
                >
                    <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    <span>{localBookmarksCount}</span>
                </button>

                {/* Comments Button */}
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                    <MessageCircle className="h-5 w-5" />
                    <span>{post.commentsCount || 0}</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <CommentsSection
                        id={post._id as string}
                        comments={post.comments}
                        isSignedIn={!!isSignedIn}
                        currentUserAvatar={currentUserAvatar}
                        currentUserName={currentSignedInUser?.fullName || t('common', 'unknownUser')}
                        currentUserProfileLink={currentUserProfileLink}
                        newComment={newComment}
                        isSubmittingComment={isSubmittingComment}
                        formatTimeAgo={formatTimeAgo}
                        onCommentChange={setNewComment}
                        onCommentSubmit={handleInternalCommentSubmit}
                    />

                    {/* Comment Input */}
                    {/* {isSignedIn && (
                        <div className="flex gap-3 mt-4">
                            <img
                                src={currentUserAvatar}
                                alt="Your avatar"
                                className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex-1 flex gap-2">
                                <input
                                    type="text"
                                    placeholder={t('comment.placeholder', 'Add a comment...')}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleInternalCommentSubmit()}
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    onClick={handleInternalCommentSubmit}
                                    disabled={isSubmittingComment || !newComment.trim()}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                                >
                                    {isSubmittingComment ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        t('comment.submit', 'Post')
                                    )}
                                </button>
                            </div>
                        </div>
                    )} */}
                </div>
            )}
        </article>
    );
};

export default CommunityPostCard;