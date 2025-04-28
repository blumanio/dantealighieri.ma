'use client';

import { LanguageProvider } from './LanguageContext';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ConstructionToast from '@/components/ConstructionToast';
import WhatsAppButton from '@/components/WhatsAppButton';
import HeroSection from '@/components/HeroSection';
import { Suspense } from 'react';
import ScrollToTop from '@/components/ScrollToTop';
import DomainChangePopup from '@/components/DomainChange';

type Lang = 'en' | 'it' | 'ar';

export default function RootClientWrapper({
    children,
    lang,
}: {
    children: React.ReactNode;
    lang: Lang;
}) {
    return (
        <Suspense 
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                    <div className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-soft">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-textPrimary font-medium">Loading language settings...</p>
                    </div>
                </div>
            }
        >
            <LanguageProvider initialLang={lang}>
                <div className="flex flex-col min-h-screen bg-neutral-50">
                    <ConstructionToast />
                    
                    {/* Header with sticky positioning */}
                    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-neutral-200">
                        <Header />
                    </div>

                    {/* Development Notice Banner */}
                    <div className="bg-primary/5 border-b border-primary/10">
                        <div className="mx-auto max-w-7xl px-4 py-2">
                            <p className="text-center text-sm text-primary flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                                    />
                                </svg>
                                <span>Website under development</span>
                                <span className="hidden md:inline text-primary/80">
                                    | We're working to improve your experience
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <main className="flex-grow">
                        <HeroSection />
                        <div className="transition-all duration-300 ease-in-out">
                            {children}
                        </div>
                    </main>

                    {/* Footer with decorative border */}
                    <div className="relative mt-auto">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10"></div>
                        <div className="bg-white">
                            <Footer />
                        </div>
                    </div>

                    {/* Floating Elements */}
                    <WhatsAppButton />
                    <ScrollToTop />
                    <DomainChangePopup/>

                    {/* Loading Bar */}
                    <div className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-50 loading-bar"></div>
                </div>
            </LanguageProvider>
        </Suspense>
    );
}