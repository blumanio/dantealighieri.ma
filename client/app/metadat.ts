import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://dantealighieri.ma'),
  title: 'DanteMa Study in Italy',
  description: 'by Mohamed El Aammari',
  
  openGraph: {
    type: 'website',
    siteName: 'DanteMa',
    title: 'DanteMa Study in Italy',
    description: 'by Mohamed El Aammari',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DanteMa - Study in Italy'
      }
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'DanteMa Study in Italy',
    description: 'by Mohamed El Aammari',
    images: ['/og-image.png'],
  },

  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};