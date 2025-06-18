'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, Shield, User } from 'lucide-react';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';
import type { IUniversityCommunityPostComment } from '@/types/community';
import { useLanguage } from '@/context/LanguageContext';
import { IComment } from '@/types/post';

interface CommentsSectionProps {
    comments: IComment[];
    isSignedIn: boolean;
    currentUserAvatar: string;
    currentUserName: string;
    currentUserProfileLink: string;
    newComment: string;
    isSubmittingComment: boolean;
    formatTimeAgo: (dateString: string) => string;
    onCommentChange: (value: string) => void;
    onCommentSubmit: () => void;
    id: string; // Added id prop for CommentInput
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
    comments,
    isSignedIn,
    currentUserAvatar,
    currentUserName,
    currentUserProfileLink,
    newComment,
    isSubmittingComment,
    formatTimeAgo,
    onCommentChange,
    onCommentSubmit
}) => {
    console.log(" cccccccccccccccccCommentsSection props:", {
        comments,
        isSignedIn,
        currentUserAvatar,
    });
    const { language } = useLanguage();

    return (
        <div className="space-y-4">
            {/* Comments List */}
            {comments && comments.length > 0 ? (
                <div className="space-y-3">
                    {comments.map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            formatTimeAgo={formatTimeAgo}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-6">
                    <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                        No comments yet. Be the first to share your thoughts!
                    </p>
                </div>
            )}

            {/* Comment Input or Sign In Prompt */}
            {isSignedIn ? (
                <CommentInput
                    currentUserAvatar={currentUserAvatar}
                    currentUserName={currentUserName}
                    currentUserProfileLink={currentUserProfileLink}
                    newComment={newComment}
                    isSubmittingComment={isSubmittingComment}
                    onCommentChange={onCommentChange}
                    onCommentSubmit={onCommentSubmit}
                />
            ) : (
                <div className="text-center py-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <User className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        Sign in to join the conversation
                    </p>
                    <Link
                        href={`/${language}/sign-in`}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CommentsSection;