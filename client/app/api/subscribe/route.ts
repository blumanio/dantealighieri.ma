// app/api/subscribe/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const API_KEY = process.env.CONVERTKIT_API_KEY;
  const FORM_ID = process.env.CONVERTKIT_FORM_ID;

  // Debug: Log to see if env vars are loaded
  console.log('API_KEY exists:', !!API_KEY);
  console.log('FORM_ID:', FORM_ID);

  if (!API_KEY || !FORM_ID) {
    console.error('Missing environment variables');
    return NextResponse.json({ error: 'Server config error' }, { status: 500 });
  }

  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: API_KEY, email }),
      }
    );

    const data = await response.json();
    console.log('ConvertKit response:', data);

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}