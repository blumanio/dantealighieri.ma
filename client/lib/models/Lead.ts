import mongoose, { Schema, Document, Model } from 'mongoose';

export type LeadTag = 'COLD' | 'WARM' | 'HOT';

export interface ILead extends Document {
  name?: string;
  email: string;
  whatsapp?: string;
  country?: string;
  quiz_answers?: Record<string, string | string[]>;
  tag: LeadTag;
  createdAt: Date;
  updatedAt: Date;
  contacted_at: Date | null;
  converted: boolean;
}

const LeadSchema = new Schema<ILead>({
  name: { type: String, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  whatsapp: { type: String, trim: true },
  country: { type: String, trim: true },
  quiz_answers: { type: Schema.Types.Mixed },
  tag: { type: String, enum: ['COLD', 'WARM', 'HOT'], default: 'WARM' },
  contacted_at: { type: Date, default: null },
  converted: { type: Boolean, default: false },
}, { timestamps: true });

const Lead: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
