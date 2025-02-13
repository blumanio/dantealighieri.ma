'use client'

import { useState, useEffect } from 'react'
import { Menu, X, GraduationCap, School, CalendarCheck, FileCheck, Globe2, Info, PenIcon, University } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { useLanguage } from '../app/[lang]/LanguageContext'

interface MobileNavProps {
  menuItems: {
    [key: string]: { [key: string]: string };
  };
}


const MobileNav: React.FC<MobileNavProps> = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { language, setLanguage } = useLanguage()

  const menu = [
    { name: 'universities', href: `/${language}/universities`, icon: School },
    { name: 'programs', href: `/${language}/program-search`, icon: GraduationCap },
    { name: 'IMAT', href: '/imat', icon: University },
    { name: 'TOLC', href: '/tolc', icon: University },

    { name: 'blog', href: '/blog', icon: PenIcon },
    { name: 'about', href: '/about', icon: Info },
    // { name: 'apply', href: '/', icon: CalendarCheck },
    // { name: 'requirements', href: '/', icon: FileCheck },
    // { name: 'services', href: '/', icon: Globe2 },

  ]
  const languageNames = {
    en: { ar: 'Arabic', en: 'English', it: 'Italian' },
    ar: { ar: 'عربي', en: 'الانجليزية', it: 'الايطالية' },
    it: { ar: 'Arabo', en: 'Inglese', it: 'Italiano' },
  }

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleLanguageChange = (selectedLanguage: 'en' | 'ar' | 'it') => {
    setLanguage(selectedLanguage)
    document.documentElement.dir = selectedLanguage === 'ar' ? 'rtl' : 'ltr'
  }

  if (!isMobile) return null

  return (
    <div className="fixed right-0 top-0 z-50 md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button
            onClick={toggleMenu}
            className="m-4 rounded-full bg-teal-700 p-2 shadow-lg transition-all hover:bg-teal-600 active:scale-95"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] bg-white p-0 sm:w-[400px]">
          <div className="flex flex-col h-full">
            <div className="flex flex-col items-center justify-center bg-teal-600 p-6 text-white">
              <SignedOut>
                <SignInButton>
                  <button className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-teal-700">
                    Student Login
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>

            <nav className="flex-grow p-6">
              {menu.map((item, index) => {
                const IconComponent = item.icon
                const itemName = menuItems[language]?.[item.name] || item.name
                return (
                  <Link
                    href={language !== 'en' ? `/${language}${item.href}` : item.href}
                    key={index}
                    className="flex items-center py-3 text-base text-teal-700 hover:bg-teal-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <IconComponent className="mr-3 h-5 w-5" />
                    {itemName}
                  </Link>
                )
              })}
            </nav>

            {/* <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-teal-700">Select Language</h3>
              <div className="flex flex-col">
                {Object.entries(languageNames[language]).map(([code, name]) => (
                  <button
                    key={code}
                    onClick={() => handleLanguageChange(code as 'en' | 'ar' | 'it')}
                    className={`px-4 py-2 border text-sm font-medium transition-colors ${language === code
                      ? 'bg-white text-teal-700 border-teal-700'
                      : 'bg-teal-700 text-white border-white'
                      }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div> */}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileNav
