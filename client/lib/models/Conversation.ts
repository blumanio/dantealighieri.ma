// client/lib/models/Conversation.ts
import mongoose, { Schema, Document, models, Model, Types } from 'mongoose';
// Assuming IMessage is defined and exported from Message.ts, or define it here if not
// For clarity, if IMessage is in Message.ts, you could import it:
// import { IMessage } from './Message'; 

// To avoid circular dependencies if Message.ts imports IConversation, define IMessage here too or in a shared types file
export interface IMessageSubDoc { // Using a slightly different name for subdocument if needed
  content: string;
  senderId: string;
  timestamp: Date;
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
  participantDetails?: IParticipantDetail[]; // Denormalized for easier display
  lastMessage?: IMessageSubDoc;
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
    timestamp: { type: Date, required: true },
    messageId: { type: Schema.Types.ObjectId, ref: 'Message' }
}, { _id: false });

const ConversationSchema = new Schema<IConversation>({
  participants: [{ type: String, required: true, index: true }],
  participantDetails: [ParticipantDetailSchema],
  lastMessage: LastMessageSchema,
}, {
  timestamps: true
});

// To ensure unique 2-party conversations, you can add a compound unique index
// This requires participants to always be stored in a sorted order.
// ConversationSchema.index({ participants: 1 }, { unique: true, partialFilterExpression: { $expr: { $eq: [ { $size: "$participants" }, 2 ] } } });


const Conversation: Model<IConversation> = models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);

export default Conversation;