// client/app/api/messaging/conversations/route.ts
// (ensure imports are correct as per previous response)
import { NextRequest, NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import Conversation, { IParticipantDetail } from '@/lib/models/Conversation';
import UserProfileDetail, { IUserProfileDetail } from '@/lib/models/UserProfileDetail';
import mongoose from 'mongoose';

async function ensureUserProfile(userId: string, clerkUserDataForCreate?: { fullName?: string | null, imageUrl?: string | null, username?: string | null, firstName?: string | null, lastName?: string | null }): Promise<IParticipantDetail> {
    await dbConnect(); // Ensure DB is connected here as well
    let userProfile = await UserProfileDetail.findOne({ userId }).select('role personalData.firstName personalData.lastName').lean();
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);
    let profileRole = 'student';
    let profileFullName = '';
    let profileAvatarUrl = clerkUserDataForCreate?.imageUrl || undefined;
    let profileFirstName = clerkUserDataForCreate?.firstName || '';
    let profileLastName = clerkUserDataForCreate?.lastName || '';

    if (clerkUserDataForCreate?.fullName) {
        profileFullName = clerkUserDataForCreate.fullName;
    } else {
        profileFullName = `${profileFirstName} ${profileLastName}`.trim();
    }
    if (!profileFullName && clerkUserDataForCreate?.username) {
        profileFullName = clerkUserDataForCreate.username;
    }
    if (!profileFullName) {
        profileFullName = `User ${userId.substring(0, 5)}`;
    }

    if (userProfile) {
        profileRole = userProfile.role || 'student';
        const dbFullName = `${userProfile.personalData?.firstName || ''} ${userProfile.personalData?.lastName || ''}`.trim();
        if (dbFullName) {
            profileFullName = dbFullName; // Prefer DB name if more complete or explicitly set
        }
        // Avatar might also be in UserProfileDetail if you decide to store it there
    } else {
        console.log(`[API Messaging - ensureUserProfile] No UserProfileDetail for ${userId}. Creating basic profile.`);
        const newUserProfileData: Partial<IUserProfileDetail> = {
            userId,
            personalData: {
                // Add only properties that exist in ICustomPersonalData
                // For example, if ICustomPersonalData has 'givenName' and 'surname':
                // givenName: profileFirstName,
                // surname: profileLastName,
            },
            educationalData: { previousEducation: [], otherStandardizedTests: [], languageProficiency: {} },
            role: 'student',
            premiumTier: 'Michelangelo', // Default tier, adjust as needed
            profileVisibility: 'private',
            languageInterests: [],
            targetUniversities: [],
            aboutMe: ''
        };
        try {
            const newDbProfile = await UserProfileDetail.create(newUserProfileData);
            console.log(`[API Messaging - ensureUserProfile] Created UserProfileDetail for ${userId}, ID: ${newDbProfile._id}`);
            profileRole = newDbProfile.role ?? 'student';
        } catch (createError: any) {
            console.error(`[API Messaging - ensureUserProfile] Error creating UserProfileDetail for ${userId}:`, createError.message);
            // Proceed with defaults if creation fails
        }
    }

    return {
        userId,
        fullName: profileFullName,
        avatarUrl: profileAvatarUrl, // This will be Clerk's image URL
        role: profileRole,
    };
}

// GET handler (from previous response, ensure enrichConversationWithOtherParticipant calls the refined ensureUserProfile)
export async function GET(req: NextRequest) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }
        await dbConnect();

        const conversations = await Conversation.find({ participants: userId })
            .sort({ updatedAt: -1 })
            .lean();

        const enrichedConversations = await Promise.all(conversations.map(async (convo) => {
            const otherParticipantId = convo.participants.find(pId => pId !== userId);
            let otherParticipantClerkData;
            if (otherParticipantId) {
                try {
                    const clerk = await clerkClient();
                    const user = await clerk.users.getUser(otherParticipantId);
                    otherParticipantClerkData = {
                        fullName: user.fullName,
                        imageUrl: user.imageUrl,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName
                    };
                } catch (e) { console.warn(`[API Messaging GET] Clerk user ${otherParticipantId} not found for enrichment.`) }
            }
            const otherParticipantDetail = otherParticipantId ? await ensureUserProfile(otherParticipantId, otherParticipantClerkData) : { userId: 'unknown', fullName: 'Unknown User', role: 'system' };

            return { ...convo, otherParticipant: otherParticipantDetail };
        }));

        return NextResponse.json({ success: true, data: enrichedConversations });
    } catch (error: any) {
        console.error('API GET /messaging/conversations Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch conversations', error: error.message }, { status: 500 });
    }
}


