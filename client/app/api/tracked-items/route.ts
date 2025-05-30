// client/app/api/tracked-items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect'; // Adjust path as necessary
import TrackedItem from '@/lib/models/TrackedItem'; // Adjust path as necessary
import Course from '@/lib/models/Course'; // Adjust path as necessary
import mongoose from 'mongoose';
import { PopulatedCourse, getUniversityDeadlinesForCourse } from '@/app/utils/deadlineUtils'; // Import from shared utils
import { Course as CourseType } from '@/types/types';

// --- GET Handler ---
export async function GET(req: NextRequest) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }
        await dbConnect();

        interface TrackedItemLean {
            _id: any;
            userId: string;
            courseId: PopulatedCourse | null;
            isArchived: boolean;
            [key: string]: any;
        }

        const trackedItemsFromDB = await TrackedItem.find({ userId, isArchived: false })
            .populate<{ courseId: PopulatedCourse }>({
                path: 'courseId',
                model: Course,
                select: 'nome uni tipo academicYear intake link comune area lingua _id trackedCount'
            })
            .lean<TrackedItemLean[]>(); // Explicitly type as array of TrackedItemLean

        const enrichedTrackedItems = trackedItemsFromDB.map(item => {
            // item.courseId will be null if the course was deleted after being tracked.
            const courseDetails = item.courseId; // Now TypeScript knows courseId exists
            const deadlines = getUniversityDeadlinesForCourse(courseDetails);

            return {
                ...item,
                courseDetails: courseDetails || {},
                universityDeadlines: deadlines
            };
        });
        return NextResponse.json({ success: true, data: enrichedTrackedItems }, { status: 200 });

    } catch (error: any) {
        console.error('[API/TRACKED-ITEMS] GET Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch tracked items.', error: error.message }, { status: 500 });
    }
}

// --- POST Handler ---
export async function POST(req: NextRequest) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }
        const body = await req.json();
        const { courseId, courseLink } = body;

        if (!courseId) {
            return NextResponse.json({ success: false, message: 'Course ID is required.' }, { status: 400 });
        }
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return NextResponse.json({ success: false, message: 'Invalid Course ID format.' }, { status: 400 });
        }
        // Optionally validate courseLink if it's essential
        if (!courseLink || typeof courseLink !== 'string') { // Added basic validation for courseLink
            // Based on TrackedItem schema, courseLink is required.
            return NextResponse.json({ success: false, message: 'Course link is required and must be a string.' }, { status: 400 });
        }

        await dbConnect();

        const existingItem = await TrackedItem.findOne({ userId, courseId })
            .populate<{ courseId: PopulatedCourse }>({
                path: 'courseId',
                model: Course,
                select: 'nome uni comune academicYear _id trackedCount' // trackedCount included
            })


        if (existingItem) {
            const courseDetails = existingItem.courseId as PopulatedCourse | null;
            const itemToSend = {
                ...existingItem,
                courseDetails: courseDetails || {},
                universityDeadlines: getUniversityDeadlinesForCourse(courseDetails)
            };
            return NextResponse.json({ success: true, message: 'Item already tracked.', data: itemToSend, alreadyExists: true }, { status: 200 });
        }

        const newTrackedItem = new TrackedItem({ userId, courseId, courseLink, userApplicationStatus: 'Researching' });
        await newTrackedItem.save();

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $inc: { trackedCount: 1 } },
            { new: true, runValidators: true, lean: true } // Added lean for consistency if only data is needed
        );

        if (!updatedCourse) {
            console.error(`[API/TRACKED-ITEMS] POST: Course with ID ${courseId} not found. Failed to increment trackedCount. Rolling back TrackedItem creation (ID: ${newTrackedItem._id}).`);
            await TrackedItem.findByIdAndDelete(newTrackedItem._id);
            return NextResponse.json({ success: false, message: `Course with ID ${courseId} not found. Tracked item not saved.` }, { status: 404 });
        }
        console.log(`[API/TRACKED-ITEMS] POST: Incremented trackedCount for Course ID: ${courseId}. New count: ${(updatedCourse as { trackedCount?: number }).trackedCount}`);

        const populatedNewItem = await TrackedItem.findById(newTrackedItem._id)
            .populate<{ courseId: PopulatedCourse }>({
                path: 'courseId', model: Course,
                select: 'nome uni tipo academicYear intake link comune area lingua _id trackedCount' // trackedCount included
            });

        if (!populatedNewItem) {
            console.error(`[API/TRACKED-ITEMS] POST: Failed to retrieve populated tracked item (ID: ${newTrackedItem._id}) after creation. Course trackedCount was incremented for Course ID: ${courseId}. This might indicate a data inconsistency.`);
            // Consider if trackedCount should be decremented here if populating fails.
            // For now, returning error as per original logic.
            return NextResponse.json({ success: false, message: 'Failed to retrieve full tracked item details after creation.' }, { status: 500 });
        }

        const courseDetailsForNew = populatedNewItem.courseId as PopulatedCourse | null;
        const itemToSend = {
            ...populatedNewItem,
            courseDetails: courseDetailsForNew || {},
            universityDeadlines: getUniversityDeadlinesForCourse(courseDetailsForNew)
        };
        return NextResponse.json({ success: true, message: 'Item added to tracker.', data: itemToSend, alreadyExists: false }, { status: 201 });

    } catch (error: any) {
        console.error('[API/TRACKED-ITEMS] POST Error:', error);
        if (error.name === 'ValidationError') {
            return NextResponse.json({ success: false, message: 'Validation Error: ' + error.message, errors: error.errors }, { status: 400 });
        }
        if (error.code === 11000) { // Duplicate key error (e.g. from unique index on userId+courseId)
            // This path should ideally be caught by "existingItem" check above, but this is a DB-level safeguard.
            return NextResponse.json({ success: false, message: 'Item already in tracker.', error: 'Duplicate entry' }, { status: 409 });
        }
        return NextResponse.json({ success: false, message: 'Failed to add item to tracker. ' + error.message }, { status: 500 });
    }
}

