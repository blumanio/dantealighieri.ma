import { auth, clerkClient } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import User, { IUser } from '@/lib/models/User';

// Helper function to compare dates by calendar day (remains the same)
function isSameDay(date1: Date, date2: Date): boolean {
    if (!date1 || !date2) return false;
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}

export async function getOrCreateUser(): Promise<IUser> {
    try {
        await dbConnect();

        const { userId } = await auth();
        if (!userId) throw new Error('Unauthorized: User must be signed in.');

        // 1. Fetch the latest user data from Clerk
        const client = await clerkClient()
        const clerkUser = await client.users.getUser(userId);
        if (!clerkUser) throw new Error('User data could not be retrieved from Clerk.');

        let user = await User.findOne({ clerkId: userId });

        const currentSignIn = new Date(clerkUser.lastSignInAt || Date.now());

        // --- Path 1: New User ---
        // If the user does not exist in our DB, create them with a streak of 1.
        if (!user) {
            const newUser = new User({
                clerkId: clerkUser.id,
                email: clerkUser.emailAddresses[0]?.emailAddress || '',
                username: clerkUser.username || clerkUser.id,
                firstName: clerkUser.firstName || '',
                lastName: clerkUser.lastName || '',
                imageUrl: clerkUser.imageUrl || '',
                xp: 0,
                tier: 'Viaggiatore',
                streak: 1, // A new user starts with a 1-day streak.
                processedLastSignInAt: currentSignIn,
            });
            await newUser.save();
            return newUser;
        }

        // --- Path 2: Existing User ---
        const lastProcessedSignIn = user.processedLastSignInAt;

        // If the streak has already been updated for today's sign-in, just return the user.    
        if (lastProcessedSignIn && isSameDay(lastProcessedSignIn, currentSignIn)) {
            return user;
        }

        // If we've reached here, it means we NEED to calculate the streak for a new day.
        const yesterday = new Date(currentSignIn);
        yesterday.setDate(currentSignIn.getDate() - 1);

        // Check if the last action was yesterday to continue the streak.
        if (lastProcessedSignIn && isSameDay(lastProcessedSignIn, yesterday)) {
            user.streak = (user.streak || 0) + 1; // Increment the streak
        } else {
            // The streak is broken or it's the first action for a user who existed before streaks. Reset to 1.
            user.streak = 1;
        }

        // Finally, update the last processed sign-in date to today and save.
        user.processedLastSignInAt = currentSignIn;
        const updatedUser = await user.save();

        return updatedUser;

    } catch (error) {
        console.error('Error in getOrCreateUser:', error);
        throw new Error('Failed to get or create user profile.');
    }
}