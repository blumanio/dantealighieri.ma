import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import { SignInButton, useUser } from '@clerk/nextjs';
import { Lock, MapPin } from 'lucide-react';
import { useLanguage } from '@/app/[lang]/LanguageContext';

const LANGUAGE_CODES = {
  English: 'GB',
  Italian: 'IT',
};

interface Course {
  uni: string;
  comune: string;
  link: string;
  nome: string;
}
const ProgramRow = ({ course }: { course: Course }) => {
  const { isSignedIn } = useUser();
  const { language, t } = useLanguage()
  const isRTL = language === 'ar'

  if (!isSignedIn) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-6">
          <div className="flex justify-between items-start gap-4 mb-4">
            <div className="flex-1 text-left">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {course.uni}
              </h3>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{course.comune}</span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap bg-red-50 text-red-700 ring-1 ring-red-600/20">
              Restricted
            </span>
          </div>

          <p className="text-lg font-semibold text-gray-400">{course.nome}</p>

          <div className="mt-6 text-center">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-full">
                  <Lock className="h-6 w-6 text-gray-600" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">{t('universities', 'protectedContent')}</h4>
                  <p className="text-sm text-gray-600 max-w-sm mx-auto">
                    {t('programs', 'signInToAccess')}
                  </p>
                </div>
                <SignInButton mode="modal">
                  <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm">
                    {t('universities', 'login')}
                    <span className={`${isRTL ? 'rotate-180' : ''}`}>→</span>
                  </button>
                </SignInButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group mb-4 rounded-xl border border-gray-200 bg-white p-3 sm:p-5 shadow-sm transition-all duration-300 hover:border-indigo-100 hover:shadow-md">
      <span className="text-sm text-gray-500"> {t('programs', 'clickLink')}</span>
      <div className="flex items-center gap-2">
        <a
          href={course.link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-inter text-lg font-semibold text-indigo-700 decoration-2 hover:text-indigo-800 hover:underline"
        >
          {course.nome} ↗️
        </a>
      </div>
      <div className="flex items-center text-sm text-gray-600 mt-2">
        <MapPin className="h-4 w-4" />
        <span className="ml-1 font-medium">{course.comune}</span>
      </div>
      <div className="mt-3 text-gray-700 font-medium tracking-wide">
        🏛️ {course.uni}
      </div>
    </div>
  );
};

export default ProgramRow;
