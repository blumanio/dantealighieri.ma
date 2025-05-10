import { useLanguage } from "@/context/LanguageContext";
import { Translation } from "@/app/i18n/types";
import { SignInButton } from "@clerk/nextjs";
import { Calendar, ChevronDown, ChevronUp, Euro, ExternalLink, 
         Globe, GraduationCap, MapPin, Lock, School } from "lucide-react";

interface University {
  name: string;
  location: string;
  status: string;
  deadline?: string;
  admission_fee: number;
  cgpa_requirement: string;
  english_requirement?: string;
  intakes?: { name: string; start_date?: string; end_date?: string; notes?: string }[];
  application_link?: string;
}

interface UniversityCardProps {
  university: University;
  isSignedIn: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  t: any;
}

const UniversityCard = ({ university, isSignedIn, isExpanded, onToggle, t }: UniversityCardProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  if (!isSignedIn) {
    return (
      <div className="bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300">
        <div className="p-6">
          {/* Header */}
          <div className={`flex justify-between items-start gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h3 className="text-xl font-semibold text-primary mb-2">
                {university.name}
              </h3>
              <div className={`flex items-center gap-2 text-textSecondary ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MapPin className="h-4 w-4 text-primary/70" />
                <span>{university.location}</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium
              ${university.status === 'Open'
                ? 'bg-primary/10 text-primary'
                : 'bg-secondary/10 text-secondary'}`}
            >
              {t('universities', university.status.toLowerCase() as keyof Translation['universities'])}
            </span>
          </div>

          {/* Sign In Card */}
          <div className="mt-6">
            <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 
                         hover:border-primary/20 transition-all duration-300">
              <div className="flex flex-col items-center gap-6">
                <div className="p-4 bg-primary/10 rounded-full">
                  <School className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-3 text-center">
                  <h4 className="font-medium text-primary">
                    {t('universities', 'protectedContent')}
                  </h4>
                  <p className="text-sm text-textSecondary max-w-sm mx-auto">
                    {t('universities', 'loginPrompt')}
                  </p>
                </div>
                <SignInButton mode="modal">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary 
                                 hover:bg-primary-dark text-white font-medium rounded-full
                                 transition-all duration-300 hover:shadow-soft active:scale-95">
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
    <div className="bg-white rounded-xl shadow-soft hover:shadow-medium 
                  transition-all duration-300 group">
      <div className="p-6">
        {/* Header */}
        <div className={`flex justify-between items-start gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h3 className="text-xl font-semibold text-primary group-hover:text-primary-dark 
                       transition-colors duration-300 mb-2">
              {university.name}
            </h3>
            <div className={`flex items-center gap-2 text-textSecondary ${isRTL ? 'flex-row-reverse' : ''}`}>
              <MapPin className="h-4 w-4 text-primary/70" />
              <span>{university.location}</span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300
            ${university.status === 'Open'
              ? 'bg-primary/10 text-primary group-hover:bg-primary/20'
              : 'bg-secondary/10 text-secondary group-hover:bg-secondary/20'}`}
          >
            {t('universities', university.status.toLowerCase() as keyof Translation['universities'])}
          </span>
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Deadline */}
          <div className="bg-neutral-50 rounded-lg p-4 hover:bg-primary/5 
                       transition-colors duration-300">
            <div className={`flex items-center gap-2 text-textSecondary mb-2 
                         ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Calendar className="h-4 w-4 text-primary/70" />
              <span>{t('universities', 'deadline')}</span>
            </div>
            <p className={`font-medium text-primary ${isRTL ? 'text-right' : ''}`}>
              {university.intakes 
                ? university.intakes[university.intakes.length - 1].end_date || t('universities', 'tba') 
                : t('universities', 'tba')}
            </p>
          </div>

          {/* Fee */}
          <div className="bg-neutral-50 rounded-lg p-4 hover:bg-primary/5 
                       transition-colors duration-300">
            <div className={`flex items-center gap-2 text-textSecondary mb-2 
                         ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Euro className="h-4 w-4 text-primary/70" />
              <span>{t('universities', 'fee')}</span>
            </div>
            <p className={`font-medium text-primary ${isRTL ? 'text-right' : ''}`}>
              {university.admission_fee === 0
                ? <span className="text-secondary">{t('universities', 'free')}</span>
                : `€${university.admission_fee}`}
            </p>
          </div>
        </div>

        {/* Show More/Less Button */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 py-3 px-6
                   text-sm font-medium text-white bg-primary hover:bg-primary-dark 
                   rounded-full transition-all duration-300 hover:shadow-soft 
                   active:scale-95"
        >
          {isExpanded ? t('universities', 'showLess') : t('universities', 'showMore')}
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-neutral-200 p-6 bg-neutral-50">
          <div className="space-y-6">
            {/* Requirements */}
            <div className="bg-white rounded-lg p-6 shadow-soft hover:shadow-medium 
                         transition-all duration-300">
              <div className={`flex items-center gap-2 text-primary mb-4 
                           ${isRTL ? 'flex-row-reverse' : ''}`}>
                <GraduationCap className="h-5 w-5" />
                <span className="font-medium">{t('universities', 'requirements')}</span>
              </div>
              <div className="space-y-4">
                <div className={`flex items-center justify-between text-sm 
                             ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-textSecondary">CGPA:</span>
                  <span className="font-medium text-primary">{university.cgpa_requirement}</span>
                </div>
                {university.english_requirement && (
                  <div className={`flex items-center justify-between text-sm 
                               ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-textSecondary">English:</span>
                    <span className="font-medium text-primary">
                      {university.english_requirement}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Intakes */}
            {university.intakes && university.intakes.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-primary">
                  {t('universities', 'availableIntakes')}
                </h4>
                <div className="space-y-4">
                  {university.intakes.map((intake, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-6 shadow-soft hover:shadow-medium 
                             transition-all duration-300"
                    >
                      <h5 className="font-medium text-primary mb-4">{intake.name}</h5>
                      <div className="space-y-3">
                        {intake.start_date && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-textSecondary">{t('universities', 'start')}:</span>
                            <span className="font-medium text-primary">{intake.start_date}</span>
                          </div>
                        )}
                        {intake.end_date && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-textSecondary">{t('universities', 'end')}:</span>
                            <span className="font-medium text-primary">{intake.end_date}</span>
                          </div>
                        )}
                        {intake.notes && (
                          <div className="mt-4 text-sm bg-primary/5 text-primary rounded-lg p-3">
                            {intake.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Apply Button */}
            {university.application_link && (
              <a
                href={university.application_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 px-6 py-3 
                       bg-primary hover:bg-primary-dark text-white font-medium rounded-full
                       transition-all duration-300 hover:shadow-soft active:scale-95"
              >
                {t('universities', 'apply')}
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityCard;