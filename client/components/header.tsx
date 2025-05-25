'use client';

import React, { useEffect, useState, useRef } from 'react'; // Added useRef
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Ensure SignOutButton is imported
import { SignedIn, SignedOut, SignInButton, useUser, SignOutButton } from '@clerk/nextjs';
import MobileNav from './mobileNav';
import { DanteAlighieriLogo } from './SocialIcons';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage, defaultLang } from '../context/LanguageContext';

// menuItems definition - Add signOut if you haven't
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
    signOut: 'Sign Out', // Make sure this exists
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
    signOut: 'تسجيل الخروج', // Make sure this exists
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
    signOut: 'Esci', // Make sure this exists
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

  // Component to render the user avatar link with dropdown
  const UserProfileLink = () => {
    const { user } = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsDropdownOpen(false);
        }
      };
      if (isDropdownOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isDropdownOpen]);

    if (!user) {
      // This placeholder should still work if user data is loading
      return <div className="w-9 h-9 bg-gray-400 rounded-full animate-pulse"></div>;
    }

    return (
      <div className="relative" ref={dropdownRef}>
        {/* This is the clickable area for the avatar */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-label={currentMenu.profile || "User menu"}
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
          className="focus:outline-none" // Added for better focus state if needed
        >
          <img
            src={user.imageUrl} // This should display the profile picture
            alt={user.fullName || user.username || currentMenu.profile || "User Profile"}
            className="w-9 h-9 rounded-full cursor-pointer hover:ring-2 hover:ring-teal-100/70 transition-all"
          />
        </button>

        {isDropdownOpen && (
          <div
            className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[60] ring-1 ring-black ring-opacity-5 focus:outline-none`} // Increased z-index just in case
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu-button" // Assuming the button above could have an ID if needed, or remove if not strictly adhering to full ARIA pattern for simple cases
          >
            <Link
              href={`/${language}/profile`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              role="menuitem"
              onClick={() => setIsDropdownOpen(false)}
            >
              {currentMenu.profile}
            </Link>
            <SignOutButton
                signOutCallback={() => {
                    setIsDropdownOpen(false);
                    // Optional: redirect after sign out, e.g., router.push('/')
                }}
            >
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                {currentMenu.signOut || 'Sign Out'}
              </button>
            </SignOutButton>
          </div>
        )}
      </div>
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
          {/* Restoring your original flex structure */}
          <div className={`flex w-full items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="text-white font-poppins">{/* Left side empty placeholder - as in your original code */}</div>

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
              <div className="flex items-center gap-4"> {/* This div contains SignOut/In and UserProfileLink */}
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
                  {/* UserProfileLink is rendered here, now with dropdown logic */}
                  <UserProfileLink />
                </SignedIn>
              </div>
            </div>

            <div className="md:hidden z-50">
              <MobileNav menuItems={menuItems[language] || menuItems[defaultLang]} currentLanguage={language} />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;