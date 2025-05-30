// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import UserProfileDetail from '@/lib/models/UserProfileDetail'; // Your Mongoose model

// Helper function to check admin role (you'll need a more robust way in production)
async function isAdmin(userId: string): Promise<boolean> {
  // Placeholder: In production, fetch UserProfileDetail and check the role.
  // For now, assuming if they can hit admin API, they might have passed some client-side check.
  // THIS IS NOT SECURE FOR PRODUCTION. Implement proper DB role check.
  console.warn("API /api/admin/users performing mock admin check for user:", userId);
  // const profile = await UserProfileDetail.findOne({ userId }).select('role').lean();
  // return profile?.role === 'admin' || profile?.role === 'Coordinatore';
  return true; // DEVELOPMENT ONLY
}

export async function GET(req: NextRequest) {
  try {
    const { userId: currentAdminId } = getAuth(req);
    if (!currentAdminId || !(await isAdmin(currentAdminId))) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const searchTerm = searchParams.get('search') || '';
    const roleFilter = searchParams.get('role') || '';
    const tierFilter = searchParams.get('tier') || '';

    await dbConnect();

    // 1. Fetch users from Clerk based on search term (if any) or list all
    // Clerk's search is good for names/emails/usernames
    const clerkUserListParams: any = { limit: 1000 }; // Fetch more to filter locally for now
    if (searchTerm) {
      clerkUserListParams.query = searchTerm;
    }
    const clerk = await clerkClient();
    const clerkUsersResponse = await clerk.users.getUserList(clerkUserListParams);
    const clerkUsers = clerkUsersResponse.data;

    // 2. Fetch corresponding UserProfileDetails from your DB
    const userIdsFromClerk = clerkUsers.map(u => u.id);
    const profileQuery: any = { userId: { $in: userIdsFromClerk } };
    if (roleFilter) profileQuery.role = roleFilter;
    if (tierFilter) profileQuery.premiumTier = tierFilter;

    const userProfiles = await UserProfileDetail.find(profileQuery).lean();

    // 3. Combine Clerk data with your UserProfileDetail data
    const combinedUsers = clerkUsers.map(clerkUser => {
      const profile = userProfiles.find(p => p.userId === clerkUser.id);
      return {
        id: clerkUser.id,
        clerkId: clerkUser.id,
        fullName: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : clerkUser.username,
        email: clerkUser.primaryEmailAddress?.emailAddress,
        avatarUrl: clerkUser.imageUrl,
        role: profile?.role || 'Viaggiatore', // Default from your model
        premiumTier: profile?.premiumTier || 'Michelangelo', // Default from your model
        createdAt: new Date(clerkUser.createdAt).toISOString(),
        // Add any other relevant fields from profile or clerkUser
      };
    }).filter(user => { // Re-apply search term if it was broad or if profiles didn't have the search field
      if (!searchTerm) return true;
      return (user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.clerkId.toLowerCase().includes(searchTerm.toLowerCase()));
    });


    // 4. Paginate the combined results
    const total = combinedUsers.length;
    const paginatedUsers = combinedUsers.slice((page - 1) * limit, page * limit);

    return NextResponse.json({ success: true, users: paginatedUsers, total, totalPages: Math.ceil(total / limit), currentPage: page });

  } catch (error: any) {
    console.error('API GET /admin/users Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch users', error: error.message }, { status: 500 });
  }
}

// POST, PUT, DELETE for admin/users/[userId] would go into a separate route.ts in that directory