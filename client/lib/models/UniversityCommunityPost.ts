// lib/models/UniversityCommunityPost.ts
import mongoose, { Document, Model, Schema } from 'mongoose';
import IUserProfileDetail from '@/lib/models/UserProfileDetail'; // Adjust the import if IUserProfileDetail is exported as a default export
import { ICustomEducationalData, ICustomPersonalData } from '@/types/types'; // Adjust the import path as necessary
// Interface for Housing Details (remains the same)
import { IComment } from '@/types/post';

interface IHousingDetails {
    type: 'seeking' | 'offering';
    rent?: number;
    availabilityDate?: Date;
}

// Interface for Study Group Details (remains the same)
interface IStudyGroupDetails {
    subject: string;
    level?: string;
}

// Interface and Schema for Comments (remains the same)
export interface IUniversityCommunityPostComment extends Document {
    userId: string;
    userFullName: string;
    userAvatarUrl?: string;
    userRole?: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const UniversityCommunityPostCommentSchema = new Schema<IUniversityCommunityPostComment>({
    userId: { type: String, required: true },
    userFullName: { type: String, required: true, trim: true },
    userAvatarUrl: { type: String, trim: true },
    userRole: { type: String, trim: true },
    content: { type: String, required: true, trim: true },
}, { timestamps: true });


// Updated Main Post Interface
export interface IUniversityCommunityPost extends Document {
    universitySlug: string;
    userId: string; // Clerk User ID of the admin creating the post OR the user who claimed it
    userFullName: string; // Stores the originalFacebookUsername or claimer's name
    userAvatarUrl?: string; // Stores the originalFacebookUserAvatarUrl or claimer's avatar
    userRole?: string;
    postType: 'discussion' | 'housing_seeking' | 'housing_offering' | 'study_group_looking' | 'study_group_forming' | 'event' | 'other';
    content: string;
    tags?: string[];
    isArchived: boolean;
    comments: IComment[]; // Mongoose `Types.DocumentArray<IUniversityCommunityPostComment>` in practice
    housingDetails?: IHousingDetails;
    studyGroupDetails?: IStudyGroupDetails;

    // Fields for likes and bookmarks
    likedBy: string[]; // Array of Clerk User IDs who liked the post
    bookmarkedBy: string[]; // Array of Clerk User IDs who bookmarked the post
    likesCount: number; // Will be a virtual property
    bookmarksCount: number; // Will be a virtual property

    // Facebook and Claiming specific fields
    originalFacebookUsername: string;
    originalFacebookUserAvatarUrl?: string;
    facebookUserId?: string;
    isClaimable: boolean;
    claimedByUserId?: mongoose.Types.ObjectId | null; // Assuming IUserProfileDetail is also a Mongoose document type
    originalUserCountry?: string;
    postedByAdminId: mongoose.Types.ObjectId | null; // Assuming IUserProfileDetail is also a Mongoose document type

    createdAt: Date;
    updatedAt: Date;
}

// Updated Main Post Schema
const UniversityCommunityPostSchema = new Schema<IUniversityCommunityPost>({
    universitySlug: { type: String, required: true, trim: true, index: true },
    userId: { type: String, required: true }, // Clerk User ID
    userFullName: { type: String, required: true, trim: true },
    userAvatarUrl: { type: String, trim: true },
    userRole: { type: String, trim: true, default: 'community_member' },
    postType: {
        type: String,
        required: true,
        enum: ['discussion', 'housing_seeking', 'housing_offering', 'study_group_looking', 'study_group_forming', 'event', 'other'],
    },
    content: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    isArchived: { type: Boolean, default: false },
    comments: [UniversityCommunityPostCommentSchema], // Embedded comments
    housingDetails: { // Optional, so no `required: true`
        type: { type: String, enum: ['seeking', 'offering'] },
        rent: Number,
        availabilityDate: Date,
    },
    studyGroupDetails: { // Optional
        subject: String,
        level: String,
    },

    // Interaction fields added to schema
    likedBy: [{ type: String }], // Array of Clerk User IDs
    bookmarkedBy: [{ type: String }], // Array of Clerk User IDs

    // Facebook and Claiming specific fields
    originalFacebookUsername: { type: String, required: true, trim: true },
    originalFacebookUserAvatarUrl: { type: String, trim: true },
    facebookUserId: { type: String, trim: true, index: true },
    isClaimable: { type: Boolean, default: false },
    claimedByUserId: { type: Schema.Types.ObjectId, ref: 'UserProfileDetail', default: null },
    originalUserCountry: { type: String, trim: true },
    postedByAdminId: { type: Schema.Types.ObjectId, ref: 'UserProfileDetail', required: true },
}, {
    timestamps: true,
    toJSON: { virtuals: true }, // Important for virtuals to be included in JSON output
    toObject: { virtuals: true } // Important for virtuals to be included when converting to object
});

// Virtual for likesCount
UniversityCommunityPostSchema.virtual('likesCount').get(function (this: IUniversityCommunityPost) {
    return this.likedBy.length;
});

// Virtual for bookmarksCount
UniversityCommunityPostSchema.virtual('bookmarksCount').get(function (this: IUniversityCommunityPost) {
    return this.bookmarkedBy.length;
});

// Indexes (remains the same)
UniversityCommunityPostSchema.index({ universitySlug: 1, createdAt: -1 });
UniversityCommunityPostSchema.index({ universitySlug: 1, postType: 1, createdAt: -1 });
UniversityCommunityPostSchema.index({ facebookUserId: 1, isClaimable: 1 });

// Model definition (remains the same, ensure correct Model typing)
const UniversityCommunityPost: Model<IUniversityCommunityPost> =
    mongoose.models.UniversityCommunityPost ||
    mongoose.model<IUniversityCommunityPost>('UniversityCommunityPost', UniversityCommunityPostSchema);

export default UniversityCommunityPost;