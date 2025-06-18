// lib/clerk.ts
import { ClerkProvider } from '@clerk/nextjs';

// Make sure to set your Clerk environment variables
export const clerkConfig = {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
  secretKey: process.env.CLERK_SECRET_KEY!,
};