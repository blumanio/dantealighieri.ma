// client/lib/models/Conversation.ts
import mongoose, { Schema, Document, models, Model, Types } from 'mongoose';

export interface IMessageSubDoc { 
  content: string;
  senderId: string;
  timestamp: Date; // Ensure this is Date for consistency with Message model
  messageId?: Types.ObjectId;
}

export interface IParticipantDetail {
  userId: string;
  fullName: string;
  avatarUrl?: string;
  role?: string;
}

export interface IConversation extends Document {
  participants: string[];
  participantDetails?: IParticipantDetail[]; 
  lastMessage?: IMessageSubDoc; // Will use IMessageSubDoc
  createdAt: Date;
  updatedAt: Date; 
}

const ParticipantDetailSchema = new Schema<IParticipantDetail>({
    userId: { type: String, required: true },
    fullName: { type: String, required: true },
    avatarUrl: { type: String },
    role: { type: String },
}, { _id: false });

const LastMessageSchema = new Schema<IMessageSubDoc>({
    content: { type: String, required: true },
    senderId: { type: String, required: true },
    timestamp: { type: Date, required: true }, // Store as Date
    messageId: { type: Schema.Types.ObjectId, ref: 'Message' }
}, { _id: false });

const ConversationSchema = new Schema<IConversation>({
  participants: [{ type: String, required: true, index: true }],
  participantDetails: [ParticipantDetailSchema],
  lastMessage: LastMessageSchema,
}, {
  timestamps: true // This adds createdAt and updatedAt as Date
});

const Conversation: Model<IConversation> = models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);

export default Conversation;