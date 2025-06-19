'use client';

import { useState, useEffect } from 'react';
import {
  Home as HomeIcon,
  School,
  GraduationCap,
  User as UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext'
import { usePathname } from 'next/navigation';
import React from 'react';

interface MobileBottomNavProps {
  menuItems: {
    [key: string]: { [key: string]: string };
  };
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ menuItems }) => {
  const [isMobile, setIsMobile] = useState(true); // Default to mobile (mobile-first)
  const { language } = useLanguage();
  const pathname = usePathname();

  // Detect screen size (mobile-first: assume mobile by default, hide on desktop)
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const bottomMenu = [
    { name: 'home', href: `/${language}`, icon: HomeIcon },
    { name: 'universities', href: `/${language}/universities`, icon: School },
    { name: 'programs', href: `/${language}/program-search`, icon: GraduationCap },
    { name: 'profile', href: '/dashboard', icon: UserIcon },
  ];

  const isActivePath = (path: string) => {
    if (!pathname) return false;
    return pathname === path || pathname.startsWith(path);
  };

  if (!isMobile) return null; // Hide on desktop (≥ 768px)

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
      style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        transform: 'none', // Prevent stacking context issues
      }}
      data-testid="mobile-bottom-nav" // For debugging in dev tools
    >
      <div className="flex items-center justify-around h-14">
        {bottomMenu.map((item) => {
          const IconComponent = item.icon;
          const itemName = menuItems[language]?.[item.name] || item.name;
          const href =
            language !== 'en'
              ? `/${language}${item.href.replace(/^\/[a-z]{2}/, '')}`
              : item.href;
          const active = isActivePath(href);

          return (
            <Link
              key={item.name}
              href={href}
              className={`flex flex-col items-center justify-center w-full h-full 
                space-y-1 text-sm font-medium transition-colors duration-300
                ${
                  active
                    ? 'text-teal-700'
                    : 'text-gray-500 hover:text-teal-700'
                }`}
            >
              <IconComponent className="h-5 w-5" />
              <span className="text-xs">{itemName}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;