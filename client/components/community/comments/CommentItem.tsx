'use client';

import React from 'react';
import Link from 'next/link';
import { Crown, Award, Shield } from 'lucide-react';
import { IUniversityCommunityPostComment } from '@/types/community';
import { useLanguage } from '@/context/LanguageContext';
import { IComment } from '@/types/post';

interface CommentItemProps {
    comment: IComment;
    formatTimeAgo: (dateString: string) => string;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, formatTimeAgo }) => {
    const { language, t } = useLanguage();

    const getRoleConfig = (role?: string) => {
        switch (role) {
            case 'mentor':
                return { label: 'Mentor', bgClass: 'bg-blue-100 border-blue-200', textClass: 'text-blue-700', icon: Crown };
            case 'alumni':
                return { label: 'Alumni', bgClass: 'bg-emerald-100 border-emerald-200', textClass: 'text-emerald-700', icon: Award };
            case 'student':
                return { label: 'Student', bgClass: 'bg-purple-100 border-purple-200', textClass: 'text-purple-700', icon: Shield };
            default:
                return null
        }
    };

    const commenterProfileLink = `/${language}/users/${comment.author?.username || comment.author?.id}`;
    const commenterName = comment.author?.firstName || t('common', 'unknownUser');
    const commenterAvatar = comment.author?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(commenterName)}&background=random&color=fff&size=128`;
    const commenterRoleConfig = getRoleConfig(comment.author?.role);

    return (
        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all duration-300">
            <Link href={commenterProfileLink} className="flex-shrink-0 group/commenter">
                <img src={commenterAvatar} alt={commenterName} className="w-10 h-10 rounded-full border-2 border-white shadow-md group-hover/commenter:shadow-lg group-hover/commenter:scale-110 transition-all duration-300 object-cover" />
            </Link>

            <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-2">
                    <Link href={commenterProfileLink} className="group/commenter-name">
                        <span className="font-bold text-slate-900 text-sm group-hover/commenter-name:text-blue-600 transition-colors duration-300">{commenterName}</span>
                    </Link>
                    {commenterRoleConfig && (
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${commenterRoleConfig.bgClass} ${commenterRoleConfig.textClass}`}>
                            <commenterRoleConfig.icon className="h-3 w-3" />
                            {commenterRoleConfig.label}
                        </div>
                    )}
                    <span className="text-xs text-slate-500">{formatTimeAgo(String(comment.createdAt))}</span>
                </div>
                <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">{comment.content}</p>
            </div>
        </div>
    );
};

export default CommentItem;