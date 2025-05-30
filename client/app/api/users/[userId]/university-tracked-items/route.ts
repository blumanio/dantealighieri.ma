import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UniversityTrackedItem from '@/lib/models/UniversityTrackedItem';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const authData = getAuth(req);
    const sessionUserId = authData.userId;
    const targetUserId = (await params).userId;

    if (!sessionUserId) {
      return NextResponse.json({ success: false, message: 'Unauthorized: You must be signed in.' }, { status: 401 });
    }

    if (sessionUserId !== targetUserId /* && !authData.has({role: "admin"}) */) {
       return NextResponse.json({ success: false, message: 'Forbidden: You can only view your own tracked items.' }, { status: 403 });
    }

    await dbConnect();

    const trackedItems = await UniversityTrackedItem.find({ userId: targetUserId })
      .populate({
        path: 'universityId',
        model: 'University',
        select: '_id name slug location logoUrl' // Customize as needed
      })
      .lean()
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, message: 'University tracked items fetched successfully.', data: trackedItems },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`API route /api/users/${params.userId}/university-tracked-items GET error:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch university tracked items.', error: error?.message },
      { status: 500 }
    );
  }
}