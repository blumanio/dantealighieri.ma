'use client';

import { Suspense } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClerkWrapper from './utils/clerck';
import { LanguageProvider } from './[lang]/LanguageContext';
import dynamic from 'next/dynamic';
import { Poppins } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// Dynamically import TawkMessenger with no SSR
//const TawkMessenger = dynamic(
//() => import('../components/TawkMessengerComponent'),
// { ssr: false }
//);

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
      <div className="text-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle fill="#008C45" stroke="#008C45" strokeWidth="15" r="15" cx="40" cy="65">
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
        <circle fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="15" r="15" cx="100" cy="65">
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
        <circle fill="#CD212A" stroke="#CD212A" strokeWidth="15" r="15" cx="160" cy="65">
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
  );
}
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});
export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang || 'en'} className={poppins.variable}>
      <script src="//code.tidio.co/5x5vbeatvnqkj4tofmzqhw8rctjxtd17.js" async></script>
      <body className='className="font-poppins" ${inter.className}'>
        <Suspense fallback={<LoadingFallback />}>
          <LayoutContent lang={params.lang}>
            {children}
          </LayoutContent>
        </Suspense>
        {/* <TawkMessenger /> */}
        <GoogleAnalytics gaId='G-845LV1ZMN9' />
        <GoogleTagManager gtmId='GTM-5PXD8C8K' />
        <SpeedInsights />
      </body>
    </html>
  );
}