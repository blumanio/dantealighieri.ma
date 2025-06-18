import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import dbConnect from '@/lib/dbConnect'; // Ensure this path is correct
import { IUserProfileDetail, ICustomPersonalData, ICustomEducationalData, IWorkExperience } from '@/types/types'; // Ensure this path is correct
import UserProfileDetail from '@/lib/models/UserProfileDetail';

// --- Default Structures for Initialization ---
const defaultPersonalData: ICustomPersonalData = {
    firstName: '',
    lastName: '',
    dateOfBirth: undefined, // Use undefined to let Mongoose defaults/optionality work
    gender: undefined,
    nationality: undefined,
    countryOfResidence: undefined,
    streetAddress: undefined,
    city: undefined,
    stateProvince: undefined,
    postalCode: undefined,
    addressCountry: undefined,
    passportNumber: undefined,
    passportExpiryDate: undefined,
    emergencyContactName: undefined,
    emergencyContactRelationship: undefined,
    emergencyContactPhone: undefined,
    emergencyContactEmail: undefined,
};

const defaultEducationalData: ICustomEducationalData = {
    highestLevelOfEducation: undefined,
    previousEducation: [],
    languageProficiency: {
        isNativeEnglishSpeaker: undefined,
        testTaken: undefined,
        overallScore: undefined,
        testDate: undefined,
    },
    otherStandardizedTests: [],
};

const defaultWorkExperience: IWorkExperience = {
    workExperienceInMonths: 0,
    workExperienceType: 'none',
    projectsWorkedOn: 0
}


async function findOrCreateUserProfile(userId: string): Promise<Record<string, any>> {
    await dbConnect();
    let profileDetailsDoc = await UserProfileDetail.findOne({ userId });

    if (!profileDetailsDoc) {
        console.log(`[API UserProfileDetail GET/POST] No profile found for ${userId}. Attempting to create one.`);
        let clerkFirstName = null;
        let clerkLastName = null;
        try {
            const clerkUser = await clerkClient.users.getUser(userId); // Direct usage of clerkClient
            clerkFirstName = clerkUser.firstName;
            clerkLastName = clerkUser.lastName;
        } catch (clerkError: any) {
            console.warn(`[API UserProfileDetail GET/POST] Could not fetch Clerk user details for ${userId} during profile creation: ${clerkError.message}`);
        }

        const newUserProfileData: Partial<IUserProfileDetail> = {
            userId,
            personalData: {
                ...defaultPersonalData,
                firstName: clerkFirstName || undefined, // Pre-fill from Clerk if available
                lastName: clerkLastName || undefined,
            },
            educationalData: { ...defaultEducationalData },
            workExperience: { ...defaultWorkExperience },
            languages: [],
            role: 'student', // Default role
            premiumTier: 'Michelangelo', // Default tier
            profileVisibility: 'private', // Default visibility
            languageInterests: [],
            targetUniversities: [],
            aboutMe: '',
            interest: '',
            userType: 'student',
            graduationYear: '',
            fieldOfInterest: '',
            studyAbroadStage: 'researching'
        };

        try {
            profileDetailsDoc = await UserProfileDetail.create(newUserProfileData);
            console.log(`[API UserProfileDetail GET/POST] Created new profile for ${userId}.`);
        } catch (error: any) {
            console.error(`[API UserProfileDetail GET/POST] Critical: Failed to create profile for ${userId}:`, error.message, error.stack);
            // If creation fails, it's a server-side issue. Throw to let handler return 500.
            throw new Error(`Failed to create profile for user ${userId}.`);
        }
    }

    // Ensure the returned object is a plain JS object and has default structures for nested fields
    const profileDetails = profileDetailsDoc.toObject();

    return {
        ...profileDetails,
        personalData: {
            ...defaultPersonalData, // Ensure all keys exist
            ...(profileDetails.personalData || {}),
        },
        educationalData: {
            highestLevelOfEducation: profileDetails.educationalData?.highestLevelOfEducation || defaultEducationalData.highestLevelOfEducation,
            previousEducation: profileDetails.educationalData?.previousEducation || defaultEducationalData.previousEducation,
            languageProficiency: {
                ...(defaultEducationalData.languageProficiency!), // Non-null assertion as it's defined
                ...(profileDetails.educationalData?.languageProficiency || {}),
            },
            otherStandardizedTests: profileDetails.educationalData?.otherStandardizedTests || defaultEducationalData.otherStandardizedTests,
        },
        workExperience: {
            ...defaultWorkExperience,
            ...(profileDetails.workExperience || {}),
        }
    };
}

