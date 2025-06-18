// 3. Updated Backend API for POST CREATION: app/api/university-hubs/[universitySlug]/community-posts/route.ts
// -----------------------------------------------------------------------------
// (GET remains the same as in previous version)
// POST updated to remove title and imageUrl

// app/api/university-hubs/[universitySlug]/community-posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import UniversityCommunityPost, { IUniversityCommunityPost } from '@/lib/models/UniversityCommunityPost';
import UserProfileDetail from '@/lib/models/UserProfileDetail';

export async function GET(req: NextRequest, { params }: { params: { universitySlug: string } }) {
    try {
        await dbConnect();
        const { universitySlug } = params;
        const { searchParams } = new URL(req.url);
        const postType = searchParams.get('type');
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const skip = (page - 1) * limit;

        let query: any = { universitySlug: decodeURIComponent(universitySlug), isArchived: false };
        if (postType) query.postType = postType;

        const posts = await UniversityCommunityPost.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('claimedByUserId', 'fullName avatarUrl userRole')
            .populate('postedByAdminId', 'fullName avatarUrl userRole')
            .lean();
        const totalPosts = await UniversityCommunityPost.countDocuments(query);
        return NextResponse.json({ success: true, data: posts, totalPages: Math.ceil(totalPosts / limit), currentPage: page });
    } catch (error: any) {
        console.error(`API GET /university-hubs/${params.universitySlug}/community-posts Error:`, error);
        return NextResponse.json({ success: false, message: error.message || "Failed to fetch posts" }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { universitySlug: string } }) {
    try {
        const { userId: adminClerkId, sessionClaims } = getAuth(req);
        if (!adminClerkId) {
            return NextResponse.json({ success: false, message: 'Unauthorized: Admin not signed in.' }, { status: 401 });
        }
        // Implement robust admin check here
        // const isAdmin = sessionClaims?.publicMetadata?.isAdmin;
        // if (!isAdmin) {
        //     return NextResponse.json({ success: false, message: 'Forbidden: User is not an admin.' }, { status: 403 });
        // }

        await dbConnect();
        const { universitySlug } = params;
        const body = await req.json();
        const {
            postType, content, tags,
            originalFacebookUsername,
            originalFacebookUserAvatarUrl,
            facebookUserId,
            isClaimable,
            originalUserCountry,
            // title and imageUrl removed from body for post creation
        } = body;

        if (!postType || !content || !originalFacebookUsername) {
            return NextResponse.json({ success: false, message: 'Post type, content, and Facebook username are required.' }, { status: 400 });
        }
        if (isClaimable && !facebookUserId) {
            return NextResponse.json({ success: false, message: 'Facebook User ID is required if the post is claimable.' }, { status: 400 });
        }

        const adminProfile = await UserProfileDetail.findOne({ userId: adminClerkId }).select('_id').lean();
        if (!adminProfile) {
            return NextResponse.json({ success: false, message: 'Admin profile not found.' }, { status: 404 });
        }

        const newPostData: Partial<IUniversityCommunityPost> = {
            universitySlug: decodeURIComponent(universitySlug),
            userId: adminClerkId,
            userFullName: originalFacebookUsername,
            userAvatarUrl: originalFacebookUserAvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(originalFacebookUsername)}&background=random&color=fff`,
            userRole: 'community_member',
            postType,
            content,
            tags: tags || [],
            originalFacebookUsername,
            originalFacebookUserAvatarUrl: originalFacebookUserAvatarUrl || undefined,
            facebookUserId: facebookUserId || undefined,
            isClaimable: !!isClaimable,
            originalUserCountry: originalUserCountry || undefined,
            postedByAdminId: adminProfile._id,
            isArchived: false, comments: [], likesCount: 0,
        };
        
        const newPost = await UniversityCommunityPost.create(newPostData);
        return NextResponse.json({ success: true, data: newPost, message: "Post created successfully by admin!" }, { status: 201 });

    } catch (error: any) {
        console.error(`API POST /university-hubs/${params.universitySlug}/community-posts Error:`, error);
        if (error.name === 'ValidationError') {
            return NextResponse.json({ success: false, message: 'Validation Error', errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: error.message || "Failed to create post by admin" }, { status: 500 });
    }
}
