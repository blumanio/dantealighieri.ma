// client/lib/models/ClerkUserRaw.ts
import mongoose, { Schema, Document, models, Model } from 'mongoose';

// Define interfaces for nested objects if you want stricter typing
interface IClerkEmailAddress {
    id: string;
    email_address: string;
    verification?: {
        status: string;
        strategy: string;
        [key: string]: any; // For other potential verification fields
    };
    linked_to: any[];
    object: 'email_address';
}

interface IClerkPhoneNumber {
    id: string;
    phone_number: string;
    verification?: {
        status: string;
        strategy: string;
        [key: string]: any;
    };
    linked_to: any[];
    object: 'phone_number';
}

export interface IClerkUserRaw extends Document {
    clerkId: string; // from payload.data.id
    firstName?: string | null;
    lastName?: string | null;
    username?: string | null;
    imageUrl?: string | null;
    profileImageUrl?: string | null; // Older field, image_url is preferred by Clerk
    gender?: string | null;
    birthday?: string | null;
    passwordEnabled?: boolean;
    twoFactorEnabled?: boolean;

    primaryEmailAddressId?: string | null;
    primaryPhoneNumberId?: string | null;
    primaryWeb3WalletId?: string | null;

    externalId?: string | null; // from payload.data.external_id

    // Store the rich array structures
    emailAddresses?: IClerkEmailAddress[];
    phoneNumbers?: IClerkPhoneNumber[];
    web3Wallets?: any[]; // Define a specific interface if structure is known
    externalAccounts?: any[]; // Define a specific interface if structure is known

    publicMetadata?: Record<string, any>;
    privateMetadata?: Record<string, any>; // Be mindful of storing sensitive data
    unsafeMetadata?: Record<string, any>;

    // Clerk's timestamps
    clerkCreatedAt?: Date; // from payload.data.created_at (Unix ms)
    clerkUpdatedAt?: Date; // from payload.data.updated_at (Unix ms)
    lastSignInAt?: Date | null; // from payload.data.last_sign_in_at (Unix ms)

    // --- Fields from initial CSV import (now optional if webhooks are primary sync) ---
    // These might not be directly in every webhook payload in the same flat way.
    // The webhook handler will attempt to derive primaryEmailAddress / primaryPhoneNumber
    // from the arrays above for these fields if you wish to keep them flat.
    primaryEmailAddress?: string | null; // Derived or from CSV
    primaryPhoneNumber?: string | null;  // Derived or from CSV
    // These are not available in webhook payloads:
    // totpSecret?: string | null;
    // passwordDigest?: string | null;
    // passwordHasher?: string | null;
    // -----------------------------------------------------------------------------

    // Mongoose's own timestamps for the database record
    createdAt: Date;
    updatedAt: Date;
}

const ClerkEmailAddressSchema = new Schema<IClerkEmailAddress>({
    id: String,
    email_address: String,
    verification: { type: Schema.Types.Mixed },
    linked_to: [Schema.Types.Mixed],
    object: String,
}, { _id: false });

const ClerkPhoneNumberSchema = new Schema<IClerkPhoneNumber>({
    id: String,
    phone_number: String,
    verification: { type: Schema.Types.Mixed },
    linked_to: [Schema.Types.Mixed],
    object: String,
}, { _id: false });

const ClerkUserRawSchema = new Schema<IClerkUserRaw>({
    clerkId: { type: String, required: true, unique: true, index: true },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    username: { type: String, default: null },
    imageUrl: { type: String, default: null },
    profileImageUrl: { type: String, default: null },
    gender: { type: String, default: null },
    birthday: { type: String, default: null },
    passwordEnabled: { type: Boolean },
    twoFactorEnabled: { type: Boolean },
    primaryEmailAddressId: { type: String, default: null },
    primaryPhoneNumberId: { type: String, default: null },
    primaryWeb3WalletId: { type: String, default: null },
    externalId: { type: String, default: null },

    emailAddresses: { type: [ClerkEmailAddressSchema], default: [] },
    phoneNumbers: { type: [ClerkPhoneNumberSchema], default: [] },
    web3Wallets: { type: [Schema.Types.Mixed], default: [] },
    externalAccounts: { type: [Schema.Types.Mixed], default: [] },

    publicMetadata: { type: Schema.Types.Mixed, default: {} },
    privateMetadata: { type: Schema.Types.Mixed, default: {} },
    unsafeMetadata: { type: Schema.Types.Mixed, default: {} },

    clerkCreatedAt: { type: Date },
    clerkUpdatedAt: { type: Date },
    lastSignInAt: { type: Date, default: null },

    // For data primarily from CSV, or if you want to maintain these flat fields
    primaryEmailAddress: { type: String, default: null },
    primaryPhoneNumber: { type: String, default: null },

}, {
    timestamps: true, // Mongoose's createdAt/updatedAt for the DB record itself
});

const ClerkUserRaw: Model<IClerkUserRaw> =
    models.ClerkUserRaw || mongoose.model<IClerkUserRaw>('ClerkUserRaw', ClerkUserRawSchema);

export default ClerkUserRaw;