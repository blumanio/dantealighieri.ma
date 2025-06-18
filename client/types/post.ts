// lib/types/post.ts
import { Document } from 'mongoose';
import { IPost, PostCategory } from '@/lib/models/Post'; // Import IPost and PostCategory

// Define IComment interface
export interface IComment extends Document {
  authorId: string; // Clerk User ID of the comment author
  postId: string; // ID of the post this comment belongs to
  content: string; // Content of the comment
  createdAt: Date;
  updatedAt: Date;
  // This 'author' field is for hydrated data from Clerk, added by API
  author?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
    role: string;
  };
}

// Extend IPost to include hydrated author and comments for the frontend state
export interface IPostWithComments extends IPost {
  comments: IComment[]; // Array of comments, potentially hydrated with author data
  author: { // Hydrated author data from Clerk
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
  };
  // Add any other display-specific fields here that might come from other sources
  // For example, if 'title' was specific to UniversityCommunityPost and you want to unify:
  title?: string;
  tags?: string[]; // If tags are a common feature for posts
}