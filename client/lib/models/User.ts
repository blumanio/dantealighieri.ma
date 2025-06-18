import mongoose, { Schema, Document, Types, Model } from 'mongoose';

// Define the structure for unlocked features
interface IUnlockedFeatures {
    extraShortlistSlots: number;
    extraTrackingSlots: number;
    unlockedArticles: Types.ObjectId[];
}

export interface IUser extends Document {
    clerkId: string;
    email: string;

    // Gamification & Core Features
    xp: number;
    level: number;
    streak: number;
    lastLogin: Date;
    tier: 'Viaggiatore' | 'Esploratore' | 'Maestro';
processedLastSignInAt: Date;
    // Core University Features
    shortlist: Types.ObjectId[];

    // Features unlocked via XP, independent of tier
    unlockedFeatures: IUnlockedFeatures;

    // Subscription & Billing
    stripeCustomerId?: string;
    subscriptionId?: string;
    subscriptionStatus?: 'active' | 'inactive' | 'cancelled' | 'past_due';

    // Essential User Preferences (keep minimal)
    preferredLanguage: string;
    isOnboardingComplete: boolean;

    // Activity Tracking
    lastActiveDate: Date;

    // Reference to detailed profile (optional - can be populated when needed)
    profileDetail?: Types.ObjectId;
}

const UserSchema: Schema = new Schema({
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },

    // Gamification
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    lastLogin: { type: Date, default: Date.now },

    tier: {
        type: String,
        enum: ['Viaggiatore', 'Esploratore', 'Maestro'],
        default: 'Viaggiatore',
    },

    // Core Features
    shortlist: [{ type: Schema.Types.ObjectId, ref: 'University' }],
 
    unlockedFeatures: {
        extraShortlistSlots: { type: Number, default: 0 },
        extraTrackingSlots: { type: Number, default: 0 },
        unlockedArticles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
    },

    // Subscription
    stripeCustomerId: { type: String, sparse: true },
    subscriptionId: { type: String, sparse: true },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'inactive', 'cancelled', 'past_due'],
        default: 'inactive'
    },

    // Essential Preferences
    preferredLanguage: { type: String, default: 'en' },
    isOnboardingComplete: { type: Boolean, default: false },

    // Activity
    lastActiveDate: { type: Date, default: Date.now },

    // Optional reference to detailed profile
    profileDetail: { type: Schema.Types.ObjectId, ref: 'UserProfileDetail' },

}, {
    timestamps: true,
    // Add indexes for better performance
    indexes: [
        { clerkId: 1 },
        { email: 1 },
        { tier: 1 },
        { lastActiveDate: -1 }
    ]
});

// Add methods for common operations
UserSchema.methods.canShortlist = function () {
    const baseLimits = {
        'Viaggiatore': 5,
        'Esploratore': 15,
        'Maestro': 50
    };
    return this.shortlist.length < (baseLimits[this.tier as 'Viaggiatore' | 'Esploratore' | 'Maestro'] + this.unlockedFeatures.extraShortlistSlots);
};

UserSchema.methods.addXP = function (points: number) {
    this.xp += points;
    // Calculate level based on XP (example: level = floor(xp/1000) + 1)
    this.level = Math.floor(this.xp / 1000) + 1;
    return this.save();
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;