'use client';

import { Suspense } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClerkWrapper from './utils/clerck';
import { LanguageProvider } from './[lang]/LanguageContext';
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ['latin'] });

// Dynamically import TawkMessenger with no SSR
const TawkMessenger = dynamic(
  () => import('../components/TawkMessengerComponent'),
  { ssr: false }
);

// Create a separate component for the content that needs Suspense
function LayoutContent({ 
  children, 
  lang 
}: { 
  children: React.ReactNode;
  lang: string;
}) {
  return (
    <LanguageProvider initialLang={lang as 'en' | 'it' | 'ar'}>
      <ClerkWrapper>
        {children}
      </ClerkWrapper>
    </LanguageProvider>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">Loading...</div>
    </div>
  );
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang || 'en'}>
      <body className={inter.className}>
        <Suspense fallback={<LoadingFallback />}>
          <LayoutContent lang={params.lang}>
            {children}
          </LayoutContent>
        </Suspense>
        <TawkMessenger />
        <GoogleAnalytics gaId='G-845LV1ZMN9' />
        <GoogleTagManager gtmId='GTM-5PXD8C8K' />
        <SpeedInsights />
      </body>
    </html>
  );
}