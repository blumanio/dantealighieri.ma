// client/app/api/user-profile-details/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import UserProfileDetail, { IUserProfileDetail } from '@/lib/models/UserProfileDetail';

// Re-use or import a shared version of findOrCreateUserProfile
async function findOrCreateUserProfile(userId: string): Promise<IUserProfileDetail> {
    await dbConnect();
    let profileDetails = await UserProfileDetail.findOne({ userId }).lean();

    if (!profileDetails) {
        console.log(`[API UserProfileDetail GET] No profile found for ${userId}. Attempting to create one.`);
        let clerkFirstName = null;
        let clerkLastName = null;
        try {
            const clerkUser = await clerkClient.users.getUser(userId);
            clerkFirstName = clerkUser.firstName;
            clerkLastName = clerkUser.lastName;
        } catch (clerkError: any) {
            console.warn(`[API UserProfileDetail GET] Could not fetch Clerk user details for ${userId} during profile creation: ${clerkError.message}`);
        }

        const newUserProfileData: Partial<IUserProfileDetail> = {
            userId,
            personalData: {
                // Replace 'firstName' and 'lastName' with the correct keys from ICustomPersonalData
                // Example: givenName: clerkFirstName || '', familyName: clerkLastName || '',
                // Initialize other fields as empty or with defaults
            },
            educationalData: { previousEducation: [], otherStandardizedTests: [], languageProficiency: {} },
            role: 'student',
            premiumTier: 'Amico',
            profileVisibility: 'private',
            languageInterests: [],
            targetUniversities: [],
            aboutMe: ''
        };
        try {
            const createdProfile = await UserProfileDetail.create(newUserProfileData);
            console.log(`[API UserProfileDetail GET] Created new profile for ${userId}.`);
            profileDetails = createdProfile.toObject();
        } catch (error: any) {
            console.error(`[API UserProfileDetail GET] Failed to create profile for ${userId}:`, error.message);
            // Fallback structure if creation fails
            return {
                userId,
                personalData: { firstName: clerkFirstName || '', lastName: clerkLastName || '' },
                educationalData: { previousEducation: [], otherStandardizedTests: [], languageProficiency: {} },
                role: 'student', premiumTier: 'Amico', profileVisibility: 'private',
                languageInterests: [], targetUniversities: [], aboutMe: '',
                createdAt: new Date(), updatedAt: new Date(),
            } as unknown as IUserProfileDetail;
        }
    }

    return {
        ...profileDetails,
        personalData: profileDetails.personalData || { /* Provide default keys from ICustomPersonalData here */ }, // Ensure personalData exists
        educationalData: profileDetails.educationalData || { previousEducation: [], otherStandardizedTests: [], languageProficiency: {} },
    } as IUserProfileDetail;
}


export async function GET(req: NextRequest) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const profileDetails = await findOrCreateUserProfile(userId);

        return NextResponse.json({ success: true, data: profileDetails }, { status: 200 });
    } catch (error: any) {
        console.error('API GET /user-profile-details Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch profile details', error: error.message }, { status: 500 });
    }
}

// POST handler (from previous response)
export async function POST(req: NextRequest) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }
        await dbConnect();
        const body = await req.json();

        const dataToUpdate: Partial<IUserProfileDetail> = {};
        const allowedFields: (keyof IUserProfileDetail)[] = [
            'personalData', 'educationalData', 'role', 'premiumTier',
            'profileVisibility', 'languageInterests', 'targetUniversities', 'aboutMe'
        ];

        for (const key of allowedFields) {
            if (body[key] !== undefined) {
                (dataToUpdate as any)[key] = body[key];
            }
        }
        // Ensure nested objects are handled correctly
        if (body.personal && typeof body.personal === 'object') dataToUpdate.personalData = body.personal;
        if (body.education && typeof body.education === 'object') dataToUpdate.educationalData = body.education;


        if (Object.keys(dataToUpdate).length === 0) {
            return NextResponse.json({ success: false, message: 'No data provided to update.' }, { status: 400 });
        }

        // Ensure default UserProfileDetail structure if creating
        const defaultStructure = {
            userId,
            personalData: {},
            educationalData: { previousEducation: [], otherStandardizedTests: [], languageProficiency: {} },
            role: 'student',
            premiumTier: 'Amico',
            profileVisibility: 'private',
            languageInterests: [],
            targetUniversities: [],
            aboutMe: ''
        };

        const updatePayload = { $set: dataToUpdate, $setOnInsert: defaultStructure };


        const updatedProfile = await UserProfileDetail.findOneAndUpdate(
            { userId },
            updatePayload,
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