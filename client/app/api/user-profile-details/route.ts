// app/api/user-profile-details/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import UserProfileDetail, { IUserProfileDetail } from '@/lib/models/UserProfileDetail';

// GET handler (mostly unchanged, ensure it returns new fields)
export async function GET(req: NextRequest) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }
        await dbConnect();
        const profileDetails = await UserProfileDetail.findOne({ userId }).lean();

        if (!profileDetails) {
            return NextResponse.json({
                success: true,
                // Ensure new fields are initialized if profile doesn't exist
                data: {
                    personalData: {},
                    educationalData: { previousEducation: [], otherStandardizedTests: [], languageProficiency: {} },
                    role: 'student', // Default role
                    premiumTier: 'Amico', // Default tier
                    profileVisibility: 'private',
                    languageInterests: [],
                    targetUniversities: [],
                    aboutMe: ''
                }
            }, { status: 200 });
        }
        return NextResponse.json({ success: true, data: profileDetails }, { status: 200 });
    } catch (error: any) {
        console.error('API GET /user-profile-details Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch profile details', error: error.message }, { status: 500 });
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

        // Prepare data for update, allowing partial updates to any top-level field in IUserProfileDetail
        const dataToUpdate: Partial<IUserProfileDetail> = {};

        // Whitelist fields that can be updated by the user directly
        const allowedFields: (keyof IUserProfileDetail)[] = [
            'personalData', 'educationalData', 'role', 'premiumTier',
            'profileVisibility', 'languageInterests', 'targetUniversities', 'aboutMe'
        ];

        for (const key of allowedFields) {
            if (body[key] !== undefined) {
                (dataToUpdate as any)[key] = body[key];
            }
        }
        // Special handling for nested updates if needed (e.g., body.personal, body.education)
        if (body.personal) dataToUpdate.personalData = body.personal;
        if (body.education) dataToUpdate.educationalData = body.education;


        if (Object.keys(dataToUpdate).length === 0) {
            return NextResponse.json({ success: false, message: 'No data provided to update.' }, { status: 400 });
        }

        const updatedProfile = await UserProfileDetail.findOneAndUpdate(
            { userId },
            { $set: dataToUpdate, $setOnInsert: { userId, role: 'student', premiumTier: 'Amico', profileVisibility: 'private' } },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        ).lean();

        return NextResponse.json({ success: true, message: 'Profile details updated successfully.', data: updatedProfile }, { status: 200 });

    } catch (error: any) {
        console.error('API POST /user-profile-details Error:', error);
        if (error.name === 'ValidationError') {
            return NextResponse.json({ success: false, message: 'Validation Error', errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: 'Failed to update profile details', error: error.message }, { status: 500 });
    }
}