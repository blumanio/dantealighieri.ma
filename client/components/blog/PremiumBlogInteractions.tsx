'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useLanguage } from '@/context/LanguageContext';
import {
    Heart, MessageCircle, Send, Loader2, Shield, Crown, Award,
    Star, Sparkles, ThumbsUp, User, Clock, CheckCircle
} from 'lucide-react';

interface Comment {
    _id: string;
    userId: string;
    userFullName: string;
    userAvatarUrl?: string;
    userRole?: string;
    content: string;
    createdAt: string;
}

interface PremiumBlogInteractionsProps {
    postId: string;
    postType: 'blog';
    lang: string;
    initialLikes?: number;
    initialComments?: number;
}

const PremiumBlogInteractions: React.FC<PremiumBlogInteractionsProps> = ({
    postId,
    postType,
    lang,
    initialLikes = 0,
    initialComments = 0
}) => {
    const { language, t } = useLanguage();
    const { isSignedIn, user: currentSignedInUser } = useUser();

    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [showComments, setShowComments] = useState(false);

    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(initialLikes);
    const [isLikeLoading, setIsLikeLoading] = useState(false);

    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Fetch comments
    useEffect(() => {
        const fetchComments = async () => {
            if (!showComments) return;

            setIsLoadingComments(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments?type=${postType}`);
                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        setComments(result.data || []);
                    }
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            } finally {
                setIsLoadingComments(false);
            }
        };

        fetchComments();
    }, [showComments, postId, postType, API_BASE_URL]);

    // Check if user has already liked the post
    useEffect(() => {
        const checkLikeStatus = async () => {
            if (!isSignedIn || !currentSignedInUser) return;

            try {
                const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/like-status?type=${postType}`);
                if (response.ok) {
                    const result = await response.json();
                    setIsLiked(result.isLiked || false);
                }
            } catch (error) {
                console.error('Error checking like status:', error);
            }
        };

        checkLikeStatus();
    }, [isSignedIn, currentSignedInUser, postId, postType, API_BASE_URL]);

    const handleLike = async () => {
        if (!isSignedIn || !currentSignedInUser) {
            setFeedbackMessage('Please sign in to like this post');
            setTimeout(() => setFeedbackMessage(null), 3000);
            return;
        }

        setIsLikeLoading(true);
        const originalLiked = isLiked;
        const originalCount = likesCount;

        // Optimistic update
        setIsLiked(!originalLiked);
        setLikesCount(prev => originalLiked ? Math.max(0, prev - 1) : prev + 1);

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
                method: originalLiked ? 'DELETE' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: postType })
            });

            const result = await response.json();
            if (result.success) {
                if (typeof result.likesCount === 'number') {
                    setLikesCount(result.likesCount);
                }
            } else {
                // Revert on failure
                setIsLiked(originalLiked);
                setLikesCount(originalCount);
                setFeedbackMessage(result.message || 'Failed to update like');
                setTimeout(() => setFeedbackMessage(null), 3000);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            setIsLiked(originalLiked);
            setLikesCount(originalCount);
            setFeedbackMessage('Failed to update like');
            setTimeout(() => setFeedbackMessage(null), 3000);
        } finally {
            setIsLikeLoading(false);
        }
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim() || !currentSignedInUser) return;

        setIsSubmittingComment(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newComment,
                    type: postType,
                    userFullName: currentSignedInUser.fullName,
                    userImageUrl: currentSignedInUser.imageUrl
                })
            });

            const result = await response.json();
            if (result.success && result.data) {
                setComments(prev => [result.data, ...prev]);
                setNewComment('');
                setFeedbackMessage('Comment added successfully!');
                setTimeout(() => setFeedbackMessage(null), 3000);
            } else {
                setFeedbackMessage(result.message || 'Failed to add comment');
                setTimeout(() => setFeedbackMessage(null), 3000);
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
            setFeedbackMessage('Failed to add comment');
            setTimeout(() => setFeedbackMessage(null), 3000);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const getRoleConfig = (role?: string) => {
        switch (role) {
            case 'editor':
                return {
                    label: 'Editor',
                    bgClass: 'bg-purple-100 border-purple-200',
                    textClass: 'text-purple-700',
                    icon: Crown
                };
            case 'author':
                return {
                    label: 'Author',
                    bgClass: 'bg-blue-100 border-blue-200',
                    textClass: 'text-blue-700',
                    icon: Award
                };
            case 'contributor':
                return {
                    label: 'Contributor',
                    bgClass: 'bg-emerald-100 border-emerald-200',
                    textClass: 'text-emerald-700',
                    icon: Star
                };
            case 'mentor':
                return {
                    label: 'Mentor',
                    bgClass: 'bg-indigo-100 border-indigo-200',
                    textClass: 'text-indigo-700',
                    icon: Shield
                };
            default:
                return null;
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

        return date.toLocaleDateString(language, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                            <MessageCircle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900">Community Discussion</h3>
                            <p className="text-slate-600">Share your thoughts and engage with fellow readers</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Like Button */}
                        <button
                            onClick={handleLike}
                            disabled={isLikeLoading}
                            className={`group flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${isLiked
                                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                                    : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-500'
                                }`}
                        >
                            {isLikeLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Heart className={`h-5 w-5 transition-transform duration-300 group-hover:scale-125 ${isLiked ? 'fill-current' : ''}`} />
                            )}
                            <span>{likesCount}</span>
                        </button>

                        {/* Comments Toggle */}
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className={`group flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${showComments
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                                    : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-500'
                                }`}
                        >
                            <MessageCircle className="h-5 w-5 transition-transform duration-300 group-hover:scale-125" />
                            <span>{comments.length || initialComments}</span>
                        </button>
                    </div>
                </div>

                {/* Feedback Message */}
                {feedbackMessage && (
                    <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200">
                        <p className="text-emerald-800 font-semibold text-center">{feedbackMessage}</p>
                    </div>
                )}
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="p-8 space-y-8">
                    {/* New Comment Form */}
                    {isSignedIn && currentSignedInUser ? (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                            <div className="flex items-start gap-4">
                                <Link href={`/${lang}/users/${currentSignedInUser.id}`} className="flex-shrink-0">
                                    <div className="relative">
                                        <img
                                            src={currentSignedInUser.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentSignedInUser.fullName || currentSignedInUser.firstName || 'U')}&background=random&color=fff&size=128`}
                                            alt={currentSignedInUser.fullName || 'User'}
                                            className="w-12 h-12 rounded-full border-2 border-white shadow-lg object-cover"
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                                            <CheckCircle className="h-2 w-2 text-white" />
                                        </div>
                                    </div>
                                </Link>

                                <div className="flex-grow space-y-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-bold text-slate-900">
                                                {currentSignedInUser.fullName || currentSignedInUser.firstName || 'User'}
                                            </span>
                                            <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 border border-blue-200 rounded-full text-xs font-bold text-blue-700">
                                                <Shield className="h-3 w-3" />
                                                Verified
                                            </div>
                                        </div>
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Share your thoughts on this article..."
                                            className="w-full p-4 text-sm border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 resize-none transition-all duration-300"
                                            rows={4}
                                            onKeyPress={(e) => e.key === 'Enter' && e.ctrlKey && !isSubmittingComment && newComment.trim() && handleCommentSubmit()}
                                        />
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-slate-500">
                                            Press Ctrl+Enter to submit, or click the button
                                        </p>
                                        <button
                                            onClick={handleCommentSubmit}
                                            disabled={isSubmittingComment || !newComment.trim()}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
                                        >
                                            {isSubmittingComment ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Send className="h-4 w-4" />
                                            )}
                                            <span>Comment</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="max-w-md mx-auto">
                                <div className="p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl mb-6">
                                    <Shield className="h-12 w-12 text-slate-400 mx-auto" />
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-2">Join the Discussion</h4>
                                <p className="text-slate-600 mb-6">Sign in to share your thoughts and engage with our community</p>
                                <Link
                                    href={`/${lang}/sign-in`}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl"
                                >
                                    <Sparkles className="h-5 w-5" />
                                    Sign In to Comment
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-6">
                        {isLoadingComments ? (
                            <div className="text-center py-12">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl">
                                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                    </div>
                                    <p className="text-slate-600 font-medium">Loading comments...</p>
                                </div>
                            </div>
                        ) : comments.length > 0 ? (
                            comments.map(comment => {
                                const commenterProfileLink = `/${lang}/users/${comment.userId}`;
                                const commenterName = comment.userFullName || 'Anonymous User';
                                const commenterAvatar = comment.userAvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(commenterName)}&background=random&color=fff&size=128`;
                                const commenterRoleConfig = getRoleConfig(comment.userRole);

                                return (
                                    <div key={comment._id} className="group bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:bg-white transition-all duration-300">
                                        <div className="flex items-start gap-4">
                                            {/* Commenter Avatar */}
                                            <Link href={commenterProfileLink} className="flex-shrink-0 group/commenter">
                                                <div className="relative">
                                                    <img
                                                        src={commenterAvatar}
                                                        alt={commenterName}
                                                        className="w-12 h-12 rounded-full border-2 border-white shadow-lg group-hover/commenter:shadow-xl group-hover/commenter:scale-110 transition-all duration-300 object-cover"
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                                                        <CheckCircle className="h-2 w-2 text-white" />
                                                    </div>
                                                </div>
                                            </Link>

                                            {/* Comment Content */}
                                            <div className="flex-grow min-w-0">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Link href={commenterProfileLink} className="group/commenter-name">
                                                        <span className="font-bold text-slate-900 group-hover/commenter-name:text-blue-600 transition-colors duration-300">
                                                            {commenterName}
                                                        </span>
                                                    </Link>

                                                    {commenterRoleConfig && (
                                                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${commenterRoleConfig.bgClass} ${commenterRoleConfig.textClass}`}>
                                                            <commenterRoleConfig.icon className="h-3 w-3" />
                                                            {commenterRoleConfig.label}
                                                        </div>
                                                    )}

                                                    <span className="text-sm text-slate-500">
                                                        {formatTimeAgo(comment.createdAt)}
                                                    </span>
                                                </div>

                                                <div className="prose prose-sm max-w-none">
                                                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                                                        {comment.content}
                                                    </p>
                                                </div>

                                                {/* Comment Actions */}
                                                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-200">
                                                    <button className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-500 rounded-lg text-sm font-semibold transition-all duration-300">
                                                        <ThumbsUp className="h-3 w-3" />
                                                        <span>Like</span>
                                                    </button>
                                                    <button className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-500 rounded-lg text-sm font-semibold transition-all duration-300">
                                                        <MessageCircle className="h-3 w-3" />
                                                        <span>Reply</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12">
                                <div className="max-w-md mx-auto">
                                    <div className="p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl mb-6">
                                        <MessageCircle className="h-12 w-12 text-slate-400 mx-auto" />
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-2">No Comments Yet</h4>
                                    <p className="text-slate-600">Be the first to share your thoughts on this article!</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export { PremiumBlogInteractions };