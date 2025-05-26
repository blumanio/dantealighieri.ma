import mongoose, { Schema, Document } from 'mongoose';

export interface IUniversity extends Document {
  name: string;
  slug: string; // URL-friendly, unique
  location?: string;
  city?: string; // To link with CityCostExplorer
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  contacts?: { email?: string; phone?: string };
  // Add any other specific fields like founding year, student count etc.
}

const UniversitySchema = new Schema<IUniversity>({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  location: { type: String, trim: true },
  city: { type: String, trim: true, lowercase: true, index: true },
  description: { type: String },
  logoUrl: { type: String },
  websiteUrl: { type: String },
  contacts: {
    email: String,
    phone: String
  }
}, { timestamps: true });

export default mongoose.models.University || mongoose.model<IUniversity>('University', UniversitySchema);