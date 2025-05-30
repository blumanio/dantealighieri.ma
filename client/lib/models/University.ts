// client/lib/models/University.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUniversity extends Document {
  // _id is automatically generated
  name: string;
  slug: string;
  location?: string;
  city?: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  contacts?: { email?: string; phone?: string };
  deadline?: string;
  admission_fee?: number;
  cgpa_requirement?: string;
  english_requirement?: string;
  intakes?: { name: string; start_date?: string; end_date?: string; notes?: string }[];
  application_link?: string;

  // -------- COUNT FIELDS - Ensure these are here --------
  viewCount: number;
  favoriteCount: number;
  trackedCount: number;
  // ----------------------------------------------------

  // You also have an "id" field in your sample JSON.
  // If this is a custom numeric ID separate from MongoDB's _id, define it.
  // Otherwise, if it's legacy, consider removing it to avoid confusion with _id.
  id?: number; // Or string, depending on its nature
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
  },
  deadline: { type: String },
  admission_fee: { type: Number, default: 0 },
  cgpa_requirement: { type: String },
  english_requirement: { type: String },
  intakes: [{
    name: String,
    start_date: String,
    end_date: String,
    notes: String,
  }],
  application_link: { type: String },

  // -------- COUNT FIELDS DEFINITION WITH DEFAULTS --------
  viewCount: { type: Number, default: 0 },
  favoriteCount: { type: Number, default: 0 },
  trackedCount: { type: Number, default: 0 },
  // -------------------------------------------------------
  id: { type: Number }, // If you intend to keep the numeric 'id'
}, { timestamps: true }); // `updatedAt` from your sample is due to this

export default mongoose.models.University || mongoose.model<IUniversity>('University', UniversitySchema);