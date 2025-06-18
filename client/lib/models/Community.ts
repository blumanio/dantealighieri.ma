// lib/models/Community.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ICommunity extends Document {
  type: 'University' | 'City' | 'Country';
  name: string; // The official, human-readable name
  slug: string; // A unique, URL-friendly version of the name
  description?: string;
  imageUrl?: string; // URL for a logo or representative image
  city?: string; // e.g., "Bologna" for the University of Bologna
  country: string; // e.g., "Italy"

  // Denormalized counters for performance
  postCount: number;
  memberCount: number; // Number of users following this community
}

const CommunitySchema: Schema = new Schema({
  type: { type: String, required: true, enum: ['University', 'City', 'Country'], index: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // Slugs MUST be unique
  description: { type: String },
  imageUrl: { type: String },
  city: { type: String },
  country: { type: String, default: 'Italy' },
  postCount: { type: Number, default: 0 },
  memberCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Community || mongoose.model<ICommunity>('Community', CommunitySchema);