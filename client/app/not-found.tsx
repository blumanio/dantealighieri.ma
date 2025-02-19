'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function NotFound() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <circle fill="#008C45" stroke="#008C45" stroke-width="15" r="15" cx="40" cy="65">
        <animate 
            attributeName="cy" 
            calcMode="spline" 
            dur="2" 
            values="65;135;65;" 
            keySplines=".5 0 .5 1;.5 0 .5 1" 
            repeatCount="indefinite" 
            begin="-.4"
        />
    </circle>
    <circle fill="#FFFFFF" stroke="#FFFFFF" stroke-width="15" r="15" cx="100" cy="65">
        <animate 
            attributeName="cy" 
            calcMode="spline" 
            dur="2" 
            values="65;135;65;" 
            keySplines=".5 0 .5 1;.5 0 .5 1" 
            repeatCount="indefinite" 
            begin="-.2"
        />
    </circle>
    <circle fill="#CD212A" stroke="#CD212A" stroke-width="15" r="15" cx="160" cy="65">
        <animate 
            attributeName="cy" 
            calcMode="spline" 
            dur="2" 
            values="65;135;65;" 
            keySplines=".5 0 .5 1;.5 0 .5 1" 
            repeatCount="indefinite" 
            begin="0"
        />
    </circle>
</svg></div>
        </div>
      }
    >
      <Header />
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
          <h2 className="mb-4 text-2xl font-medium text-gray-600">Page Not Found</h2>
          <p className="mb-8 text-gray-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            href="/en"
            className="rounded-md bg-teal-600 px-6 py-3 text-white transition-colors hover:bg-teal-700"
          >
            Go Home
          </Link>
        </div>
      </main>
      <Footer />
    </Suspense>
  );
}
