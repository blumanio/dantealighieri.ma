import { NextRequest, NextResponse } from 'next/server';
import Favorite from '@/lib/models/Favorite';
import Course  from '@/lib/models/Course'; // Import Course model
import dbConnect from '@/lib/dbConnect';
import { getAuth } from '@clerk/nextjs/server';
import mongoose from 'mongoose'; // Import mongoose for ObjectId validation

// GET user's favorites (remains largely the same)
export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }
    await dbConnect();
    const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 }).populate('courseId'); // Optionally populate course details
    return NextResponse.json(
      { success: true, message: 'Favorites fetched successfully.', data: favorites },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('API route /api/favorites GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch favorites.', error: error?.message },
      { status: 500 }
    );
  }
}

// POST to add a new favorite
export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    // Expect courseId and other course details (uni, nome, link, comune)
    const { courseId, uni, nome, link, comune } = body.course; // Assuming course object is nested in body

    if (!courseId || !uni || !nome || !link || !comune) {
        return NextResponse.json({ success: false, message: 'Missing course details (courseId, uni, nome, link, comune) in request body.' }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return NextResponse.json({ success: false, message: 'Invalid courseId format.' }, { status: 400 });
    }

    const existingFavorite = await Favorite.findOne({ userId, courseId });

    if (existingFavorite) {
      return NextResponse.json(
        { success: true, message: 'This course is already in your favorites.', data: existingFavorite, alreadyExists: true },
        { status: 200 }
      );
    }

    const favoriteData = { userId, courseId, courseUni: uni, courseNome: nome, courseLink: link, courseComune: comune };
    const newFavorite = await Favorite.create(favoriteData);

    // Increment favoriteCount on the Course model
    await Course.findByIdAndUpdate(courseId, { $inc: { favoriteCount: 1 } });

    return NextResponse.json(
      { success: true, message: 'Course added to favorites successfully! 🎉', data: newFavorite, alreadyExists: false },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('API route /api/favorites POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add course to favorites. Please try again.', error: error?.message },
      { status: 500 }
    );
  }
}

// DELETE a favorite
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const favoriteId = searchParams.get('id'); // Expecting favorite's MongoDB _id

    if (!favoriteId || !mongoose.Types.ObjectId.isValid(favoriteId)) {
      return NextResponse.json({ success: false, message: 'Favorite ID is required and must be valid.' }, { status: 400 });
    }

    await dbConnect();
    const deletedFavorite = await Favorite.findOneAndDelete({ _id: favoriteId, userId });

    if (!deletedFavorite) {
      return NextResponse.json(
        { success: false, message: 'Favorite not found or user not authorized to delete.' },
        { status: 404 }
      );
    }

    // Decrement favoriteCount on the Course model
    // Ensure courseId was stored on the favorite or fetch it if needed
    if (deletedFavorite.courseId) {
      await Course.findByIdAndUpdate(deletedFavorite.courseId, { $inc: { favoriteCount: -1 } });
    } else {
        // Fallback if courseId is not on favorite (less ideal)
        // This might happen if you didn't update the Favorite model to include courseId
        // For robustness, you might need to find the course by other means (e.g., courseLink)
        console.warn(`courseId not found on deleted favorite ${favoriteId}, attempting to update Course by link.`);
        await Course.findOneAndUpdate({ link: deletedFavorite.courseLink }, { $inc: { favoriteCount: -1 } });
    }


    return NextResponse.json(
      { success: true, message: 'Course removed from favorites successfully.', data: { id: deletedFavorite._id } },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('API route /api/favorites DELETE error:', error);
    if (error.kind === 'ObjectId') {
        return NextResponse.json({ success: false, message: 'Invalid Favorite ID format.'}, { status: 400 });
    }
    return NextResponse.json(
      { success: false, message: 'Failed to remove course from favorites.', error: error?.message },
      { status: 500 }
    );
  }
}