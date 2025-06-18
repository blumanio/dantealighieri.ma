import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import dbConnect from '@/lib/dbConnect';
import UserProfileDetail from '@/lib/models/UserProfileDetail';
import UniversityFavorite from '@/lib/models/UniversityFavorite'; // Import Favorite model
import Application from '@/lib/models/Application'; // Import Application model

// This interface defines all possible data that can be sent to the client.
// Optional properties are used because the data sent will depend on the viewer's tier.
interface TieredPublicProfileData {
    userId: string;
    fullName?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string;
    role?: string;
    aboutMe?: string;
    profileVisibility?: string;
    premiumTier?: string; // The tier of the profile owner

    // Data sections controlled by viewer's tier
    favorites?: any[];
    applications?: any[];
    activity?: any[]; // For future activity tracking

    // Counts for lower tiers
    favoritesCount?: number;
    applicationsCount?: number;

    // Metadata about the viewer for frontend logic
    viewerTier: 'guest' | 'michelangelo' | 'dante' | 'davinci';
}


export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        await dbConnect();
        const { userId: targetUserId } = params;

        // 1. Get the viewer's authentication state and userId from the request
        const { userId: viewerId } = getAuth(req);

        if (!targetUserId) {
            return NextResponse.json({ success: false, message: 'User ID is required.' }, { status: 400 });
        }

        // 2. Fetch the target user's profile details (owner of the profile)
        const targetProfile = await UserProfileDetail.findOne({ userId: targetUserId })
            .select('userId personalData.firstName personalData.lastName role aboutMe profileVisibility premiumTier')
            .lean();

        // 3. Check for privacy
        if (!targetProfile || (targetProfile.profileVisibility === 'private' && targetUserId !== viewerId)) {
            return NextResponse.json({ success: false, message: 'User not found or this profile is private.' }, { status: 404 });
        }

        // 4. Fetch the viewer's profile to determine their tier
        let viewerTier: TieredPublicProfileData['viewerTier'] = 'guest';
        if (viewerId) {
            const viewerProfile = await UserProfileDetail.findOne({ userId: viewerId }).select('premiumTier').lean();
            // Normalize premiumTier to match allowed values
            const normalizedTier = (viewerProfile?.premiumTier || '').toLowerCase().replace(/\s/g, '');
            if (['michelangelo', 'dante', 'davinci'].includes(normalizedTier)) {
                viewerTier = normalizedTier as TieredPublicProfileData['viewerTier'];
            } else {
                viewerTier = 'michelangelo'; // Default logged-in users to free tier
            }
        }

        // 5. Initialize response data with basic info
        const clerkUser = await clerkClient.users.getUser(targetUserId);
        const responseData: TieredPublicProfileData = {
            userId: targetUserId,
            fullName: `${clerkUser.firstName || targetProfile.personalData?.firstName || ''} ${clerkUser.lastName || targetProfile.personalData?.lastName || ''}`.trim(),
            firstName: clerkUser.firstName || targetProfile.personalData?.firstName,
            imageUrl: clerkUser.imageUrl,
            role: targetProfile.role,
            aboutMe: targetProfile.aboutMe,
            profileVisibility: targetProfile.profileVisibility,
            premiumTier: targetProfile.premiumTier,
            viewerTier: viewerTier,
        };

        // 6. Tier-based logic: Fetch additional data based on the VIEWER's tier
        if (viewerId) { // Only fetch detailed data if the user is logged in
            switch (viewerTier) {
                case 'davinci': // Top tier sees everything
                    responseData.favorites = await UniversityFavorite.find({ userId: targetUserId }).populate('universityId', 'name').lean();
                    responseData.applications = await Application.find({ userId: targetUserId }).select('programName universityName status').lean();
                    break;

                case 'dante': // Premium tier sees recent items
                    responseData.favorites = await UniversityFavorite.find({ userId: targetUserId }).sort({ createdAt: -1 }).limit(5).populate('universityId', 'name').lean();
                    responseData.applications = await Application.find({ userId: targetUserId }).sort({ createdAt: -1 }).limit(5).select('programName universityName status').lean();
                    break;

                case 'michelangelo': // Free tier sees only counts
                    responseData.favoritesCount = await UniversityFavorite.countDocuments({ userId: targetUserId });
                    responseData.applicationsCount = await Application.countDocuments({ userId: targetUserId });
                    break;
            }
        }

        return NextResponse.json({ success: true, data: responseData });

    } catch (error: any) {
        console.error(`API GET /api/users/[userId]/profile Error:`, error);
        return NextResponse.json({ success: false, message: 'Failed to fetch user profile', error: error.message }, { status: 500 });
    }
}