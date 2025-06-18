'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, Eye, Crown, Award, Shield, MapPin, MessageSquare, Home, Users as StudyGroupIcon } from 'lucide-react';
import PostTypeIcon from './PostTypeIcon';
import { IPostWithComments } from '@/types/post';
import { useLanguage } from '@/context/LanguageContext';
import { PostCategory } from '@/lib/models/Post';

interface PostHeaderProps {
    post: IPostWithComments;
    formatTimeAgo: (dateString: string) => string;
}

const PostHeader: React.FC<PostHeaderProps> = ({ post, formatTimeAgo }) => {
    const { language, t } = useLanguage();

    // --- NEW: Abbreviation logic for Italian universities ---
    const abbreviateCommunityName = (name: string): string => {
        if (!name) return '';
        return name
            .replace(/Università degli Studi di/i, 'Univ.')
            .replace(/Università di/i, 'Univ.')
            .replace(/Politecnico di/i, 'Poli.');
        // Add other rules here as needed
    };

    const getRoleConfig = (role?: string) => {
        switch (role) {
            case 'mentor':
                return { label: t('roles.mentor' as any, 'Mentor'), bgClass: 'bg-gray-100 border-gray-200', textClass: 'text-gray-700', icon: Crown };
            case 'alumni':
                return { label: t('roles.alumni' as any, 'Alumni'), bgClass: 'bg-gray-100 border-gray-200', textClass: 'text-gray-700', icon: Award };
            case 'student':
                return { label: t('roles.student' as any, 'Student'), bgClass: 'bg-gray-100 border-gray-200', textClass: 'text-gray-700', icon: Shield };
            default:
                return null;
        }
    };

    const getPostCategoryConfig = (category: PostCategory) => {
        const color = 'text-gray-500';
        switch (category as any) {
            case 'discussion':
                return { label: t('postType' as any, 'general'), icon: MessageSquare, color };
            case 'housing_seeking':
                return { label: t('postType' as any, 'housingSeeking'), icon: Home, color };
            case 'housing_offering':
                return { label: t('postType.housingOffering' as any, 'Housing Available'), icon: Home, color };
            default:
                return { label: t('postType.general' as any, 'General'), icon: MessageSquare, color };
        }
    };

    const formatSlugToName = (slug: string | undefined | null) => {
        if (!slug || typeof slug !== 'string') return '';
        return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace(/Di /g, 'di ').replace(/Degli /g, 'degli ').replace(/Della /g, 'della ').replace(/Del /g, 'del ');
    };

    const authorDisplayName = post.author?.firstName && post.author?.lastName ? `${post.author.firstName} ${post.author.lastName}` : post.author?.username || t('common', 'unknownUser');
    const authorDisplayAvatar = post.author?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorDisplayName)}&background=random&color=fff&size=128`;
    const roleConfig = getRoleConfig(undefined);
    const postCategoryConfig = getPostCategoryConfig(post.category);
    const postAuthorProfileLink = `/${language}/users/${post.author.id}`;

    let communityDisplayName = '';
    let communityLink = '';

    if (post.communityType && post.communitySlug) {
        const rawCommunityName = post.communityName || formatSlugToName(post.communitySlug);
        communityDisplayName = abbreviateCommunityName(rawCommunityName); // Apply abbreviation
        communityLink = `/${language}/${post.communityType.toLowerCase()}/${post.communitySlug}`;
    } else if (post.communityName) {
        communityDisplayName = abbreviateCommunityName(post.communityName); // Apply abbreviation
        communityLink = `/${language}/community`;
    }

    return (
        <div className="flex items-start gap-3 mb-4  sm:px-0">
            <Link href={postAuthorProfileLink} className="flex-shrink-0">
                <img src={authorDisplayAvatar} alt={authorDisplayName} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
            </Link>

            <div className="flex-grow min-w-0">
                {/* --- RESTRUCTURED SECTION 1: Community + Date --- */}
                <div className="flex items-center justify-between mb-1">
                    <Link href={communityLink} className="min-w-0">
                        <h4 className="text-base font-semibold text-gray-900 truncate hover:text-gray-700 transition-colors" title={post.communityName}>
                            {communityDisplayName || t('postType.general' as any, 'General')}
                        </h4>
                    </Link>
                    <time dateTime={post.createdAt.toISOString()} className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {formatTimeAgo(post.createdAt.toISOString())}
                    </time>
                </div>

                {/* --- RESTRUCTURED SECTION 2: Author + Role --- */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
                    <Link href={postAuthorProfileLink}>
                        <span className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                            {authorDisplayName}
                        </span>
                    </Link>
                    {roleConfig && (
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs ${roleConfig.bgClass} ${roleConfig.textClass}`}>
                            <roleConfig.icon className="h-2.5 w-2.5" />
                            <span>{roleConfig.label}</span>
                        </div>
                    )}
                </div>

                {/* --- RESTRUCTURED SECTION 3: Other Metadata --- */}
                <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className={`inline-flex items-center gap-1.5 ${postCategoryConfig.color}`}>
                        <postCategoryConfig.icon className="h-2.5 w-2.5" />
                        <span>{postCategoryConfig.label}</span>
                    </div>
                    {/* <div className="flex items-center gap-1">
                        <Eye className="h-2.5 w-2.5" />
                        <span>{Math.floor(Math.random() * 100) + 10}</span>
                    </div> */}
                </div>
            </div>
            {/* <div className="flex-shrink-0">
                <PostTypeIcon category={post.category} />
            </div> */}
        </div>
    );
};

export default PostHeader;