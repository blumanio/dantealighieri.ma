// migration-script.ts
import mongoose, { Schema, ClientSession } from 'mongoose';
import 'dotenv/config';

// --- Import Your Models (without .js extension) ---
import UniversityCommunityPost from './lib/models/UniversityCommunityPost';
import Post from './lib/models/Post';
import Comment from './lib/models/Comment';
import University from './lib/models/University';

// Define the shape of the old comment model, pointing to the correct collection name
const OldCommentSchema = new Schema({}, { strict: false, collection: 'universitycommunitycomments' });
const UniversityCommunityComment = mongoose.models.UniversityCommunityComment || mongoose.model('UniversityCommunityComment', OldCommentSchema);


// --- Database Connection ---
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  return mongoose.connect(MONGODB_URI);
};


// --- The Migration Logic ---
async function runMigration() {
  let session: ClientSession | undefined;
  try {
    // 1. Connect to the database
    await dbConnect();
    console.log('Database connection established.');

    // 2. Start a session and transaction
    session = await mongoose.startSession();
    console.log('Database session started.');
    session.startTransaction();
    console.log('Transaction started.');

    // 3. Fetch old data
    const oldPosts = await UniversityCommunityPost.find({}).lean();
    console.log(`Found ${oldPosts.length} posts to migrate.`);

    let postsMigrated = 0;
    let commentsMigrated = 0;

    for (const oldPost of oldPosts) {
      const university = await University.findOne({ slug: oldPost.universitySlug }).lean();

      const [newPost] = await Post.create([{
        authorId: oldPost.authorId,
        content: oldPost.content,
        parentType: 'University',
        parentId: oldPost.universitySlug,
        parentName: university ? (university.name as any).en : oldPost.universitySlug,
        parentSlug: oldPost.universitySlug,
        commentsCount: 0,
        createdAt: oldPost.createdAt,
        updatedAt: oldPost.updatedAt,
      }], { session });

      const oldComments = await UniversityCommunityComment.find({ postId: oldPost._id }).lean();

      if (oldComments.length > 0) {
        const newCommentsData = oldComments.map((comment: any) => ({
          authorId: comment.authorId,
          content: comment.content,
          postId: newPost._id,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        }));

        await Comment.insertMany(newCommentsData, { session });
        await Post.findByIdAndUpdate(newPost._id, { commentsCount: oldComments.length }, { session });
        commentsMigrated += oldComments.length;
      }
      postsMigrated++;
    }

    // 4. If everything succeeded, commit the transaction
    await session.commitTransaction();
    console.log('--- Migration Successful! ---');
    console.log(`Migrated ${postsMigrated} posts.`);
    console.log(`Migrated ${commentsMigrated} comments.`);

  } catch (error) {
    // 5. If any error occurs, log it and abort the transaction
    console.error('--- MIGRATION FAILED ---');
    console.error('An error occurred:', error);
    if (session && session.inTransaction()) {
      console.log('Aborting transaction...');
      await session.abortTransaction();
      console.log('Transaction aborted.');
    }
  } finally {
    // 6. Always clean up the session and connection
    if (session) {
      session.endSession();
      console.log('Session ended.');
    }
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

runMigration();