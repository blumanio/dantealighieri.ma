// app/api/webhooks/stripe/route.ts (Ensure this is correctly set up as per previous advice)
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
// import { buffer } from 'micro'; // For reading the raw body
import dbConnect from '@/lib/dbConnect'; //
import UserProfileDetail from '@/lib/models/UserProfileDetail'; //

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Disable Next.js body parsing for this route, as Stripe needs the raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to map Stripe Price ID to your application's tier name/ID
// You need to maintain these mappings or derive tier from Stripe Product associated with Price.
const getTierInfoFromPriceId = (priceId: string): { tierName: string, isSubscription: boolean } => {
    // IMPORTANT: Replace these with your actual Stripe Price IDs from your .env.local
    if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_DANTE) return { tierName: 'DANTE', isSubscription: true };
    if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_DAVINCI) return { tierName: 'DAVINCI', isSubscription: true };
    // Add other Price IDs and their corresponding tier names
    console.warn(`Unknown Price ID encountered in webhook: ${priceId}`);
    return { tierName: 'UNKNOWN_TIER', isSubscription: false }; // Fallback
};


export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
  }

  // Utility to read the raw body from ReadableStream
  async function readRawBody(readable: ReadableStream<Uint8Array> | null): Promise<Buffer> {
    if (!readable) return Buffer.alloc(0);
    const reader = readable.getReader();
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    return Buffer.concat(chunks);
  }

  const rawBody = await readRawBody(req.body as ReadableStream<Uint8Array>); // Read the raw body

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  await dbConnect(); //

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);

      const clerkUserId = paymentIntent.metadata?.clerkUserId;
      const selectedPriceId = paymentIntent.metadata?.selectedPriceId;

      if (clerkUserId && selectedPriceId) {
        const { tierName, isSubscription } = getTierInfoFromPriceId(selectedPriceId);

        try {
          const updateData: any = {
            subscriptionTier: tierName,
            subscriptionStatus: 'active', // Or 'premium', etc.
            lastPaymentDate: new Date(paymentIntent.created * 1000),
            stripeCustomerId: typeof paymentIntent.customer === 'string' ? paymentIntent.customer : null,
          };

          // If this payment is part of a subscription setup
          // 'invoice' is not a standard property on PaymentIntent, but may exist in metadata or as an extension.
          // If you store the invoice ID in metadata, use that instead.
          const invoiceId = (paymentIntent as any).invoice;
          if (isSubscription && invoiceId) {
             // If an invoice is associated, it might be part of a subscription
             // You might want to retrieve the subscription ID from the invoice or paymentIntent
             // For actual subscriptions, you'd listen to `invoice.paid` for recurring payments.
             // const invoice = await stripe.invoices.retrieve(invoiceId as string);
             // if (typeof invoice.subscription === 'string') {
             //   updateData.stripeSubscriptionId = invoice.subscription;
             //   const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
             //   updateData.subscriptionEndDate = new Date(subscription.current_period_end * 1000);
             // }
          }


          const userProfile = await UserProfileDetail.findOneAndUpdate( //
            { clerkId: clerkUserId },
            { $set: updateData },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
          console.log(`Updated UserProfileDetail for clerkId ${clerkUserId} to tier ${tierName}`, userProfile);
        } catch (dbError) {
          console.error(`Database error updating UserProfileDetail for clerkId ${clerkUserId}:`, dbError);
          // Potentially retry or log for manual intervention
        }
      } else {
        console.error('Missing clerkUserId or selectedPriceId in PaymentIntent metadata for succeeded event', paymentIntent.metadata);
      }
      break;

    // Add other event handlers as needed (e.g., 'invoice.paid' for subscriptions, 'customer.subscription.updated')

    default:
      console.warn(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}