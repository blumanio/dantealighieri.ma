// lib/models/Post.ts
import mongoose, { Document, Schema } from 'mongoose';

// Your PostCategory enum remains the same
export type PostCategory = 'discussion' | 'housing' | 'scholarships' | 'event' | 'other' | 'academic' | 'career' | 'visa_process';

export interface IPost extends Document {
  authorId: string; // Clerk User ID
  communityId: mongoose.Schema.Types.ObjectId; // **CHANGED**: This is now a reference

  // Denormalized fields copied from the Community model at creation
  communityType: 'University' | 'Country' | 'City' | 'General';
  communityName: string;
  communitySlug: string;

  content: string;
  category: PostCategory;

  // Fields for admin-seeded posts
  originalAuthorFullName?: string;
  originalAuthorAvatarUrl?: string;
  originalAuthorExternalId?: string;
  isClaimable?: boolean;
  originalUserCountry?: string;

  // Standard engagement counters
  commentsCount: number;
  likesCount: number;
  bookmarksCount: number;
  likedBy: string[];
  bookmarkedBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    authorId: { type: String, required: true, index: true },
    // **KEY CHANGE**: communityId is now a proper ObjectId reference
    communityId: { type: Schema.Types.ObjectId, ref: 'Community', required: true, index: true },

    // Denormalized fields for performance
    communityType: { type: String, required: true, enum: ['University', 'Course', 'Country', 'City', 'General'] },
    communityName: { type: String, required: true },
    communitySlug: { type: String, required: true },

    content: { type: String, required: true, text: true },
    category: { type: String, required: true, enum: ['discussion', 'housing', 'scholarships', 'event', 'other', 'academic', 'career', 'visa_process'] },

    // Admin-specific fields for seeded content
    originalAuthorFullName: { type: String },
    originalAuthorAvatarUrl: { type: String },
    originalAuthorExternalId: { type: String },
    isClaimable: { type: Boolean, default: false },
    originalUserCountry: { type: String },

    // Your existing counter fields
    commentsCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    bookmarksCount: { type: Number, default: 0 },
    likedBy: [{ type: String }],
    bookmarkedBy: [{ type: String }],
  },
  { timestamps: true }
);

// Ensure a text index for searching post content
PostSchema.index({ content: 'text' });

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);