'use client';

import { useState, useEffect } from 'react';
import { Menu, X, GraduationCap, School, Globe, Info, PenIcon, University } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs'; // Import useUser
import { useLanguage } from '@/context/LanguageContext'; // Assuming defaultLang is also exported if needed
import { usePathname } from 'next/navigation';

interface MobileNavProps {
  // Assuming menuItems prop structure might need adjustment based on how it's passed from Header
  // If Header passes menuItems[language], then this should be: { [key: string]: string; }
  // If Header passes the full menuItems object, this is fine:
  menuItems: {
    [langKey: string]: { [itemKey: string]: string };
  };
  // currentLanguage prop as passed from the updated Header.tsx
  currentLanguage: 'en' | 'ar' | 'it';
}

const MobileNav: React.FC<MobileNavProps> = ({ menuItems, currentLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // This logic might be redundant if MobileNav is only rendered on mobile
  const { language, setLanguage, t } = useLanguage(); // t function for translations
  const pathname = usePathname();

  const isRTL = language === 'ar';

  // Get the menu for the current language, fallback to English
  const currentLangMenu = menuItems[language] || menuItems['en'];

  const menuStructure = [
    { nameKey: 'universities', href: `/universities`, icon: School },
    { nameKey: 'programs', href: `/program-search`, icon: GraduationCap },
    { nameKey: 'imat', href: '/imat', icon: University }, // 'IMAT' is likely the key in menuItems
    { nameKey: 'tolc', href: '/tolc', icon: University }, // 'TOLC' is likely the key in menuItems
    { nameKey: 'blog', href: '/blog', icon: PenIcon },
    { nameKey: 'about', href: '/about', icon: Info },
  ];

  const languageNames = {
    en: { ar: 'Arabic', en: 'English', it: 'Italian' },
    ar: { ar: 'عربي', en: 'الانجليزية', it: 'الايطالية' },
    it: { ar: 'Arabo', en: 'Inglese', it: 'Italiano' },
  };

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile(); // Initial check
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleLanguageChange = (selectedLanguage: 'en' | 'ar' | 'it') => {
    if (selectedLanguage === language) {
      setIsOpen(false); // Close sheet even if language is the same
      return;
    }
    document.documentElement.dir = selectedLanguage === 'ar' ? 'rtl' : 'ltr';
    setLanguage(selectedLanguage);
    const newPath = `/${selectedLanguage}${pathname?.replace(/^\/[a-z]{2}/, '') || '/'}`;
    setIsOpen(false);
    window.location.href = newPath; // Consider Next.js router.push for SPA-like navigation if preferred
  };

  // If MobileNav should only be rendered on mobile, parent component can handle this.
  // Otherwise, this check is fine.
  if (!isMobile && typeof window !== 'undefined') return null;


  // Component for rendering the user profile link within SignedIn context
  const UserProfileLinkMobile = () => {
    const { user } = useUser();

    if (!user) {
      // Placeholder for loading user state
      return (
        <div className="flex flex-col items-center text-center py-2">
          <div className="w-16 h-16 bg-teal-500 rounded-full animate-pulse mb-2"></div>
          <div className="h-4 bg-teal-500 rounded w-24 animate-pulse"></div>
        </div>
      );
    }

    return (
      <Link
        href={`/${language}/profile`}
        onClick={() => setIsOpen(false)} // Close sheet on click
        className="flex flex-col items-center text-center text-white hover:bg-teal-700/80 p-3 rounded-lg transition-colors w-full"
        aria-label={t('profile','profile') || "View Profile"} // Use t function for profile ARIA label
      >
        <img
          src={user.imageUrl}
          alt={user.fullName || user.username || t('profile','profile') || "User avatar"}
          className="w-16 h-16 rounded-full mb-2 border-2 border-white shadow-sm"
        />
        <span className="font-medium text-sm truncate max-w-full px-2">
          {user.fullName || user.username}
        </span>
        {/* Optionally show "View Profile" text if design allows */}
        {/* <span className="text-xs opacity-80">{t('profile','profile')}</span> */}
      </Link>
    );
  };


  return (
    // Removed "sticky top-0 right-0 z-50 md:hidden w-full" - typically SheetTrigger is placed in the header
    // This component is the Sheet itself, triggered from elsewhere (e.g., a hamburger icon in main Header)
    // Assuming this MobileNav is primarily the Sheet content.
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {/* The button that triggers this sheet is expected to be in the parent Header component */}
        {/* This button is an example if MobileNav also contains its own trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 md:hidden" // Only show on mobile, trigger for the sheet
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" /> // Assuming trigger is on a dark background like header
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>
      </SheetTrigger>
      <SheetContent side={isRTL ? "left" : "right"} className="w-[300px] bg-white p-0 sm:w-[320px] flex flex-col">
        {/* User/Auth Section at the Top */}
        <div className="flex flex-col items-center justify-center gap-2 bg-teal-600 p-4 text-white">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3
                                 bg-white/10 hover:bg-white/20
                                 text-white font-medium rounded-lg
                                 transition-colors duration-200 text-sm w-full">
                {t('profile', 'signIn')} {/* Using t() with 'profile' namespace */}
                <span className={`transform ${isRTL ? 'rotate-180' : ''} transition-transform`}>→</span>
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserProfileLinkMobile />
          </SignedIn>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow p-4 space-y-1">
          {menuStructure.map((item) => {
            const IconComponent = item.icon;
            // Use currentLangMenu to get translated item names
            const itemName = currentLangMenu?.[item.nameKey] || item.nameKey.charAt(0).toUpperCase() + item.nameKey.slice(1);
            return (
              <Link
                href={`/${language}${item.href}`} // Ensure language prefix is correctly applied
                key={item.nameKey}
                className="flex items-center py-3 px-3 text-base text-neutral-700 hover:bg-teal-50 hover:text-teal-700 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <IconComponent className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'} text-teal-600`} />
                {itemName}
              </Link>
            );
          })}
        </nav>

        {/* Language Switcher at the Bottom */}
        <div className="border-t p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-teal-700">
              <Globe className="h-5 w-5" />
              <span className="text-sm font-medium">
                {languageNames[language][language]} {/* Current selected language name */}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {/* Filter out the current language from the list of buttons */}
              {(Object.keys(languageNames) as Array<'en' | 'ar' | 'it'>)
                .filter(langCode => langCode !== language)
                .map((code) => (
                  <button
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors text-left flex items-center gap-2
                               bg-neutral-100 text-neutral-700 hover:bg-teal-50 hover:text-teal-700`}
                  >
                    {languageNames[language][code]} {/* Display language name in current UI language */}
                  </button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;