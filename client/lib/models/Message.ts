// client/lib/models/Message.ts
import mongoose, { Schema, Document, models, Model, Types } from 'mongoose';

// Interface for the Message document already exported by Conversation.ts
// If it's not, define it here:
export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  senderId: string; 
  senderFullName: string; 
  senderAvatarUrl?: string;
  senderRole?: string; 
  content: string;
  readBy: string[]; 
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  senderId: { type: String, required: true, index: true },
  senderFullName: { type: String, required: true },
  senderAvatarUrl: { type: String },
  senderRole: { type: String },
  content: { type: String, required: true, trim: true },
  readBy: [{ type: String }],
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

const Message: Model<IMessage> = models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;