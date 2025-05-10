'use client'

import { useState, useEffect } from 'react'
import { Menu, X, GraduationCap, School, Globe, Info, PenIcon, University } from 'lucide-react'
import Link from 'next/link'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { useLanguage } from '@/context/LanguageContext'
import { usePathname } from 'next/navigation'

interface MobileNavProps {
  menuItems: {
    [key: string]: { [key: string]: string };
  };
}

const MobileNav: React.FC<MobileNavProps> = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { language, setLanguage } = useLanguage()
  const pathname = usePathname()
const { t } = useLanguage()
  const isRTL = language === 'ar'
  const menu = [
    { name: 'universities', href: `/universities`, icon: School },
    { name: 'programs', href: `/program-search`, icon: GraduationCap },
    { name: 'IMAT', href: '/imat', icon: University },
    { name: 'TOLC', href: '/tolc', icon: University },
    { name: 'blog', href: '/blog', icon: PenIcon },
    { name: 'about', href: '/about', icon: Info },
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

  const handleLanguageChange = (selectedLanguage: 'en' | 'ar' | 'it') => {
    if (selectedLanguage === language) {
      return
    }

    // Update direction
    document.documentElement.dir = selectedLanguage === 'ar' ? 'rtl' : 'ltr'

    // Update language state
    setLanguage(selectedLanguage)

    // Construct new path
    const newPath = `/${selectedLanguage}${pathname?.replace(/^\/[a-z]{2}/, '')}`

    // Close sheet
    setIsOpen(false)

    // Navigate to new path
    window.location.href = newPath
  }

  if (!isMobile) return null

  


  return (
    <div className="sticky top-0 right-0 z-50 md:hidden w-full">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button
            onClick={() => setIsOpen(!isOpen)}
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
            <div className="flex flex-col items-center justify-center gap-4 bg-teal-600 p-6 text-white">
              <SignedOut>
                <SignInButton mode="modal">
                <button className="inline-flex items-center gap-2 px-6 py-2.5
                    bg-teal-600 hover:bg-teal-700 
                    text-white font-medium rounded-lg
                    border-transparent sm:border-white
                    transition-colors duration-200 text-sm">
  {t('universities', 'login')}
  <span className={`${isRTL ? 'rotate-180' : ''}`}>→</span>
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

            <div className="border-t p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-teal-700">
                  <Globe className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {languageNames[language][language]}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(languageNames[language]).map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => handleLanguageChange(code as 'en' | 'ar' | 'it')}
                      className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors
                        ${language === code
                          ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-700'
                          : 'bg-white text-teal-700 ring-1 ring-gray-200 hover:ring-teal-700'
                        }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileNav