// app/api/applications/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Application submitted:', body);
    // Forward the request to your Express backend
    const response = await fetch('https://backend-jxkf29se8-mohamed-el-aammaris-projects.vercel.app/api/applications', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit application' },
      { status: 500 }
    );
  }
}