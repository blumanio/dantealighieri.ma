'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs'; // Import useUser
import MobileNav from './mobileNav';
import { DanteAlighieriLogo } from './SocialIcons';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage, defaultLang } from '../context/LanguageContext';
// Removed unused imports: supportedLanguages, Lang type alias if not used elsewhere in this file

// menuItems definition remains the same as you provided
const menuItems = {
  en: {
    blog: 'Blog',
    imat: 'IMAT',
    tolc: 'TOLC',
    about: 'About',
    universities: 'Universities deadline',
    apply: 'Apply',
    soon: 'Soon',
    programs: 'Programs',
    requirements: 'Requirements',
    services: 'Services',
    home: 'Home',
    profile: 'Profile',
    signIn: 'Sign In',
    signUp: 'Sign Up',
  },
  ar: {
    imat: 'IMAT',
    tolc: 'TOLC',
    blog: 'مدونة',
    about: 'من نحن',
    universities: 'مواعيد الجامعات',
    apply: 'تقديم',
    soon: 'قريباً',
    programs: 'ابحث عن تخصصك',
    requirements: 'المتطلبات',
    services: 'الخدمات',
    home: 'الرئيسية',
    profile: 'الملف الشخصي',
    signIn: 'تسجيل الدخول',
    signUp: 'انشاء حساب',
  },
  it: {
    imat: 'IMAT',
    tolc: 'TOLC',
    blog: 'Blog',
    about: 'Chi Siamo',
    universities: 'Scadenze Universitarie',
    apply: 'Applica',
    soon: 'Presto',
    programs: 'Programmi',
    requirements: 'Requisiti',
    services: 'Servizi',
    home: 'Home',
    profile: 'Profilo',
    signIn: 'Accedi',
    signUp: 'Registrati',
  },
} as const;


const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { language } = useLanguage();
  const pathname = usePathname(); // Keep this if used, otherwise it can be removed

  const currentMenu = menuItems[language] || menuItems[defaultLang];
  const isRTL = language === 'ar';

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

  if (!language) return null; // Or a loading state for the language

  // Component to render the user avatar link, ensuring useUser is called correctly
  const UserProfileLink = () => {
    const { user } = useUser();

    if (!user) {
      // Optional: Show a placeholder while user data is loading within SignedIn
      return <div className="w-8 h-8 bg-gray-400 rounded-full animate-pulse"></div>;
    }

    return (
      <Link href={`/${language}/profile`} aria-label={currentMenu.profile || "View Profile"}>
        <img
          src={user.imageUrl}
          alt={user.fullName || user.username || currentMenu.profile || "User Profile"}
          className="w-9 h-9 rounded-full cursor-pointer hover:ring-2 hover:ring-teal-100/70 transition-all"
          // Adjust styling as needed to match UserButton or your design preference
        />
      </Link>
    );
  };

  return (
    <header
      className={`sticky font-poppins top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled
          ? 'bg-gradient-to-b from-teal-600/95 to-teal-700/95 backdrop-blur-md shadow-xl'
          : 'bg-gradient-to-b from-teal-600/85 to-teal-700/85'
        }`}
      role="banner"
    >
      <div className="container mx-auto px-4">
        <nav className="flex w-full items-center justify-between h-24" role="navigation" aria-label="Main navigation">
          <div className={`flex w-full items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* This div seems to be intentionally left empty as a spacer.
                If you want the logo to be on the far left and nav links/auth on the far right,
                you might need to adjust the overall flex layout of the parent `nav` or this `div`.
                For now, preserving its structure.
            */}
            <div className="text-white font-poppins">{/* Left side empty placeholder */}</div>

            <Link href={`/${language}`} className="flex items-center space-x-2 max-w-60" aria-label={currentMenu.home || "Home"}>
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
              <div className="flex items-center gap-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button
                      className="text-white hover:text-teal-100 transition-colors text-sm font-poppins
                                 tracking-wide hover:scale-105 transform duration-200 px-3 py-2 rounded-md
                                 border border-transparent hover:border-teal-200"
                      aria-label={currentMenu.signIn}
                    >
                      {currentMenu.signIn}
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserProfileLink />
                </SignedIn>
              </div>
            </div>

            <div className="md:hidden z-50">
              {/* Pass menuItems and language for MobileNav to construct links and get translations */}
              <MobileNav menuItems={menuItems[language] || menuItems[defaultLang]} currentLanguage={language} />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;