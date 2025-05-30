import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUniversityTrackedItem extends Document {
  userId: string;
  universityId: mongoose.Types.ObjectId; // Refers to University._id
  // Add any other tracking-specific fields if needed, e.g., notes, status
  createdAt: Date;
  updatedAt: Date;
}

const UniversityTrackedItemSchema = new Schema<IUniversityTrackedItem>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  universityId: {
    type: Schema.Types.ObjectId,
    ref: 'University',
    required: true,
  },
  // Example:
  // userNotes: { type: String, trim: true, default: '' },
  // applicationStatus: { type: String, default: 'Researching' },
}, {
  timestamps: true,
});

// Compound index to prevent duplicate tracking for the same user and university
UniversityTrackedItemSchema.index({ userId: 1, universityId: 1 }, { unique: true });

const UniversityTrackedItem: Model<IUniversityTrackedItem> =
  mongoose.models.UniversityTrackedItem || mongoose.model<IUniversityTrackedItem>('UniversityTrackedItem', UniversityTrackedItemSchema);

export default UniversityTrackedItem;