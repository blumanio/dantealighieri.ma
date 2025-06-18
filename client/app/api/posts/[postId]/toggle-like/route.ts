import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import Post from '@/lib/models/Post';
import mongoose from 'mongoose';

// Define the structure of the response data
interface ResponseData {
    success: boolean;
    message: string;
    likesCount?: number;
    likedByCurrentUser?: boolean;
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ postId: string }> }
): Promise<NextResponse<ResponseData>> {
    try {
        // Get authenticated user ID from Clerk
        const { userId: currentUserId } = await auth();
        if (!currentUserId) {
            console.warn('API Warning - Toggle Like: Unauthorized access attempt.');
            return NextResponse.json({
                success: false,
                message: 'Unauthorized. Please sign in.'
            }, { status: 401 });
        }

        // Await the params object to extract postId
        const { postId } = await params;
        if (!postId || typeof postId !== 'string') {
            console.warn('API Warning - Toggle Like: Post ID is missing or invalid in params.');
            return NextResponse.json({
                success: false,
                message: 'Post ID is required.'
            }, { status: 400 });
        }

        // Validate if the postId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            console.warn(`API Warning - Toggle Like: Invalid Post ID format: ${postId}`);
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
            console.log(`API Info - Toggle Like: Post not found for ID: ${postId}`);
            return NextResponse.json({
                success: false,
                message: 'Post not found.'
            }, { status: 404 });
        }

        // Log current state before update
        console.log(`API Debug - Toggle Like: Post ID: ${postId}, Current User ID: ${currentUserId}`);
        console.log(`API Debug - Toggle Like: Initial post state - likesCount: ${post.likesCount}, likedBy: ${post.likedBy}`);


        // Ensure post.likedBy is an array before calling .includes()
        // If 'likedBy' is undefined or null, it will default to an empty array.
        const hasLiked = (post.likedBy ?? []).includes(currentUserId);

        let likedByCurrentUser: boolean;
        let message: string;
        let updatedPost;

        if (hasLiked) {
            // User has already liked the post, so perform an "unlike" action
            console.log(`API Debug - Toggle Like: Performing 'unlike' for Post ID: ${postId}`);
            updatedPost = await Post.findByIdAndUpdate(
                postId,
                {
                    $pull: { likedBy: currentUserId },
                    $inc: { likesCount: -1 }
                },
                {
                    new: true, // Return the updated document
                    runValidators: true // Run schema validators
                }
            );
            likedByCurrentUser = false;
            message = 'Post unliked successfully.';
        } else {
            // User has not liked the post, so perform a "like" action
            console.log(`API Debug - Toggle Like: Performing 'like' for Post ID: ${postId}`);
            updatedPost = await Post.findByIdAndUpdate(
                postId,
                {
                    $addToSet: { likedBy: currentUserId }, // $addToSet prevents duplicates
                    $inc: { likesCount: 1 }
                },
                {
                    new: true, // Return the updated document
                    runValidators: true // Run schema validators
                }
            );
            likedByCurrentUser = true;
            message = 'Post liked successfully.';
        }

        // Add check to ensure updatedPost is not null after update operation.
        // If it's null, it implies the document wasn't found or updated,
        // possibly due to a concurrent deletion.
        if (!updatedPost) {
            console.error(`API Error - Toggle Like: Failed to find/update post with ID: ${postId}. Document might be missing.`);
            return NextResponse.json({
                success: false,
                message: 'Failed to update post. It might have been removed concurrently.'
            }, { status: 404 });
        }

        // Log updated state
        console.log(`API Debug - Toggle Like: Updated post state - likesCount: ${updatedPost.likesCount}, likedBy: ${updatedPost.likedBy}`);


        // Ensure likesCount doesn't go below 0 (edge case protection)
        if (updatedPost.likesCount < 0) {
            console.warn(`API Warning - Toggle Like: likesCount went below zero for Post ID: ${postId}. Resetting to 0.`);
            updatedPost.likesCount = 0;
            await updatedPost.save(); // Save the corrected likesCount
        }

        // Return a successful response with updated like count and current user's like status
        return NextResponse.json({
            success: true,
            message: message,
            likesCount: updatedPost.likesCount, // Use updatedPost.likesCount directly now that it's guaranteed not null
            likedByCurrentUser: likedByCurrentUser,
        }, { status: 200 });

    } catch (error) {
        console.error('API Error - Toggle Like (Catch Block):', error);

        // Handle specific Mongoose error types for better client feedback
        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json({
                success: false,
                message: `Validation error occurred: ${error.message}` // Include error message for more detail
            }, { status: 400 });
        }

        if (error instanceof mongoose.Error.CastError) {
            return NextResponse.json({
                success: false,
                message: 'Invalid ID format.'
            }, { status: 400 });
        }

        // Handle MongoDB duplicate key errors
        if (error instanceof Error && 'code' in error && error.code === 11000) {
            return NextResponse.json({
                success: false,
                message: 'Duplicate operation detected. This might happen with rapid consecutive requests.'
            }, { status: 409 });
        }

        // Catch any other unexpected errors and return a generic server error
        return NextResponse.json({
            success: false,
            message: 'Internal server error. Please try again later.'
        }, { status: 500 });
    }
}
