// app/api/university-hubs/[universitySlug]/community-posts/[postId]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import UniversityCommunityPost from '@/lib/models/UniversityCommunityPost';
import UserProfileDetail from '@/lib/models/UserProfileDetail';
import mongoose from 'mongoose';

export async function POST(req: NextRequest, { params }: { params: { universitySlug: string, postId: string } }) {
    try {
        const { userId, sessionClaims } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { postId } = params;
        const body = await req.json();
        const { content } = body;

        if (!content || typeof content !== 'string' || content.trim() === "") {
            return NextResponse.json({ success: false, message: 'Comment content is required.' }, { status: 400 });
        }
        if (!mongoose.Types.ObjectId.isValid(postId)) {
             return NextResponse.json({ success: false, message: 'Invalid Post ID format.' }, { status: 400 });
        }

        const userProfile = await UserProfileDetail.findOne({ userId }).select('role').lean();
        const userRole = userProfile?.role || 'student';

        const commentData = {
            userId,
            userFullName: sessionClaims?.fullName || `${sessionClaims?.firstName || ''} ${sessionClaims?.lastName || ''}`.trim() || 'Anonymous User',
            userAvatarUrl: sessionClaims?.imageUrl,
            userRole,
            content: content.trim(),
            // createdAt will be set automatically by Mongoose timestamps
        };

        const updatedPost = await UniversityCommunityPost.findByIdAndUpdate(
            postId,
            { $push: { comments: commentData } },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedPost) {
            return NextResponse.json({ success: false, message: 'Post not found to add comment.' }, { status: 404 });
        }
        
        // Return the newly added comment (last one in the array)
        const newComment = updatedPost.comments[updatedPost.comments.length -1];

        return NextResponse.json({ success: true, data: newComment, message: "Comment added successfully!" }, { status: 201 });

    } catch (error: any) {
        console.error(`API POST .../comments Error for post ${params.postId}:`, error);
        if (error.name === 'ValidationError') {
            return NextResponse.json({ success: false, message: 'Validation Error for comment', errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: error.message || "Failed to add comment" }, { status: 500 });
    }
}