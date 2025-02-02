'use client';

// app/[lang]/RootClientWrapper.tsx
import { LanguageProvider } from './LanguageContext';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ConstructionToast from '@/components/ConstructionToast';
import WhatsAppButton from '@/components/WhatsAppButton';
import HeroSection from '@/components/HeroSection';

type Lang = 'en' | 'it' | 'fr' | 'ar';

export default function RootClientWrapper({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: Lang;
}) {
  return (
    <LanguageProvider initialLang={lang}>
      <ConstructionToast />
      <Header />
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="mx-auto max-w-7xl px-4 py-2">
          <p className="text-center text-sm text-yellow-800">
            🚧 Website under development - Some features may not work as expected
            <span className="hidden md:inline"> | We're working to improve your experience</span>
          </p>
        </div>
      </div>    
      <HeroSection/>    
      {children}
      <Footer />
      <WhatsAppButton />
    </LanguageProvider>
  );
}