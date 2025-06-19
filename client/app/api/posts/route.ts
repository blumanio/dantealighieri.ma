// /api/posts/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Post, { PostCategory } from '@/lib/models/Post'; // Import PostCategory
import { clerkClient } from '@clerk/nextjs/server';
import { getAuth } from '@clerk/nextjs/server';
import Comment from '@/lib/models/Comment'; // Assuming you have a Comment model
import Community from '@/lib/models/Community';

export async function GET(request: Request) {
    console.log('🔍 GET /api/posts called');

    const { searchParams } = new URL(request.url);
    console.log('📋 Search params:', Object.fromEntries(searchParams.entries()));

    // Updated parameter names
    const communityType = searchParams.get('communityType');
    const communityId = searchParams.get('communityId');
    const categories = searchParams.getAll('category');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const filter = searchParams.get('filter') || 'recent';
    const search = searchParams.get('search');

    console.log('🔍 Parsed query params:', {
        communityType,
        communityId,
        categories,
        page,
        limit,
        filter,
        search
    });

    try {
        await dbConnect();
        console.log('✅ Database connected');

        const matchStage: any = {};

        if (communityType && communityId) {
            matchStage.communityType = communityType;
            matchStage.communityId = communityId;
            console.log('🎯 Filtering by community:', { communityType, communityId });
        }

        if (search) {
            matchStage.$text = { $search: search };
            console.log('🔍 Text search:', search);
        }

        if (categories && categories.length > 0) {
            matchStage.category = { $in: categories as PostCategory[] };
            console.log('🏷️ Category filter:', categories);
        }

        console.log('📊 Final match stage:', matchStage);

        let sortStage: any = { createdAt: -1 };
        if (filter === 'popular') sortStage = { likesCount: -1, createdAt: -1 };
        if (filter === 'trending') sortStage = { commentsCount: -1, createdAt: -1 };

        console.log('📈 Sort stage:', sortStage);

        const totalPosts = await Post.countDocuments(matchStage);
        console.log('📊 Total matching posts:', totalPosts);

        if (totalPosts === 0) {
            console.log('❌ No posts found matching criteria. Returning empty array.');
            return NextResponse.json({ posts: [], currentPage: page, totalPages: 0, totalPosts: 0 });
        }

        const posts = await Post.aggregate([
            { $match: matchStage },
            { $sort: sortStage },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
                $lookup: {
                    from: 'comments', // Ensure this matches your comments collection name
                    localField: '_id',
                    foreignField: 'postId',
                    as: 'comments',
                    pipeline: [{ $sort: { createdAt: 1 } }],
                },
            },
            {
                $addFields: {
                    commentsCount: { $size: "$comments" },
                }
            },
        ]);

        console.log('📦 Posts found:', posts.length);
        console.log('📦 Posts preview:', posts.map(p => ({
            id: p._id,
            category: p.category,
            communityType: p.communityType, // Updated field
            communityId: p.communityId,     // Updated field
            content: p.content?.substring(0, 50) + '...'
        })));

        // Fetch user details for authors and comment authors
        if (posts.length > 0) {
            const authorIds = new Set<string>();
            posts.forEach(post => {
                authorIds.add(post.authorId);
                // Assuming comments array in post contains comment objects, each with an authorId
                post.comments.forEach((comment: any) => authorIds.add(comment.authorId));
            });

            console.log('👥 Author IDs to fetch:', Array.from(authorIds));
            try {
                const client = await clerkClient(); // Await the clerkClient function
                const users = await client.users.getUserList({ userId: Array.from(authorIds) });
                const userMap = new Map(users.data.map(user => [user.id, user]));

                console.log('👥 Users fetched:', users.data.length);

                posts.forEach(post => {
                    const author = userMap.get(post.authorId);
                    Object.assign(post, {
                        author: {
                            id: author?.id || '',
                            username: author?.username || 'Unknown',
                            firstName: author?.firstName || '',
                            lastName: author?.lastName || '',
                            imageUrl: author?.imageUrl || '',
                        }
                    });

                    post.comments.forEach((comment: any) => {
                        const commentAuthor = userMap.get(comment.authorId);
                        Object.assign(comment, {
                            author: {
                                id: commentAuthor?.id || '',
                                username: commentAuthor?.username || 'Unknown',
                                firstName: commentAuthor?.firstName || '',
                                lastName: commentAuthor?.lastName || '',
                                imageUrl: commentAuthor?.imageUrl || '',
                            }
                        });
                    });
                });
            } catch (clerkError) {
                console.error('⚠️ Error fetching user data from Clerk:', clerkError);
                // Continue without user data rather than failing entirely
                posts.forEach(post => {
                    Object.assign(post, {
                        author: { id: '', username: 'Unknown', firstName: '', lastName: '', imageUrl: '' }
                    });
                    post.comments.forEach((comment: any) => {
                        Object.assign(comment, {
                            author: { id: '', username: 'Unknown', firstName: '', lastName: '', imageUrl: '' }
                        });
                    });
                });
            }
        }

        const response = {
            posts,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
        };

        console.log('✅ Returning response:', {
            postsCount: response.posts.length,
            currentPage: response.currentPage,
            totalPages: response.totalPages,
            totalPosts: response.totalPosts
        });

        return NextResponse.json(response);

    } catch (error) {
        console.error('💥 [POSTS_GET] Error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

/**
 * @summary Creates a new post.
 * @description Handles POST requests to /api/posts to create a new discussion or housing post.
 */
export async function POST(request: Request) {
    console.log('📝 POST /api/posts called');

    try {
        // --- 1. Authentication & Authorization ---
        const { userId: requestingUserId } = getAuth(request as any);
        if (!requestingUserId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

         const client = await clerkClient(); // Await the clerkClient function
        console.log(`👤 Requesting User ID: ${requestingUserId}`);


        // Check if the requesting user is an admin by checking their Clerk metadata
        const clerkUser = await client.users.getUser(requestingUserId);
        const isAdmin = clerkUser.id == 'user_2yiwr2cfjKqOzVZDYtf59CekAcj'; // Replace with your actual admin user ID



        // const clerkUser = await clerkClient.users.getUser(requestingUserId);
        // const isAdmin = clerkUser.publicMetadata?.role === 'admin';
        // console.log(`👤 Requesting User: ${requestingUserId}, isAdmin: ${isAdmin}`);

        // --- 2. Data Preparation ---
        await dbConnect();
        const body = await request.json();
        const {
            // Option A: For all users posting to an EXISTING community
            communityId,
            // Option B: For ADMINS to find/create a NEW community on the fly
            communityName,
            communitySlug,
            communityType,
            // Standard post fields
            content,
            category,
            // Admin-only fields for seeding
            ...adminSeedingFields
        } = body;

        if (!content || !category) {
            return new NextResponse('Missing required fields: content or category', { status: 400 });
        }

        // --- 3. Find or Create Community Logic ---
        let community; // This variable will hold our target community document

        if (communityId) {
            // STANDARD FLOW: For all users (including admins) posting to a known community.
            console.log(`🔍 Finding community by ID: ${communityId}`);
            community = await Community.findById(communityId);

        } else if (isAdmin && communitySlug && communityName && communityType) {
            // ADMIN "FIND OR CREATE" FLOW: Only an admin can trigger this block.
            console.log(`🌱 ADMIN FLOW: Finding or creating community by slug: ${communitySlug}`);
            
            // Try to find the community by its unique slug first
            community = await Community.findOne({ slug: communitySlug });

            if (community) {
                console.log(`✅ Found existing community with slug '${communitySlug}'.`);
            } else {
                // If it doesn't exist, create it.
                console.log(`✨ Community with slug '${communitySlug}' not found. Creating it...`);
                community = await Community.create({
                    name: communityName,
                    slug: communitySlug,
                    type: communityType,
                    // You can add other default fields for new communities here
                });
                console.log(`✅ New community created with ID: ${community._id}`);
            }
        }
        
        // --- 4. Final Validation ---
        // If after all the logic, we still don't have a community, it's an error.
        if (!community) {
            console.error(`❌ A valid community could not be found or created.`);
            return new NextResponse('A valid communityId (or for admins, full community details) is required.', { status: 400 });
        }


        // --- 5. Determine Author (same as before) ---
        let postAuthorClerkId = requestingUserId;
        const isSeededPost = isAdmin && adminSeedingFields.userFullName && adminSeedingFields.userId;

        if (isSeededPost) {
            console.log('🌱 Admin is seeding a post for an external user...');
            // Your logic for finding or creating a placeholder user goes here.
            // For now, we'll assume it resolves to a specific ID.
            // postAuthorClerkId = resolvedPlaceholderId; 
        }

        // --- 6. Construct & Create the Post ---
        const postData = {
            authorId: postAuthorClerkId,
            content,
            category,
            communityId: community._id,
            communityType: community.type,
            communityName: community.name,
            communitySlug: community.slug,
            ...(isSeededPost && {
                originalAuthorFullName: adminSeedingFields.userFullName,
                originalAuthorAvatarUrl: adminSeedingFields.userAvatarUrl,
                originalAuthorExternalId: adminSeedingFields.userId,
                isClaimable: adminSeedingFields.isClaimable ?? false,
                originalUserCountry: adminSeedingFields.originalUserCountry,
            }),
        };

        const newPost = await Post.create(postData);

        // --- 7. Update Community Counter ---
        await Community.updateOne({ _id: community._id }, { $inc: { postCount: 1 } });
        console.log(`📈 Incremented post count for community: ${community.name}`);

        return NextResponse.json(newPost, { status: 201 });

    } catch (error: any) {
        console.error('💥 [POSTS_POST] Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { postId: string } }
) {
    console.log(`🗑️ DELETE /api/posts/${params.postId} called`);

    try {
        const { userId } = getAuth(request as any); // Get the ID of the user making the request
        const postId = params.postId;

        if (!userId) {
            console.log('❌ Unauthorized - no user ID for delete request');
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!postId) {
            console.log('❌ Bad Request - Post ID is missing');
            return new NextResponse('Post ID is required', { status: 400 });
        }

        await dbConnect();
        console.log('✅ Database connected');

        // Find the post to verify ownership or admin status
        const post = await Post.findById(postId);

        if (!post) {
            console.log(`❌ Not Found - Post with ID ${postId} not found`);
            return new NextResponse('Post not found', { status: 404 });
        }

        // --- Authorization Check ---
        // Allow deletion if:
        // 1. The requesting user is the post author.
        // 2. The requesting user is a special admin user (user_2yiwr2cfjKqOzVZDYtf59CekAcj).
        //    (For production, a more robust role-based access control (RBAC) check is recommended,
        //     e.g., checking user.publicMetadata.role === 'admin' via Clerk API)
        const ADMIN_USER_ID = 'user_2yiwr2cfjKqOzVZDYtf59CekAcj'; 

        if (post.authorId !== userId && userId !== ADMIN_USER_ID) {
            console.log(`❌ Forbidden - User ${userId} is not the author (${post.authorId}) and not admin.`);
            return new NextResponse('Forbidden: You do not have permission to delete this post', { status: 403 });
        }

        // Delete associated comments first (optional, but good for data integrity)
        await Comment.deleteMany({ postId: postId });
        console.log(`🗑️ Deleted comments for post ${postId}`);

        // Delete the post
        await Post.deleteOne({ _id: postId });
        console.log(`🗑️ Successfully deleted post ${postId}`);

        return new NextResponse('Post deleted successfully', { status: 200 });

    } catch (error) {
        console.error('💥 [POST_DELETE] Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}