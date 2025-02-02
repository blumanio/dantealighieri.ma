'use client'

import React from 'react'
import { Globe } from 'lucide-react'
import { useLanguage } from '../app/[lang]/LanguageContext'

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage()
  const languageNames = {
    en: {
      ar: 'Arabic',
      en: 'English',
      it: 'Italian',
    },
    ar: {
      ar: 'عربي',
      en: 'الانجليزية',
      it: 'الايطالية',
    },
    it: {
      ar: 'Arabo',
      en: 'Inglese',
      it: 'Italiano',
    },
  }

  const handleLanguageChange = (selectedLanguage: 'en' | 'ar' | 'it') => {
    console.log(selectedLanguage, 'selectedLanguage')
    setLanguage(selectedLanguage)
    document.documentElement.dir = selectedLanguage === 'ar' ? 'rtl' : 'ltr'
  }

  return (
    <div className="relative group">
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm text-teal-700 ring-1 ring-gray-200 hover:ring-teal-700 transition-colors duration-150"
        aria-label="Select language"
      >
        <Globe className="h-4 w-4 text-teal-700" />
        <span>{languageNames[language][language]}</span>
      </button>

      <div className="absolute top-full mt-1 w-40 bg-white rounded-lg shadow-sm ring-1 ring-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50">
        {Object.entries(languageNames[language]).map(([code, name]) => (
          <button
            key={code}
            onClick={() => handleLanguageChange(code as 'en' | 'ar' | 'it')}
            className={`w-full px-3 py-2 text-sm bg-white ${language === code ? 'text-teal-700 font-medium' : 'text-teal-700'} hover:underline first:rounded-t-lg last:rounded-b-lg`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default LanguageSwitcher
