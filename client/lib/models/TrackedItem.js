// client/lib/models/TrackedItem.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const trackedItemSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course', 
    required: true,
  },
  userApplicationStatus: {
    type: String,
    trim: true,
    enum: [
        'Not Started',
        'Researching',
        'Preparing Documents',
        // Changed 'Awaiting Pre-enrollment' to 'Awaiting Pre Enrollment' to match client data
        'Awaiting Pre Enrollment', 
        'Applied',
        'Awaiting Results',
        'Accepted',
        'Rejected',
        'Enrolled'
    ],
    default: 'Researching',
  },
  userNotes: { 
    type: String,
    trim: true,
    default: '',
  },
  isArchived: { 
    type: Boolean,
    default: false,
  },
  courseLink: { 
    type: String,
    required: [true, 'Course link is required for a tracked item.'],
    trim: true,
  },
}, {
  timestamps: true,
});

trackedItemSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.models.TrackedItem || mongoose.model('TrackedItem', trackedItemSchema);