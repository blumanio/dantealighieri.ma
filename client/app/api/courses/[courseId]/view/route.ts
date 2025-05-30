// File: client/app/api/courses/[courseId]/view/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Course from '@/lib/models/Course'; // Ensure this path is correct

interface Params {
  courseId: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { courseId } = params;
  const requestUrl = request.url;
  console.log(`[API/COURSES/VIEW] POST request received for ${requestUrl}, Course ID: ${courseId}`);

  if (!courseId) {
    console.error("[API/COURSES/VIEW] Course ID is missing in request params.");
    return NextResponse.json(
      { message: "Course ID is required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    console.log("[API/COURSES/VIEW] Database connected.");

    // Find the course by ID and increment its viewCount
    // Using findOneAndUpdate to ensure atomicity if possible, or a find and save.
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $inc: { viewCount: 1 } }, // Atomically increment viewCount by 1
      { new: true, runValidators: true } // Return the updated document and run schema validators
    ).lean() as { _id: string; nome: string; viewCount: number } | null; // Type assertion for expected shape

    if (!updatedCourse) {
      console.warn(`[API/COURSES/VIEW] Course not found with ID: ${courseId}`);
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    console.log(`[API/COURSES/VIEW] Successfully incremented view count for course ID: ${courseId}. New view count: ${updatedCourse.viewCount}`);
    return NextResponse.json(
      {
        message: "View count updated successfully",
        course: {
          _id: updatedCourse._id,
          nome: updatedCourse.nome,
          viewCount: updatedCourse.viewCount
        }
      },
      { status: 200 }
    );

  } catch (err: any) {
    console.error(`[API/COURSES/VIEW] Error updating view count for course ID ${courseId}:`, err);

    if (err.name === 'CastError' && err.path === '_id') {
      return NextResponse.json(
        { message: "Invalid Course ID format", error: err.message },
        { status: 400 } // Bad Request for invalid ID format
      );
    }

    return NextResponse.json(
      { message: "Failed to update view count", error: err.message },
      { status: 500 }
    );
  }
}
