import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    countryCode: {
      type: String,
      required: true
    },
    number: {
      type: String,
      required: true
    }
  },
  education: {
    degree: {
      type: String,
      required: true
    },
    graduationYear: {
      type: Number,
      required: true
    },
    points: {
      type: String,
      required: true
    }
  },
  studyPreference: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'processing', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// ✅ Prevent OverwriteModelError
export default mongoose.models.Application || mongoose.model('Application', applicationSchema);
