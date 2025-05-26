// components/university-hub/CommunityPostCard.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, ThumbsUp, User, CalendarDays, Tag, Home, BookOpen, Users as StudyGroupIcon, Loader2, Send } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useLanguage } from '@/context/LanguageContext';

// Re-using types from UniversityHubPage or a shared types file
interface Comment { _id: string; userId: string; userFullName: string; userAvatarUrl?: string; userRole?: string; content: string; createdAt: string; }
export interface CommunityPost {
    _id: string; userId: string; userFullName: string; userAvatarUrl?: string; userRole?: string;
    postType: 'discussion' | 'housing_seeking' | 'housing_offering' | 'study_group_looking' | 'study_group_forming';
    title?: string; content: string; tags?: string[]; housingDetails?: any; studyGroupDetails?: any;
    comments: Comment[]; createdAt: string; universitySlug: string;
}

interface CommunityPostCardProps {
    post: CommunityPost;
    onCommentSubmit: (postId: string, commentText: string) => Promise<void>; // To handle comment submission logic in parent
}

const PostTypeIcon: React.FC<{ type: CommunityPost['postType'] }> = ({ type }) => {
    switch (type) {
        case 'discussion': return <MessageCircle size={18} className="text-blue-500" />;
        case 'housing_seeking':
        case 'housing_offering': return <Home size={18} className={type === 'housing_offering' ? "text-red-500" : "text-green-500"} />;
        case 'study_group_looking':
        case 'study_group_forming': return <StudyGroupIcon size={18} className="text-purple-500" />;
        default: return <MessageCircle size={18} className="text-gray-500" />;
    }
};


const CommunityPostCard: React.FC<CommunityPostCardProps> = ({ post, onCommentSubmit }) => {
    const { language, t } = useLanguage();
    const { isSignedIn, user } = useUser();
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const handleInternalCommentSubmit = async () => {
        if (!newComment.trim()) return;
        setIsSubmittingComment(true);
        await onCommentSubmit(post._id, newComment);
        setNewComment(''); // Clear input after submission (parent should update comments list)
        setIsSubmittingComment(false);
    };

    const roleDisplay = post.userRole
        ? t('profileFieldLabels', `role_${post.userRole}`, { defaultValue: post.userRole.charAt(0).toUpperCase() + post.userRole.slice(1) })
        : '';

    return (
        <article className="bg-white p-4 sm:p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-neutral-200">
            {/* Post Header */}
            <div className="flex items-start gap-3 mb-3">
                <img
                    src={post.userAvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.userFullName)}&background=random&color=fff`}
                    alt={post.userFullName}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-neutral-100"
                />
                <div className="flex-grow">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-textPrimary text-sm sm:text-base">{post.userFullName}</span>
                        {roleDisplay && (
                            <span className={`text-[0.65rem] font-semibold px-1.5 py-0.5 rounded-full
                                ${post.userRole === 'mentor' ? 'bg-blue-100 text-blue-700' :
                                    post.userRole === 'alumni' ? 'bg-green-100 text-green-700' :
                                        'bg-teal-100 text-teal-700'}`}>
                                {roleDisplay}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-textSecondary">
                        <time dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleString(language, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</time>
                    </p>
                </div>
                <div className="flex-shrink-0" title={t('universityHubs', `postType_${post.postType}`, { defaultValue: post.postType })}>
                    <PostTypeIcon type={post.postType} />
                </div>
            </div>

            {/* Post Content */}
            {post.title && <h4 className="text-md sm:text-lg font-semibold text-primary mb-1.5">{post.title}</h4>}
            <p className="text-sm text-textSecondary whitespace-pre-wrap leading-relaxed">{post.content}</p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.map(tag => (
                        <span key={tag} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">#{tag}</span>
                    ))}
                </div>
            )}

            {/* Actions & Comments Toggle */}
            <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-between items-center">
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                >
                    <MessageCircle size={14} />
                    {showComments ? t('universityHubs', 'hideComments') : t('universityHubs', 'showComments', { count: post.comments?.length || 0 })}
                </button>
                {/* Add like button or other actions here if needed */}
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-3 space-y-3">
                    {post.comments && post.comments.length > 0 ? post.comments.map(comment => (
                        <div key={comment._id} className="flex items-start gap-2 p-2.5 bg-neutral-50 rounded-lg border border-neutral-100">
                            <img src={comment.userAvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userFullName)}&background=random&color=fff`} alt={comment.userFullName} className="w-8 h-8 rounded-full" />
                            <div className="flex-grow">
                                <p className="text-xs font-semibold text-textPrimary">
                                    {comment.userFullName}
                                    {comment.userRole && <span className={`ml-1 text-[0.6rem] font-medium px-1 py-0.5 rounded-full
                                        ${comment.userRole === 'mentor' ? 'bg-blue-100 text-blue-600' :
                                            comment.userRole === 'alumni' ? 'bg-green-100 text-green-600' :
                                                'bg-teal-100 text-teal-600'}`}>
                                        {t('profileFieldLabels', `role_${comment.userRole}`, { defaultValue: comment.userRole })}
                                    </span>}
                                </p>
                                <p className="text-xs text-textSecondary whitespace-pre-wrap">{comment.content}</p>
                                <p className="text-[0.65rem] text-neutral-400 mt-0.5">{new Date(comment.createdAt).toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>
                    )) : <p className="text-xs text-textSecondary text-center py-2">{t('universityHubs', 'noCommentsYet', { defaultValue: "No comments yet." })}</p>}

                    {isSignedIn && (
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder={t('universityHubs', 'addCommentPlaceholder')}
                                className="flex-grow p-2 text-xs border border-neutral-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary"
                                onKeyPress={(e) => e.key === 'Enter' && !isSubmittingComment && newComment.trim() && handleInternalCommentSubmit()}
                            />
                            <button onClick={handleInternalCommentSubmit} disabled={isSubmittingComment || !newComment.trim()}
                                className="p-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-60 transition-colors">
                                {isSubmittingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={16} />}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </article>
    );
};

export default CommunityPostCard;