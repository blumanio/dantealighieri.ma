import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UniversityFavorite from '@/lib/models/UniversityFavorite';
import { getAuth } from '@clerk/nextjs/server'; // To verify the requesting user

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const authData = getAuth(req);
    const sessionUserId = authData.userId; // The user making the request
    const targetUserId = (await params).userId; // The user whose favorites are being requested

    if (!sessionUserId) {
      return NextResponse.json({ success: false, message: 'Unauthorized: You must be signed in.' }, { status: 401 });
    }

    // Security check: Ensure the requesting user is asking for their own favorites,
    // or implement admin role check if admins can view others' favorites.
    if (sessionUserId !== targetUserId /* && !authData.has({role: "admin"}) */) {
       return NextResponse.json({ success: false, message: 'Forbidden: You can only view your own favorites.' }, { status: 403 });
    }

    await dbConnect();

    const favorites = await UniversityFavorite.find({ userId: targetUserId })
      .populate({
        path: 'universityId', // Field in UniversityFavorite model
        model: 'University',    // Name of the University model
        select: '_id name slug location logoUrl' // Fields to populate from University model
      })
      .lean()
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, message: 'University favorites fetched successfully.', data: favorites },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`API route /api/users/${params.userId}/university-favorites GET error:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch university favorites.', error: error?.message },
      { status: 500 }
    );
  }
}