import { NextResponse } from 'next/server';
import { getOrCreateUser } from '@/lib/actions/user.actions';
import { IUser } from '@/lib/models/User';

// --- Helper functions to build the data structures your component expects ---

// Calculates user's level and rank based on XP
const generateUserStats = (user: IUser) => {
    const xp = user.xp;
    // Simple level calculation (you can make this more complex)
    console.log('User XP:', xp);
    const level = Math.floor(xp / 1000) + 1;
    const nextLevelXP = level * 1000;

    let rankKey = 'Newcomer';
    if (xp > 500) rankKey = 'Aspirant';
    if (xp > 2000) rankKey = 'Prodigy';
    if (xp > 5000) rankKey = 'Maestro';

    return {
        level,
        xp,
        nextLevelXP,
        streak: 0, // You would calculate this based on login history
        completedSections: 0, // You would calculate this from profileSections
        totalSections: 7, // Total number of sections
        rankKey
    };
};

// Generates the list of profile sections with their current completion status
const generateProfileSections = (user: IUser) => {
    // This logic translates raw user data into actionable profile sections
    return [
        {
            id: 'userProfileDetails',
            titleKey: 'User Profile',
            descriptionKey: 'Complete your personal details to personalize your experience.',
            // Check if the user's first name is filled out
            completion: user.shortlist ? 100 : 0,
            statusKey: user.shortlist ? 'completed' : 'actionRequired',
            ctaKey: 'View & Edit',
            urgency: user.shortlist ? undefined : 'high',
            category: 'application'
        },
        {
            id: 'favorites',
            titleKey: 'My Shortlisted Universities',
            descriptionKey: 'Keep track of all the universities that catch your eye.',
            completion: user.shortlist.length > 0 ? 100 : 0,
            statusKey: user.shortlist.length > 0 ? 'inProgress' : 'notStarted',
            ctaKey: 'Manage Favorites',
            category: 'academic'
        },
        // --- Add more sections based on your data models ---
        {
            id: 'documents', titleKey: 'Document Hub', descriptionKey: 'Upload and manage all your required application documents.',
            completion: 0, statusKey: 'notStarted', ctaKey: 'Upload Documents', category: 'application', urgency: 'medium'
        },
        {
            id: 'scholarships', titleKey: 'Scholarship Finder', descriptionKey: 'Discover and track scholarships you are eligible for.',
            completion: 0, statusKey: 'notStarted', ctaKey: 'Find Scholarships', category: 'financial'
        },
        {
            id: 'deadlines', titleKey: 'Deadline Tracker', descriptionKey: 'Never miss an important date with your personalized timeline.',
            completion: 0, statusKey: 'inProgress', ctaKey: 'View Timeline', urgency: 'high', category: 'application'
        },
        {
            id: 'premium', titleKey: 'Premium Hub', descriptionKey: 'Unlock exclusive features and get expert help.',
            completion: user.tier !== 'Viaggiatore' ? 100 : 0, statusKey: user.tier !== 'Viaggiatore' ? 'completed' : 'notStarted', ctaKey: 'Explore Premium', category: 'social'
        }
    ];
};

// Checks which achievements the user has unlocked
const generateAchievements = (user: IUser) => {
    return [
        { id: 'firstStep', titleKey: 'First Step', descriptionKey: 'You started your journey!', unlocked: user.xp > 0 },
        { id: 'dreamCollector', titleKey: 'Dream Collector', descriptionKey: 'Shortlisted 3+ universities', unlocked: user.shortlist.length >= 3, progress: user.shortlist.length, total: 3 },
        { id: 'connected', titleKey: 'Community Member', descriptionKey: 'Made your first post or comment', unlocked: false }, // Requires community data
        { id: 'applicant', titleKey: 'Serious Applicant', descriptionKey: 'Reached Level 5', unlocked: (Math.floor(user.xp / 1000) + 1) >= 5 }
    ];
};


// --- The Main API Route ---
export async function GET() {
    try {
        const user = await getOrCreateUser();

        // 1. Generate all the data structures your frontend needs
        const userStats = generateUserStats(user);
        const profileSections = generateProfileSections(user);
        const achievements = generateAchievements(user);

        // Mock data for features not yet built on the backend
        const communityActivity:any = [];
        const checklistData:any = []; // You would fetch this from your checklist collection

        // 2. Combine everything into a single response object
        const dashboardData = {
            user, // The raw user object, which might still be useful
            userStats,
            profileSections,
            achievements,
            communityActivity,
            checklistData
        };

        return NextResponse.json({ success: true, data: dashboardData }, { status: 200 });

    } catch (error: any) {
        if (error.message.includes('Unauthorized')) {
            return new NextResponse(JSON.stringify({ success: false, message: error.message }), { status: 401 });
        }
        console.error('[DASHBOARD_GET]', error);
        return new NextResponse(JSON.stringify({ success: false, message: 'Internal Server Error' }), { status: 500 });
    }
}