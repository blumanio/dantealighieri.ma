import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import University from '@/lib/models/University';
import mongoose from 'mongoose';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ universityId: string }> }
) {
  // Await the params before accessing properties
  const { universityId } = await params;

  if (!universityId || !mongoose.Types.ObjectId.isValid(universityId)) {
    return NextResponse.json({ success: false, message: 'Invalid University ID format.' }, { status: 400 });
  }

  try {
    await dbConnect();
    const updatedUniversity = await University.findByIdAndUpdate(
      universityId,
      { $inc: { viewCount: 1 } },
      { new: true, select: 'viewCount name' }
    );

    if (!updatedUniversity) {
      return NextResponse.json({ success: false, message: 'University not found.' }, { status: 404 });
    }

    console.log(`View count updated for ${updatedUniversity.name} to ${updatedUniversity.viewCount} (via API: /api/universities/${universityId}/view)`);

    return NextResponse.json({
      success: true,
      message: 'View count updated successfully.',
      data: { viewCount: updatedUniversity.viewCount }
    }, { status: 200 });

  } catch (error: any) {
    console.error(`API Error: /api/universities/${universityId}/view POST:`, error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update view count.',
      error: error?.message
    }, { status: 500 });
  }
}