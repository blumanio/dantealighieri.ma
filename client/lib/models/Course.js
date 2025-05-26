// client/lib/models/Course.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const DeadlineSchema = new Schema({ /* ... */ });

const courseSchema = new Schema({
  nome: { type: String, trim: true },
  link: { type: String, trim: true },
  tipo: { type: String, trim: true },
  uni: { type: String, trim: true, required: true }, // Original name for display
  uniSlug: { // FIELD TO QUERY WITH
    type: String,
    trim: true,
    lowercase: true,
    index: true,
    // required: true // Ideally true after backfilling
  },
  accesso: { type: String, trim: true },
  area: { type: String, trim: true },
  lingua: { type: String, trim: true },
  comune: { type: String, trim: true },
  deadlines: [DeadlineSchema],
  academicYear: { type: String, trim: true },
  intake: { type: String, trim: true },
  viewCount: { type: Number, default: 0, min: 0 },
  favoriteCount: { type: Number, default: 0, min: 0 },
  trackedCount: { type: Number, default: 0, min: 0 }
}, {
  timestamps: true
});

// Pre-save hook to auto-generate uniSlug
courseSchema.pre('save', function(next) {
  if (this.isModified('uni') || !this.uniSlug) { // Also generate if uniSlug is missing
    if (this.uni) {
      this.uniSlug = this.uni.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[àáâãäåāăą]/g, 'a')
        .replace(/[èéêëēĕėęě]/g, 'e')
        .replace(/[ìíîïĩīĭįı]/g, 'i')
        .replace(/[òóôõöōŏő]/g, 'o')
        .replace(/[ùúûüũūŭůűų]/g, 'u')
        .replace(/[ýÿŷ]/g, 'y')
        .replace(/[ñń]/g, 'n')
        .replace(/[çćč]/g, 'c')
        .replace(/[šśŝş]/g, 's')
        .replace(/[žźż]/g, 'z')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
    } else {
        this.uniSlug = undefined; // Or handle as an error if uni is required
    }
  }
  next();
});

export default mongoose.models.Course || mongoose.model("Course", courseSchema);