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
    id: string; // Client-generated ID for list management
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
    id: string; // Client-generated ID
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
    createdAt: Date;
    updatedAt: Date;
}

// --- Mongoose Schemas ---
const EducationEntrySchema = new Schema<IEducationEntry>({
    id: { type: String, required: true }, // Keep client-generated ID for list consistency
    institutionName: { type: String, trim: true },
    institutionCountry: { type: String, trim: true },
    institutionCity: { type: String, trim: true },
    degreeName: { type: String, trim: true },
    fieldOfStudy: { type: String, trim: true },
    graduationYear: { type: String, trim: true },
    graduationMonth: { type: String, trim: true },
    gpa: { type: String, trim: true },
    gradingScale: { type: String, trim: true },
}, { _id: true }); // Mongoose will add its own _id, but 'id' is for client key

const LanguageProficiencySchema = new Schema<ILanguageProficiency>({
    isNativeEnglishSpeaker: { type: String, enum: ['yes', 'no', ''] },
    testTaken: { type: String, enum: ['TOEFL', 'IELTS', 'Duolingo', 'Cambridge', 'Other', ''] },
    overallScore: { type: String, trim: true },
    testDate: { type: String }, // Storing as string as received from client
}, { _id: false });

const StandardizedTestSchema = new Schema<IStandardizedTest>({
    id: { type: String, required: true },
    testName: { type: String, trim: true },
    score: { type: String, trim: true },
    dateTaken: { type: String },
}, { _id: true });

const CustomPersonalDataSchema = new Schema<ICustomPersonalData>({
    dateOfBirth: { type: String },
    gender: { type: String },
    nationality: { type: String, trim: true },
    countryOfResidence: { type: String, trim: true },
    streetAddress: { type: String, trim: true },
    city: { type: String, trim: true },
    stateProvince: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    addressCountry: { type: String, trim: true },
    passportNumber: { type: String, trim: true },
    passportExpiryDate: { type: String },
    emergencyContactName: { type: String, trim: true },
    emergencyContactRelationship: { type: String, trim: true },
    emergencyContactPhone: { type: String, trim: true },
    emergencyContactEmail: { type: String, trim: true, lowercase: true },
}, { _id: false });

const CustomEducationalDataSchema = new Schema<ICustomEducationalData>({
    highestLevelOfEducation: {
        type: String,
        enum: ['High School', "Associate's Degree", "Bachelor's Degree", "Master's Degree", "Doctorate (PhD)", 'Other', ''],
    },
    previousEducation: { type: [EducationEntrySchema], default: [] },
    languageProficiency: { type: LanguageProficiencySchema, default: {} },
    otherStandardizedTests: { type: [StandardizedTestSchema], default: [] },
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
}, {
    timestamps: true, // Adds createdAt and updatedAt
});

// Prevent model overwrite in Next.js hot reloading
const UserProfileDetail: Model<IUserProfileDetail> =
    models.UserProfileDetail || mongoose.model<IUserProfileDetail>('UserProfileDetail', UserProfileDetailSchema);

export default UserProfileDetail;