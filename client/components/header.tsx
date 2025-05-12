// app/components/Header.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'; // useUser removed as it's not directly used in this component after changes
import MobileNav from './mobileNav';
import { DanteAlighieriLogo } from './SocialIcons';
import LanguageSwitcher from './LanguageSwitcher';
// Import Lang, supportedLanguages, and defaultLang from the context
import { useLanguage, supportedLanguages, defaultLang } from '../context/LanguageContext';
import type { Locale as Lang } from '@/app/i18n/types';

// menuItems definition remains the same...
const menuItems = {
  en: { blog: 'Blog', imat: 'IMAT', tolc: 'TOLC', about: 'About', universities: 'Universities deadline', apply: 'Apply', soon: 'Soon', programs: 'Programs', requirements: 'Requirements', services: 'Services', home: 'Home', profile: 'Profile', signIn: 'Sign In', signUp: 'Sign Up' },
  ar: { imat: 'IMAT', tolc: 'TOLC', blog: 'مدونة', about: 'من نحن', universities: 'مواعيد الجامعات', apply: 'تقديم', soon: 'قريباً', programs: "ابحث عن تخصصك", requirements: 'المتطلبات', services: 'الخدمات', home: 'الرئيسية', profile: 'الملف الشخصي', signIn: 'تسجيل الدخول', signUp: 'انشاء حساب' },
  it: { imat: 'IMAT', tolc: 'TOLC', blog: 'Blog', about: 'Chi Siamo', universities: 'Scadenze Universitarie', apply: 'Applica', soon: 'Presto', programs: 'Programmi', requirements: 'Requisiti', services: 'Servizi', home: 'Home', profile: 'Profilo', signIn: 'Accedi', signUp: 'Registrati' }
} as const;


type MenuItem = {
  [key: string]: string;
};

type MenuItems = {
  [K in Lang]: MenuItem;
};


const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { language } = useLanguage(); // setLanguage removed as it's not directly used after reviewing the useEffect
  const pathname = usePathname();

  useEffect(() => {
    const langFromPath = pathname?.split('/')[1];

    if (langFromPath && supportedLanguages.includes(langFromPath as Lang)) {
      if (langFromPath !== language) {
        console.warn(`Header: Path language (${langFromPath}) and context language (${language}) mismatch. Context should be source of truth after init.`);
        // The LanguageProvider should ensure the context language is set based on the URL at initialization.
        // Subsequent changes via LanguageSwitcher update the context and should trigger a route change.
        // Direct setLanguage here based on path could conflict with context's role.
      }
    } else if (langFromPath && !supportedLanguages.includes(langFromPath as Lang)) {
      console.warn(`Header: Invalid language segment "${langFromPath}" in path. Context language: "${language}".`);
    }
  }, [pathname, language]);

  const isRTL = language === 'ar';
  const currentMenu = menuItems[language] || menuItems[defaultLang];

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
          ? 'bg-gradient-to-b from-teal-600/95 to-teal-700/95 backdrop-blur-md shadow-xl' // Slightly increased opacity and blur
          : 'bg-gradient-to-b from-teal-600/85 to-teal-700/85' // Slightly increased opacity
        }`}
      role="banner"
    >
      <div className="container mx-auto px-4">
        <nav className="flex w-full items-center justify-between h-24" role="navigation" aria-label="Main navigation">
          <div className={`flex w-full items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Left side placeholder - can be used for additional branding or kept empty */}
            <div className="text-white font-poppins">
              {/* Intentionally empty or for future use */}
            </div>

            <Link href={`/${language}`} className="flex items-center space-x-2 max-w-60" aria-label="Home">
              <DanteAlighieriLogo className="h-24 w-auto text-white" aria-hidden="true" />
            </Link>

            <div className={`hidden md:flex items-center gap-6 lg:gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
              <div className="flex items-center gap-4"> {/* Added a div to group auth buttons if needed, for styling consistency */}
                <SignedOut>
                  <SignInButton mode="modal">
                    <button
                      className="text-white hover:text-teal-100 transition-colors text-sm font-poppins
                                       tracking-wide hover:scale-105 transform duration-200 px-3 py-2 rounded-md
                                       border border-transparent hover:border-teal-200" // Added subtle border on hover for button feel
                      aria-label={currentMenu.signIn}
                    >
                      {currentMenu.signIn}
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton
                    afterSignOutUrl={typeof window !== 'undefined' ? `/${language}` : '/'}
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-9 h-9 ring-2 ring-white/50 hover:ring-white transition-all", // Example custom styling
                        userButtonPopoverCard: "bg-teal-700 border-teal-600 shadow-lg",
                        userButtonPopoverLink: "text-white hover:bg-teal-600",
                        userButtonPopoverActions: "text-white",
                        userButtonPopoverFooter: "hidden" // Example: hide footer
                      }
                    }}
                  />
                </SignedIn>
              </div>
            </div>

            <div className="md:hidden z-50">
              <MobileNav menuItems={menuItems} />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;  