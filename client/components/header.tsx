'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import MobileNav from './mobileNav';
import { DanteAlighieriLogo } from './SocialIcons';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage, supportedLanguages, defaultLang } from '../context/LanguageContext';
import type { Locale as Lang } from '@/app/i18n/types';

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
  const pathname = usePathname();

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

  if (!language) return null;

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
            <div className="text-white font-poppins">{/* Left side empty placeholder */}</div>

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
                  <UserButton afterSignOutUrl={`/${language}`} />
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
