// client/app/api/tracked-items/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect'; // Adjust path as necessary
import TrackedItem from '@/lib/models/TrackedItem'; // Adjust path as necessary
import Course from '@/lib/models/Course'; // Adjust path as necessary
import mongoose from 'mongoose';
import { PopulatedCourse, getUniversityDeadlinesForCourse } from '@/app/utils/deadlineUtils'; // Import from shared utils

// --- DELETE Handler (for /api/tracked-items/[id]) ---
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // Accessing params.id: The way params are destructured and accessed here
        // (const trackedItemId = params.id;) is the standard Next.js Route Handler pattern.
        // If you encounter errors like "params should be awaited",
        // check your Next.js version (ensure it's 13.4+ or 14+) and clear any build caches.
        // The pattern itself is correct as per official documentation.
        const trackedItemId = params.id;
        if (!mongoose.Types.ObjectId.isValid(trackedItemId)) {
            return NextResponse.json({ success: false, message: 'Invalid Tracked Item ID format' }, { status: 400 });
        }

        await dbConnect();
        const itemToDelete = await TrackedItem.findOne({ _id: trackedItemId, userId }).lean() as { _id: any; userId: string; courseId?: string;[key: string]: any } | null;

        if (!itemToDelete) {
            return NextResponse.json({ success: false, message: 'Tracked item not found or user not authorized.' }, { status: 404 });
        }

        await TrackedItem.findByIdAndDelete(itemToDelete._id);

        if (itemToDelete.courseId) {
            const updatedCourse = await Course.findByIdAndUpdate(
                itemToDelete.courseId,
                { $inc: { trackedCount: -1 } },
                { new: true, runValidators: true, lean: true }
            );
            if (!updatedCourse) {
                console.warn(`[API/TRACKED-ITEMS/:ID] DELETE: Course ID ${itemToDelete.courseId} (from deleted TrackedItem ${itemToDelete._id}) was not found during trackedCount decrement.`);
            } else {
                console.log(`[API/TRACKED-ITEMS/:ID] DELETE: Decremented trackedCount for Course ID: ${itemToDelete.courseId}. New count: ${(updatedCourse as { trackedCount?: number }).trackedCount}`);
            }
        } else {
            console.warn(`[API/TRACKED-ITEMS/:ID] DELETE: Tracked item ${itemToDelete._id} did not have a courseId. trackedCount not decremented.`);
        }

        return NextResponse.json({ success: true, message: 'Item removed from tracker.', data: { id: itemToDelete._id } }, { status: 200 });

    } catch (error: any) {
        console.error('[API/TRACKED-ITEMS/:ID] DELETE Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to remove item from tracker.', error: error.message }, { status: 500 });
    }
}

// --- PUT Handler (for /api/tracked-items/[id]) ---
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // Accessing params.id: The way params are destructured and accessed here
        // (const trackedItemId = params.id;) is the standard Next.js Route Handler pattern.
        // If you encounter errors like "params should be awaited",
        // check your Next.js version (ensure it's 13.4+ or 14+) and clear any build caches.
        // The pattern itself is correct as per official documentation.
        const trackedItemId = params.id;
        if (!mongoose.Types.ObjectId.isValid(trackedItemId)) {
            return NextResponse.json({ success: false, message: 'Invalid Tracked Item ID format' }, { status: 400 });
        }

        const body = await req.json();
        const { userApplicationStatus, userNotes, isArchived } = body;

        const updateData: any = {};
        if (userApplicationStatus !== undefined) updateData.userApplicationStatus = userApplicationStatus;
        if (userNotes !== undefined) updateData.userNotes = userNotes;
        if (isArchived !== undefined) updateData.isArchived = isArchived;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ success: false, message: 'No valid fields to update provided.' }, { status: 400 });
        }

        await dbConnect();

        const updatedTrackedItem = await TrackedItem.findOneAndUpdate(
            { _id: trackedItemId, userId },
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate({
            path: 'courseId',
            model: Course,
            select: 'nome uni tipo academicYear intake link comune area lingua _id trackedCount'
        })

        if (!updatedTrackedItem) {
            return NextResponse.json({ success: false, message: 'Tracked item not found, user not authorized, or no changes made.' }, { status: 404 });
        }

        const courseDetails = (updatedTrackedItem.courseId ?? null) as PopulatedCourse | null;
        const enrichedUpdatedItem = {
            ...updatedTrackedItem,
            courseDetails: courseDetails || {},
            universityDeadlines: getUniversityDeadlinesForCourse(courseDetails)
        };

        return NextResponse.json({ success: true, message: 'Tracked item updated.', data: enrichedUpdatedItem }, { status: 200 });

    } catch (error: any) {
        console.error('[API/TRACKED-ITEMS/:ID] PUT Error:', error); // This line was in the error stack
        if (error.name === 'ValidationError') {
            return NextResponse.json({ success: false, message: 'Validation Error: ' + error.message, errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: 'Failed to update tracked item.', error: error.message }, { status: 500 });
    }
}