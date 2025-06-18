import { currentUser } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    
    // Destructure all fields from the updated form data
    const {
      userType,
      countryOfOrigin,
      mobileNumber,
      currentEducationLevel,
      graduationYear,
      desiredDegreeLevel,
      targetCities,
      academicAreas, // Replaced coursesOfInterest
      targetUniversities,
    } = body;

    // Update user metadata with all the new fields
    await clerkClient.users.updateUserMetadata(user.id, {
      publicMetadata: {
        userType,
        countryOfOrigin,
        mobileNumber,
        currentEducationLevel,
        graduationYear,
        desiredDegreeLevel,
        targetCities,
        academicAreas,
        targetUniversities,
        onboardingComplete: true, // Mark onboarding as complete
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ONBOARDING_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}