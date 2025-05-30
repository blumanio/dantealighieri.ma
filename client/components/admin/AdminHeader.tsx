// components/admin/AdminHeader.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User } from '@clerk/nextjs/server'; // For type
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, ChevronDown, LogOut, UserCircle, Settings, Menu as MenuIcon } from 'lucide-react'; // Added MenuIcon
import { useLanguage } from '@/context/LanguageContext';

interface AdminHeaderProps {
user: User | null;
  lang: string;
  onToggleMobileSidebar?: () => void; // For mobile
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ user, lang, onToggleMobileSidebar }) => {
  const { signOut } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut(() => router.push(`/${lang}`));
  };

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-30">
      {/* Mobile Hamburger */}
      <button onClick={onToggleMobileSidebar} className="text-textPrimary md:hidden p-2 -ml-2">
        <MenuIcon size={24} />
      </button>
      
      {/* Placeholder for search or breadcrumbs if needed on larger screens */}
      <div className="hidden md:block text-sm text-textSecondary">
        {/* Breadcrumbs or current section title could go here */}
      </div>

      <div className="flex items-center gap-4">
        <button className="text-textSecondary hover:text-primary relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 cursor-pointer p-1 rounded-md hover:bg-neutral-100"
          >
            <img
              src={user?.imageUrl || `https://ui-avatars.com/api/?name=${user?.firstName?.[0] || 'A'}&background=random&color=fff`}
              alt={user?.firstName || 'Admin'}
              className="w-8 h-8 rounded-full border-2 border-neutral-200"
            />
            <span className="hidden sm:inline text-sm font-medium text-textPrimary">
              {user?.firstName || 'Admin'}
            </span>
            <ChevronDown size={16} className={`text-textSecondary transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className={`absolute ${lang === 'ar' ? 'left-0' : 'right-0'} mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-neutral-200`}>
              <Link
                href={`/${lang}/profile`} // Link to user's main profile
                className="block px-4 py-2 text-sm text-textPrimary hover:bg-neutral-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <UserCircle size={16} className="inline mr-2 opacity-70" /> {t('adminHeader', 'viewProfile') || 'View Profile'}
              </Link>
              <Link
                href={`/${lang}/admin/settings`}
                className="block px-4 py-2 text-sm text-textPrimary hover:bg-neutral-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Settings size={16} className="inline mr-2 opacity-70" /> {t('adminHeader', 'adminSettings') || 'Admin Settings'}
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} className="inline mr-2 opacity-70" /> {t('adminHeader', 'signOut') || 'Sign Out'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;