// app/api/stripe/create-payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server'; // Assuming you use Clerk for auth

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil', // Use your desired API version
});

// Helper to get amount based on tier/priceId from Stripe
// This ensures you're always charging the correct amount as defined in your Stripe dashboard.
const getAmountForPriceId = async (priceId: string): Promise<{amount: number, currency: string}> => {
    try {
        const price = await stripe.prices.retrieve(priceId);
        if (!price.unit_amount) {
            throw new Error('Price unit_amount is not defined.');
        }
        return { amount: price.unit_amount, currency: price.currency };
    } catch (error) {
        console.error(`Error fetching price ${priceId} from Stripe:`, error);
        throw new Error('Invalid Price ID or failed to fetch price details.');
    }
};

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json();
    const { userId: clerkUserId } = await auth(); // Get Clerk user ID

    if (!clerkUserId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
    if (!priceId || typeof priceId !== 'string') {
      return NextResponse.json({ error: 'Price ID is required and must be a string' }, { status: 400 });
    }

    const { amount, currency } = await getAmountForPriceId(priceId);

    // You might want to create or retrieve a Stripe Customer ID for the user here
    // and associate it with the paymentIntent for better record-keeping and future payments.
    // Example:
    // let stripeCustomer = await findOrCreateStripeCustomer(clerkUserId, userEmail);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        clerkUserId: clerkUserId,
        selectedPriceId: priceId,
        // selectedTierId: tierId, // You could pass tierId from client if different from priceId's product
      },
      // customer: stripeCustomer.id, // If using Stripe customers
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('Error creating Payment Intent:', error);
    return NextResponse.json({ error: error.message || 'Failed to create Payment Intent' }, { status: 500 });
  }
}