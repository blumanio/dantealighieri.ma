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
  <a href="https://wa.me/393519000615?text=Hi!%20I%20want%20to%20study%20in%20Italy.%20Can%20you%20help%3F"
    target="_blank"
    className="whatsapp-float"
    style={{
      position: 'fixed',
      width: '60px',
      height: '60px',
      bottom: '40px',
      right: '40px',
      backgroundColor: '#25d366',
      color: '#FFF',
      borderRadius: '50px',
      textAlign: 'center',
      fontSize: '30px',
      boxShadow: '2px 2px 3px #999',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
      transition: 'all 0.3s',
    }}
    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
          <svg width="35" height="35" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
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