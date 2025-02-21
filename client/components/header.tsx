'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs';
import MobileNav from './mobileNav';
import { DanteAlighieriLogo } from './SocialIcons';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../app/[lang]/LanguageContext';

type Language = 'en' | 'ar' | 'it';

type MenuItem = {
  [key: string]: string;
};

type MenuItems = {
  [K in Language]: MenuItem;
};

const menuItems: MenuItems = {
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
    services: 'Services'
  },
  ar: {
    imat: 'IMAT',
    tolc: 'TOLC',
    blog: 'مدونة',
    about: 'من نحن',
    universities: 'مواعيد الجامعات',
    apply: 'تقديم',
    soon: 'قريباً',
    programs: "ابحث عن تخصصك "  ,
    requirements: 'المتطلبات',
    services: 'الخدمات'
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
    services: 'Servizi'
  }
} as const;

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const { user } = useUser()

  // Sync language with URL on mount and pathname change
  useEffect(() => {
    const urlLang = pathname.split('/')[1] as Language;
    if (urlLang && ['en', 'ar', 'it'].includes(urlLang) && urlLang !== language) {
      setLanguage(urlLang);
      document.documentElement.dir = urlLang === 'ar' ? 'rtl' : 'ltr';
    }
  }, [pathname, language, setLanguage]);

  const isRTL = language === 'ar';
  const currentMenu = menuItems[language as Language] || menuItems.en;

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
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full 
                           transition-all duration-200 text-sm font-medium
                           hover:scale-105 transform backdrop-blur-sm">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8 rounded-full hover:scale-105 transform duration-200"
                      }
                    }}
                  />
                  <div className="text-sm text-center md:text-left">
                    <span> {user?.firstName || 'there'}!</span>
                  </div>
                </div>
              </SignedIn>
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
              {/* <div className="text-white font-poppins">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full 
                                   transition-all duration-200 text-sm font-medium
                                   hover:scale-105 transform backdrop-blur-sm">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8 rounded-full hover:scale-105 transform duration-200"
                      }
                    }}
                  />
                </SignedIn>
              </div> */}
            </div>
          </div>

          <div className="md:hidden">
            <MobileNav menuItems={menuItems} />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;