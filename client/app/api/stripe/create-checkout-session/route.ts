// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// 1. Correct the Stripe API Version:
// Replace '2024-04-10' with the latest stable API version or your account's default.
// Do NOT use '.basil' or any other non-date suffix.

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});
const APP_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://yourdomain.com';
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const priceId = body.priceId;
    const lang = body.lang || 'en'; // Default to 'en' if not provided

    // 2. Determine the origin for constructing success and cancel URLs:
    // Prefer NEXT_PUBLIC_API_BASE_URL if available, then req.headers.get('origin'), then a hardcoded fallback.
    // This makes it more robust across different environments (localhost, Vercel preview, production).
    let origin = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!origin) {
      origin = req.headers.get('origin') || APP_BASE_URL;
    }
    if (origin.endsWith('/')) {
      origin = origin.slice(0, -1);
    }

    if (!priceId) {
      return NextResponse.json({ error: { message: 'Price ID is required' } }, { status: 400 });
    }

    const successUrl = `${origin}/${lang}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/${lang}/pricing?payment_cancelled=true`;

    const sessionPayload: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription', // Or 'payment' for one-time purchases
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      // Optionally, you can pass customer email if known, or other parameters:
      // customer_email: body.userEmail, // If you have it
      // client_reference_id: body.userId, // To link with your internal user ID
      // locale: lang === 'it' ? 'it' : lang === 'ar' ? 'ar' : 'auto', // Suggest locale to Stripe Checkout
    };

    const session = await stripe.checkout.sessions.create(sessionPayload);

    // 4. Return the session ID to the frontend.
    // The frontend code expects an object with an 'id' property.
    return NextResponse.json({ id: session.id });

  } catch (err: any) {
    console.error('[STRIPE API] Error creating Stripe session:', err);
    // Provide a structured error message to the client
    return NextResponse.json(
      { error: { message: err.message || 'An unexpected error occurred while creating the payment session.' } },
      { status: err.statusCode || 500 } // Use Stripe's status code if available
    );
  }
}