import { Document } from 'mongoose';
import { IComment } from '@/types/post';

// --- Base Schemas from your Models ---
// It's good practice to have these interfaces available for the transformation logic.

// From lib/models/Post.ts
export interface IPost extends Document {
    authorId: string;
    content: string;
    parentType: 'University' | 'Course';
    parentId: string;
    parentName: string;
    parentSlug: string;
    commentsCount: number;
    createdAt: Date;
    updatedAt: Date;
}

// From lib/models/UniversityCommunityPost.ts
export interface IUniversityCommunityPostComment {
    userId: string;
    userFullName: string;
    userAvatarUrl?: string;
    content: string;
    createdAt: string;
    userRole?: 'community_member' | 'student' | 'mentor';
    postId: string;
    authorUsername?: string;
    id?: string; // Optional ID for testing purposes
}
export interface IUniversityCommunityPost extends Document {
    universitySlug: string;
    userId: string;
    userFullName: string;
    userAvatarUrl?: string;
    postType: string;
    content: string;
    tags?: string[];
    comments: IComment[];
    likedBy: string[];
    bookmarkedBy: string[];
    createdAt: Date;
    updatedAt: Date;
}


// --- NEW UNIFIED DISPLAY TYPE ---

/**
 * This is the new, unified shape for any post to be displayed in the feed.
 * Both IPost and IUniversityCommunityPost objects will be transformed into this shape.
 * Your UI components should ONLY consume this type.
 */
export interface DisplayablePost {
    _id: string;
    authorName: string;
    authorAvatarUrl?: string;
    // 'sourceType' helps the UI distinguish the origin of the post.
    sourceType: 'community' | 'general';
    title: string,
    // Optional fields that may not exist on all post types
    likesCount: number;
    commentsCount: number;
    authorId: string;
    parentType: 'University' | 'Course';
    parentId: string;
    parentName: string;
    parentSlug: string;
    universitySlug: string;
    userId: string;
    userFullName: string;
    userAvatarUrl?: string;
    postType: string;
    content: string;
    tags?: string[];
    comments: IUniversityCommunityPostComment[];
    likedBy: string[];
    bookmarkedBy: string[];
    createdAt: Date;
    updatedAt: Date;
}

interface Comment extends IUniversityCommunityPostComment {
    id?: string; // Optional ID for testing purposes
}
// Base interfaces for common fields
interface BaseAuthor {
    authorId?: string;
    userId?: string;
    authorUsername?: string;
    userFullName?: string;
    authorFirstName?: string;
    authorLastName?: string;
    authorImageUrl?: string;
    userAvatarUrl?: string;
}

interface BaseComment {
    _id: string;
    authorId: string;
    postId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    authorUsername: string;
    authorImageUrl: string;
    authorFirstName: string;
    authorLastName: string;
}

interface BasePost {
    _id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    isArchived?: boolean;
}

// University-specific post (from first response)
interface UniversityPost extends BasePost, BaseAuthor {
    parentType: "University";
    parentId: string;
    parentName: string;
    parentSlug: string;
    commentsCount: number;
    comments: BaseComment[];
}

// Community post with admin details
interface AdminDetails {
    _id: string;
    personalData: {
        firstName: string;
        lastName: string;
    };
}

// Community post (from second response)
interface CommunityPost extends BasePost, BaseAuthor {
    universitySlug: string;
    userRole: "community_member" | "student" | "mentor";
    postType: "discussion" | "housing_seeking" | "housing_offering";
    title?: string;
    tags: string[];
    comments: any[]; // Could be BaseComment[] or different structure
    originalFacebookUsername?: string;
    isClaimable?: boolean;
    claimedByUserId?: string | null;
    originalUserCountry?: string;
    postedByAdminId?: AdminDetails | null;
}

// Union type for all post types
type Post = UniversityPost | CommunityPost;

// Response structures
interface UniversityPostsResponse {
    posts: UniversityPost[];
    currentPage: number;
    totalPages: number;
    totalPosts: number;
}

interface CommunityPostsResponse {
    success: boolean;
    data: CommunityPost[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalPosts: number;
    };
}

// Unified response type
type PostsResponse = UniversityPostsResponse | CommunityPostsResponse;

// Type guards to distinguish between post types
function isUniversityPost(post: Post): post is UniversityPost {
    return 'parentType' in post && post.parentType === 'University';
}

function isCommunityPost(post: Post): post is CommunityPost {
    return 'universitySlug' in post && 'userRole' in post;
}

// Type guards for response types
function isUniversityPostsResponse(response: PostsResponse): response is UniversityPostsResponse {
    return 'posts' in response;
}

function isCommunityPostsResponse(response: PostsResponse): response is CommunityPostsResponse {
    return 'success' in response && 'data' in response;
}

// Utility type to extract posts from either response format
type ExtractedPosts<T extends PostsResponse> =
    T extends UniversityPostsResponse ? T['posts'] :
    T extends CommunityPostsResponse ? T['data'] :
    never;

// Helper function to normalize responses
function extractPostsFromResponse(response: PostsResponse): Post[] {
    if (isUniversityPostsResponse(response)) {
        return response.posts;
    } else if (isCommunityPostsResponse(response)) {
        return response.data;
    }
    return [];
}

// Export all types
export type {
    BaseAuthor,
    BaseComment,
    BasePost,
    UniversityPost,
    CommunityPost,
    AdminDetails,
    Post,
    UniversityPostsResponse,
    CommunityPostsResponse,
    PostsResponse,
    ExtractedPosts,
};
export {
    isUniversityPost,
    isCommunityPost,
    isUniversityPostsResponse,
    isCommunityPostsResponse,
    extractPostsFromResponse
};