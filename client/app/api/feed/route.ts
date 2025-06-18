// app/api/feed/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import dbConnect from '@/lib/dbConnect';
import UniversityCommunityPostModel, { IUniversityCommunityPost, IUniversityCommunityPostComment } from '@/lib/models/UniversityCommunityPost'; // Ensure correct path
import { IComment } from '@/types/post';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

// Updated FeedPost interface to match your example response
export interface FeedPost {
    _id: string;
    userId: string; // Clerk User ID of the post author (could be admin or claimed user)
    userFullName: string;
    userAvatarUrl?: string;
    userRole?: string;
    postType: IUniversityCommunityPost['postType'];
    content: string;
    tags?: string[];
    comments: Array<{ // Structure of comments in the feed
        _id: string;
        userId: string; // Clerk User ID of the commenter
        userFullName: string;
        userAvatarUrl?: string;
        userRole?: string;
        content: string;
        createdAt: string;
        updatedAt: string; // Added based on your example
    }>;
    createdAt: string;
    updatedAt: string;
    universitySlug: string;
    // title and imageUrl are intentionally omitted as per your model and example
    likedBy: string[];
    bookmarkedBy: string[];
    likesCount: number;
    bookmarksCount: number;
    isLikedByCurrentUser: boolean;
    isBookmarkedByCurrentUser: boolean;

    // The following fields from your main model are intentionally omitted for feed brevity
    // If you need them, add them to this interface and the mapping logic below.
    // housingDetails?: any;
    // studyGroupDetails?: any;
    // originalFacebookUsername?: string;
    // ... other Facebook/claiming fields
}

interface FeedResponse {
    posts: FeedPost[];
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    limit: number;
}

export async function GET(request: Request) {
    try {
        const { userId: currentUserId } = await auth();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || `${DEFAULT_PAGE}`, 10);
        const limit = parseInt(searchParams.get('limit') || `${DEFAULT_LIMIT}`, 10);
        const universitySlug = searchParams.get('universitySlug');

        if (isNaN(page) || page < 1) {
            return NextResponse.json({ message: 'Invalid page number.' }, { status: 400 });
        }
        if (isNaN(limit) || limit < 1 || limit > 100) {
            return NextResponse.json({ message: 'Invalid limit value.' }, { status: 400 });
        }

        await dbConnect();

        const query: any = {};
        if (universitySlug) {
            query.universitySlug = universitySlug;
        }
        query.isArchived = { $ne: true }; // Typically, don't show archived posts in feed

        const totalPosts = await UniversityCommunityPostModel.countDocuments(query);
        const totalPages = Math.ceil(totalPosts / limit);
        const skip = (page - 1) * limit;

        // Fetch posts using the UniversityCommunityPostModel
        const postsFromDb = await UniversityCommunityPostModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean({ virtuals: true }); // Crucial for performance and including virtuals

        const processedPosts: FeedPost[] = postsFromDb.map(post => {
            // The 'post' object here is a plain JS object due to .lean()
            // It includes virtuals like likesCount and bookmarksCount

            // Explicitly cast to include fields from the Mongoose document that might not be in FeedPost yet
            const sourcePost = post as any as (IUniversityCommunityPost & { likesCount: number; bookmarksCount: number; });

            return {
                _id: (sourcePost._id as string | { toString(): string }).toString(),
                userId: sourcePost.userId, // This is the Clerk User ID stored on the post
                userFullName: sourcePost.userFullName,
                userAvatarUrl: sourcePost.userAvatarUrl,
                userRole: sourcePost.userRole,
                postType: sourcePost.postType,
                content: sourcePost.content,
                tags: sourcePost.tags || [],
                comments: (sourcePost.comments || []).map(comment => {
                    const com = comment as any as IComment; // Cast to ensure properties
                    return {
                        _id: (com._id as { toString(): string }).toString(),
                        userId: com.authorId, // Clerk User ID of the commenter
                        userFullName: com.author?.firstName || com.author?.username || '', // Add userFullName as required
                        userAvatarUrl: com.author?.imageUrl,
                        userRole: com.author?.role,
                        content: com.content,
                        createdAt: com.createdAt.toISOString(),
                        updatedAt: com.updatedAt.toISOString(), // Included now
                    };
                }),
                createdAt: sourcePost.createdAt.toISOString(),
                updatedAt: sourcePost.updatedAt.toISOString(),
                universitySlug: sourcePost.universitySlug,
                likedBy: (sourcePost.likedBy || []).map(id => id.toString()),
                bookmarkedBy: (sourcePost.bookmarkedBy || []).map(id => id.toString()),
                likesCount: sourcePost.likesCount, // Provided by virtual
                bookmarksCount: sourcePost.bookmarksCount, // Provided by virtual
                isLikedByCurrentUser: currentUserId ? (sourcePost.likedBy || []).map(id => id.toString()).includes(currentUserId) : false,
                isBookmarkedByCurrentUser: currentUserId ? (sourcePost.bookmarkedBy || []).map(id => id.toString()).includes(currentUserId) : false,
            };
        });

        const responseData: FeedResponse = {
            posts: processedPosts,
            currentPage: page,
            totalPages: totalPages,
            totalPosts: totalPosts,
            limit: limit,
        };

        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error('API Error - GET /api/feed:', error);
        let message = 'Internal server error.';
        if (error instanceof Error) {
            message = error.message;
        }
        return NextResponse.json({ message }, { status: 500 });
    }
}