'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import MobileNav from './mobileNav'
import { DanteAlighieriLogo } from './SocialIcons'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '../app/[lang]/LanguageContext'

// Improved type definitions with strict typing
type Language = 'en' | 'ar' | 'it';

// Convert MenuItem to an index signature type
type MenuItem = {
  [key: string]: string;
};

type MenuItems = {
  [K in Language]: MenuItem;
};

const menuItems: MenuItems = {
  en: {
    about: 'About',
    universities: 'Universities deadline',
    apply: 'Apply',
    soon: 'Soon',
    programs: 'Programs',
    requirements: 'Requirements',
    services: 'Services'
  },
  ar: {
    about: 'حول',
    universities: 'مواعيد الجامعات',
    apply: 'تقديم',
    soon: 'قريباً',
    programs: 'البرامج',
    requirements: 'المتطلبات',
    services: 'الخدمات'
  },
  it: {
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
  const [isScrolled, setIsScrolled] = useState(false)
  const { language = 'en' } = useLanguage()
  const isRTL = language === 'ar'
  const currentMenu = menuItems[language as Language] || menuItems.en

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigationLinks = [
    { href: '/about', text: currentMenu.about },
    { href: `/${language}/services`, text: currentMenu.universities },
  ]

  return (
    <header
      className={` top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gradient-to-b from-teal-600/80 to-teal-700/80' : 'bg-gradient-to-b from-teal-600/80 to-teal-700/80'
        }`}
      role="banner"
    >
      <div className="container mx-auto px-4">
        <nav className="flex w-full items-center justify-between h-24" role="navigation" aria-label="Main navigation">
          <div className={`flex w-full items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link href="/" className="flex items-center space-x-2" aria-label="Home">
              <DanteAlighieriLogo className="h-12 w-auto text-white" aria-hidden="true" />
            </Link>

            <div className={`hidden md:flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {navigationLinks.map(({ href, text }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-white hover:text-teal-100 transition-colors"
                >
                  {text}
                </Link>
              ))}

              <div className="relative">
                <button
                  className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full transition-colors backdrop-blur-sm"
                  aria-label={`${currentMenu.apply} (${currentMenu.soon})`}
                >
                  {currentMenu.apply}
                  <span
                    className={`absolute -top-3 ${isRTL ? 'left-0' : 'right-0'
                      } bg-teal-500 text-white text-xs px-2 py-0.5 rounded-full`}
                    aria-hidden="true"
                  >
                    {currentMenu.soon}
                  </span>
                </button>
              </div>

              <LanguageSwitcher />

              <div className="text-white">
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <MobileNav menuItems={menuItems} />
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header