// app/api/user-profile-details/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect'; // Your DB connection utility
import UserProfileDetail, { IUserProfileDetail } from '@/lib/models/UserProfileDetail'; // The model we just created

// GET handler to fetch user profile details
export async function GET(req: NextRequest) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const profileDetails = await UserProfileDetail.findOne({ userId });

        if (!profileDetails) {
            // Return empty objects if no profile found, client can initialize with these
            return NextResponse.json({
                success: true,
                data: { personalData: {}, educationalData: { previousEducation: [], otherStandardizedTests: [], languageProficiency: {} } }
            }, { status: 200 });
        }

        return NextResponse.json({ success: true, data: profileDetails }, { status: 200 });

    } catch (error: any) {
        console.error('API GET /user-profile-details Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch profile details',
            error: error.message
        }, { status: 500 });
    }
}

// POST handler to create or update user profile details
export async function POST(req: NextRequest) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();
        // body can contain { personal: ... } or { education: ... } or both

        const dataToUpdate: Partial<Pick<IUserProfileDetail, 'personalData' | 'educationalData'>> = {};

        if (body.personal) {
            dataToUpdate.personalData = body.personal;
        }
        if (body.education) {
            dataToUpdate.educationalData = body.education;
        }

        if (Object.keys(dataToUpdate).length === 0) {
            return NextResponse.json({ success: false, message: 'No data provided to update.' }, { status: 400 });
        }
        
        // Find existing profile or create a new one if it doesn't exist (upsert)
        // $set will ensure only provided fields (personalData or educationalData) are updated
        // and existing ones are preserved if not included in the request.
        const updatedProfile = await UserProfileDetail.findOneAndUpdate(
            { userId },
            { $set: dataToUpdate, $setOnInsert: { userId } }, // $setOnInsert ensures userId is set on creation
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({
            success: true,
            message: 'Profile details updated successfully.',
            data: updatedProfile
        }, { status: 200 });

    } catch (error: any) {
        console.error('API POST /user-profile-details Error:', error);
        // Handle validation errors specifically if needed
        if (error.name === 'ValidationError') {
            return NextResponse.json({
                success: false,
                message: 'Validation Error',
                errors: error.errors // Mongoose validation errors
            }, { status: 400 });
        }
        return NextResponse.json({
            success: false,
            message: 'Failed to update profile details',
            error: error.message
        }, { status: 500 });
    }
}