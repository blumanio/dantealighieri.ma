import { NextRequest, NextResponse } from 'next/server';
import Favorite from '@/lib/models/Favorite'; // Adjust path if your model is elsewhere
import dbConnect from '@/lib/dbConnect';   // Adjust path if your dbConnect is elsewhere
import { getAuth } from '@clerk/nextjs/server';

// GET user's favorites
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
    const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 }); // Sort by newest

    return NextResponse.json(
      {
        success: true,
        message: 'Favorites fetched successfully.',
        data: favorites,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('API route /api/favorites GET error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch favorites.',
        error: error?.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// POST to add a new favorite (existing logic, ensure it returns the new favorite item)
export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await req.json();
    const { course } = body;

    if (!course || !course.uni || !course.nome || !course.link || !course.comune) {
        return NextResponse.json(
            { success: false, message: 'Missing course details in request body.' },
            { status: 400 }
        );
    }

    const existingFavorite = await Favorite.findOne({
      userId,
      courseLink: course.link
    });

    if (existingFavorite) {
      return NextResponse.json(
        {
          success: true, // Indicate success, but it's already there
          message: 'This course is already in your favorites.',
          data: existingFavorite, // Return existing one so client can get its _id if needed
          alreadyExists: true,
        },
        { status: 200 } // 200 OK, not 201 Created
      );
    }

    const favoriteData = {
      userId,
      courseUni: course.uni,
      courseNome: course.nome,
      courseLink: course.link,
      courseComune: course.comune,
    };

    const newFavorite = await Favorite.create(favoriteData);

    return NextResponse.json(
      {
        success: true,
        message: 'Course added to favorites successfully! 🎉',
        data: newFavorite,
        alreadyExists: false,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('API route /api/favorites POST error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to add course to favorites. Please try again.',
        error: error?.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// DELETE a favorite
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const favoriteId = searchParams.get('id'); // Expecting favorite's MongoDB _id

    if (!favoriteId) {
      return NextResponse.json(
        { success: false, message: 'Favorite ID is required.' },
        { status: 400 }
      );
    }

    await dbConnect();
    const deletedFavorite = await Favorite.findOneAndDelete({ _id: favoriteId, userId });

    if (!deletedFavorite) {
      return NextResponse.json(
        { success: false, message: 'Favorite not found or user not authorized to delete.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Course removed from favorites successfully.',
        data: { id: deletedFavorite._id }, // Send back the ID of the deleted item
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('API route /api/favorites DELETE error:', error);
    if (error.kind === 'ObjectId') { // Mongoose specific error for invalid ID format
        return NextResponse.json(
          { success: false, message: 'Invalid Favorite ID format.'},
          { status: 400 }
        );
    }
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to remove course from favorites.',
        error: error?.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}