import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUniversityFavorite extends Document {
  userId: string;
  universityId: mongoose.Types.ObjectId; // Refers to University._id
  createdAt: Date;
  updatedAt: Date;
}

const UniversityFavoriteSchema = new Schema<IUniversityFavorite>({
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
}, {
  timestamps: true,
});

// Compound index to prevent duplicate favorites for the same user and university
UniversityFavoriteSchema.index({ userId: 1, universityId: 1 }, { unique: true });

const UniversityFavorite: Model<IUniversityFavorite> =
  mongoose.models.UniversityFavorite || mongoose.model<IUniversityFavorite>('UniversityFavorite', UniversityFavoriteSchema);

export default UniversityFavorite;