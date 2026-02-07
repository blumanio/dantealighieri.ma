// app/layout.tsx
'use client';
import { Suspense } from 'react'; // Keep Suspense if needed, but simplify fallback for debug
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClerkProviderWrapper from '@/components/ClerkProviderWrapper'; // Ensure path is correct
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { Loader2, GraduationCap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PremiumSidebar from '@/components/RightSidebar'; // Ensure path is correct
import BottomMenu from '@/components/BottomMenu';



const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

// Simple fallback for debugging
export function LoadingFallback() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);


  console.log('[RootLayout_LOG] LoadingFallback rendered (Suspense)');

  return (
    <div className="ml-4 flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-white text-gray-700">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GraduationCap className="w-16 h-16 text-blue-600 animate-bounce" />
        <h2 className="text-2xl font-bold">Preparing your journey to Italy{dots}</h2>
        <p className="text-md text-gray-500 max-w-md text-center">
          You're one step closer to your international study adventure 🇮🇹
        </p>

        <AnimatePresence>
          <motion.div
            className="mt-6 flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
            <span className="text-blue-600 font-medium">Loading your personalized experience...</span>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 relative w-64 h-3 rounded-full bg-blue-100 overflow-hidden">
          <motion.div
            className="absolute h-full bg-blue-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
          />
        </div>

        <motion.div
          className="mt-6 flex items-center text-sm text-green-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <Sparkles className="w-4 h-4 mr-1" />
          Tip: Use this time to imagine your first espresso in Rome ☕ 🇮🇹
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
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
          {/* {isMobile ? <BottomMenu /> : <PremiumSidebar />} */}
          <Suspense fallback={<LoadingFallback />}>
            {children}
          </Suspense>
          <Toaster position="bottom-center" />

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