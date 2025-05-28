// client/app/api/messaging/conversations/[conversationId]/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import Conversation from '@/lib/models/Conversation';
import Message from '@/lib/models/Message';
import UserProfileDetail from '@/lib/models/UserProfileDetail';
import mongoose from 'mongoose';
import { useParams } from 'next/navigation';

export async function GET(req: NextRequest, { params }: { params: { conversationId: string } }) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }
        
        // const { conversationId } = params;
        const routeParams = useParams();
        const conversationId = routeParams && typeof routeParams.conversationId === 'string'
            ? routeParams.conversationId
            : 'en'; // Default to 'en' if not found or array
        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
            return NextResponse.json({ success: false, message: 'Invalid conversationId' }, { status: 400 });
        }

        await dbConnect();

        const conversation = await Conversation.findOne({ _id: conversationId, participants: userId }).lean();
        if (!conversation) {
            return NextResponse.json({ success: false, message: 'Conversation not found or access denied.' }, { status: 404 });
        }

        const messages = await Message.find({ conversationId })
            .sort({ createdAt: 1 }) 
            .limit(100) 
            .lean();
        
        await Message.updateMany(
            { conversationId, senderId: { $ne: userId }, readBy: { $nin: [userId] } }, // only update if not already read
            { $addToSet: { readBy: userId } }
        );

        return NextResponse.json({ success: true, data: messages });
    } catch (error: any) {
        console.error('API GET /messaging/conversations/[id]/messages Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch messages', error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { conversationId: string } }) {
    try {
        const { userId, sessionClaims } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { conversationId } = params;
        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
            return NextResponse.json({ success: false, message: 'Invalid conversationId' }, { status: 400 });
        }

        const body = await req.json();
        const { content } = body;
        if (!content || typeof content !== 'string' || content.trim() === "") {
            return NextResponse.json({ success: false, message: 'Message content is required.' }, { status: 400 });
        }

        await dbConnect();

        const conversation = await Conversation.findOne({ _id: conversationId, participants: userId });
        if (!conversation) {
            return NextResponse.json({ success: false, message: 'Conversation not found or access denied.' }, { status: 404 });
        }

        const userProfile = await UserProfileDetail.findOne({ userId }).select('role').lean();
        const senderRole = userProfile?.role || 'student';

        const messageData = {
            conversationId: new mongoose.Types.ObjectId(conversationId),
            senderId: userId,
            senderFullName: sessionClaims?.fullName || `${sessionClaims?.firstName || ''} ${sessionClaims?.lastName || ''}`.trim() || 'User',
            senderAvatarUrl: sessionClaims?.imageUrl,
            senderRole,
            content: content.trim(),
            readBy: [userId], 
        };

        const newMessageDocument = new Message(messageData);
        const newMessage = await newMessageDocument.save();
        
        conversation.lastMessage = {
            content: newMessage.content.substring(0, 100), 
            senderId: newMessage.senderId,
            timestamp: newMessage.createdAt,
            messageId: newMessage._id as unknown as mongoose.Types.ObjectId
        };
        // conversation.updatedAt will be updated by Mongoose timestamps
        await conversation.save();
        
        return NextResponse.json({ success: true, data: newMessage.toObject(), message: "Message sent." }, { status: 201 });

    } catch (error: any) {
        console.error('API POST /messaging/conversations/[id]/messages Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to send message', error: error.message }, { status: 500 });
    }
}