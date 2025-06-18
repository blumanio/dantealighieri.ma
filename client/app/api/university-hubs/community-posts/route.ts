import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UniversityCommunityPost from '@/lib/models/UniversityCommunityPost';
import UserProfileDetail from '@/lib/models/UserProfileDetail'; // <-- ADD THIS LINE

/**
 * @swagger
 * /api/university-hubs/community-posts:
 * get:
 * summary: Retrieves all community posts from all universities
 * description: Fetches a paginated list of all non-archived community posts across all universities, sorted by creation date.
 * tags: [Posts]
 * parameters:
 * - in: query
 * name: page
 * schema:
 * type: integer
 * default: 1
 * - in: query
 * name: limit
 * schema:
 * type: integer
 * default: 20
 * responses:
 * 200:
 * description: A list of posts from all universities.
 * 500:
 * description: Internal Server Error
 */
export async function GET(request: Request) {
  // Ensure the UserProfileDetail model is "touched" or used to prevent tree-shaking
  // In most cases, the import itself is enough, but this is an explicit way to ensure it.
  UserProfileDetail.findOne({}).lean(); 

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const skip = (page - 1) * limit;

  await dbConnect();

  try {
    const query = {
      isArchived: false
    };

    // This line will now work correctly
    const posts = await UniversityCommunityPost.find(query)
      .populate({
        path: 'claimedByUserId',
        select: 'personalData.firstName personalData.lastName personalData.countryOfResidence', // Adjusted to your schema
      })
      .populate({
        path: 'postedByAdminId',
        select: 'personalData.firstName personalData.lastName', // Adjusted to your schema
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPosts = await UniversityCommunityPost.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts: totalPosts,
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Failed to fetch all posts:", error);
    // The error is now more descriptive if it fails for other reasons
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
        { success: false, error: 'Internal Server Error', details: errorMessage },
        { status: 500 }
    );
  }
}