import mongoose, { Document, Schema } from 'mongoose';

export interface IMembership extends Document {
  userId: string;
  communityId: string;
  joinedAt: Date;
}

const MembershipSchema: Schema = new Schema({
  userId: { type: String, required: true },
  communityId: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
});

// Create a compound index to prevent a user from joining the same community more than once
MembershipSchema.index({ userId: 1, communityId: 1 }, { unique: true });

export default mongoose.models.Membership || mongoose.model<IMembership>('Membership', MembershipSchema);
