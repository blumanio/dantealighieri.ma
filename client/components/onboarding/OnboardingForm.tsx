'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Locale, Translation } from '@/app/i18n/types';
import { ChevronLeft, ChevronRight, Check, Search, X, User, Users, BookMarked, GraduationCap, School, Loader2 } from 'lucide-react';

// --- INTERFACES ---
interface FormData {
    userType: 'student' | 'parent' | '';
    countryOfOrigin: string;
    mobileNumber: string;
    currentEducationLevel: 'school' | 'bachelor' | 'master' | '';
    graduationYear: string;
    desiredDegreeLevel: string;
    targetCities: string[];
    allCities: boolean;
    academicAreas: string[];
    allAcademicAreas: boolean;
    targetUniversities: string[];
    allUniversities: boolean;
}

interface Country {
    code: string;
    name: string;
    flag: string;
    phoneCode: string;
}

interface SearchableItem {
    id: string;
    name: string;
    description?: string;
}

interface SelectableOption {
    id: 'school' | 'bachelor' | 'master';
    name: string;
    description: string;
    icon: React.ElementType;
}

// --- CONSTANTS ---
const COUNTRIES: Country[] = [
    { code: 'MA', name: 'Morocco', flag: '🇲🇦', phoneCode: '+212' },
    { code: 'AL', name: 'Algeria', flag: '🇩🇿', phoneCode: '+213' },
    { code: 'TN', name: 'Tunisia', flag: '🇹🇳', phoneCode: '+216' },
    { code: 'LY', name: 'Libya', flag: '🇱🇾', phoneCode: '+218' },
    { code: 'EG', name: 'Egypt', flag: '🇪🇬', phoneCode: '+20' },
    // { code: 'IT', name: 'Italy', flag: '🇮🇹', phoneCode: '+39' },
    // { code: 'FR', name: 'France', flag: '🇫🇷', phoneCode: '+33' },
    // { code: 'ES', name: 'Spain', flag: '🇪🇸', phoneCode: '+34' },
    // { code: 'NL', name: 'Netherlands', flag: '🇳🇱', phoneCode: '+31' },
    // { code: 'IN', name: 'India', flag: '🇮🇳', phoneCode: '+91' },
];

const CURRENT_EDUCATION_LEVELS: SelectableOption[] = [
    { id: 'school', name: 'High School', description: 'Currently studying or recently graduated', icon: School },
    { id: 'bachelor', name: 'Bachelor\'s Degree', description: '3-4 year undergraduate program', icon: GraduationCap },
    { id: 'master', name: 'Master\'s Degree', description: '1-2 year graduate program', icon: BookMarked }
];

const DESIRED_DEGREE_LEVELS = [
    { id: 'bachelor', name: 'Bachelor\'s Degree', description: 'Undergraduate program (3-4 years)' },
    { id: 'master', name: 'Master\'s Degree', description: 'Graduate program (1-2 years)' },
    { id: 'phd', name: 'PhD/Doctorate', description: 'Doctoral program (3-7 years)' }
];

const ACADEMIC_AREAS: SearchableItem[] = [
    { id: '01', name: 'Mathematics and Computer Science' },
    { id: '02', name: 'Physical Sciences' },
    { id: '03', name: 'Chemical Sciences' },
    { id: '04', name: 'Earth Sciences' },
    { id: '05', name: 'Biological Sciences' },
    { id: '06', name: 'Medical Sciences' },
    { id: '07', name: 'Agricultural and Veterinary Sciences' },
    { id: '08', name: 'Civil Engineering and Architecture' },
    { id: '09', name: 'Industrial and Information Engineering' },
    { id: '10', name: 'Ancient, Philological-Literary and Historical-Artistic Sciences' },
    { id: '11', name: 'Historical, Philosophical, Pedagogical and Psychological Sciences' },
    { id: '12', name: 'Legal Sciences' },
    { id: '13', name: 'Economic and Statistical Sciences' },
    { id: '14', name: 'Political and Social Sciences' }
];

