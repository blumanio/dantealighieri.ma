// app/layout.tsx
import { Suspense } from 'react'; // Keep Suspense if needed, but simplify fallback for debug
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClerkProviderWrapper from '@/components/ClerkProviderWrapper'; // Ensure path is correct

const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

// Simple fallback for debugging
function LoadingFallback() {
  console.log('[RootLayout_LOG] LoadingFallback rendered (Suspense)');
  return <div>ROOT LOADING FALLBACK...</div>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log('[RootLayout_LOG] Rendering RootLayout START');
  return (
    // The lang attribute here is a default. It will be updated by LanguageProvider for specific language pages.
    <html lang={DEFAULT_LANGUAGE} className={poppins.variable}>
      <head>
        {/* <script src="//code.tidio.co/5x5vbeatvnqkj4tofmzqhw8rctjxtd17.js" async></script>
        {/* Other meta tags, links etc. */}
      </head>
      <body className={`font-poppins ${inter.className}`}>
        <ClerkProviderWrapper>
          <Suspense fallback={<LoadingFallback />}>
            {children}
          </Suspense>
        </ClerkProviderWrapper>
        <GoogleAnalytics gaId="G-845LV1ZMN9" />
        <GoogleTagManager gtmId="GTM-5PXD8C8K" />
        <SpeedInsights />
      </body>
    </html>
  );
}
// Added DEFAULT_LANGUAGE to html tag, though it will be client-side updated
// Ensure DEFAULT_LANGUAGE is exported from context or defined here if used directly
// For simplicity, hardcoding 'en' as an example default if not imported:
const DEFAULT_LANGUAGE = 'en'; // Or import from your context