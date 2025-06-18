'use client';

import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  GraduationCap,
  School,
  Globe,
  Info,
  PenIcon,
  University,
  User,
  Settings,
  LogOut,
  Star,
  ChevronRight,
  Bell,
  Mail,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SignedIn, SignedOut, SignInButton, useUser, SignOutButton } from '@clerk/nextjs';
import { useLanguage } from '@/context/LanguageContext';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface MobileNavProps {
  menuItems: {
    [langKey: string]: { [itemKey: string]: string };
  };
  currentLanguage: 'en' | 'ar' | 'it' | 'fr';
}

const MobileNav: React.FC<MobileNavProps> = ({ menuItems, currentLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'menu' | 'profile' | 'settings'>('menu');
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  const isRTL = language === 'ar';
  const currentLangMenu = menuItems[language] || menuItems['en'];

  const menuStructure = [
    { nameKey: 'home', href: `/`, icon: Home, isActive: pathname === `/${language}` },
    { nameKey: 'universities', href: `/universities`, icon: School, isActive: (pathname ?? '').includes('/universities') },
    { nameKey: 'programs', href: `/program-search`, icon: GraduationCap, isActive: (pathname ?? '').includes('/program-search') },
    { nameKey: 'imat', href: '/imat', icon: University, isActive: (pathname ?? '').includes('/imat') },
    { nameKey: 'tolc', href: '/tolc', icon: University, isActive: (pathname ?? '').includes('/tolc') },
    { nameKey: 'blog', href: '/blog', icon: PenIcon, isActive: (pathname ?? '').includes('/blog') },
    { nameKey: 'about', href: '/about', icon: Info, isActive: (pathname ?? '').includes('/about') },
  ];

  const profileMenuItems = [
    { nameKey: 'profile', href: `/profile`, icon: User },
    { nameKey: 'applications', href: `/profile/applications`, icon: GraduationCap },
    { nameKey: 'settings', href: `/profile/settings`, icon: Settings },
  ];

  type Locale = 'en' | 'ar' | 'it' | 'fr';

  const languageNames: Record<Locale, Record<Locale, string>> = {
    en: { ar: 'عربي', en: 'English', it: 'Italiano', fr: 'Français' },
    ar: { ar: 'عربي', en: 'English', it: 'Italiano', fr: 'Français' },
    it: { ar: 'عربي', en: 'English', it: 'Italiano', fr: 'Français' },
    fr: { ar: 'عربي', en: 'English', it: 'Italiano', fr: 'Français' }
  };

  const getInitials = (fullName?: string | null, firstName?: string | null, lastName?: string | null): string => {
    if (fullName) {
      const names = fullName.split(' ');
      if (names.length > 1 && names[0] && names[names.length - 1]) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      if (names[0]) {
        return names[0][0].toUpperCase();
      }
    }
    if (firstName && lastName && firstName[0] && lastName[0]) {
      return (firstName[0] + lastName[0]).toUpperCase();
    }
    if (firstName && firstName[0]) {
      return firstName[0].toUpperCase();
    }
    return 'U';
  };

  const handleLanguageChange = (selectedLanguage: Locale) => {
    if (selectedLanguage === language) {
      setIsOpen(false);
      return;
    }
    document.documentElement.dir = selectedLanguage === 'ar' ? 'rtl' : 'ltr';
    setLanguage(selectedLanguage);
    const newPath = `/${selectedLanguage}${pathname?.replace(/^\/[a-z]{2}/, '') || '/'}`;
    setIsOpen(false);
    router.push(newPath);
  };

  const closeSheet = () => {
    setIsOpen(false);
    setActiveSection('menu');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 lg:hidden rounded-lg hover:bg-white/10 transition-colors duration-200"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-6 w-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </SheetTrigger>

      <SheetContent
        side={isRTL ? "left" : "right"}
        className="w-full sm:w-[380px] p-0 bg-white dark:bg-gray-900 flex flex-col border-0 shadow-2xl"
      >
        {/* Header Section */}
        <div className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-blue-600 text-white">
          <div className="absolute inset-0 bg-black/10" />

          <SignedOut>
            <div className="relative p-6 text-center">
              <div className="mb-4">
                <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <User className="h-10 w-10 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Welcome!</h3>
              <p className="text-white/80 text-sm mb-4">Sign in to access your profile and applications</p>
              <SignInButton mode="modal">
                <Button
                  className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 backdrop-blur-sm"
                  onClick={closeSheet}
                >
                  {currentLangMenu?.signIn || 'Sign In'}
                </Button>
              </SignInButton>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="relative p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 ring-2 ring-white/20">
                    <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User avatar"} />
                    <AvatarFallback className="bg-white/20 text-white font-semibold text-lg">
                      {getInitials(user?.fullName, user?.firstName, user?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">
                    {user?.fullName || user?.firstName || "User"}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {user?.publicMetadata?.isAdmin ? "👑 Admin" : "✨ Free User"}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <button
                  className="flex-1 bg-white/10 hover:bg-white/20 rounded-lg p-3 text-center transition-colors duration-200 backdrop-blur-sm"
                  onClick={() => {
                    setActiveSection('profile');
                  }}
                >
                  <User className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">Profile</span>
                </button>
                <Link
                  href={`/${language}/profile/messaging`}
                  className="flex-1 bg-white/10 hover:bg-white/20 rounded-lg p-3 text-center transition-colors duration-200 backdrop-blur-sm"
                  onClick={closeSheet}
                >
                  <Mail className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">Messages</span>
                </Link>
                <Link
                  href={`/${language}/profile`}
                  className="flex-1 bg-white/10 hover:bg-white/20 rounded-lg p-3 text-center transition-colors duration-200 backdrop-blur-sm"
                  onClick={closeSheet}
                >
                  <Bell className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">Alerts</span>
                </Link>
              </div>
            </div>
          </SignedIn>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeSection === 'menu' && (
              <motion.div
                key="menu"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 space-y-2"
              >
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-3">
                    Navigation
                  </h4>
                  {menuStructure.map((item) => {
                    const IconComponent = item.icon;
                    const itemName = currentLangMenu?.[item.nameKey] || item.nameKey.charAt(0).toUpperCase() + item.nameKey.slice(1);

                    return (
                      <Link
                        href={`/${language}${item.href}`}
                        key={item.nameKey}
                        className={`
                          flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-200 group
                          ${item.isActive
                            ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 shadow-sm'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          }
                        `}
                        onClick={closeSheet}
                      >
                        <div className="flex items-center">
                          <div className={`
                            p-2 rounded-lg mr-3 transition-colors duration-200
                            ${item.isActive
                              ? 'bg-teal-100 dark:bg-teal-800/30 text-teal-600 dark:text-teal-400'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 group-hover:text-teal-600 dark:group-hover:text-teal-400'
                            }
                          `}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <span className="font-medium">{itemName}</span>
                        </div>
                        {item.isActive && (
                          <div className="h-2 w-2 bg-teal-500 rounded-full" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeSection === 'profile' && (
              <motion.div
                key="profile"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4"
              >
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => setActiveSection('menu')}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ChevronRight className={`h-5 w-5 text-gray-600 dark:text-gray-400 ${isRTL ? '' : 'rotate-180'}`} />
                  </button>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Profile & Settings</h4>
                </div>

                <div className="space-y-2">
                  {profileMenuItems.map((item) => {
                    const IconComponent = item.icon;
                    const itemName = currentLangMenu?.[item.nameKey] || item.nameKey.charAt(0).toUpperCase() + item.nameKey.slice(1);

                    return (
                      <Link
                        href={`/${language}${item.href}`}
                        key={item.nameKey}
                        className="flex items-center justify-between py-3 px-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group"
                        onClick={closeSheet}
                      >
                        <div className="flex items-center">
                          <div className="p-2 rounded-lg mr-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-200">
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <span className="font-medium">{itemName}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-teal-500 transition-colors duration-200" />
                      </Link>
                    );
                  })}

                  {/* Sign Out Button */}
                  <SignOutButton redirectUrl={`/${language}`}>
                    <button className="w-full flex items-center justify-between py-3 px-4 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg mr-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors duration-200">
                          <LogOut className="h-5 w-5" />
                        </div>
                        <span className="font-medium">Sign Out</span>
                      </div>
                    </button>
                  </SignOutButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50/50 dark:bg-gray-900/50">
          {/* Language Switcher */}
          <div className="mb-4">
            <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Language
            </h5>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(languageNames) as Array<Locale>)
                .map((code) => (
                  <button
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    className={`
                      rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 text-center
                      ${code === language
                        ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 ring-1 ring-teal-200 dark:ring-teal-800'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-700 dark:hover:text-teal-300 border border-gray-200 dark:border-gray-700'
                      }
                    `}
                  >
                    {languageNames[language][code]}
                  </button>
                ))}
            </div>
          </div>

          {/* App Info */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Dante Alighieri Academy
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Version 2.0
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;