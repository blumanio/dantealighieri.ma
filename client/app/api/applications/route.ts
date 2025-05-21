// app/api/applications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Application from '@/lib/models/Application';
import dbConnect from '@/lib/dbConnect';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log('Application submitted to Next.js API route:', body);

    // Transform flat input into nested structure for MongoDB schema
    const applicationData = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: {
        countryCode: body.countryCode,
        number: body.whatsapp,
      },
      education: {
        degree: body.lastDegree,
        graduationYear: parseInt(body.graduationYear, 10),
        points: body.degreePoints,
      },
      studyPreference: body.studyPreference,
    };

    const newApplication = await Application.create(applicationData);

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
        data: newApplication,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('API route processing error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process application data',
        error: error?.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
