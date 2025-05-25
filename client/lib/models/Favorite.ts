import mongoose, { Schema, Document, Model } from 'mongoose'; // Ensure Model is imported

// Define an interface for the Favorite document
export interface IFavorite extends Document {
  userId: string;
  courseId: mongoose.Types.ObjectId; // Added courseId
  courseUni: string;
  courseNome: string;
  courseLink: string;
  courseComune: string;
  createdAt: Date;
  updatedAt: Date;
}

const favoriteSchema = new Schema<IFavorite>({ // Use the interface with Schema
  userId: {
    type: String,
    required: true,
    index: true,
  },
  courseId: { // Add courseId field
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  courseUni: {
    type: String,
    required: true,
  },
  courseNome: {
    type: String,
    required: true,
  },
  courseLink: {
    type: String,
    required: true,
    index: true // Keep index on courseLink if it's frequently queried
  },
  courseComune: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Compound index to prevent duplicate favorites
favoriteSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Ensure the model is correctly typed
const Favorite: Model<IFavorite> =
  mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', favoriteSchema);

export default Favorite;