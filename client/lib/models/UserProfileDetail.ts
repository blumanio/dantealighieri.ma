import { ICustomEducationalData, ICustomPersonalData, IEducationEntry, ILanguageProficiency, IStandardizedTest, IUserProfileDetail } from '@/types/types';
import mongoose, { Schema, Document, models, Model } from 'mongoose';



// --- Mongoose Schemas ---

// Schema for Personal Data (Nested)
const CustomPersonalDataSchema = new Schema<ICustomPersonalData>({
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    dateOfBirth: { type: String }, // Or Date
    gender: { type: String, enum: ['male', 'female', 'non-binary', 'other', 'prefer_not_to_say', ''] },
    nationality: { type: String, trim: true },
    countryOfResidence: { type: String, trim: true },
    streetAddress: { type: String, trim: true },
    city: { type: String, trim: true },
    stateProvince: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    addressCountry: { type: String, trim: true },
    passportNumber: { type: String, trim: true },
    passportExpiryDate: { type: String }, // Or Date
    emergencyContactName: { type: String, trim: true },
    emergencyContactRelationship: { type: String, trim: true },
    emergencyContactPhone: { type: String, trim: true },
    emergencyContactEmail: { type: String, trim: true, lowercase: true },
}, { _id: false }); // No separate _id for this subdocument

// Schema for Education Entry (Array of Subdocuments)
const EducationEntrySchema = new Schema<IEducationEntry>({
    // id: { type: String, required: true }, // Not needed if Mongoose _id is sufficient, frontend can use _id
    institutionName: { type: String, trim: true },
    institutionCountry: { type: String, trim: true },
    institutionCity: { type: String, trim: true },
    degreeName: { type: String, trim: true },
    fieldOfStudy: { type: String, trim: true },
    graduationYear: { type: String }, // Could be Number
    graduationMonth: { type: String }, // Could be Number (1-12)
    gpa: { type: String },
    gradingScale: { type: String },
}, { _id: true }); // Each education entry gets its own _id, useful for array manipulations

// Schema for Language Proficiency (Nested)
const LanguageProficiencySchema = new Schema<ILanguageProficiency>({
    isNativeEnglishSpeaker: { type: String, enum: ['yes', 'no', ''] },
    testTaken: { type: String, enum: ['TOEFL', 'IELTS', 'Duolingo', 'Cambridge', 'Other', ''] },
    overallScore: { type: String },
    testDate: { type: String }, // Or Date
}, { _id: false });

// Schema for Standardized Test (Array of Subdocuments)
const StandardizedTestSchema = new Schema<IStandardizedTest>({
    // id: { type: String, required: true }, // Not needed if Mongoose _id is sufficient
    testName: { type: String, trim: true },
    score: { type: String },
    dateTaken: { type: String }, // Or Date
}, { _id: true }); // Each test entry gets its own _id

// Schema for Educational Data (Nested)
const CustomEducationalDataSchema = new Schema<ICustomEducationalData>({
    highestLevelOfEducation: {
        type: String,
        enum: ['High School', "Associate's Degree", "Bachelor's Degree", "Master's Degree", "Doctorate (PhD)", 'Other', ''],
    },
    previousEducation: [EducationEntrySchema],
    languageProficiency: LanguageProficiencySchema,
    otherStandardizedTests: [StandardizedTestSchema],
}, { _id: false });

// Schema for Target University (Array of Subdocuments)
const TargetUniversitySchema = new Schema({
    universityId: { type: Schema.Types.ObjectId, ref: 'University' }, // Example ref
    universityName: { type: String, required: true, trim: true },
    applicationStatus: { type: String, required: true, trim: true }, // Consider an enum
    programOfInterest: { type: String, trim: true },
}, { _id: false }); // Typically _id: false for simple embedded objects unless individual manipulation is frequent

// --- Main UserProfileDetail Schema ---
const UserProfileDetailSchema = new Schema<IUserProfileDetail>({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true, // Important for query performance
    },
    personalData: {
        type: CustomPersonalDataSchema,
        default: () => ({ // Default to an empty object or specific initial values
            firstName: '', lastName: '', // Align with API defaults
            // other fields can be undefined to let Mongoose schema types handle it
        }),
    },
    educationalData: {
        type: CustomEducationalDataSchema,
        default: () => ({ // Default for educational data
            previousEducation: [],
            languageProficiency: { isNativeEnglishSpeaker: '' }, // Align with API defaults
            otherStandardizedTests: [],
        }),
    },
    role: {
        type: String,
        enum: ['student', 'alumni', 'mentor', 'admin'],
        default: 'student',
    },
    premiumTier: {
        type: String,
        enum: ['Michelangelo', 'Dante', 'da Vinci'],
        default: 'Michelangelo',
    },
    profileVisibility: {
        type: String,
        enum: ['public', 'private', 'network_only'],
        default: 'private',
    },
    languageInterests: [{ type: String }], // Array of strings
    targetUniversities: [TargetUniversitySchema],
    aboutMe: { type: String, trim: true, maxlength: 2000 },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});

// --- Model Creation and Export ---
// This pattern prevents redefining the model in Next.js hot-reload environments
const UserProfileDetail: Model<IUserProfileDetail> =
    models.UserProfileDetail || mongoose.model<IUserProfileDetail>('UserProfileDetail', UserProfileDetailSchema);

export default UserProfileDetail;
