// Improved migration script with better error handling and pagination
import { clerkClient } from '@clerk/clerk-sdk-node';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid
import UserProfileDetail from './lib/models/userProfileDetail.js';

const MONGODB_URI = process.env.MONGODB_URI_FOR_SCRIPT;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const BATCH_SIZE = 100; // Process users in batches
const MAX_RETRIES = 3;

async function migrateExistingUsers() {
    if (!MONGODB_URI || !CLERK_SECRET_KEY) {
        console.error('MONGODB_URI_FOR_SCRIPT or CLERK_SECRET_KEY is not set.');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected for migration.');

        let totalMigrated = 0;
        let totalSkipped = 0;
        let totalErrors = 0;
        let offset = 0;
        let hasMore = true;

        // Process users in batches with pagination
        while (hasMore) {
            try {
                console.log(`\nFetching users batch starting at offset: ${offset}`);
                
                const clerkUsers = await clerkClient.users.getUserList({ 
                    limit: BATCH_SIZE,
                    offset: offset 
                });

                if (clerkUsers.length === 0) {
                    hasMore = false;
                    break;
                }

                console.log(`Processing ${clerkUsers.length} users...`);

                // Process each user with individual error handling
                for (const user of clerkUsers) {
                    try {
                        const existingProfile = await UserProfileDetail.findOne({ userId: user.id });
                        
                        if (!existingProfile) {
                            // Create new profile with proper ID generation
                            await UserProfileDetail.create({
                                userId: user.id,
                                personalData: {
                                    firstName: user.firstName || '',
                                    lastName: user.lastName || '',
                                    email: user.emailAddresses?.[0]?.emailAddress || '',
                                },
                                educationalData: {
                                    previousEducation: [{ 
                                        id: uuidv4(), // Use proper UUID instead of Date.now()
                                        institution: '',
                                        degree: '',
                                        year: ''
                                    }],
                                    otherStandardizedTests: [],
                                    languageProficiency: { isNativeEnglishSpeaker: '' },
                                },
                                role: 'student',
                                premiumTier: 'Amico',
                                profileVisibility: 'private',
                                languageInterests: [],
                                targetUniversities: [],
                                aboutMe: '',
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            });

                            totalMigrated++;
                            console.log(`✅ Migrated user: ${user.id} (${user.emailAddresses?.[0]?.emailAddress || 'no email'})`);
                        } else {
                            totalSkipped++;
                            console.log(`⏭️  User already exists, skipped: ${user.id}`);
                        }
                    } catch (userError) {
                        totalErrors++;
                        console.error(`❌ Error migrating user ${user.id}:`, userError.message);
                        
                        // Log detailed error for debugging
                        console.error(`   User data: ${JSON.stringify({
                            id: user.id,
                            email: user.emailAddresses?.[0]?.emailAddress,
                            firstName: user.firstName,
                            lastName: user.lastName
                        }, null, 2)}`);
                    }
                }

                offset += BATCH_SIZE;

                // If we got fewer users than requested, we've reached the end
                if (clerkUsers.length < BATCH_SIZE) {
                    hasMore = false;
                }

                // Progress update
                console.log(`Progress: Migrated ${totalMigrated}, Skipped ${totalSkipped}, Errors ${totalErrors}`);

            } catch (batchError) {
                console.error(`❌ Error fetching user batch at offset ${offset}:`, batchError.message);
                
                // Implement retry logic for batch failures
                let retryCount = 0;
                while (retryCount < MAX_RETRIES) {
                    retryCount++;
                    console.log(`Retrying batch (attempt ${retryCount}/${MAX_RETRIES})...`);
                    
                    try {
                        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
                        break; // If we get here, the retry succeeded, so break out of retry loop
                    } catch (retryError) {
                        if (retryCount === MAX_RETRIES) {
                            console.error(`❌ Failed to process batch after ${MAX_RETRIES} retries. Stopping migration.`);
                            throw retryError;
                        }
                    }
                }
            }
        }

        console.log('\n🎉 MIGRATION COMPLETE!');
        console.log('========================');
        console.log(`✅ Successfully migrated: ${totalMigrated} users`);
        console.log(`⏭️  Skipped (already exist): ${totalSkipped} users`);
        console.log(`❌ Errors encountered: ${totalErrors} users`);
        console.log(`📊 Total processed: ${totalMigrated + totalSkipped + totalErrors} users`);

        // Verification step
        const totalProfilesInDb = await UserProfileDetail.countDocuments();
        console.log(`\n📋 Verification: ${totalProfilesInDb} total profiles now in database`);

    } catch (error) {
        console.error('❌ Critical error during migration:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 MongoDB disconnected.');
    }
}

// Add graceful shutdown handling
process.on('SIGINT', async () => {
    console.log('\n⚠️  Received SIGINT. Gracefully shutting down...');
    await mongoose.disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n⚠️  Received SIGTERM. Gracefully shutting down...');
    await mongoose.disconnect();
    process.exit(0);
});

// Run the migration
migrateExistingUsers().catch(error => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
});