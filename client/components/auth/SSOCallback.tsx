// components/auth/SSOCallback.tsx
'use client';

import { useEffect } from 'react';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk();
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await handleRedirectCallback({ 
  redirectUrl: window.location.href 
});
        router.push('/dashboard');
      } catch (error) {
        console.error('SSO callback error:', error);
        router.push('/sign-in?error=sso_failed');
      }
    };

    handleCallback();
  }, [handleRedirectCallback, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing sign in...
        </h2>
        <p className="text-gray-600">
          Please wait while we redirect you
        </p>
      </div>
    </div>
  );
}