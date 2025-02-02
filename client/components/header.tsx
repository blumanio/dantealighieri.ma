'use client'

import React from 'react'
import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import MobileNav from './mobileNav'
import { DanteAlighieriLogo } from './SocialIcons.js'
import LanguageSwitcher from './LanguageSwitcher'  // Import LanguageSwitcher
import { useLanguage } from '../app/[lang]/LanguageContext'

type Language = 'en' | 'ar' | 'it'

interface MenuItem {
  about: string
  universities: string
  apply: string
  soon: string
  [key: string]: string
}

interface MenuItems {
  [key: string]: MenuItem
}

interface LanguageNames {
  [key: string]: {
    [key: string]: string
  }
}

const defaultLanguage: Language = 'en' // Default language should be 'en'

const menuItems: MenuItems = {
  en: {
    about: 'About',
    universities: 'Universities deadline',
    apply: 'Apply',
    soon: 'Soon',
  },
  ar: {
    about: 'حول',
    universities: 'مواعيد الجامعات',
    apply: 'تقديم',
    soon: 'قريباً',
  },
  it: {
    about: 'Chi Siamo',
    universities: 'Scadenze Universitarie',
    apply: 'Applica',
    soon: 'Presto',
  },
}

const Header: React.FC = () => {
  // Ensure the default language is set to 'en' when useLanguage() returns undefined
  const { language = defaultLanguage } = useLanguage() || { language: defaultLanguage }

  const currentLanguage = language
  const isRTL = currentLanguage === 'ar'

  const currentMenu = menuItems[currentLanguage] || menuItems[defaultLanguage]

  return (
    <header className="sticky top-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <nav className="flex w-full items-center justify-between">
          <div className={`flex w-full items-center justify-between h-20 md:h-24 px-4 md:px-8 lg:px-12 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link href="/" className="font-heading text-2xl font-bold text-teal-700 flex-shrink-0">
              <DanteAlighieriLogo className="logo h-14 md:h-16" />
            </Link>

            <div className={`hidden md:flex items-center gap-6 lg:gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link href="/about" className="text-slate-700 hover:text-teal-600 whitespace-nowrap">
                {currentMenu.about}
              </Link>

              <Link href={`/${language}/services`} className="text-red-600 relative animate-pulse font-semibold whitespace-nowrap">
                {currentMenu.universities}
              </Link>

              <div className="relative whitespace-nowrap">
                <Link href="" className="flex items-center rounded bg-gray-400 px-5 py-2 text-white opacity-70 cursor-not-allowed pointer-events-none transition-colors">
                  {currentMenu.apply}
                </Link>
                <span className={`absolute -top-3 ${isRTL ? 'left-0' : 'right-0'} bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full animate-pulse`}>
                  {currentMenu.soon}
                </span>
              </div>

              {/* Language Switcher */}
              <LanguageSwitcher />
              
              <div className="text-slate-700 transition-colors hover:text-teal-600">
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
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
