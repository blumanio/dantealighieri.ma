'use client';
import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ConstructionToast from '@/components/ConstructionToast';
import WhatsAppButton from '@/components/WhatsAppButton';
import { SupportedLanguage } from '@/app/config/i18n';
import HeroSection from './HeroSection';
import Services from './services';
import AboutFounder from './AboutFounder';
import { BlogNavigation } from './BlogNavigation';
import { getValidLanguage } from '@/app/config/i18n';

export default function ClientLayout({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: SupportedLanguage;
}) {
  console.log(`[ClientLayout_LOG] Rendering ClientLayout. Received lang prop: "${lang}"`);
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <ConstructionToast />
      <main className="flex-grow w-full pb-[56px]">
        <div className="transition-all duration-300 ease-in-out">
        <HeroSection />
          <Services />
          <AboutFounder />
          <BlogNavigation
            prevPost={null}
            nextPost={null}
            lang={getValidLanguage(lang)}
          />
        </div>
      </main>
      <WhatsAppButton />
      <div className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-[1001] loading-bar"></div>
    </div>
  );
}
