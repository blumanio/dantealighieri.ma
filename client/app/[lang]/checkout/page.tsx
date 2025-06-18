// app/[lang]/checkout/page.tsx (Conceptual - you'll need to build the UI)
'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';


// Ensure your publishable key is loaded from .env.local
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
  clientSecret: string;
  tierId: string | null;
  priceId: string | null;
  lang: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret, tierId, priceId, lang }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
        setIsLoading(false);
        setErrorMessage("Card details not found.");
        return;
    }

    // This is where you would ideally pass customer details if collected (name, email, address)
    // For simplicity, we are not collecting them here, but Stripe might require some.
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        // billing_details: { name: 'Customer Name', email: 'customer@example.com' }, // Example
      },
    });

    if (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment successful!
      // You can redirect to a success page or show a success message.
      // The webhook will handle updating UserProfileDetail.
      router.push(`/${lang}/payment-success?tier=${tierId}&payment_intent=${paymentIntent.id}`);
    } else {
      setErrorMessage("Payment processing. Please wait.");
      // Handle other statuses if necessary
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white shadow-md rounded-lg">
      <div>
        <h2 className="text-xl font-semibold">Complete Your Payment for Tier: {tierId?.toUpperCase()}</h2>
        <p className="text-gray-600">Price ID: {priceId}</p>
      </div>
      <div>
        <label htmlFor="card-element" className="block text-sm font-medium text-gray-700">
          Card details
        </label>
        <div className="mt-1 p-3 border border-gray-300 rounded-md">
          <CardElement id="card-element" options={{style: {base: {fontSize: '16px'}}}} />
        </div>
      </div>
      {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const CheckoutPage: React.FC = () => {
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const tierId: string | null = searchParams?.get('tier') ?? null;
  const priceId: string | null = searchParams?.get('priceId') ?? null; // This will be your Stripe Price ID

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    if (priceId) {
      // Fetch the client secret for the Payment Intent from your backend
      fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: priceId }), // Send the Stripe Price ID
      })
        .then((res) => {
            if (!res.ok) {
                return res.json().then(err => { throw new Error(err.error || 'Failed to create payment intent')});
            }
            return res.json();
        })
        .then((data) => {
            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
            } else {
                throw new Error(data.error || 'Client secret not received.');
            }
        })
        .catch((error) => {
            console.error("Error fetching client secret:", error);
            setLoadingError(error.message || "Failed to initialize payment. Please try again.");
        });
    } else {
        setLoadingError("Tier information is missing. Please select a tier again.");
    }
  }, [priceId]);

  if (loadingError) {
    return <div className="container mx-auto p-4 text-red-600 text-center">{loadingError}</div>;
  }

  if (!clientSecret || !stripePromise) {
    return <div className="container mx-auto p-4 text-center">Loading payment form...</div>;
  }

  const options: StripeElementsOptions = { clientSecret };

  return (
    <div className="container mx-auto p-4 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
            <Elements stripe={stripePromise} options={options}>
                <CheckoutForm clientSecret={clientSecret} tierId={tierId} priceId={priceId} lang={language ? language : ''} />
            </Elements>
        </div>
    </div>
  );
};

export default CheckoutPage;