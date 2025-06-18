import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import  Post  from '@/lib/models/Post';
import  Comment  from '@/lib/models/Comment';
import { getAuth } from '@clerk/nextjs/server';
import mongoose from 'mongoose';

interface IParams {
  postId?: string;
}

/**
 * @swagger
 * /api/posts/{postId}:
 * get:
 * summary: Retrieves a single post.
 * tags: [Posts]
 * parameters:
 * - in: path
 * name: postId
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: The requested post.
 * 404:
 * description: Post not found.
 * 500:
 * description: Internal Server Error.
 * patch:
 * summary: Updates a post.
 * tags: [Posts]
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
 * 200:
 * description: Post updated successfully.
 * 401:
 * description: Unauthorized.
 * 403:
 * description: Forbidden.
 * 404:
 * description: Post not found.
 * delete:
 * summary: Deletes a post.
 * tags: [Posts]
 * parameters:
 * - in: path
 * name: postId
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Post deleted successfully.
 * 401:
 * description: Unauthorized.
 * 403:
 * description: Forbidden.
 * 404:
 * description: Post not found.
 */
export async function GET(request: Request, { params }: { params: IParams }) {
    try {
        if (!params.postId) {
            return new NextResponse('Post ID required', { status: 400 });
        }
        await dbConnect();
        const post = await Post.findById(params.postId).lean();
        if (!post) {
            return new NextResponse('Post not found', { status: 404 });
        }
        return NextResponse.json(post);
    } catch (error) {
        console.error('[POST_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}


export async function PATCH(request: Request, { params }: { params: IParams }) {
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

    const postToUpdate = await Post.findById(params.postId);

    if (!postToUpdate) {
      return new NextResponse('Post not found', { status: 404 });
    }

    if (postToUpdate.authorId !== userId) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    postToUpdate.content = content;
    await postToUpdate.save();

    return NextResponse.json(postToUpdate);
  } catch (error) {
    console.error('[POST_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: IParams }) {
  try {
    const { userId } = getAuth(request as any);
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!params.postId) {
      return new NextResponse('Post ID required', { status: 400 });
    }

    await dbConnect();
    
    // Use a transaction to ensure both operations succeed or fail together
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const postToDelete = await Post.findById(params.postId).session(session);

        if (!postToDelete) {
          await session.abortTransaction();
          session.endSession();
          return new NextResponse('Post not found', { status: 404 });
        }

        if (postToDelete.authorId !== userId) {
          await session.abortTransaction();
          session.endSession();
          return new NextResponse('Forbidden', { status: 403 });
        }

        // Delete all associated comments
        await Comment.deleteMany({ postId: params.postId }).session(session);

        // Delete the post
        await Post.findByIdAndDelete(params.postId).session(session);

        await session.commitTransaction();
        session.endSession();

        return new NextResponse('Post deleted successfully', { status: 200 });
    } catch(err) {
        await session.abortTransaction();
        session.endSession();
        throw err; // Rethrow to be caught by outer catch block
    }
  } catch (error) {
    console.error('[POST_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
