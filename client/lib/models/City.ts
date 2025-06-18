// lib/models/City.ts
import mongoose, { Document, Schema } from 'mongoose';

// Ensure this matches your actual CityData type and MongoDB document structure
export interface ICity extends Document {
  id: string; // Internal ID, possibly same as slug or a different unique identifier
  cityName: string;
  slug: string; // Unique URL-friendly identifier
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  heroImage?: string;
  monthlyEstimateEUR: number;
  currencySymbol?: string;
  overallScore: number;
  safetyScore: number;
  studentFriendliness: number;
  universityNames: string[];
  metrics: Array<{ label: string; value: number | string; unit?: string; icon: string; barColor?: string }>;
  nomadListStyleTags?: Array<{ label: string; color: string }>; // Added from mock data
  internetSpeedMbps?: number;
  dataSourceNotes?: string;
  cityDescription?: string; // New field for detailed description
  housingLink?: string; // New field for external housing portals
  // These will be dynamic, not stored in DB usually, but for type consistency in frontend
  annualMinTempC?: number;
  annualMaxTempC?: number;
  currentWeather?: {
    tempC: number;
    minTempC: number;
    maxTempC: number;
    description: string;
    iconURL: string;
    isLoading?: boolean;
    error?: boolean;
  };
}

const CitySchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    cityName: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    region: { type: String, required: true },
    country: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    heroImage: { type: String },
    monthlyEstimateEUR: { type: Number, required: true },
    currencySymbol: { type: String, default: '€' },
    overallScore: { type: Number, required: true },
    safetyScore: { type: Number, required: true },
    studentFriendliness: { type: Number, required: true },
    universityNames: [{ type: String }],
    metrics: [{
      label: { type: String, required: true },
      value: { type: Schema.Types.Mixed, required: true }, // Mixed to allow number or string
      unit: { type: String },
      icon: { type: String }, // Stored as string, mapped to Lucide icon on frontend
      barColor: { type: String },
    }],
    nomadListStyleTags: [{
      label: { type: String },
      color: { type: String },
    }],
    internetSpeedMbps: { type: Number },
    dataSourceNotes: { type: String },
    cityDescription: { type: String },
    housingLink: { type: String },
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields
    collection: 'universitycities', // Explicitly set collection name
  }
);

// Add text index for search on cityName
CitySchema.index({ cityName: 'text' });

export default mongoose.models.City || mongoose.model<ICity>('City', CitySchema);