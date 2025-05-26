// client/app/api/users/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import UserProfileDetail from '@/lib/models/UserProfileDetail';

export async function GET(req: NextRequest) {
    try {
        const { userId: currentUserId } = getAuth(req);
        if (!currentUserId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        if (!query || query.trim().length < 2) {
            return NextResponse.json({ success: true, data: [] });
        }

        await dbConnect();

        // Attempt to fetch from UserProfileDetail first
        const profileDetails = await UserProfileDetail.find({
            userId: { $ne: currentUserId },
            $or: [
                { "personalData.firstName": new RegExp(query, 'i') },
                { "personalData.lastName": new RegExp(query, 'i') },
            ]
        })
        .select('userId personalData.firstName personalData.lastName') // Add avatar if stored
        .limit(10)
        .lean();

        let results = profileDetails.map(u => ({
            id: u.userId,
            fullName: `${u.personalData?.firstName || ''} ${u.personalData?.lastName || ''}`.trim() || `User ${u.userId.substring(0,5)}`,
            avatarUrl: undefined // Placeholder, see below
        }));

        // If UserProfileDetail doesn't have avatars or full names consistently,
        // or to ensure up-to-date Clerk data, you can fetch from Clerk.
        // This is more complex if you need to combine results.
        // For simplicity, we'll primarily use UserProfileDetail for now.
        // If results are too few, you could augment with a Clerk search:
        if (results.length < 5) {
            try {
                const clerkUsers = await clerkClient.users.getUserList({ query: query, limit: 5 });
                clerkUsers.forEach(clerkUser => {
                    if (clerkUser.id !== currentUserId && !results.find(r => r.id === clerkUser.id)) {
                        results.push({
                            id: clerkUser.id,
                            fullName: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : clerkUser.username || `User ${clerkUser.id.substring(0,5)}`,
                            avatarUrl: clerkUser.imageUrl
                        });
                    }
                });
                // Deduplicate and limit again if necessary
                const uniqueResultsMap = new Map(results.map(u => [u.id, u]));
                results = Array.from(uniqueResultsMap.values()).slice(0,10);

            } catch (clerkSearchError) {
                console.warn("Clerk user search also failed or returned limited results:", clerkSearchError);
            }
        }


        return NextResponse.json({ success: true, data: results });

    } catch (error: any) {
        console.error('API GET /users/search Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to search users', error: error.message }, { status: 500 });
    }
}