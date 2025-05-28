// client/app/api/users/[userId]/profile/route.ts
// New file
import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import UserProfileDetail, { IUserProfileDetail } from '@/lib/models/UserProfileDetail';
import mongoose from 'mongoose';

interface PublicProfileData {
    userId: string;
    fullName?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string;
    role?: string;
    aboutMe?: string;
    // Add other fields you want to make public from UserProfileDetail
    // For example: educationalData.highestLevelOfEducation, specific interests, etc.
    // Be very careful about what data is exposed publicly.
    profileVisibility?: string;
}

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const targetUserId = await params.userId;

        if (!targetUserId) {
            return NextResponse.json({ success: false, message: 'User ID is required.' }, { status: 400 });
        }

        await dbConnect();
        let publicData: Partial<PublicProfileData> = { userId: targetUserId };

        // Fetch from UserProfileDetail first
        const profileDetail = await UserProfileDetail.findOne({ userId: targetUserId })
            .select('userId personalData.firstName personalData.lastName role aboutMe profileVisibility educationalData.highestLevelOfEducation') // Select only public fields
            .lean();

        if (profileDetail) {
            // Check profile visibility settings from UserProfileDetail
            // For now, let's assume 'public' allows viewing, otherwise restrict.
            // You might have more granular settings like 'network_only'.
            if (profileDetail.profileVisibility === 'private') {
                 // Even if private, we might still want to show basic Clerk info if the user is part of a public interaction
                 // For now, let's restrict if explicitly private.
                 // return NextResponse.json({ success: false, message: 'This profile is private.' }, { status: 403 });
            }
            
            publicData.firstName = (profileDetail.personalData as any)?.firstName;
            publicData.lastName = (profileDetail.personalData as any)?.lastName;
            publicData.fullName = `${(profileDetail.personalData as any)?.firstName || ''} ${(profileDetail.personalData as any)?.lastName || ''}`.trim();
            publicData.role = profileDetail.role;
            publicData.aboutMe = profileDetail.aboutMe;
            publicData.profileVisibility = profileDetail.profileVisibility;
            // Example: publicData.highestEducation = profileDetail.educationalData?.highestLevelOfEducation;
        }

        // Augment or fill with Clerk data, especially if UserProfileDetail is minimal or missing
        try {
            const clerk = await clerkClient();
            const clerkUser = await clerk.users.getUser(targetUserId);
            publicData.imageUrl = clerkUser.imageUrl;
            if (!publicData.fullName && clerkUser.fullName) {
                publicData.fullName = clerkUser.fullName;
            }
            if (!publicData.firstName && clerkUser.firstName) {
                publicData.firstName = clerkUser.firstName;
            }
            if (!publicData.lastName && clerkUser.lastName) {
                publicData.lastName = clerkUser.lastName;
            }
             if (!publicData.fullName) { // Fallback if still no full name
                publicData.fullName = `${publicData.firstName || ''} ${publicData.lastName || ''}`.trim() || clerkUser.username || `User ${targetUserId.substring(0,8)}`;
            }
        } catch (clerkError: any) {
            console.warn(`[API Public Profile] Clerk user not found for ${targetUserId}: ${clerkError.message}. Profile data might be incomplete.`);
            // If no UserProfileDetail and no Clerk user, then user likely doesn't exist or is inaccessible
            if (!profileDetail) {
                return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
            }
        }
        
        if (!publicData.fullName) { // Final fallback for name
             publicData.fullName = `User ${targetUserId.substring(0,8)}`;
        }


        return NextResponse.json({ success: true, data: publicData });

    } catch (error: any) {
        console.error(`API GET /api/users/${params.userId}/profile Error:`, error);
        return NextResponse.json({ success: false, message: 'Failed to fetch user profile', error: error.message }, { status: 500 });
    }
}