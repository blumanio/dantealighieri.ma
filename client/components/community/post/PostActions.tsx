'use client';

import React from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';

interface PostActionsProps {
    isLiked: boolean;
    isBookmarked: boolean;
    localLikesCount: number;
    commentsCount: number;
    onLike: () => void;
    onBookmark: () => void;
    onToggleComments: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({
    isLiked,
    isBookmarked,
    localLikesCount,
    commentsCount,
    onLike,
    onBookmark,
    onToggleComments
}) => {
    return (
        <div className="flex items-center justify-between py-3 border-t border-gray-200/80 dark:border-gray-700/60 mt-4">
            <div className="flex items-center gap-2">
                {/* Like Button */}
                <button
                    onClick={onLike}
                    className={`group flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-sm ${
                        isLiked
                            ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                            : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600'
                    }`}
                >
                    <Heart className={`h-5 w-5 transition-transform duration-300 group-hover:scale-125 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{localLikesCount} Likes</span>
                </button>

                {/* Comment Button */}
                <button
                    onClick={onToggleComments}
                    className="group flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-sm text-slate-600 dark:text-slate-400  "
                >
                    <MessageCircle className="h-5 w-5 transition-transform duration-300 group-hover:scale-125" />
                    <span>{commentsCount} Comments</span>
                </button>

                 {/* Share Button */}
                <button className="group flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-sm text-slate-600 dark:text-slate-400 hover:bg-green-50 dark:hover:bg-green-500/10 hover:text-green-600">
                    <Share2 className="h-5 w-5 transition-transform duration-300 group-hover:scale-125" />
                    <span>Share</span>
                </button>
            </div>

            {/* --- BOOKMARK BUTTON UPDATED HERE --- */}
            <button
                onClick={onBookmark}
                className={`group p-2 rounded-lg transition-all duration-200 ${
                    isBookmarked
                        // Active (bookmarked) state: keeps the yellow background and icon color
                        ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                        // Default state: no background on hover, icon turns orange
                        : 'text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400'
                }`}
                title="Bookmark"
            >
                <Bookmark className={`h-5 w-5 transition-transform duration-300 group-hover:scale-125 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
        </div>
    );
};

export default PostActions;