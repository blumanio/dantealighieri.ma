// app/api/university-hubs/[universitySlug]/community-posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import UniversityCommunityPost from '@/lib/models/UniversityCommunityPost';
import UserProfileDetail from '@/lib/models/UserProfileDetail'; // To fetch user role

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
            .lean();

        const totalPosts = await UniversityCommunityPost.countDocuments(query);

        return NextResponse.json({
            success: true,
            data: posts,
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: page
        });
    } catch (error: any) {
        console.error(`API GET /university-hubs/${params.universitySlug}/community-posts Error:`, error);
        return NextResponse.json({ success: false, message: error.message || "Failed to fetch posts" }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { universitySlug: string } }) {
    try {
        const { userId, sessionClaims } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { universitySlug } = params;
        const body = await req.json();
        const { postType, title, content, tags, housingDetails, studyGroupDetails } = body;

        if (!postType || !content) {
            return NextResponse.json({ success: false, message: 'Post type and content are required.' }, { status: 400 });
        }

        // Fetch user's role from UserProfileDetail
        const userProfile = await UserProfileDetail.findOne({ userId }).select('role').lean();
        const userRole = userProfile?.role || 'student'; // Default to student if no profile/role found

        const newPostData: any = {
            universitySlug: decodeURIComponent(universitySlug),
            userId,
            userFullName: sessionClaims?.fullName || `${sessionClaims?.firstName || ''} ${sessionClaims?.lastName || ''}`.trim() || 'Anonymous User',
            userAvatarUrl: sessionClaims?.imageUrl,
            userRole, // Include the fetched role
            postType,
            content,
        };
        if (title) newPostData.title = title;
        if (tags) newPostData.tags = tags;
        if (housingDetails) newPostData.housingDetails = housingDetails;
        if (studyGroupDetails) newPostData.studyGroupDetails = studyGroupDetails;

        const newPost = await UniversityCommunityPost.create(newPostData);

        return NextResponse.json({ success: true, data: newPost, message: "Post created successfully!" }, { status: 201 });

    } catch (error: any) {
        console.error(`API POST /university-hubs/${params.universitySlug}/community-posts Error:`, error);
        if (error.name === 'ValidationError') {
            return NextResponse.json({ success: false, message: 'Validation Error', errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: error.message || "Failed to create post" }, { status: 500 });
    }
}