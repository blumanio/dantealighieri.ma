// client/app/api/messaging/conversations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server'; // Added clerkClient
import dbConnect from '@/lib/dbConnect';
import Conversation, { IParticipantDetail } from '@/lib/models/Conversation';
import UserProfileDetail from '@/lib/models/UserProfileDetail';

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
        
        // Enrich with up-to-date participant details if needed, especially for the 'other' participant
        const enrichedConversations = await Promise.all(conversations.map(async (convo) => {
            const otherParticipantId = convo.participants.find(pId => pId !== userId);
            let otherParticipantDetail: IParticipantDetail | undefined = convo.participantDetails?.find(p => p.userId === otherParticipantId);

            if (otherParticipantId && !otherParticipantDetail) { // If details are stale or missing
                try {
                    const clerkUser = await clerkClient.users.getUser(otherParticipantId);
                    const userProfile = await UserProfileDetail.findOne({ userId: otherParticipantId }).select('role').lean();
                    otherParticipantDetail = {
                        userId: otherParticipantId,
                        fullName: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : clerkUser.username || 'User',
                        avatarUrl: clerkUser.imageUrl,
                        role: userProfile?.role || 'student'
                    };
                } catch (clerkError) {
                    console.warn(`Could not fetch details for participant ${otherParticipantId}:`, clerkError);
                    otherParticipantDetail = { userId: otherParticipantId, fullName: 'Unknown User', role: 'student' };
                }
            }
            return { ...convo, otherParticipant: otherParticipantDetail };
        }));


        return NextResponse.json({ success: true, data: enrichedConversations });
    } catch (error: any) {
        console.error('API GET /messaging/conversations Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch conversations', error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) { // Start a new conversation
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
        });

        if (conversation) {
            // Enrich with potentially updated participant details for the response
            const enrichedConvo = await enrichConversationWithOtherParticipant(conversation.toObject(), currentUserId);
            return NextResponse.json({ success: true, message: 'Conversation already exists.', data: enrichedConvo, isNew: false });
        }

        // Fetch details for both participants
        const participantDetailsPromises = participants.map(async (pId) => {
            let fullName = "User";
            let avatarUrl = "";
            let role = "student";

            try {
                const clerkUser = await clerkClient.users.getUser(pId);
                fullName = clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : clerkUser.username || `User ${pId.substring(0,5)}`;
                avatarUrl = clerkUser.imageUrl;
                
                const userProfile = await UserProfileDetail.findOne({ userId: pId }).select('role').lean();
                if (userProfile) role = userProfile.role || 'student';

            } catch(userFetchError) {
                console.warn(`Error fetching details for participant ${pId}:`, userFetchError);
                // Use fallback if Clerk user not found or profile detail not found
                const existingProfile = await UserProfileDetail.findOne({ userId: pId }).select('role personalData.firstName personalData.lastName').lean();
                if(existingProfile) {
                    fullName = `${existingProfile.personalData?.firstName || ''} ${existingProfile.personalData?.lastName || ''}`.trim() || `User ${pId.substring(0,5)}`;
                    role = existingProfile.role || 'student';
                }
            }
            return { userId: pId, fullName, avatarUrl, role };
        });

        const resolvedParticipantDetails = await Promise.all(participantDetailsPromises);

        conversation = await Conversation.create({ 
            participants,
            participantDetails: resolvedParticipantDetails
        });
        
        const finalEnrichedConvo = await enrichConversationWithOtherParticipant(conversation.toObject(), currentUserId);

        return NextResponse.json({ success: true, message: 'Conversation started.', data: finalEnrichedConvo, isNew: true }, { status: 201 });

    } catch (error: any) {
        console.error('API POST /messaging/conversations Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to start conversation', error: error.message }, { status: 500 });
    }
}

// Helper to add 'otherParticipant' field for client convenience
async function enrichConversationWithOtherParticipant(convo: any, currentUserId: string) {
    const otherPId = convo.participants.find((pId: string) => pId !== currentUserId);
    let otherPDetail = convo.participantDetails?.find((p: IParticipantDetail) => p.userId === otherPId);
    
    if (otherPId && !otherPDetail) { // Attempt to fetch if missing
        try {
            const clerkUser = await clerkClient.users.getUser(otherPId);
            const userProfile = await UserProfileDetail.findOne({ userId: otherPId }).select('role').lean();
            otherPDetail = {
                userId: otherPId,
                fullName: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : clerkUser.username || 'User',
                avatarUrl: clerkUser.imageUrl,
                role: userProfile?.role || 'student'
            };
        } catch (e) { console.warn(`Enrichment: Could not fetch details for ${otherPId}`); }
    }
    return { ...convo, otherParticipant: otherPDetail || { userId: otherPId, fullName: 'Unknown User', role: 'student'} };
}