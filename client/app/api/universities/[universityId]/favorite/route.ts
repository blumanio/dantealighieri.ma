// client/app/api/universities/[universityId]/favorite/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UniversityFavorite from '@/lib/models/UniversityFavorite';
import University from '@/lib/models/University';
import { getAuth } from '@clerk/nextjs/server';
import mongoose from 'mongoose';

// POST to add a new favorite
export async function POST(
  req: NextRequest,
  context: { params: { universityId: string } } // Changed this line
) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const { universityId } = context.params; // Changed this line
    if (!universityId || !mongoose.Types.ObjectId.isValid(universityId)) {
      return NextResponse.json({ success: false, message: 'Invalid University ID format.' }, { status: 400 });
    }

    await dbConnect();

    const universityDoc = await University.findById(universityId);
    if (!universityDoc) {
        return NextResponse.json({ success: false, message: 'University not found.' }, { status: 404 });
    }

    const existingFavorite = await UniversityFavorite.findOne({ userId, universityId });

    if (existingFavorite) {
      return NextResponse.json(
        { 
          success: true,
          message: 'This university is already in your favorites.', 
          data: existingFavorite, 
          alreadyExists: true,
          favoriteCount: universityDoc.favoriteCount
        },
        { status: 200 }
      );
    }

    const newFavorite = await UniversityFavorite.create({ userId, universityId });
    const updatedUniversity = await University.findByIdAndUpdate(
        universityId,
        { $inc: { favoriteCount: 1 } },
        { new: true, select: 'favoriteCount name' }
    );

    if (!updatedUniversity) {
        console.error(`Error: University ${universityId} found but failed to update for favorite count increment.`);
        await UniversityFavorite.findByIdAndDelete(newFavorite._id); 
        return NextResponse.json({ success: false, message: 'Failed to update university favorite count after creating favorite link.' }, { status: 500 });
    }
    
    console.log(`Favorite count updated for ${updatedUniversity.name} to ${updatedUniversity.favoriteCount} (added via API)`);

    return NextResponse.json(
      { 
        success: true, 
        message: 'University added to favorites successfully!', 
        data: newFavorite, 
        alreadyExists: false,
        favoriteCount: updatedUniversity.favoriteCount 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(`API Error: /api/universities/${context.params.universityId}/favorite POST:`, error); // Use context.params here too for logging
    if (error.code === 11000) {
         return NextResponse.json({ success: false, message: 'Favorite already exists (concurrent request).', error: 'Duplicate entry' }, { status: 409 });
    }
    return NextResponse.json(
      { success: false, message: 'Failed to add university to favorites.', error: error?.message },
      { status: 500 }
    );
  }
}

// DELETE a favorite
export async function DELETE(
  req: NextRequest,
  context: { params: { universityId: string } } // Changed this line
) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const { universityId } = context.params; // Changed this line
     if (!universityId || !mongoose.Types.ObjectId.isValid(universityId)) {
      return NextResponse.json({ success: false, message: 'Invalid University ID format.' }, { status: 400 });
    }

    await dbConnect();

    const deletedFavorite = await UniversityFavorite.findOneAndDelete({ userId, universityId });

    if (!deletedFavorite) {
      const currentUniversity = await University.findById(universityId).select('favoriteCount name').lean();
      const favoriteCount = (currentUniversity && typeof currentUniversity === 'object' && 'favoriteCount' in currentUniversity)
        ? (currentUniversity as { favoriteCount?: number }).favoriteCount
        : undefined;
      return NextResponse.json(
        { 
          success: false, 
          message: 'Favorite not found or user not authorized to delete this specific favorite link.',
          favoriteCount 
        },
        { status: 404 }
      );
    }

    const updatedUniversity = await University.findByIdAndUpdate(
        universityId,
        { $inc: { favoriteCount: -1 } },
        { new: true, select: 'favoriteCount name' }
    );

    if (!updatedUniversity) {
        console.error(`Error: University ${universityId} not found for favorite count decrement, but favorite link was deleted.`);
        return NextResponse.json({ success: false, message: 'Favorite link deleted, but failed to update university favorite count.' }, { status: 500 });
    }
    
    console.log(`Favorite count updated for ${updatedUniversity.name} to ${updatedUniversity.favoriteCount} (removed via API)`);

    return NextResponse.json(
      { 
        success: true, 
        message: 'University removed from favorites successfully.', 
        data: { id: deletedFavorite._id }, 
        favoriteCount: updatedUniversity.favoriteCount
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`API Error: /api/universities/${context.params.universityId}/favorite DELETE:`, error); // Use context.params here too for logging
    return NextResponse.json(
      { success: false, message: 'Failed to remove university from favorites.', error: error?.message },
      { status: 500 }
    );
  }
}