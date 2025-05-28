// client/pages/api/webhooks/clerk.js OR client/app/api/webhooks/clerk/route.js
import { Webhook } from 'svix';
// import dbConnect from '../../../lib/dbConnect'; // Adjust path as needed
import dbConnect from '@/lib/dbConnect'; // Update this path to the correct location of dbConnect
import ClerkUserRaw from '@/lib/models/ClerkUserRaw'; // Adjust path
import { buffer } from 'micro'; // May need: npm install micro

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export const config = { // For Pages Router
    api: {
        bodyParser: false,
    },
};

// For App Router, you'd export async function POST(req) { ... }
// and handle the raw body differently, e.g., await req.text()

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) { // For Pages Router
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!WEBHOOK_SECRET) {
        console.error('Clerk webhook secret is not defined.');
        return res.status(500).json({ error: 'Internal server error: Webhook secret missing' });
    }

    const svix_id = Array.isArray(req.headers['svix-id']) ? req.headers['svix-id'][0] : req.headers['svix-id'];
    const svix_timestamp = Array.isArray(req.headers['svix-timestamp']) ? req.headers['svix-timestamp'][0] : req.headers['svix-timestamp'];
    const svix_signature = Array.isArray(req.headers['svix-signature']) ? req.headers['svix-signature'][0] : req.headers['svix-signature'];

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({ error: 'Missing Svix headers' });
    }

    const rawBody = (await buffer(req)).toString(); // For Pages Router
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: any;

    try {
        evt = wh.verify(rawBody, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as { type: string; data: any };
    } catch (err) {
        if (err instanceof Error) {
            console.error('Error verifying webhook signature:', err.message);
        } else {
            console.error('Error verifying webhook signature:', err);
        }
        return res.status(400).json({ error: 'Webhook signature verification failed' });
    }

    const eventType = evt.type;
    const eventData = evt.data; // This is the user object from Clerk (e.g., payload.data from your example)

    console.log(`Received Clerk webhook event: ${eventType} for user ID: ${eventData.id}`);

    try {
        await dbConnect();

        if (eventType === 'user.created' || eventType === 'user.updated') {
            let derivedPrimaryEmail = null;
            if (eventData.email_addresses && eventData.primary_email_address_id) {
                const primaryEmailObj = eventData.email_addresses.find(
                    (email: any) => email.id === eventData.primary_email_address_id
                );
                if (primaryEmailObj) {
                    derivedPrimaryEmail = primaryEmailObj.email_address;
                }
            }

            let derivedPrimaryPhone = null;
            if (eventData.phone_numbers && eventData.primary_phone_number_id) {
                const primaryPhoneObj = eventData.phone_numbers.find(
                    (phone: any) => phone.id === eventData.primary_phone_number_id
                );
                if (primaryPhoneObj) {
                    derivedPrimaryPhone = primaryPhoneObj.phone_number;
                }
            }

            const userDataForDB = {
                clerkId: eventData.id,
                firstName: eventData.first_name,
                lastName: eventData.last_name,
                username: eventData.username,
                imageUrl: eventData.image_url,
                profileImageUrl: eventData.profile_image_url,
                gender: eventData.gender,
                birthday: eventData.birthday,
                passwordEnabled: eventData.password_enabled,
                twoFactorEnabled: eventData.two_factor_enabled,
                primaryEmailAddressId: eventData.primary_email_address_id,
                primaryPhoneNumberId: eventData.primary_phone_number_id,
                primaryWeb3WalletId: eventData.primary_web3_wallet_id,
                externalId: eventData.external_id,
                emailAddresses: eventData.email_addresses,
                phoneNumbers: eventData.phone_numbers,
                web3Wallets: eventData.web3_wallets,
                externalAccounts: eventData.external_accounts,
                publicMetadata: eventData.public_metadata,
                privateMetadata: eventData.private_metadata,
                unsafeMetadata: eventData.unsafe_metadata,
                clerkCreatedAt: eventData.created_at ? new Date(eventData.created_at) : undefined,
                clerkUpdatedAt: eventData.updated_at ? new Date(eventData.updated_at) : undefined,
                lastSignInAt: eventData.last_sign_in_at ? new Date(eventData.last_sign_in_at) : undefined,
                // Populate derived flat primary fields if you want them:
                primaryEmailAddress: derivedPrimaryEmail,
                primaryPhoneNumber: derivedPrimaryPhone,
            };

            // Remove undefined fields to prevent $set from setting fields to null if not present in payload
            (Object.keys(userDataForDB) as Array<keyof typeof userDataForDB>).forEach(key => {
                if (userDataForDB[key] === undefined) {
                    delete userDataForDB[key];
                }
            });

            await ClerkUserRaw.findOneAndUpdate(
                { clerkId: eventData.id },
                { $set: userDataForDB },
                { upsert: true, new: true, runValidators: true }
            );
            console.log(`User ${eventData.id} data ${eventType === 'user.created' ? 'created' : 'upserted'} in local DB.`);

        } else if (eventType === 'user.deleted') {
            const clerkIdToDelete = eventData.id || (eventData.id === null ? null : undefined) ; // Handle potential variations in delete payload
            if (clerkIdToDelete) {
                const deletedUser = await ClerkUserRaw.findOneAndDelete({ clerkId: clerkIdToDelete });
                if (deletedUser) {
                    console.log(`User ${clerkIdToDelete} deleted from local DB.`);
                } else {
                    console.log(`User ${clerkIdToDelete} not found in local DB for deletion.`);
                }
            } else {
                console.warn('User deleted event received without an ID in data.', eventData);
            }
        }

        return res.status(200).json({ success: true, message: `Webhook processed: ${eventType}` });

    } catch (error) {
        if (error instanceof Error) {
            console.error('Error processing webhook and updating database:', error.message, error.stack);
        } else {
            console.error('Error processing webhook and updating database:', error);
        }
        return res.status(500).json({ error: 'Internal server error processing webhook' });
    }
}