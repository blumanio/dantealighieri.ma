import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import Post from '@/lib/models/Post'; // Ensure this path is correct
import mongoose from 'mongoose';

// Define the structure of the response data
interface ResponseData {
    success: boolean;
    message: string;
    bookmarksCount?: number; // Optional, to return the updated count
    bookmarkedByCurrentUser?: boolean; // Optional, to indicate current user's bookmark status
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ postId: string }> }
): Promise<NextResponse<ResponseData>> {
    try {
        // Get authenticated user ID from Clerk
        const { userId: currentUserId } = await auth();
        if (!currentUserId) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized. Please sign in.'
            }, { status: 401 });
        }

        // Await the params object to extract postId
        const { postId } = await params;
        if (!postId || typeof postId !== 'string') {
            return NextResponse.json({
                success: false,
                message: 'Post ID is required.'
            }, { status: 400 });
        }

        // Validate if the postId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return NextResponse.json({
                success: false,
                message: 'Invalid Post ID format.'
            }, { status: 400 });
        }

        // Establish connection to the database
        await dbConnect();

        // Find the post by its ID
        const post = await Post.findById(postId);
        if (!post) {
            return NextResponse.json({
                success: false,
                message: 'Post not found.'
            }, { status: 404 });
        }

        // Initialize bookmarkedBy array if it does not exist on the post document
        if (!post.bookmarkedBy) { // Make sure 'bookmarkedBy' is in your Post schema
            post.bookmarkedBy = [];
        }

        // Determine if the current user has already bookmarked the post
        const userIndexInBookmarkedBy = post.bookmarkedBy.findIndex(
            (userId: string) => userId.toString() === currentUserId
        );

        let bookmarkedByCurrentUser: boolean;
        let message: string;

        if (userIndexInBookmarkedBy > -1) {
            // User has already bookmarked the post, so perform an "unbookmark" action
            post.bookmarkedBy.splice(userIndexInBookmarkedBy, 1); // Remove user from bookmarkedBy array
            post.bookmarksCount = Math.max(0, (post.bookmarksCount || 0) - 1); // Decrement bookmarks count
            bookmarkedByCurrentUser = false;
            message = 'Post unbookmarked successfully.';
        } else {
            // User has not bookmarked the post, so perform a "bookmark" action
            post.bookmarkedBy.push(currentUserId); // Add user to bookmarkedBy array
            post.bookmarksCount = (post.bookmarksCount || 0) + 1; // Increment bookmarks count
            bookmarkedByCurrentUser = true;
            message = 'Post bookmarked successfully.';
        }

        // Save the updated post document back to the database
        await post.save();

        // Return a successful response with updated bookmark count and current user's bookmark status
        return NextResponse.json({
            success: true,
            message: message,
            bookmarksCount: post.bookmarksCount, // Send the updated count
            bookmarkedByCurrentUser: bookmarkedByCurrentUser,
        }, { status: 200 });

    } catch (error) {
        console.error('API Error - Toggle Bookmark:', error);

        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json({
                success: false,
                message: 'Validation error occurred.'
            }, { status: 400 });
        }

        if (error instanceof mongoose.Error.CastError) {
            return NextResponse.json({
                success: false,
                message: 'Invalid ID format.'
            }, { status: 400 });
        }

        return NextResponse.json({
            success: false,
            message: 'Internal server error. Please try again later.'
        }, { status: 500 });
    }
}
