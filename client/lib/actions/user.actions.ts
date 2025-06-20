import { auth, clerkClient } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import User, { IUser } from '@/lib/models/User';

// Helper function to compare dates by calendar day
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

        const client = await clerkClient()
        const clerkUser = await client.users.getUser(userId);
        if (!clerkUser) throw new Error('User data could not be retrieved from Clerk.');

        let user = await User.findOne({ clerkId: userId });

        const currentSignIn = new Date();
        console.log('Clerk user public metadata: vvvvvvvvvvvv', clerkUser.publicMetadata.countryOfOrigin);
        // --- Path 1: New User ---
        if (!user) {
            const newUser = new User({
                clerkId: clerkUser.id,
                email: clerkUser.emailAddresses[0]?.emailAddress || '',
                username: clerkUser.username || clerkUser.id,
                firstName: clerkUser.firstName || '',
                lastName: clerkUser.lastName || '',
                imageUrl: clerkUser.imageUrl || '',
                country: clerkUser.publicMetadata.countryOfOrigin || '',
                xp: 0,
                tier: 'Viaggiatore',
                streak: 1,
                lastLogin: currentSignIn,
                lastActiveDate: currentSignIn,
            });
            await newUser.save();
            return newUser;
        }

        // --- Path 2: Existing User ---
        const lastActiveDate = user.lastActiveDate;

        // If the streak has already been updated for today, just return the user
        if (lastActiveDate && isSameDay(lastActiveDate, currentSignIn)) {
            // Update lastLogin but keep the same lastActiveDate since it's the same day
            user.lastLogin = currentSignIn;
            await user.save();
            return user;
        }

        // Calculate streak for a new day
        const yesterday = new Date(currentSignIn);
        yesterday.setDate(currentSignIn.getDate() - 1);

        console.log('Current sign in:', currentSignIn);
        console.log('Last active date:', lastActiveDate);
        console.log('Yesterday:', yesterday);
        console.log('Same day as yesterday check:', lastActiveDate ? isSameDay(lastActiveDate, yesterday) : false);

        // Check if the last active date was yesterday to continue the streak
        if (lastActiveDate && isSameDay(lastActiveDate, yesterday)) {
            user.streak = (user.streak || 0) + 1; // Continue streak
            console.log('Continuing streak:', user.streak);
        } else {
            // Streak broken or first time - reset to 1
            user.streak = 1;
            console.log('Streak reset to 1');
        }

        // Update both login timestamps
        user.lastLogin = currentSignIn;
        user.lastActiveDate = currentSignIn;
        
        const updatedUser = await user.save();
        return updatedUser;

    } catch (error) {
        console.error('Error in getOrCreateUser:', error);
        throw new Error('Failed to get or create user profile.');
    }
}