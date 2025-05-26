// lib/models/UniversityCommunityPost.ts
import mongoose, { Schema, Document, models, Model } from 'mongoose';

interface IComment extends Document {
  userId: string;
  userFullName: string;
  userAvatarUrl?: string;
  userRole?: string; // Role of the commenter at the time of comment
  content: string;
  createdAt: Date;
  // No updatedAt for comments usually
}

const CommentSchema = new Schema<IComment>({
  userId: { type: String, required: true },
  userFullName: { type: String, required: true },
  userAvatarUrl: { type: String },
  userRole: { type: String },
  content: { type: String, required: true, trim: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

export interface IUniversityCommunityPost extends Document {
  universitySlug: string; // Links to a conceptual University.slug or a slugified university name
  userId: string; // Clerk User ID
  userFullName: string;
  userAvatarUrl?: string;
  userRole?: string; // Role of the post author
  postType: 'discussion' | 'housing_seeking' | 'housing_offering' | 'study_group_looking' | 'study_group_forming';
  title?: string; // For discussions, study groups
  content: string;
  tags?: string[];
  housingDetails?: {
    rent?: number;
    availabilityDate?: Date;
    roomType?: string;
  };
  studyGroupDetails?: {
    courseName?: string;
    maxMembers?: number;
  };
  comments: IComment[];
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UniversityCommunityPostSchema = new Schema<IUniversityCommunityPost>({
  universitySlug: { type: String, required: true, index: true, trim: true, lowercase: true },
  userId: { type: String, required: true, index: true },
  userFullName: { type: String, required: true },
  userAvatarUrl: { type: String },
  userRole: { type: String }, // Role of the post author
  postType: {
    type: String,
    required: true,
    enum: ['discussion', 'housing_seeking', 'housing_offering', 'study_group_looking', 'study_group_forming']
  },
  title: { type: String, trim: true },
  content: { type: String, required: true, trim: true },
  tags: [{ type: String, trim: true, lowercase: true }],
  housingDetails: {
    rent: Number,
    availabilityDate: Date,
    roomType: String,
  },
  studyGroupDetails: {
    courseName: String,
    maxMembers: Number
  },
  comments: [CommentSchema],
  isArchived: { type: Boolean, default: false },
}, { timestamps: true });

const UniversityCommunityPost: Model<IUniversityCommunityPost> =
  models.UniversityCommunityPost || mongoose.model<IUniversityCommunityPost>('UniversityCommunityPost', UniversityCommunityPostSchema);

export default UniversityCommunityPost;