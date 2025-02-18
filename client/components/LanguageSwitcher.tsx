import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../app/[lang]/LanguageContext';
import { usePathname, useRouter } from 'next/navigation';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

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
  };

  const handleLanguageChange = (selectedLanguage: 'en' | 'ar' | 'it') => {
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

      <div 
        className={`absolute top-full mt-1 w-40 bg-white rounded-lg shadow-sm ring-1 ring-gray-200 transition-all duration-200 ${
          isOpen 
            ? 'opacity-100 visible translate-y-0' 
            : 'opacity-0 invisible -translate-y-2'
        } z-50`}
      >
        {Object.entries(languageNames[language]).map(([code, name]) => (
          <button
            key={code}
            onClick={() => handleLanguageChange(code as 'en' | 'ar' | 'it')}
            className={`w-full px-3 py-2 text-sm bg-white ${
              language === code ? 'text-teal-700 font-medium' : 'text-teal-700'
            } hover:bg-gray-50 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;