const MOCK_DATA = {
    academicAreas: ACADEMIC_AREAS,
    universities: [
        { id: 'harvard', name: 'Harvard University', description: 'Cambridge, MA, USA' },
        { id: 'mit', name: 'MIT', description: 'Cambridge, MA, USA' },
        { id: 'stanford', name: 'Stanford University', description: 'Stanford, CA, USA' },
        { id: 'oxford', name: 'University of Oxford', description: 'Oxford, England, UK' },
    ],
    cities: [
        { id: 'london', name: 'London', description: 'United Kingdom' },
        { id: 'newyork', name: 'New York', description: 'United States' },
        { id: 'paris', name: 'Paris', description: 'France' },
        { id: 'berlin', name: 'Berlin', description: 'Germany' },
    ]
};

const STEPS = [
    { id: 'profile', title: 'About You', description: 'Tell us about yourself' },
    { id: 'contact', title: 'Contact Info', description: 'How can we reach you?' },
    { id: 'currentEducation', title: 'Current Education', description: 'Your academic background' },
    { id: 'desiredDegree', title: 'Desired Degree', description: 'What you want to study in Italy' },
    { id: 'preferences', title: 'Study Preferences', description: 'Your study goals and interests' }
];

// --- COMPONENT ---
export default function OnboardingForm({ dictionary, lang }: { dictionary: Translation; lang: Locale }) {
    const router = useRouter();
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        userType: '',
        countryOfOrigin: '',
        mobileNumber: '',
        currentEducationLevel: '',
        graduationYear: '',
        desiredDegreeLevel: '',
        targetCities: [],
        allCities: false,
        academicAreas: [],
        allAcademicAreas: false,
        targetUniversities: [],
        allUniversities: false,
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [isManualYear, setIsManualYear] = useState(false);

    // Search states
    const [countrySearch, setCountrySearch] = useState('');
    const [universitySearch, setUniversitySearch] = useState('');
    const [citySearch, setCitySearch] = useState('');

    const [universityResults, setUniversityResults] = useState<SearchableItem[]>([]);
    const [cityResults, setCityResults] = useState<SearchableItem[]>([]);
    const [isSearching, setIsSearching] = useState('');

    const searchAPI = async (query: string, type: 'universities' | 'cities'): Promise<SearchableItem[]> => {
        setIsSearching(type);
        await new Promise(resolve => setTimeout(resolve, 300));
        setIsSearching('');
        if (!query) return [];
        return MOCK_DATA[type].filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            if (universitySearch.trim()) searchAPI(universitySearch, 'universities').then(setUniversityResults)
            else setUniversityResults([])
        }, 300);
        return () => clearTimeout(handler);
    }, [universitySearch]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (citySearch.trim()) searchAPI(citySearch, 'cities').then(setCityResults)
            else setCityResults([])
        }, 300);
        return () => clearTimeout(handler);
    }, [citySearch]);

    const getSelectedCountry = (): Country | undefined => {
        return COUNTRIES.find(country => country.code === formData.countryOfOrigin);
    };

    const filteredCountries = COUNTRIES.filter(country =>
        country.name.toLowerCase().includes(countrySearch.toLowerCase())
    );

    const clearError = (field: keyof FormData) => {
        if (errors[field]) setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    };

    const validateCurrentStep = (): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        switch (currentStep) {
            case 0:
                if (!formData.userType) newErrors.userType = 'Please select if you are a student or parent.';
                break;
            case 1:
                if (!formData.countryOfOrigin) newErrors.countryOfOrigin = 'Please select your country.';
                if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Please enter your mobile number.';
                break;
            case 2:
                if (!formData.currentEducationLevel) newErrors.currentEducationLevel = 'Please select your current education level.';
                if (!formData.graduationYear.trim()) newErrors.graduationYear = 'Please provide your graduation year.';
                break;
            case 3:
                if (!formData.desiredDegreeLevel) newErrors.desiredDegreeLevel = 'Please select your desired degree level.';
                break;
            case 4:
                if (!formData.allCities && formData.targetCities.length === 0) newErrors.targetCities = 'Please select at least one city or choose to be open to any.';
                if (!formData.allAcademicAreas && formData.academicAreas.length === 0) newErrors.academicAreas = 'Please select at least one area or choose to be open to any.';
                break;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateCurrentStep()) setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    };

    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateCurrentStep()) return;

        setLoading(true);

        // --- Helper function to get full object details from IDs ---
        const getFullObjects = (ids: string[], type: keyof typeof MOCK_DATA) => {
            return ids.map(id => {
                const item = MOCK_DATA[type].find(i => i.id === id);
                return { id: item?.id || id, name: item?.name || id };
            }).filter(item => item.id && item.name); // Ensure valid items
        };

        const countryInfo = COUNTRIES.find(c => c.code === formData.countryOfOrigin);

        // --- Prepare the rich payload for the backend ---
        const submissionData = {
            ...formData,
            countryOfOrigin: {
                id: countryInfo?.code || formData.countryOfOrigin,
                name: countryInfo?.name || formData.countryOfOrigin
            },
            targetCities: getFullObjects(formData.targetCities, 'cities'),
            targetUniversities: getFullObjects(formData.targetUniversities, 'universities'),
            academicAreas: getFullObjects(formData.academicAreas, 'academicAreas'),
        };

        try {
            // --- First API Call: Update user metadata ---
            const onboardingResponse = await fetch('/api/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });

            if (!onboardingResponse.ok) {
                throw new Error('Failed to save onboarding data');
            }

            // --- Second API Call: Join communities ---
            const membershipResponse = await fetch('/api/memberships', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Send the same rich data to the memberships API
                body: JSON.stringify(submissionData),
            });

            if (!membershipResponse.ok) {
                // This is not a critical error, so we can just log it or show a mild toast
                console.warn('Could not automatically join communities.');
            }

            toast({
                title: 'Welcome aboard!',
                description: 'Your profile has been created successfully.',
            });
            router.push(`/${lang}/dashboard`);
        } catch (error) {
            console.error('Onboarding submission failed', error);
            toast({
                title: 'Something went wrong',
                description: 'Please try again in a moment.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const addSelection = (field: 'targetCities' | 'academicAreas' | 'targetUniversities', item: SearchableItem) => {
        const currentItems = formData[field];
        if (currentItems.length < 3 && !currentItems.includes(item.id)) {
            setFormData(prev => ({ ...prev, [field]: [...currentItems, item.id] }));
            clearError(field as keyof FormData);
        }
        if (field === 'targetCities') setCitySearch('');
        if (field === 'targetUniversities') setUniversitySearch('');
    };

    const removeSelection = (field: 'targetCities' | 'academicAreas' | 'targetUniversities', itemId: string) => {
        setFormData(prev => ({ ...prev, [field]: (prev[field]).filter(id => id !== itemId) }));
    };

    const getItemName = (itemId: string, type: keyof typeof MOCK_DATA): string => {
        // The check here prevents the crash. If MOCK_DATA[type] is undefined, it won't proceed.
        const dataList = MOCK_DATA[type];
        if (!dataList) {
            console.error(`getItemName failed: No data found for type "${type}"`);
            return itemId; // Return the ID as a fallback
        }
        const item = dataList.find(i => i.id === itemId);
        return item?.name || itemId;
    };

    // --- RENDER FUNCTIONS FOR STEPS ---

    const renderUserTypeStep = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{STEPS[0].title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{STEPS[0].description}</p>
            </div>
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">I am a...</label>
                <div className="space-y-3">
                    {[{ id: 'student', icon: User, title: 'Student', description: 'Looking for educational opportunities' }, { id: 'parent', icon: Users, title: 'Parent', description: 'Helping my child find the right path' }].map((option) => (
                        <label key={option.id} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${formData.userType === option.id ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 bg-white hover:border-gray-300 dark:bg-gray-800 dark:border-gray-600'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0 ${formData.userType === option.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-700'}`}><option.icon className="w-6 h-6" /></div>
                            <div className="flex-1">
                                <h3 className={`font-semibold ${formData.userType === option.id ? 'text-orange-900 dark:text-orange-100' : 'text-gray-900 dark:text-gray-100'}`}>{option.title}</h3>
                                <p className={`text-sm ${formData.userType === option.id ? 'text-orange-700 dark:text-orange-200' : 'text-gray-500 dark:text-gray-400'}`}>{option.description}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ml-4 shrink-0 ${formData.userType === option.id ? 'border-orange-500 bg-orange-500' : 'border-gray-300 dark:border-gray-500'}`}>
                                {formData.userType === option.id && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <input type="radio" value={option.id} checked={formData.userType === option.id} onChange={(e) => { setFormData(p => ({ ...p, userType: e.target.value as any })); clearError('userType'); }} className="sr-only" />
                        </label>
                    ))}
                </div>
                {errors.userType && <p className="text-sm text-red-500 dark:text-red-400 mt-2">{errors.userType}</p>}
            </div>
        </div>
    );

    const renderContactStep = () => {
        const selectedCountry = getSelectedCountry();
        return (
            <div className="space-y-6">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{STEPS[1].title}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{STEPS[1].description}</p>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country</label>
                        <div className="relative">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input type="text" placeholder="Search countries..." value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            {countrySearch && (
                                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                    {filteredCountries.map((country) => (
                                        <button key={country.code} type="button" onClick={() => { setFormData(p => ({ ...p, countryOfOrigin: country.code })); setCountrySearch(''); clearError('countryOfOrigin'); }} className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3">
                                            <span className="text-xl">{country.flag}</span>
                                            <span className="font-medium">{country.name}</span>
                                            <span className="text-sm text-gray-500 ml-auto">{country.phoneCode}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {selectedCountry && (
                            <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center gap-3">
                                <span className="text-xl">{selectedCountry.flag}</span>
                                <span className="font-medium text-orange-900 dark:text-orange-100">{selectedCountry.name}</span>
                                <button type="button" onClick={() => setFormData(p => ({ ...p, countryOfOrigin: '' }))} className="ml-auto text-orange-600 hover:text-orange-800"><X className="w-4 h-4" /></button>
                            </div>
                        )}
                        {errors.countryOfOrigin && <p className="text-sm text-red-500 dark:text-red-400 mt-2">{errors.countryOfOrigin}</p>}
                    </div>
                    {selectedCountry && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mobile Number</label>
                            <div className="flex">
                                <div className="flex items-center px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-xl">
                                    <span className="text-sm mr-2">{selectedCountry.flag}</span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{selectedCountry.phoneCode}</span>
                                </div>
                                <input type="tel" value={formData.mobileNumber} onChange={(e) => { setFormData(p => ({ ...p, mobileNumber: e.target.value })); clearError('mobileNumber'); }} placeholder="123 456 7890" className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:bg-gray-700 dark:text-white" />
                            </div>
                            {errors.mobileNumber && <p className="text-sm text-red-500 dark:text-red-400 mt-2">{errors.mobileNumber}</p>}
                        </div>
                    )}
                </div>
            </div>
        )
    };

    const renderCurrentEducationStep = () => {
        const thisYear = new Date().getFullYear();
        const lastYear = thisYear - 1;
        return (
            <div className="space-y-6">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{STEPS[2].title}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{STEPS[2].description}</p>
                </div>
                <div className="space-y-3">
                    {CURRENT_EDUCATION_LEVELS.map((option) => (
                        <label key={option.id} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${formData.currentEducationLevel === option.id ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 bg-white hover:border-gray-300 dark:bg-gray-800 dark:border-gray-600'}`}>
                            <option.icon className={`w-6 h-6 mr-4 shrink-0 ${formData.currentEducationLevel === option.id ? 'text-orange-600' : 'text-gray-500'}`} />
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{option.name}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{option.description}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ml-4 shrink-0 ${formData.currentEducationLevel === option.id ? 'border-orange-500 bg-orange-500' : 'border-gray-300 dark:border-gray-500'}`}>
                                {formData.currentEducationLevel === option.id && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <input type="radio" value={option.id} checked={formData.currentEducationLevel === option.id} onChange={(e) => { setFormData(prev => ({ ...prev, currentEducationLevel: e.target.value as any })); clearError('currentEducationLevel'); }} className="sr-only" />
                        </label>
                    ))}
                </div>
                {errors.currentEducationLevel && <p className="text-sm text-red-500 dark:text-red-400">{errors.currentEducationLevel}</p>}

                {formData.currentEducationLevel && (
                    <div className="space-y-4 pt-4 animate-in fade-in duration-300">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Graduation Year</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Button type="button" variant={formData.graduationYear === String(thisYear) && !isManualYear ? 'default' : 'outline'} onClick={() => { setFormData(p => ({ ...p, graduationYear: String(thisYear) })); setIsManualYear(false); clearError('graduationYear'); }}>{thisYear} (This Year)</Button>
                            <Button type="button" variant={formData.graduationYear === String(lastYear) && !isManualYear ? 'default' : 'outline'} onClick={() => { setFormData(p => ({ ...p, graduationYear: String(lastYear) })); setIsManualYear(false); clearError('graduationYear'); }}>{lastYear} (Last Year)</Button>
                        </div>
                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div><span className="flex-shrink mx-4 text-xs text-gray-400">OR</span><div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div>
                            <input type="number" placeholder="Enter year, e.g., 2021" disabled={!isManualYear} value={isManualYear ? formData.graduationYear : ''} onChange={(e) => { setFormData(p => ({ ...p, graduationYear: e.target.value })); clearError('graduationYear'); }} className="w-full px-4 py-2.5 rounded-lg bg-neutral-50 border border-neutral-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 transition-all duration-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:border-gray-600" />
                            {!isManualYear && <button type="button" onClick={() => { setIsManualYear(true); setFormData(p => ({ ...p, graduationYear: '' })); }} className="text-sm text-orange-600 hover:underline mt-2 w-full text-center">Graduated earlier?</button>}
                        </div>
                        {errors.graduationYear && <p className="text-sm text-red-500 dark:text-red-400">{errors.graduationYear}</p>}
                    </div>
                )}
            </div>
        );
    };

    const renderDesiredDegreeStep = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{STEPS[3].title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{STEPS[3].description}</p>
            </div>
            <div className="space-y-3">
                {DESIRED_DEGREE_LEVELS.map((degree) => (
                    <label key={degree.id} className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${formData.desiredDegreeLevel === degree.id ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 bg-white hover:border-gray-300 dark:bg-gray-800 dark:border-gray-600'}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 mt-0.5 shrink-0 ${formData.desiredDegreeLevel === degree.id ? 'border-orange-500 bg-orange-500' : 'border-gray-300 dark:border-gray-500'}`}>
                            {formData.desiredDegreeLevel === degree.id && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{degree.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{degree.description}</p>
                        </div>
                        <input type="radio" value={degree.id} checked={formData.desiredDegreeLevel === degree.id} onChange={(e) => { setFormData(prev => ({ ...prev, desiredDegreeLevel: e.target.value })); clearError('desiredDegreeLevel'); }} className="sr-only" />
                    </label>
                ))}
            </div>
            {errors.desiredDegreeLevel && <p className="text-sm text-red-500 dark:text-red-400">{errors.desiredDegreeLevel}</p>}
        </div>
    );

    const renderPreferencesStep = () => {
        // Corrected configuration array
        const preferenceFields = [
            { type: 'academicAreas', dataKey: 'academicAreas', label: 'Academic Area of Interest', placeholder: 'Select an area...' },
            { type: 'targetCities', dataKey: 'cities', label: 'Target Cities', placeholder: 'Search for cities...' },
            { type: 'targetUniversities', dataKey: 'universities', label: 'Target Universities', placeholder: 'Search for universities...', optional: true }
        ];

        return (
            <div className="space-y-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{STEPS[4].title}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{STEPS[4].description}</p>
                </div>
                {preferenceFields.map(pref => (
                    <div key={pref.type} className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {pref.label} <span className="text-gray-400 font-normal">(up to 3{pref.optional && ', optional'})</span>
                        </label>
                        {pref.type === 'academicAreas' ? (
                            <div className="relative">
                                <select value="" onChange={(e) => { const id = e.target.value; if (id) { const item = ACADEMIC_AREAS.find(a => a.id === id); if (item) addSelection('academicAreas', item); } }} disabled={formData.allAcademicAreas || formData.academicAreas.length >= 3} className="w-full px-4 py-2.5 rounded-lg bg-neutral-50 border border-neutral-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:border-gray-600">
                                    <option value="" disabled>{pref.placeholder}</option>
                                    {ACADEMIC_AREAS.map(area => (<option key={area.id} value={area.id} disabled={formData.academicAreas.includes(area.id)}>{area.name}</option>))}
                                </select>
                            </div>
                        ) : (
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                <input type="text" placeholder={pref.placeholder} value={{ 'targetCities': citySearch, 'targetUniversities': universitySearch }[pref.type] as string} onChange={(e) => ({ 'targetCities': setCitySearch, 'targetUniversities': setUniversitySearch }[pref.type] as Function)(e.target.value)} disabled={formData[`all${pref.type.charAt(0).toUpperCase() + pref.type.slice(1)}` as keyof FormData] as boolean} className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-neutral-50 border border-neutral-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:border-gray-600" />
                                {isSearching === pref.type && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-500" />}
                            </div>
                        )}
                        {pref.type !== 'academicAreas' && ({ 'targetCities': citySearch, 'targetUniversities': universitySearch }[pref.type]) && (
                            <div className="relative w-full">
                                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                    {({ 'targetCities': cityResults, 'targetUniversities': universityResults }[pref.type])?.map((item: SearchableItem) => (<button key={item.id} type="button" onClick={() => addSelection(pref.type as any, item)} className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700"><span className="font-medium text-sm">{item.name}</span>{item.description && <span className="text-xs text-gray-500">{item.description}</span>}</button>))}
                                </div>
                            </div>
                        )}
                        <div className="flex flex-wrap gap-2 pt-1 min-h-[30px]">
                            {(formData[pref.type as keyof FormData] as string[]).map((id) => (<div key={id} className="flex items-center bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 text-sm font-medium px-3 py-1 rounded-full animate-in fade-in">
                                {getItemName(id, pref.dataKey as keyof typeof MOCK_DATA)}
                                <button type="button" onClick={() => removeSelection(pref.type as any, id)} className="ml-2 text-orange-500 hover:text-orange-700"><X className="w-3 h-3" /></button></div>)
                            )}
                        </div>
                        <label htmlFor={`all${pref.type}`} className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id={`all${pref.type}`} className="sr-only peer" checked={formData[`all${pref.type.charAt(0).toUpperCase() + pref.type.slice(1)}` as keyof FormData] as boolean} onChange={(e) => { clearError(pref.type as keyof FormData); setFormData(p => ({ ...p, [`all${pref.type.charAt(0).toUpperCase() + pref.type.slice(1)}`]: e.target.checked, [pref.type]: [] })) }} />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">I'm open to any {pref.type.replace(/([A-Z])/g, ' $1').toLowerCase().replace('target ', '')}</span>
                        </label>
                        {errors[pref.type as keyof FormData] && <p className="text-sm text-red-500 dark:text-red-400 mt-2">{errors[pref.type as keyof FormData]}</p>}
                    </div>
                ))}
            </div>
        );
    }


    const stepRenderers = [renderUserTypeStep, renderContactStep, renderCurrentEducationStep, renderDesiredDegreeStep, renderPreferencesStep];

    return (
        <div className="w-full max-w-2xl mx-auto p-4 sm:p-0">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2 px-1">
                    {STEPS.map((step, index) => (
                        <div key={step.id} className={`flex-1 text-center text-xs sm:text-sm font-semibold ${currentStep >= index ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            {step.title}
                        </div>
                    ))}
                </div>
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }} />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl">
                {stepRenderers[currentStep]()}
                <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <Button type="button" variant="ghost" onClick={prevStep} disabled={currentStep === 0}>
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                    </Button>
                    {currentStep < STEPS.length - 1 ? (
                        <Button type="button" onClick={nextStep}>
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button type="submit" disabled={loading} size="lg">
                            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting</> : 'Finish & Create Profile'}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}