// POST handler (from previous response, ensures ensureUserProfile is called for both participants)
export async function POST(req: NextRequest) {
    try {
        const { userId: currentUserId, sessionClaims } = getAuth(req);
        if (!currentUserId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { recipientId } = body;

        if (!recipientId || recipientId === currentUserId) {
            return NextResponse.json({ success: false, message: 'Valid recipientId is required and cannot be yourself.' }, { status: 400 });
        }

        await dbConnect();
        const participants = [currentUserId, recipientId].sort();

        let conversation = await Conversation.findOne({
            participants: { $all: participants, $size: 2 }
        }).lean();

        if (conversation) {
            const enrichedConvo = await enrichConversationWithOtherParticipantForExisting(conversation, currentUserId);
            return NextResponse.json({ success: true, message: 'Conversation already exists.', data: enrichedConvo, isNew: false });
        }

        const currentUserClerkData = {
            fullName: sessionClaims?.fullName as string | null | undefined,
            imageUrl: sessionClaims?.imageUrl as string | null | undefined,
            username: sessionClaims?.username as string | null | undefined,
            firstName: sessionClaims?.firstName as string | null | undefined,
            lastName: sessionClaims?.lastName as string | null | undefined
        };
        const initiatorDetails = await ensureUserProfile(currentUserId, currentUserClerkData);

        let recipientClerkData;
        try {
            const clerk = await clerkClient();
            const recipientClerkUser = await clerk.users.getUser(recipientId);
            recipientClerkData = {
                fullName: recipientClerkUser.fullName,
                imageUrl: recipientClerkUser.imageUrl,
                username: recipientClerkUser.username,
                firstName: recipientClerkUser.firstName,
                lastName: recipientClerkUser.lastName
            };
        } catch (e) {
            console.warn(`[API Messaging POST] Could not fetch full recipient Clerk details for ${recipientId}`);
        }
        const recipientDetails = await ensureUserProfile(recipientId, recipientClerkData);

        const resolvedParticipantDetails = [initiatorDetails, recipientDetails].sort((a, b) => a.userId.localeCompare(b.userId)); // Ensure consistent order for participantDetails array

        const newConversationDoc = await Conversation.create({
            participants,
            participantDetails: resolvedParticipantDetails
        });

        const finalEnrichedConvo = await enrichConversationWithOtherParticipantForExisting(newConversationDoc.toObject(), currentUserId);

        return NextResponse.json({ success: true, message: 'Conversation started.', data: finalEnrichedConvo, isNew: true }, { status: 201 });

    } catch (error: any) {
        console.error('API POST /messaging/conversations Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to start conversation', error: error.message }, { status: 500 });
    }
}

// Adjusted helper for existing conversations to use ensureUserProfile
async function enrichConversationWithOtherParticipantForExisting(convo: any, currentUserId: string) {
    const otherPId = convo.participants.find((pId: string) => pId !== currentUserId);
    let otherParticipantClerkData;
    if (otherPId) {
        try {
            const clerk = await clerkClient();
            const clerkUser = await clerk.users.getUser(otherPId);
            otherParticipantClerkData = {
                fullName: clerkUser.fullName,
                imageUrl: clerkUser.imageUrl,
                username: clerkUser.username,
                firstName: clerkUser.firstName,
                lastName: clerkUser.lastName
            };
        } catch (e) { console.warn(`Enrichment: Could not fetch Clerk details for ${otherPId} during existing convo enrichment.`); }
    }
    const otherPDetail = otherPId ? await ensureUserProfile(otherPId, otherParticipantClerkData) : { userId: 'unknown', fullName: 'System Conversation', role: 'system' };

    return { ...convo, otherParticipant: otherPDetail };
}