// --- DELETE Handler (for /api/tracked-items?id=...) ---
// This endpoint is called by ProgramRow.tsx
export async function DELETE(req: NextRequest) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const trackedItemId = searchParams.get('id');

        if (!trackedItemId) {
            return NextResponse.json({ success: false, message: 'Tracked Item ID is required as a query parameter.' }, { status: 400 });
        }
        if (!mongoose.Types.ObjectId.isValid(trackedItemId)) {
            return NextResponse.json({ success: false, message: 'Invalid Tracked Item ID format.' }, { status: 400 });
        }

        await dbConnect();
        // Find the item first to get courseId for decrementing trackedCount
        const itemToDelete = await TrackedItem.findOne({ _id: trackedItemId, userId }).lean() as { _id: any; courseId?: any };

        if (!itemToDelete) {
            return NextResponse.json({ success: false, message: 'Tracked item not found or user not authorized.' }, { status: 404 });
        }

        // Now delete the item
        await TrackedItem.findByIdAndDelete(itemToDelete._id);

        // Decrement trackedCount on the Course model
        if (itemToDelete.courseId) {
            const updatedCourse = await Course.findByIdAndUpdate(
                itemToDelete.courseId,
                { $inc: { trackedCount: -1 } },
                { new: true, runValidators: true, lean: true }
            );

            if (!updatedCourse) {
                console.warn(`[API/TRACKED-ITEMS] DELETE: Course ID ${itemToDelete.courseId} (from deleted TrackedItem ${itemToDelete._id}) was not found in Courses collection during trackedCount decrement. Count on this course might be inaccurate.`);
            } else {
                console.log(`[API/TRACKED-ITEMS] DELETE: Decremented trackedCount for Course ID: ${itemToDelete.courseId}. New count: ${(updatedCourse as { trackedCount?: number }).trackedCount}`);
            }
        } else {
            console.warn(`[API/TRACKED-ITEMS] DELETE: Tracked item ${itemToDelete._id} did not have a courseId. trackedCount not decremented.`);
        }

        return NextResponse.json({ success: true, message: 'Course removed from tracked list.', data: { id: itemToDelete._id } }, { status: 200 });

    } catch (error: any) {
        console.error('[API/TRACKED-ITEMS] DELETE Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to untrack course. ' + error.message }, { status: 500 });
    }
}