export async function GET(req: NextRequest) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized: User not authenticated.' }, { status: 401 });
        }

        const profileDetails = await findOrCreateUserProfile(userId);
        return NextResponse.json({ success: true, data: profileDetails }, { status: 200 });

    } catch (error: any) {
        console.error('[API GET /user-profile-details] Error:', error.message, error.stack);
        return NextResponse.json({ success: false, message: 'Failed to fetch profile details.', error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized: User not authenticated.' }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();

        // Ensure profile exists before trying to update, or let findOneAndUpdate handle upsert
        // For clarity and to use findOrCreateUserProfile's initialization logic if it's a new user:
        let existingProfile = await UserProfileDetail.findOne({ userId });
        if (!existingProfile) {
            // This will create the profile with defaults if it doesn't exist.
            // We call it mainly for its side effect of creation and default population.
            await findOrCreateUserProfile(userId);
        }


        const dataToUpdate: { $set: Partial<IUserProfileDetail>, $setOnInsert?: Partial<IUserProfileDetail> } = { $set: {} };

        // Whitelist fields for direct update from body (top-level fields)
        const allowedTopLevelFields: (keyof IUserProfileDetail)[] = [
            'role', 'premiumTier', 'profileVisibility', 'languageInterests', 'targetUniversities', 'aboutMe',
            'interest', 'userType', 'graduationYear', 'fieldOfInterest', 'studyAbroadStage', 'workExperience', 'languages'
        ];

        for (const key of allowedTopLevelFields) {
            if (body[key] !== undefined) {
                (dataToUpdate.$set as any)[key] = body[key];
            }
        }

        // Handle nested personalData
        if (body.personal && typeof body.personal === 'object') {
            dataToUpdate.$set.personalData = { ...defaultPersonalData, ...body.personal };
        }

        // Handle nested educationalData
        if (body.education && typeof body.education === 'object') {
            dataToUpdate.$set.educationalData = {
                // Ensure all sub-fields are at least initialized if not provided
                highestLevelOfEducation: body.education.highestLevelOfEducation || defaultEducationalData.highestLevelOfEducation,
                previousEducation: body.education.previousEducation || defaultEducationalData.previousEducation,
                languageProficiency: {
                    ...(defaultEducationalData.languageProficiency!),
                    ...(body.education.languageProficiency || {}),
                },
                otherStandardizedTests: body.education.otherStandardizedTests || defaultEducationalData.otherStandardizedTests,
            };
        }

        // Handle nested workExperience
        if (body.workExperience && typeof body.workExperience === 'object') {
            dataToUpdate.$set.workExperience = { ...defaultWorkExperience, ...body.workExperience };
        }


        if (Object.keys(dataToUpdate.$set).length === 0) {
            return NextResponse.json({ success: false, message: 'No valid data provided to update.' }, { status: 400 });
        }

        // $setOnInsert for fields that should only be set on creation during an upsert
        // Most defaults are handled by the schema or findOrCreateUserProfile if called first.
        // userId is the key for matching.
        dataToUpdate.$setOnInsert = {
            userId,
            // Schema defaults will apply for other fields like role, premiumTier, etc.
            // personalData and educationalData are set via $set, so they'll be there on insert.
        };


        const updatedProfile = await UserProfileDetail.findOneAndUpdate(
            { userId },
            dataToUpdate, // Contains $set and $setOnInsert
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );

        if (!updatedProfile) {
            // This case should ideally be rare due to upsert: true and prior findOrCreate logic
            console.error(`[API POST /user-profile-details] Failed to update or create profile for ${userId} after findOneAndUpdate.`);
            return NextResponse.json({ success: false, message: 'Failed to update profile details. Profile not found or created.' }, { status: 500 });
        }

        // Ensure the returned object has the same consistent structure as GET
        const responseData = {
            ...updatedProfile.toObject(),
            personalData: {
                ...defaultPersonalData,
                ...(updatedProfile.toObject().personalData || {}),
            },
            educationalData: {
                highestLevelOfEducation: updatedProfile.toObject().educationalData?.highestLevelOfEducation || defaultEducationalData.highestLevelOfEducation,
                previousEducation: updatedProfile.toObject().educationalData?.previousEducation || defaultEducationalData?.previousEducation,
                languageProficiency: {
                    ...(defaultEducationalData.languageProficiency!),
                    ...(updatedProfile.toObject().educationalData?.languageProficiency || {}),
                },
                otherStandardizedTests: updatedProfile.toObject().educationalData?.otherStandardizedTests || defaultEducationalData.otherStandardizedTests,
            },
            workExperience: {
                ...defaultWorkExperience,
                ...(updatedProfile.toObject().workExperience || {}),
            }
        } as unknown as IUserProfileDetail;


        return NextResponse.json({ success: true, message: 'Profile details updated successfully.', data: responseData }, { status: 200 });

    } catch (error: any) {
        console.error('[API POST /user-profile-details] Error:', error.message, error.stack);
        if (error.name === 'ValidationError') {
            return NextResponse.json({ success: false, message: 'Validation Error.', errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: 'Failed to update profile details.', error: error.message }, { status: 500 });
    }
}