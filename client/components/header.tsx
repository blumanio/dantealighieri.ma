// app/components/Header.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs';
import MobileNav from './mobileNav';
import { DanteAlighieriLogo } from './SocialIcons';
import LanguageSwitcher from './LanguageSwitcher';
// Import Lang, supportedLanguages, and defaultLang from the context
import { useLanguage, supportedLanguages, defaultLang } from '../context/LanguageContext';
import type { Locale as Lang } from '@/app/i18n/types';


// Remove local 'Language' type definition
// type Language = 'en' | 'ar' | 'it';

type MenuItem = {
  [key: string]: string;
};

type MenuItems = {
  [K in Lang]: MenuItem; // Use Lang from context
};

// menuItems definition remains the same...
const menuItems: MenuItems = {
  en: { blog: 'Blog', imat: 'IMAT', tolc: 'TOLC', about: 'About', universities: 'Universities deadline', apply: 'Apply', soon: 'Soon', programs: 'Programs', requirements: 'Requirements', services: 'Services', home: 'Home', profile: 'Profile' },
  ar: { imat: 'IMAT', tolc: 'TOLC', blog: 'مدونة', about: 'من نحن', universities: 'مواعيد الجامعات', apply: 'تقديم', soon: 'قريباً', programs: "ابحث عن تخصصك", requirements: 'المتطلبات', services: 'الخدمات', home: 'الرئيسية', profile: 'الملف الشخصي' },
  it: { imat: 'IMAT', tolc: 'TOLC', blog: 'Blog', about: 'Chi Siamo', universities: 'Scadenze Universitarie', apply: 'Applica', soon: 'Presto', programs: 'Programmi', requirements: 'Requisiti', services: 'Servizi', home: 'Home', profile: 'Profilo' }
} as const;


const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage } = useLanguage(); // This should now work reliably
  const pathname = usePathname();
  //const { user } = useUser();

  useEffect(() => {
    // The LanguageProvider now sets the dir attribute.
    // This effect can be simplified or removed if the Provider handles it.
    // If kept, ensure it doesn't conflict.
    // For now, let's assume Provider handles it.
    // document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

    // The LanguageProvider is now initialized with the language from the URL.
    // This sync logic might only be needed as a fallback or if LanguageSwitcher changes language
    // and needs to ensure URL consistency (though Next.js routing usually handles this).
    const langFromPath = pathname?.split('/')[1];

    if (langFromPath && supportedLanguages.includes(langFromPath as Lang)) {
      if (langFromPath !== language) {
        // This might indicate a rare scenario or if LanguageSwitcher changes language
        // and the URL is updated by a different mechanism.
        // Generally, the language state from context (driven by initialLang from URL) should be primary.
        console.warn(`Header: Path language (${langFromPath}) and context language (${language}) mismatch. Consider centralizing URL sync.`);
        // setLanguage(langFromPath as Lang); // Be cautious with this to avoid loops
      }
    } else if (langFromPath && !supportedLanguages.includes(langFromPath as Lang)) {
      console.warn(`Header: Invalid language segment "${langFromPath}" in path. Context language: "${language}".`);
      // Routing or LanguageProvider should handle falling back to defaultLang.
    }
  }, [pathname, language, setLanguage]);

  const isRTL = language === 'ar';
  const currentMenu = menuItems[language] || menuItems[defaultLang]; // Use defaultLang as fallback

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationLinks = [
    { href: `/${language}/universities`, text: currentMenu.universities },
    { href: `/${language}/program-search`, text: currentMenu.programs },
    { href: `/${language}/imat`, text: currentMenu.imat },
    { href: `/${language}/tolc`, text: currentMenu.tolc },
    { href: `/${language}/blog`, text: currentMenu.blog },
    { href: `/${language}/about`, text: currentMenu.about },
  ];

  return (
    <header
      className={`sticky font-poppins top-0 left-0 right-0 z-50 transition-all duration-300 
        ${isScrolled
          ? 'bg-gradient-to-b from-teal-600/90 to-teal-700/90 backdrop-blur-sm shadow-lg'
          : 'bg-gradient-to-b from-teal-600/80 to-teal-700/80'
        }`}
      role="banner"
    >
      <div className="container mx-auto px-4">
        <nav className="flex w-full items-center justify-between h-24" role="navigation" aria-label="Main navigation">
          <div className={`flex w-full items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="text-white font-poppins">

            </div>

            <Link href={`/${language}`} className="flex items-center space-x-2 max-w-60" aria-label="Home">
              <DanteAlighieriLogo className="h-24 w-auto text-white" aria-hidden="true" />
            </Link>

            <div className={`hidden md:flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {navigationLinks.map(({ href, text }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-white hover:text-teal-100 transition-colors text-sm font-poppins
                                  tracking-wide hover:scale-105 transform duration-200"
                >
                  {text}
                </Link>
              ))}
              <LanguageSwitcher />
            </div>

            <div className="md:hidden z-50">
              {/* Pass current language and menu items to MobileNav if it needs them and doesn't use context itself */}
              <MobileNav menuItems={menuItems} />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;