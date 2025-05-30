// client/app/api/universities/[universityId]/track/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UniversityTrackedItem from '@/lib/models/UniversityTrackedItem';
import University from '@/lib/models/University';
import { getAuth } from '@clerk/nextjs/server';
import mongoose from 'mongoose';

// POST to track a university
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

        const existingTrackedItem = await UniversityTrackedItem.findOne({ userId, universityId });

        if (existingTrackedItem) {
            return NextResponse.json(
                {
                    success: true,
                    message: 'This university is already tracked.',
                    data: existingTrackedItem,
                    alreadyExists: true,
                    trackedCount: universityDoc.trackedCount
                },
                { status: 200 }
            );
        }

        const newTrackedItem = await UniversityTrackedItem.create({ userId, universityId });
        const updatedUniversity = await University.findByIdAndUpdate(
            universityId,
            { $inc: { trackedCount: 1 } },
            { new: true, select: 'trackedCount name' }
        );

        if (!updatedUniversity) {
            console.error(`Error: University ${universityId} found but failed to update for track count increment.`);
            await UniversityTrackedItem.findByIdAndDelete(newTrackedItem._id);
            return NextResponse.json({ success: false, message: 'Failed to update university track count after creating track link.' }, { status: 500 });
        }

        console.log(`Track count updated for ${updatedUniversity.name} to ${updatedUniversity.trackedCount} (added via API)`);

        return NextResponse.json(
            {
                success: true,
                message: 'University tracking started!',
                data: newTrackedItem,
                alreadyExists: false,
                trackedCount: updatedUniversity.trackedCount
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error(`API Error: /api/universities/${context.params.universityId}/track POST:`, error); // Use context.params here too for logging
        if (error.code === 11000) {
            return NextResponse.json({ success: false, message: 'Item already tracked (concurrent request).', error: 'Duplicate entry' }, { status: 409 });
        }
        return NextResponse.json(
            { success: false, message: 'Failed to track university.', error: error?.message },
            { status: 500 }
        );
    }
}

// DELETE to stop tracking
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
        const deletedTrackedItem = await UniversityTrackedItem.findOneAndDelete({ userId, universityId });

        if (!deletedTrackedItem) {
            const currentUniversity = await University.findById(universityId).select('trackedCount name').lean();
            const trackedCount =
                currentUniversity && !Array.isArray(currentUniversity)
                    ? (currentUniversity as { trackedCount?: number }).trackedCount
                    : undefined;
            return NextResponse.json(
                {
                    success: false,
                    message: 'Tracked item not found or user not authorized to delete this specific track link.',
                    trackedCount
                },
                { status: 404 }
            );
        }

        const updatedUniversity = await University.findByIdAndUpdate(
            universityId,
            { $inc: { trackedCount: -1 } },
            { new: true, select: 'trackedCount name' }
        );

        if (!updatedUniversity) {
            console.error(`Error: University ${universityId} not found for track count decrement, but track link was deleted.`);
            return NextResponse.json({ success: false, message: 'Track link deleted, but failed to update university track count.' }, { status: 500 });
        }

        console.log(`Track count updated for ${updatedUniversity.name} to ${updatedUniversity.trackedCount} (removed via API)`);

        return NextResponse.json(
            {
                success: true,
                message: 'Stopped tracking university.',
                data: { id: deletedTrackedItem._id },
                trackedCount: updatedUniversity.trackedCount
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error(`API Error: /api/universities/${context.params.universityId}/track DELETE:`, error); // Use context.params here too for logging
        return NextResponse.json(
            { success: false, message: 'Failed to untrack university.', error: error?.message },
            { status: 500 }
        );
    }
}