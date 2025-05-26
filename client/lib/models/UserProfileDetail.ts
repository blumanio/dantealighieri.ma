// lib/models/UserProfileDetail.ts
import mongoose, { Schema, Document, models, Model } from 'mongoose';

// --- Interface matching frontend (for type consistency, can be in shared types file) ---
interface ICustomPersonalData {
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    countryOfResidence?: string;
    streetAddress?: string;
    city?: string;
    stateProvince?: string;
    postalCode?: string;
    addressCountry?: string;
    passportNumber?: string;
    passportExpiryDate?: string;
    emergencyContactName?: string;
    emergencyContactRelationship?: string;
    emergencyContactPhone?: string;
    emergencyContactEmail?: string;
}

interface IEducationEntry {
    id: string;
    institutionName?: string;
    institutionCountry?: string;
    institutionCity?: string;
    degreeName?: string;
    fieldOfStudy?: string;
    graduationYear?: string;
    graduationMonth?: string;
    gpa?: string;
    gradingScale?: string;
}

interface ILanguageProficiency {
    isNativeEnglishSpeaker?: 'yes' | 'no' | '';
    testTaken?: 'TOEFL' | 'IELTS' | 'Duolingo' | 'Cambridge' | 'Other' | '';
    overallScore?: string;
    testDate?: string;
}

interface IStandardizedTest {
    id: string;
    testName?: string;
    score?: string;
    dateTaken?: string;
}

interface ICustomEducationalData {
    highestLevelOfEducation?: 'High School' | "Associate's Degree" | "Bachelor's Degree" | "Master's Degree" | "Doctorate (PhD)" | 'Other' | '';
    previousEducation?: IEducationEntry[];
    languageProficiency?: ILanguageProficiency;
    otherStandardizedTests?: IStandardizedTest[];
}

// --- Mongoose Document Interface ---
export interface IUserProfileDetail extends Document {
    userId: string; // Clerk User ID
    personalData?: ICustomPersonalData;
    educationalData?: ICustomEducationalData;
    role?: 'student' | 'alumni' | 'mentor' | 'admin'; // ADDED
    premiumTier?: 'Amico' | 'Artista' | 'Maestro'; // ADDED
    profileVisibility?: 'public' | 'private' | 'network_only'; // ADDED
    languageInterests?: string[]; // ADDED e.g., ['en', 'it']
    targetUniversities?: { // ADDED
        universityId?: mongoose.Types.ObjectId; // Link to a future University model if needed
        universityName: string;
        applicationStatus: string; // e.g., "Interested", "Applied", "Accepted"
        programOfInterest?: string;
    }[];
    aboutMe?: string; // ADDED
    createdAt: Date;
    updatedAt: Date;
}

// --- Mongoose Schemas (existing ones unchanged, new ones added below) ---
const EducationEntrySchema = new Schema<IEducationEntry>({ /* ... existing ... */ }, { _id: true });
const LanguageProficiencySchema = new Schema<ILanguageProficiency>({ /* ... existing ... */ }, { _id: false });
const StandardizedTestSchema = new Schema<IStandardizedTest>({ /* ... existing ... */ }, { _id: true });
const CustomPersonalDataSchema = new Schema<ICustomPersonalData>({ /* ... existing ... */ }, { _id: false });
const CustomEducationalDataSchema = new Schema<ICustomEducationalData>({ /* ... existing ... */ }, { _id: false });

const TargetUniversitySchema = new Schema({
    universityId: { type: Schema.Types.ObjectId, ref: 'University' }, // Optional ref
    universityName: { type: String, required: true },
    applicationStatus: { type: String, required: true },
    programOfInterest: { type: String },
}, { _id: false });

const UserProfileDetailSchema = new Schema<IUserProfileDetail>({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    personalData: {
        type: CustomPersonalDataSchema,
        default: {},
    },
    educationalData: {
        type: CustomEducationalDataSchema,
        default: {},
    },
    role: { // ADDED
        type: String,
        enum: ['student', 'alumni', 'mentor', 'admin'],
        default: 'student'
    },
    premiumTier: { type: String, enum: ['Amico', 'Artista', 'Maestro'] }, // ADDED
    profileVisibility: { // ADDED
        type: String,
        enum: ['public', 'private', 'network_only'],
        default: 'private'
    },
    languageInterests: [{ type: String }], // ADDED
    targetUniversities: [TargetUniversitySchema], // ADDED
    aboutMe: { type: String, trim: true }, // ADDED
}, {
    timestamps: true,
});

const UserProfileDetail: Model<IUserProfileDetail> =
    models.UserProfileDetail || mongoose.model<IUserProfileDetail>('UserProfileDetail', UserProfileDetailSchema);

export default UserProfileDetail;