// app/api/university-hubs/[universitySlug]/community-posts/[postId]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node'; // Correct import for clerkClient
import dbConnect from '@/lib/dbConnect';
import UniversityCommunityPost from '@/lib/models/UniversityCommunityPost';
import UserProfileDetail from '@/lib/models/UserProfileDetail'; // Assuming this is for custom app-specific role
import mongoose, { Types } from 'mongoose';

import Comment from '@/lib/models/Comment'; // Your Comment model
import Post from '@/lib/models/Post'; // Your Post model

async function getClerkUserDetails(userId: string) {
    try {
        const user = await clerkClient.users.getUser(userId);
        return {
            fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous User',
            avatarUrl: user.imageUrl,
            // Optional: You could also fetch a role from user.publicMetadata if that's your source of truth
            // clerkRole: user.publicMetadata.role as string || 'student',
        };
    } catch (error) {
        console.warn(`Failed to fetch user details from Clerk for userId ${userId}:`, (error as Error).message);
        // Fallback if Clerk fetch fails (e.g., user deleted, network issue)
        return {
            fullName: 'User (Details Unavailable)',
            avatarUrl: undefined, // Or a default avatar placeholder
        };
    }
}

// --- CREATE a new comment ---
export async function POST(request: Request, { params }: { params: { postId: string } }) {
    console.log(`📝 POST /api/posts/${params.postId}/comments called`);
    try {
        const { userId: adminUserId } = getAuth(request as any);
        if (!adminUserId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { postId } = params;
        const body = await request.json();
        const { content, userFullName, userAvatarUrl, userId }: {
            content: string;
            userFullName?: string; // Original commenter name
            userAvatarUrl?: string; // Original commenter avatar
            userId?: string; // Original commenter external ID
        } = body;

        if (!content) {
            return new NextResponse('Comment content is required', { status: 400 });
        }

        // --- Handle authorId for comments ---
        let commentAuthorClerkId = adminUserId; // Default to admin creating the comment

        if (userFullName && userId) { // If an external user is provided
            try {
                const existingClerkUsers = await clerkClient.users.getUserList({ query: userId });
                let foundClerkUser = existingClerkUsers.find(u => u.publicMetadata?.externalId === userId);

                if (foundClerkUser) {
                    commentAuthorClerkId = foundClerkUser.id;
                    console.log(`✅ Found existing Clerk user for external ID ${userId}: ${commentAuthorClerkId}`);
                } else {
                    // Create a placeholder Clerk user for the commenter
                    const placeholderUser = await clerkClient.users.createUser({
                        firstName: userFullName.split(' ')[0] || 'Placeholder',
                        lastName: userFullName.split(' ').slice(1).join(' ') || 'User',
                        externalId: userId,
                        // imageUrl is not a valid property for CreateUserParams and has been removed
                        publicMetadata: {
                            isPlaceholder: true,
                            externalId: userId,
                        }
                    });
                    commentAuthorClerkId = placeholderUser.id;
                    console.log(`➕ Created placeholder Clerk user for external ID ${userId}: ${commentAuthorClerkId}`);
                }
            } catch (clerkErr) {
                console.error("❌ Error finding/creating Clerk user for external comment:", clerkErr);
                // Fallback or error handling
            }
        }

        await dbConnect();
        const newComment = await Comment.create({
            postId,
            authorId: commentAuthorClerkId, // Use resolved Clerk ID
            content,
            originalAuthorFullName: userFullName,
            originalAuthorAvatarUrl: userAvatarUrl,
            originalAuthorExternalId: userId,
        });

        // Increment commentsCount on the parent post
        await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error('💥 [COMMENTS_POST] Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// --- EDIT an existing comment ---
export async function PUT(req: NextRequest, { params }: { params: { universitySlug: string, postId: string } }) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized: User not signed in.' }, { status: 401 });
        }
        console.log(`API PUT .../comments for post ${params.postId} by user ${userId}`);

        await dbConnect();
        const { postId } = params;
        const body = await req.json();
        const { commentId, content } = body; // Client must send commentId and new content

        if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
            return NextResponse.json({ success: false, message: 'Valid Comment ID is required.' }, { status: 400 });
        }
        if (!content || typeof content !== 'string' || content.trim() === "") {
            return NextResponse.json({ success: false, message: 'New comment content is required and cannot be empty.' }, { status: 400 });
        }
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return NextResponse.json({ success: false, message: 'Invalid Post ID format.' }, { status: 400 });
        }

        // Find the post and check if the comment exists and belongs to the user
        const post = await UniversityCommunityPost.findOne({ _id: postId, "comments._id": commentId });

        if (!post) {
            return NextResponse.json({ success: false, message: 'Post or specific comment not found.' }, { status: 404 });
        }

        const commentToUpdate = post.comments.find((comment: any) => comment._id.equals(new Types.ObjectId(commentId)));

        if (!commentToUpdate) {
            return NextResponse.json({ success: false, message: 'Comment not found within the post.' }, { status: 404 });
        }

        if (commentToUpdate.authorId.toString() !== userId) {
            return NextResponse.json({ success: false, message: 'Forbidden: You can only edit your own comments.' }, { status: 403 });
        }

        // Update the specific comment's content and updatedAt timestamp
        const updateResult = await UniversityCommunityPost.updateOne(
            { _id: postId, "comments._id": commentId },
            {
                $set: {
                    "comments.$.content": content.trim(),
                    "comments.$.updatedAt": new Date() // Update the timestamp
                }
            }
        );

        if (updateResult.matchedCount === 0) {
            return NextResponse.json({ success: false, message: 'Comment not found during update operation.' }, { status: 404 });
        }
        if (updateResult.modifiedCount === 0 && updateResult.matchedCount === 1) {
            // Content was the same, but we can still return the comment as if "updated" (e.g. timestamp might have changed if schema handles it)
            // Or simply indicate no change was made if desired. For simplicity, fetch and return.
        }

        // Fetch the updated post and then the specific comment to return the updated data
        const updatedPostData = await UniversityCommunityPost.findById(postId).lean();
        const finalUpdatedComment = updatedPostData?.comments.find((c: any) => c._id.equals(new Types.ObjectId(commentId)));

        if (!finalUpdatedComment) {
            console.error(`Failed to retrieve updated comment (ID: ${commentId}) in post ${postId} after updateOne.`);
            return NextResponse.json({ success: false, message: 'Comment updated but could not be retrieved immediately.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: finalUpdatedComment, message: "Comment updated successfully!" }, { status: 200 });

    } catch (error: any) {
        console.error(`API PUT .../comments Error for post ${params.postId}:`, error);
        if (error.name === 'ValidationError') {
            return NextResponse.json({ success: false, message: 'Validation Error: Invalid comment data for update.', errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: error.message || "Server error: Failed to update comment." }, { status: 500 });
    }
}


// --- DELETE an existing comment ---
export async function DELETE(req: NextRequest, { params }: { params: { universitySlug: string, postId: string } }) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized: User not signed in.' }, { status: 401 });
        }
        console.log(`API DELETE .../comments for post ${params.postId} by user ${userId}`);

        await dbConnect();
        const { postId } = params;

        // Get commentId from query parameters (e.g., /api/.../comments?commentId=XXXX)
        const commentId = req.nextUrl.searchParams.get('commentId');

        if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
            return NextResponse.json({ success: false, message: 'Valid Comment ID is required as a query parameter.' }, { status: 400 });
        }
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return NextResponse.json({ success: false, message: 'Invalid Post ID format.' }, { status: 400 });
        }

        // Find the post first to check comment ownership before pulling
        const post = await UniversityCommunityPost.findOne({ _id: postId, "comments._id": commentId });
        if (!post) {
            return NextResponse.json({ success: false, message: 'Post or specific comment not found.' }, { status: 404 });
        }

        const commentToDelete = post.comments.find((comment: any) => comment._id.equals(new Types.ObjectId(commentId)));

        if (!commentToDelete) {
            // Should have been caught by the query above, but good for robustness
            return NextResponse.json({ success: false, message: 'Comment to delete not found within the post.' }, { status: 404 });
        }

        // Authorization: Check if the authenticated user is the owner of the comment
        // You could extend this with role-based permissions (e.g., admin can delete any comment)
        if (commentToDelete.authorId.toString() !== userId) {
            // Example: Allow admin to delete (you'd need to get admin role from sessionClaims or UserProfileDetail)
            // const { sessionClaims } = getAuth(req);
            // const isAdmin = sessionClaims?.publicMetadata?.role === 'admin';
            // if (!isAdmin) {
            return NextResponse.json({ success: false, message: 'Forbidden: You can only delete your own comments.' }, { status: 403 });
            // }
        }

        // Pull the comment from the array
        const updateResult = await UniversityCommunityPost.updateOne(
            { _id: postId }, // Find the post
            { $pull: { comments: { _id: commentId } } } // Pull the comment by its _id (ownership already verified)
        );

        if (updateResult.matchedCount === 0) {
            // Post itself wasn't found, though the earlier check should prevent this.
            return NextResponse.json({ success: false, message: 'Post not found during comment deletion.' }, { status: 404 });
        }
        if (updateResult.modifiedCount === 0) {
            // This means the comment was not found in the array to be pulled,
            // possibly because it was already deleted or the commentId was incorrect for this post.
            // The initial findOne should make this case rare for valid commentIds.
            return NextResponse.json({ success: false, message: 'Comment not found for deletion, or already deleted.' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Comment deleted successfully!" }, { status: 200 });

    } catch (error: any) {
        console.error(`API DELETE .../comments Error for post ${params.postId}:`, error);
        return NextResponse.json({ success: false, message: error.message || "Server error: Failed to delete comment." }, { status: 500 });
    }
}
export async function POST_Comment( // Renamed to avoid conflict if in same file, ensure your routing calls this
    req: NextRequest,
    { params }: { params: { universitySlug: string; postId: string } }
) {
    try {
        const { userId: adminClerkId, sessionClaims } = getAuth(req);
        if (!adminClerkId) {
            return NextResponse.json({ success: false, message: 'Unauthorized. Please sign in.' }, { status: 401 });
        }

        // Implement robust admin check here
        const isAdmin = true; // Placeholder: sessionClaims?.publicMetadata?.isAdmin;
        // if (!isAdmin) {
        //    return NextResponse.json({ success: false, message: 'Forbidden: User is not an admin or not authorized for this action.' }, { status: 403 });
        // }

        await dbConnect();
        const { universitySlug, postId } = params;
        const body = await req.json();
        const {
            content: commentContent,
            // Admin can specify these for the comment "on behalf of"
            commenterFacebookUsername,
            commenterFacebookAvatarUrl
        } = body;

        if (!commentContent) {
            return NextResponse.json({ success: false, message: 'Comment content is required.' }, { status: 400 });
        }
        if (isAdmin && !commenterFacebookUsername) { // If admin is posting on behalf, username is required
            return NextResponse.json({ success: false, message: 'Commenter Facebook Username is required when admin posts comment.' }, { status: 400 });
        }


        const post = await UniversityCommunityPost.findById(postId);
        if (!post) {
            return NextResponse.json({ success: false, message: 'Post not found.' }, { status: 404 });
        }
        if (post.universitySlug !== decodeURIComponent(universitySlug)) {
            return NextResponse.json({ success: false, message: 'Post does not belong to the specified university hub.' }, { status: 400 });
        }


        let finalCommenterFullName = sessionClaims?.fullName || 'Admin';
        let finalCommenterAvatarUrl = sessionClaims?.imageUrl;
        let finalCommenterRole = (await UserProfileDetail.findOne({ userId: adminClerkId }).select('role').lean())?.role || 'admin_role'; // Get admin's role

        if (isAdmin && commenterFacebookUsername) {
            finalCommenterFullName = commenterFacebookUsername;
            finalCommenterAvatarUrl = commenterFacebookAvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(commenterFacebookUsername)}&background=random&color=fff`;
            finalCommenterRole = 'community_member'; // Role for the FB user comment
        }

        const newComment = {
            userId: adminClerkId, // The comment record is created by the admin
            userFullName: finalCommenterFullName,
            userAvatarUrl: finalCommenterAvatarUrl,
            userRole: finalCommenterRole,
            content: commentContent,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        post.comments.push(newComment as any); // Add as subdocument
        await post.save();

        // Return only the newly added comment or the whole post - a bit leaner to return the comment
        const addedComment = post.comments[post.comments.length - 1];

        return NextResponse.json({ success: true, data: addedComment, message: 'Comment added successfully!' });

    } catch (error: any) {
        console.error(`API POST /comments Error for post ${params.postId}:`, error);
        if (error.name === 'ValidationError') {
            return NextResponse.json({ success: false, message: 'Validation Error', errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: error.message || "Failed to add comment." }, { status: 500 });
    }
}
// Note: If your file routing creates separate files for each API endpoint,
// the POST_Comment function should just be 'export async function POST' in its own file:
// app/api/university-hubs/[universitySlug]/community-posts/[postId]/comments/route.ts


// Claim API (Conceptual - No changes based on this specific request, but shown for completeness of the file)
// File: app/api/community-posts/[postId]/claim/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { getAuth } from '@clerk/nextjs/server';
// import dbConnect from '@/lib/dbConnect';
// import UniversityCommunityPost from '@/lib/models/UniversityCommunityPost';
// import UserProfileDetail from '@/lib/models/UserProfileDetail';
// export async function POST(req: NextRequest, { params }: { params: { postId: string } }) {
//     try {
//         const { userId: claimerClerkId, sessionClaims } = getAuth(req);
//         if (!claimerClerkId) {
//             return NextResponse.json({ success: false, message: 'Unauthorized. Please sign in.' }, { status: 401 });
//         }
//         const { claimerFacebookId } = await req.json();
//         if (!claimerFacebookId) {
//              return NextResponse.json({ success: false, message: 'Facebook ID of claiming user not provided.' }, { status: 400 });
//         }
//         await dbConnect();
//         const { postId } = params;
//         const postToClaim = await UniversityCommunityPost.findById(postId);
//         if (!postToClaim) {
//             return NextResponse.json({ success: false, message: 'Post not found.' }, { status: 404 });
//         }
//         if (!postToClaim.isClaimable) {
//             return NextResponse.json({ success: false, message: 'This post is not claimable.' }, { status: 403 });
//         }
//         if (postToClaim.claimedByUserId) {
//             return NextResponse.json({ success: false, message: 'This post has already been claimed.' }, { status: 409 });
//         }
//         if (postToClaim.facebookUserId !== claimerFacebookId) {
//             console.warn(`Claim attempt failed: Post FB ID (${postToClaim.facebookUserId}) !== Claimer FB ID (${claimerFacebookId}) for post ${postId}`);
//             return NextResponse.json({ success: false, message: 'Facebook ID mismatch. Cannot claim this post.' }, { status: 403 });
//         }
//         const claimingUserProfile = await UserProfileDetail.findOne({ userId: claimerClerkId }).lean();
//         if (!claimingUserProfile) {
//             return NextResponse.json({ success: false, message: 'Claiming user profile not found.' }, { status: 400 });
//         }
//         postToClaim.claimedByUserId = claimingUserProfile._id;
//         postToClaim.isClaimable = false;
//         postToClaim.userId = claimerClerkId;
//         postToClaim.userFullName = sessionClaims?.fullName || claimingUserProfile.fullName || postToClaim.originalFacebookUsername;
//         postToClaim.userAvatarUrl = sessionClaims?.imageUrl || claimingUserProfile.avatarUrl || postToClaim.originalFacebookUserAvatarUrl;
//         postToClaim.userRole = claimingUserProfile.role || 'student';
//         const updatedPost = await postToClaim.save();
//         return NextResponse.json({ success: true, data: updatedPost, message: 'Post claimed successfully!' });
//     } catch (error: any) {
//         console.error(`API POST /community-posts/${params.postId}/claim Error:`, error);
//         return NextResponse.json({ success: false, message: error.message || "Failed to claim post." }, { status: 500 });
//     }
// }