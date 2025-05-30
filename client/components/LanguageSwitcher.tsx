import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext'
import { usePathname, useRouter } from 'next/navigation';

type Locale = 'en' | 'ar' | 'it' | 'fr';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const languageNames: Record<Locale, Record<Locale, string>> = {
    en: {
      ar: 'Arabic',
      en: 'English',
      it: 'Italian',
      fr: 'French',
    },
    ar: {
      ar: 'عربي',
      en: 'الانجليزية',
      it: 'الايطالية',
      fr: 'الفرنسية',
    },
    it: {
      ar: 'Arabo',
      en: 'Inglese',
      it: 'Italiano',
      fr: 'Francese',
    },
    fr: {
      ar: 'Arabe',
      en: 'Anglais',
      it: 'Italien',
      fr: 'Français',
    }
  };

  const handleLanguageChange = (selectedLanguage: 'en' | 'ar' | 'fr' | 'it') => {
    if (selectedLanguage === language) {
      setIsOpen(false);
      return;
    }

    // Update direction
    document.documentElement.dir = selectedLanguage === 'ar' ? 'rtl' : 'ltr';

    // Update language state
    setLanguage(selectedLanguage);

    // Construct new path
    const newPath = `/${selectedLanguage}${window.location.pathname.replace(/^\/[a-z]{2}/, '')}`;

    // Close dropdown
    setIsOpen(false);

    // Log the navigation
    console.log('Navigating to:', newPath);

    // Use window.location for a full page navigation
    window.location.href = newPath;
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm text-teal-700 ring-1 ring-gray-200 hover:ring-teal-700 transition-colors duration-150"
        aria-label="Select language"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="h-4 w-4 text-teal-700" />
        <span>{languageNames[language][language]}</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-full rounded-lg shadow-lg z-10">
          {Object.entries(languageNames[language]).map(([code, name]) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code as Locale)}
              className={`w-full px-3 py-2 text-sm bg-white ${language === code ? 'text-teal-700 font-medium' : 'text-teal-700'
                } hover:bg-gray-50 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;