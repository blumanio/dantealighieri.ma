// app/layout.tsx
import { Suspense } from 'react';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ClerkProviderWrapper from '@/components/ClerkProviderWrapper';
import WhatsAppButton from '@/components/WhatsAppButton';
import AppLoadingFallback from '@/components/AppLoadingFallback';

const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className={`font-poppins ${inter.className}`}>
        <WhatsAppButton />
        <ClerkProviderWrapper>
          <Suspense fallback={<AppLoadingFallback />}>
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
