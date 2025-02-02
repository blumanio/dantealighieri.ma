import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClerkWrapper from './utils/clerck';
import { LanguageProvider } from './[lang]/LanguageContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dante Alighieri Consulting',
  description: 'by Mohamed El Aammari',
};

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
        <LanguageProvider initialLang={params.lang as 'en' | 'it' | 'fr' | 'ar'}>
          <ClerkWrapper>
            {children}
          </ClerkWrapper>
          <GoogleAnalytics gaId='G-845LV1ZMN9' />
          <GoogleTagManager gtmId='GTM-5PXD8C8K' />
          <SpeedInsights />
        </LanguageProvider>
      </body>
    </html>
  );
}
