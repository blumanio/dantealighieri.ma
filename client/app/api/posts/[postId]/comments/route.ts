import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Comment from '@/lib/models/Comment';
import Post from '@/lib/models/Post';
import { clerkClient, getAuth } from '@clerk/nextjs/server';
import mongoose from 'mongoose';

interface IParams {
    postId?: string;
}

/**
 * @swagger
 * /api/posts/{postId}/comments:
 * get:
 * summary: Retrieves all comments for a post.
 * tags: [Comments]
 * parameters:
 * - in: path
 * name: postId
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: A list of comments.
 * post:
 * summary: Creates a new comment on a post.
 * tags: [Comments]
 * parameters:
 * - in: path
 * name: postId
 * required: true
 * schema:
 * type: string
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * content:
 * type: string
 * responses:
 * 201:
 * description: Comment created successfully.
 */


export async function GET(request: Request, { params }: { params: IParams }) {
    try {
        const { postId } = params;

        if (!postId) {
            return new NextResponse('Post ID required', { status: 400 });
        }

        await dbConnect();

        const comments = await Comment.find({ postId })
            .sort({ createdAt: 'asc' })
            .lean();

        if (comments.length > 0) {
            const authorIds = [...new Set(comments.map(comment => comment.authorId))];
            console.log('[COMMENTS_GET] authorIds:', authorIds);

            const client = await clerkClient();
            const usersResponse = await client.users.getUserList({ userId: authorIds });
            const users = usersResponse.data;

            const userMap = new Map(users.map(user => [user.id, user]));

            comments.forEach(comment => {
                const user = userMap.get(comment.authorId);
                comment.authorUsername = user?.username || '';
                comment.authorImageUrl = user?.imageUrl || '';
                comment.authorFirstName = user?.firstName?.trim() || '';
                comment.authorLastName = user?.lastName?.trim() || '';
            });
        }

        console.log('[COMMENTS_GET]', comments.length, 'comments found for post:', postId);
        return NextResponse.json(comments);

    } catch (error) {
        console.error('[COMMENTS_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}


export async function POST(request: Request, { params }: { params: IParams }) {
    try {
        const { userId } = getAuth(request as any);
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!params.postId) {
            return new NextResponse('Post ID required', { status: 400 });
        }

        const { content } = await request.json();
        if (!content) {
            return new NextResponse('Content is required', { status: 400 });
        }

        await dbConnect();

        // Check if the post exists before commenting
        const parentPost = await Post.findById(params.postId);
        if (!parentPost) {
            return new NextResponse("Post not found", { status: 404 });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const newComment = new Comment({
                authorId: userId,
                postId: params.postId,
                content,
            });

            await newComment.save({ session });
            await Post.findByIdAndUpdate(params.postId, { $inc: { commentsCount: 1 } }, { session });

            await session.commitTransaction();
            session.endSession();

            return NextResponse.json(newComment, { status: 201 });
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            throw err;
        }
    } catch (error) {
        console.error('[COMMENTS_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
