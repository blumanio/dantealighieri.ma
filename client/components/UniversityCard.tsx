import { useLanguage } from "@/app/[lang]/LanguageContext";
import { Translation } from "@/app/i18n/types";
import { SignInButton } from "@clerk/nextjs";
import { Calendar, ChevronDown, ChevronUp, Euro, ExternalLink, Globe, GraduationCap, MapPin, Lock } from "lucide-react";

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
    t: <T extends keyof Translation, K extends keyof Translation[T]>(section: T, key: K) => Translation[T][K];
}

const UniversityCard = ({ university, isSignedIn, isExpanded, onToggle, t }: UniversityCardProps) => {
    const { language } = useLanguage()
    const isRTL = language === 'ar'
    if (!isSignedIn) {
        return (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-6">
                    {/* Basic Header */}
                    <div className={`flex justify-between items-start gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {university.name}
                            </h3>
                            <div className={`flex items-center gap-2 text-gray-600 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <MapPin className="h-4 w-4" />
                                <span>{university.location}</span>
                            </div>
                        </div>
                        <span className={`
                            px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap
                            ${university.status === 'Open'
                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                                : 'bg-red-50 text-red-700 ring-1 ring-red-600/20'}
                        `}>
                            {t('universities', university.status.toLowerCase() as keyof Translation['universities'])}
                        </span>
                    </div>

                    {/* Sign In Card */}
                    <div className="mt-6 text-center">
                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-3 bg-gray-100 rounded-full">
                                    <Lock className="h-6 w-6 text-gray-600" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-medium text-gray-900">
                                        {t('universities', 'protectedContent')}
                                    </h4>
                                    <p className="text-sm text-gray-600 max-w-sm mx-auto">
                                        {t('universities', 'loginPrompt')}
                                    </p>
                                </div>
                                <SignInButton mode="modal">
                                    <button className="inline-flex items-center gap-2 px-6 py-2.5
                                                     bg-teal-600 hover:bg-teal-700 
                                                     text-white font-medium rounded-lg
                                                     transition-colors duration-200 text-sm">
                                        {t('universities', 'login')}
                                        <span className={`${isRTL ? 'rotate-180' : ''}`}>→</span>
                                    </button>
                                </SignInButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100">
            <div className="p-6">
                {/* Header with Status Badge */}
                <div className={`flex justify-between items-start gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {university.name}
                        </h3>
                        <div className={`flex items-center gap-2 text-gray-600 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <MapPin className="h-4 w-4" />
                            <span>{university.location}</span>
                        </div>
                    </div>
                    <span className={`
              px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap
              ${university.status === 'Open'
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                            : 'bg-red-50 text-red-700 ring-1 ring-red-600/20'}
            `}>
                        {t('universities', university.status.toLowerCase() as keyof Translation['universities'])}
                    </span>
                </div>

                {/* Key Information Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Deadline */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className={`flex items-center gap-2 text-gray-600 text-sm mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Calendar className="h-4 w-4" />
                            <span>{t('universities', 'deadline')}</span>
                        </div>
                        <p className={`font-medium ${!isSignedIn ? 'blur-sm' : ''} ${isRTL ? 'text-right' : ''}`}>
                            {university.deadline || t('universities', 'tba')}
                        </p>
                    </div>

                    {/* Fee */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className={`flex items-center gap-2 text-gray-600 text-sm mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Euro className="h-4 w-4" />
                            <span>{t('universities', 'fee')}</span>
                        </div>
                        <p className={`font-medium ${!isSignedIn ? 'blur-sm' : ''} ${isRTL ? 'text-right' : ''}`}>
                            {university.admission_fee === 0
                                ? <span className="text-emerald-600">{t('universities', 'free')}</span>
                                : `€${university.admission_fee}`
                            }
                        </p>
                    </div>
                </div>

                {/* Show More/Less Button */}
                <button
                    onClick={onToggle}
                    className="w-full flex items-center justify-center gap-2 py-2.5
                       text-sm font-medium text-white
                       bg-teal-600 hover:bg-teal-700 rounded-lg
                       transition-colors duration-200"
                >
                    {isExpanded
                        ? t('universities', 'showLess')
                        : t('universities', 'showMore')}
                    {isExpanded
                        ? <ChevronUp className="h-4 w-4" />
                        : <ChevronDown className="h-4 w-4" />}
                </button>

                {/* Sign In Prompt */}
                {!isSignedIn && (
                    <div className={`mt-4 rounded-lg bg-gray-50 p-4 border border-gray-200 
                            ${isRTL ? 'text-right' : 'text-center'}`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <SignInButton mode="modal">
                                <button className="inline-flex items-center gap-2 px-4 py-2 
                                   bg-teal-600 hover:bg-teal-700 
                                   text-white font-medium rounded-lg
                                   transition-colors duration-200">
                                    {t('universities', 'login')}
                                    <span className={`text-xs ${isRTL ? 'rotate-180' : ''}`}>→</span>
                                </button>
                            </SignInButton>
                            <span className="text-sm text-gray-600">
                                {t('universities', 'loginPrompt')}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t border-gray-100 p-6 bg-gray-50">
                    {/* Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* CGPA Requirements */}
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <div className={`flex items-center gap-2 text-gray-600 text-sm mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <GraduationCap className="h-4 w-4" />
                                <span>{t('universities', 'requirements')}</span> <span>GCPA</span>
                            </div>
                            <p className={`font-medium ${isRTL ? 'text-right' : ''}`}>
                                {university.cgpa_requirement}
                            </p>
                        </div>

                        {/* Apply Button */}
                        {/* {university.application_link && (
                            <a
                                href={university.application_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-6 py-4
                           bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg
                           transition-colors duration-200"
                            >
                                {t('universities', 'apply')}
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        )} */}
                    </div>
                    {/* Intakes Section */}
                    {university.intakes && university.intakes.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="font-medium text-gray-900">
                                {t('universities', 'availableIntakes')}
                            </h4>
                            <div className="space-y-3">
                                {university.intakes.map((intake, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-lg p-4 shadow-sm"
                                    >
                                        <h5 className="font-medium text-gray-900 mb-3">
                                            {intake.name}
                                        </h5>
                                        <div className="space-y-2">
                                            {intake.start_date && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">{t('universities', 'start')}:</span>
                                                    <span className="font-medium">{intake.start_date}</span>
                                                </div>
                                            )}
                                            {intake.end_date && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">{t('universities', 'end')}:</span>
                                                    <span className="font-medium">{intake.end_date}</span>
                                                </div>
                                            )}
                                            {intake.notes && (
                                                <div className="mt-3 text-sm text-teal-600 bg-teal-50 rounded-md p-2">
                                                    {intake.notes}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Action Button */}
                    {university.application_link && (
                        <a
                            href={university.application_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex w-full justify-center items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                        >
                            {t('universities', 'apply')}
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    )}
                </div>

            )}



        </div>
    )
}

export default UniversityCard


