'use client';

import React from 'react';
import Link from 'next/link';
import { Loader2, Send } from 'lucide-react';

interface CommentInputProps {
    currentUserAvatar: string;
    currentUserName: string;
    currentUserProfileLink: string;
    newComment: string;
    isSubmittingComment: boolean;
    onCommentChange: (value: string) => void;
    onCommentSubmit: () => void;
}

const CommentInput: React.FC<CommentInputProps> = ({
    currentUserAvatar,
    currentUserName,
    currentUserProfileLink,
    newComment,
    isSubmittingComment,
    onCommentChange,
    onCommentSubmit
}) => {
    return (
        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
            <Link href={currentUserProfileLink} className="flex-shrink-0">
                <img src={currentUserAvatar} alt={currentUserName} className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover" />
            </Link>

            <div className="flex-grow">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => onCommentChange(e.target.value)}
                    placeholder="Add a thoughtful comment..."
                    className="w-full p-3 text-sm border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 font-medium transition-all duration-300 mb-3"
                    onKeyPress={(e) => e.key === 'Enter' && !isSubmittingComment && newComment.trim() && onCommentSubmit()}
                />
                <div className="flex justify-end">
                    <button
                        onClick={onCommentSubmit}
                        disabled={isSubmittingComment || !newComment.trim()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
                    >
                        {isSubmittingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        <span className="text-sm">Comment</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentInput;