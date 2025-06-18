import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import UniversityCommunityPost from '@/lib/models/UniversityCommunityPost';
import UserProfileDetail from '@/lib/models/UserProfileDetail'; // To update post with claimer's details

export async function POST(req: NextRequest, { params }: { params: { postId: string } }) {
    try {
        const { userId, sessionClaims } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized. Please sign in to claim a post.' }, { status: 401 });
        }

        await dbConnect();
        const { postId } = params;

        const postToClaim = await UniversityCommunityPost.findById(postId);

        if (!postToClaim) {
            return NextResponse.json({ success: false, message: 'Post not found.' }, { status: 404 });
        }

        if (!postToClaim.isClaimable) {
            return NextResponse.json({ success: false, message: 'This post is not claimable.' }, { status: 403 });
        }

        if (postToClaim.claimedByUserId) {
            return NextResponse.json({ success: false, message: 'This post has already been claimed.' }, { status: 409 }); // 409 Conflict
        }

        // Fetch the profile of the user who is claiming the post
        const claimingUserProfile = await UserProfileDetail.findOne({ userId }).lean();
        if (!claimingUserProfile) {
            // This case should ideally not happen if user is signed in and has a profile record
            // Or you might need to create a UserProfileDetail entry if it doesn't exist
            return NextResponse.json({ success: false, message: 'User profile not found for claiming user.' }, { status: 400 });
        }

        // Update the post with the claimer's details
        postToClaim.claimedByUserId = claimingUserProfile._id;
        postToClaim.isClaimable = false; // Mark as no longer claimable

        // Optionally, update the post's main user fields to reflect the claimer
        postToClaim.userId = userId; // Update to the claimer's Clerk ID
        postToClaim.userFullName = 
            (typeof sessionClaims?.fullName === 'string' && sessionClaims.fullName)
            || `${sessionClaims?.firstName || ''} ${sessionClaims?.lastName || ''}`.trim()
            || `${(claimingUserProfile.personalData as any)?.firstName || ''} ${(claimingUserProfile.personalData as any)?.lastName || ''}`.trim()
            || 'Claimed User';
        postToClaim.userAvatarUrl = sessionClaims?.imageUrl || (claimingUserProfile.personalData as any)?.avatarUrl; // Use Clerk image first, fallback to profile's avatarUrl if available
        postToClaim.userRole = claimingUserProfile.role || 'student'; // Update with claimer's role

        const updatedPost = await postToClaim.save();

        return NextResponse.json({ success: true, data: updatedPost, message: 'Post claimed successfully!' });

    } catch (error: any) {
        console.error(`API POST /community-posts/${params.postId}/claim Error:`, error);
        return NextResponse.json({ success: false, message: error.message || "Failed to claim post." }, { status: 500 });
    }
}