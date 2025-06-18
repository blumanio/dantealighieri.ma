// lib/models/Comment.ts
import mongoose, { Document, Schema } from 'mongoose';
// import { IComment } from '@/types/post'; // Removed to avoid conflict with local IComment interface

// Ensure IComment also includes original author details if needed for comments
export interface IComment extends Document {
  authorId: string; // Clerk User ID (can be temporary/placeholder)
  postId: string; // ID of the post this comment belongs to
  content: string;

  // Fields to store original external user data (Optional, for admin-created comments)
  originalAuthorFullName?: string;
  originalAuthorAvatarUrl?: string;
  originalAuthorExternalId?: string; // e.g., Facebook User ID

  createdAt: Date;
  updatedAt: Date;
  // author field for hydration (from lib/types/post.ts)
  author?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
  };
}


const CommentSchema: Schema = new Schema(
  {
    authorId: { type: String, required: true, index: true },
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    content: { type: String, required: true },

    originalAuthorFullName: { type: String }, // New field
    originalAuthorAvatarUrl: { type: String }, // New field
    originalAuthorExternalId: { type: String }, // New field

  },
  { timestamps: true }
);

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);