import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import { SignInButton, useUser } from '@clerk/nextjs';
import { Lock, MapPin, ExternalLink, School, ArrowRight } from 'lucide-react';
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
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  if (!isSignedIn) {
    return (
      <div className="bg-white rounded-xl shadow-soft overflow-hidden border border-neutral-200 
                    hover:shadow-medium transition-all duration-300">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-primary mb-2 
                         line-clamp-2 hover:line-clamp-none transition-all duration-300">
                {course.uni}
              </h3>
              <div className="flex items-center gap-2 text-textSecondary text-sm">
                <MapPin className="h-4 w-4 text-primary/70" />
                <span>{course.comune}</span>
              </div>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                         bg-primary/10 text-primary whitespace-nowrap">
              <Lock className="h-3.5 w-3.5 mr-1" />
              Restricted
            </span>
          </div>

          {/* Course Name */}
          <p className="mt-4 text-lg font-semibold text-textSecondary line-clamp-2 
                     hover:line-clamp-none transition-all duration-300">
            {course.nome}
          </p>

          {/* Sign In Section */}
          <div className="mt-6">
            <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <School className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2 text-center">
                  <h4 className="font-medium text-primary">
                    {t('universities', 'protectedContent')}
                  </h4>
                  <p className="text-sm text-textSecondary max-w-sm mx-auto">
                    {t('programs', 'signInToAccess')}
                  </p>
                </div>
                <SignInButton mode="modal">
                  <button className="inline-flex items-center gap-2 px-6 py-2.5 
                                 bg-primary hover:bg-primary-dark text-white font-medium 
                                 rounded-full transition-all duration-300 text-sm
                                 hover:shadow-soft active:scale-95">
                    {t('universities', 'login')}
                    <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
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
    <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4 sm:p-6 
                  hover:shadow-medium transition-all duration-300 hover:border-primary/20 group">
      <div className="space-y-4">
        {/* Course Name and Link */}
        <div>
          <p className="text-sm text-textSecondary mb-2">
            {t('programs', 'clickLink')}
          </p>
          <a
            href={course.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-2 font-semibold text-lg 
                     text-primary hover:text-primary-dark transition-colors duration-300"
          >
            <span className="underline-offset-4 group-hover/link:underline">
              {course.nome}
            </span>
            <ExternalLink className="h-4 w-4 transform group-hover/link:translate-x-1 
                                 group-hover/link:-translate-y-1 transition-transform duration-300" />
          </a>
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-textSecondary">
          <MapPin className="h-4 w-4 text-primary/70 mr-2" />
          <span className="font-medium">{course.comune}</span>
        </div>

        {/* University */}
        <div className="flex items-center gap-2 text-textPrimary font-medium">
          <School className="h-5 w-5 text-primary/70" />
          <span className="group-hover:text-primary transition-colors duration-300">
            {course.uni}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgramRow;