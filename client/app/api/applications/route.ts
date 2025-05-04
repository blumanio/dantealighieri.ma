// app/api/applications/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Application submitted to Next.js API route:', body);
    
    // Use the correct backend URL
    // Make sure this URL matches exactly where your Express backend is hosted
    const backendUrl = 'https://backend-jxkf29se8-mohamed-el-aammaris-projects.vercel.app/api/applications';
    
    console.log('Sending to backend URL:', backendUrl);
    
    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body),
      });
      
      console.log('Backend response status:', response.status);
      
      // Check if the response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Backend responded with status ${response.status}:`, errorText);
        return NextResponse.json(
          { 
            success: false, 
            message: `Backend server error: ${response.statusText}`,
            details: errorText || 'No details available'
          },
          { status: response.status }
        );
      }

      // Try to parse the response as JSON
      let data;
      try {
        const responseText = await response.text();
        console.log('Raw response from backend:', responseText);
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('Error parsing backend response:', e);
        return NextResponse.json(
          { success: false, message: 'Invalid response from backend server' },
          { status: 502 }
        );
      }

      return NextResponse.json(data);
    } catch (fetchError) {
      console.error('Error fetching backend:', fetchError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to connect to backend server', 
          error: fetchError instanceof Error ? fetchError.message : String(fetchError)
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('API route processing error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process application data' },
      { status: 400 }
    );
  }
}