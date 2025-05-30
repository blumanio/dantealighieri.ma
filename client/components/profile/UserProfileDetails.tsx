'use client';

import React, { useState, useEffect, FormEvent }
    from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import {
    UserCircle, Mail, Phone, Calendar as CalendarIcon, Globe, Home, ShieldCheck, Briefcase,
    GraduationCap, BookOpen, Edit3, Save, AlertCircle, CheckCircle, PlusCircle, Trash2,
    Languages, FileText, Award, MapPin, UserSquare2, Heart, Loader2, Building, Users, AtSign,
    KeyRound, Info // Added some more icons for completeness
} from 'lucide-react';

// --- Types (Ideally, move these to a shared types file) ---
interface CustomPersonalData {
    firstName?: string; // Added to match frontend expectations if Clerk data isn't primary
    lastName?: string;  // Added to match frontend expectations
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    countryOfResidence?: string;
    streetAddress?: string;
    city?: string;
    stateProvince?: string;
    postalCode?: string;
    addressCountry?: string;
    passportNumber?: string;
    passportExpiryDate?: string;
    emergencyContactName?: string;
    emergencyContactRelationship?: string;
    emergencyContactPhone?: string;
    emergencyContactEmail?: string;
}

interface EducationEntry {
    id: string; // for list key, can be uuid
    institutionName?: string;
    institutionCountry?: string;
    institutionCity?: string;
    degreeName?: string;
    fieldOfStudy?: string;
    graduationYear?: string;
    graduationMonth?: string;
    gpa?: string;
    gradingScale?: string;
}

interface LanguageProficiency {
    isNativeEnglishSpeaker?: 'yes' | 'no' | '';
    testTaken?: 'TOEFL' | 'IELTS' | 'Duolingo' | 'Cambridge' | 'Other' | '';
    overallScore?: string;
    testDate?: string;
}

interface StandardizedTest {
    id: string; // for list key
    testName?: string;
    score?: string;
    dateTaken?: string;
}

interface CustomEducationalData {
    highestLevelOfEducation?: 'High School' | "Associate's Degree" | "Bachelor's Degree" | "Master's Degree" | "Doctorate (PhD)" | 'Other' | '';
    previousEducation?: EducationEntry[];
    languageProficiency?: LanguageProficiency;
    otherStandardizedTests?: StandardizedTest[];
}

interface UserProfileDetailsProps {
    t: (namespace: string, key: string, options?: any) => string;
    lang: string;
}

// --- Initial Empty States ---
const initialPersonalData: CustomPersonalData = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    countryOfResidence: '',
    streetAddress: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    addressCountry: '',
    passportNumber: '',
    passportExpiryDate: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',
};

const initialEducationalData: CustomEducationalData = {
    highestLevelOfEducation: '',
    previousEducation: [{ id: Date.now().toString(), institutionName: '', institutionCountry: '', degreeName: '', fieldOfStudy: '', graduationYear: '' }], // Start with one empty entry with required fields for display
    languageProficiency: { isNativeEnglishSpeaker: '', testTaken: '', overallScore: '', testDate: '' },
    otherStandardizedTests: [],
};


// --- Actual API functions ---
const fetchActualCustomProfileData = async (): Promise<{ personal: CustomPersonalData, education: CustomEducationalData }> => {
    const response = await fetch('/api/user-profile-details');
    if (!response.ok) {
        const errorResult = await response.json().catch(() => ({ message: 'Failed to fetch profile data and parse error.' }));
        throw new Error(errorResult.message || 'Failed to fetch profile data');
    }
    const result = await response.json();
    if (result.success && result.data) {
        return {
            personal: result.data.personalData || { ...initialPersonalData },
            education: {
                highestLevelOfEducation: result.data.educationalData?.highestLevelOfEducation || initialEducationalData.highestLevelOfEducation,
                previousEducation: (result.data.educationalData?.previousEducation?.length > 0 ? result.data.educationalData.previousEducation : initialEducationalData.previousEducation),
                languageProficiency: result.data.educationalData?.languageProficiency || { ...initialEducationalData.languageProficiency },
                otherStandardizedTests: result.data.educationalData?.otherStandardizedTests || initialEducationalData.otherStandardizedTests,
            }
        };
    } else if (result.success && !result.data) { // Case where user has no profile data yet (API should ideally always return a structure)
        return {
            personal: { ...initialPersonalData },
            education: { ...initialEducationalData }
        };
    }
    throw new Error(result.message || 'Failed to fetch profile data (unexpected structure)');
};

const saveActualCustomProfileData = async (
    data: { personal?: CustomPersonalData, education?: CustomEducationalData }
): Promise<{ success: boolean; message: string; data?: any }> => {
    const response = await fetch('/api/user-profile-details', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to save profile data');
    }
    return result;
};


// --- Main Component ---
const UserProfileDetails: React.FC<UserProfileDetailsProps> = ({ t, lang }) => {
    const { user, isLoaded } = useUser();

    const [customPersonalData, setCustomPersonalData] = useState<CustomPersonalData>({ ...initialPersonalData });
    const [customEducationalData, setCustomEducationalData] = useState<CustomEducationalData>({ ...initialEducationalData });

    const [isLoadingCustomData, setIsLoadingCustomData] = useState(true);
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingEducation, setIsEditingEducation] = useState(false);
    const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        if (isLoaded && user?.id) {
            setIsLoadingCustomData(true);
            fetchActualCustomProfileData()
                .then(data => {
                    setCustomPersonalData(prev => ({ ...prev, ...data.personal }));
                    // Ensure Clerk's first/last name are used if available and not yet in custom data
                    if (user.firstName && !data.personal.firstName) {
                        setCustomPersonalData(prev => ({ ...prev, firstName: user.firstName! }));
                    }
                    if (user.lastName && !data.personal.lastName) {
                        setCustomPersonalData(prev => ({ ...prev, lastName: user.lastName! }));
                    }
                    setCustomEducationalData(prev => ({
                        ...prev,
                        ...data.education,
                        // Ensure previousEducation is an array, even if empty from API, default to one empty item for the form
                        previousEducation: (data.education.previousEducation && data.education.previousEducation.length > 0)
                            ? data.education.previousEducation
                            : [{ id: Date.now().toString(), institutionName: '', institutionCountry: '', degreeName: '', fieldOfStudy: '', graduationYear: '' }],
                        languageProficiency: data.education.languageProficiency || { ...initialEducationalData.languageProficiency },
                        otherStandardizedTests: data.education.otherStandardizedTests || [],
                    }));
                })
                .catch(err => {
                    console.error("Failed to load custom data:", err.message);
                    setSaveStatus({ type: 'error', message: t('profile', 'errorLoadingCustomData') });
                    setCustomPersonalData({ ...initialPersonalData, firstName: user.firstName || '', lastName: user.lastName || '' });
                    setCustomEducationalData({ ...initialEducationalData });
                })
                .finally(() => setIsLoadingCustomData(false));
        } else if (isLoaded && !user) {
            setIsLoadingCustomData(false);
            setCustomPersonalData({ ...initialPersonalData });
            setCustomEducationalData({ ...initialEducationalData });
        }
    }, [isLoaded, user, t]); // user object itself as dependency

    const handlePersonalDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setCustomPersonalData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleEducationalDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'highestLevelOfEducation') {
            setCustomEducationalData(prev => ({ ...prev, highestLevelOfEducation: value as CustomEducationalData['highestLevelOfEducation'] }));
        }
    };

    const handleLanguageProficiencyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCustomEducationalData(prev => ({
            ...prev,
            languageProficiency: {
                ...(prev.languageProficiency || initialEducationalData.languageProficiency),
                [name]: value,
            } as LanguageProficiency
        }));
    };

    const handleEducationEntryChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const updatedEntries = [...(customEducationalData.previousEducation || [])];
        updatedEntries[index] = { ...updatedEntries[index], id: updatedEntries[index].id || Date.now().toString(), [name]: value };
        setCustomEducationalData(prev => ({ ...prev, previousEducation: updatedEntries }));
    };

    const addEducationEntry = () => {
        setCustomEducationalData(prev => ({
            ...prev,
            previousEducation: [
                ...(prev.previousEducation || []),
                { id: Date.now().toString(), institutionName: '', institutionCountry: '', degreeName: '', fieldOfStudy: '', graduationYear: '' } // Add all required fields for a new entry
            ]
        }));
    };

    const removeEducationEntry = (index: number) => {
        setCustomEducationalData(prev => ({
            ...prev,
            previousEducation: (prev.previousEducation || []).filter((_, i) => i !== index)
        }));
    };

    const handleStandardizedTestChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const updatedTests = [...(customEducationalData.otherStandardizedTests || [])];
        updatedTests[index] = { ...updatedTests[index], id: updatedTests[index].id || Date.now().toString(), [name]: value };
        setCustomEducationalData(prev => ({ ...prev, otherStandardizedTests: updatedTests }));
    };

    const addStandardizedTest = () => {
        setCustomEducationalData(prev => ({
            ...prev,
            otherStandardizedTests: [...(prev.otherStandardizedTests || []), { id: Date.now().toString(), testName: '', score: '', dateTaken: '' }]
        }));
    };

    const removeStandardizedTest = (index: number) => {
        setCustomEducationalData(prev => ({
            ...prev,
            otherStandardizedTests: (prev.otherStandardizedTests || []).filter((_, i) => i !== index)
        }));
    };

    const handleSavePersonalData = async (e: FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;
        setIsLoadingCustomData(true);
        setSaveStatus(null);
        try {
            const result = await saveActualCustomProfileData({ personal: customPersonalData });
            setSaveStatus({ type: result.success ? 'success' : 'error', message: result.message || (result.success ? t('profile', 'successSavingPersonalData') : t('profile', 'errorSavingPersonalData')) });
            if (result.success) setIsEditingPersonal(false);
        } catch (error: any) {
            setSaveStatus({ type: 'error', message: error.message || t('profile', 'errorSavingPersonalData') });
        } finally {
            setIsLoadingCustomData(false);
            setTimeout(() => setSaveStatus(null), 5000);
        }
    };

    const handleSaveEducationalData = async (e: FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;
        setIsLoadingCustomData(true);
        setSaveStatus(null);
        try {
            // Filter out empty education entries before saving, unless it's the only one
            let educationToSave = { ...customEducationalData };
            if (educationToSave.previousEducation && educationToSave.previousEducation.length > 0) {
                educationToSave.previousEducation = educationToSave.previousEducation.filter(entry =>
                    entry.institutionName || entry.degreeName || entry.fieldOfStudy // Keep if any key field is filled
                );
                // If all were empty and filtered out, but user intended to clear, allow empty array
                if (educationToSave.previousEducation.length === 0 && customEducationalData.previousEducation?.some(e => e.institutionName)) {
                    // This logic might need refinement based on desired UX for "clearing" all entries
                } else if (educationToSave.previousEducation.length === 0 && customEducationalData.previousEducation && customEducationalData.previousEducation.length > 0) {
                    // If user deleted all entries, send empty array
                } else if (educationToSave.previousEducation.length === 0) {
                    // If it started empty and remains empty, don't send it or send default
                    // For now, let's ensure it's at least an empty array if it was touched
                    educationToSave.previousEducation = [];
                }
            }


            const result = await saveActualCustomProfileData({ education: educationToSave });
            setSaveStatus({ type: result.success ? 'success' : 'error', message: result.message || (result.success ? t('profile', 'successSavingEducationalData') : t('profile', 'errorSavingEducationalData')) });
            if (result.success) setIsEditingEducation(false);
        } catch (error: any) {
            setSaveStatus({ type: 'error', message: error.message || t('profile', 'errorSavingEducationalData') });
        } finally {
            setIsLoadingCustomData(false);
            setTimeout(() => setSaveStatus(null), 5000);
        }
    };

    const clerkDataMissing = isLoaded && user && (!user.firstName || !user.lastName || !user.primaryEmailAddress?.emailAddress);
    const customPersonalDataMissing = isLoaded && user && (
        !customPersonalData.dateOfBirth || !customPersonalData.nationality || !customPersonalData.countryOfResidence ||
        !customPersonalData.streetAddress || !customPersonalData.city || !customPersonalData.stateProvince || !customPersonalData.postalCode || !customPersonalData.addressCountry ||
        !customPersonalData.emergencyContactName || !customPersonalData.emergencyContactRelationship || !customPersonalData.emergencyContactPhone
    );
    const customEducationalDataMissing = isLoaded && user && (
        !customEducationalData.highestLevelOfEducation ||
        !(customEducationalData.previousEducation && customEducationalData.previousEducation.length > 0 && customEducationalData.previousEducation.some(edu => edu.institutionName && edu.degreeName && edu.fieldOfStudy && edu.graduationYear)) ||
        (customEducationalData.languageProficiency?.isNativeEnglishSpeaker === 'no' && (!customEducationalData.languageProficiency.testTaken || !customEducationalData.languageProficiency.overallScore || !customEducationalData.languageProficiency.testDate))
    );


    if (!isLoaded) {
        return <div className="flex justify-center items-center py-10"><Loader2 size={32} className="animate-spin text-primary" /> <span className="ml-3">{t('profile', 'loadingProfile')}</span></div>;
    }
    if (!user) {
        return <div className="text-center py-10"><p>{t('profile', 'notSignedIn')}</p><p>{t('profile', 'signInToManage')}</p></div>;
    }
    if (isLoadingCustomData && !customPersonalData.dateOfBirth) { // Show loading only if essential data isn't there yet
        return <div className="flex justify-center items-center py-10"><Loader2 size={32} className="animate-spin text-primary" /> <span className="ml-3">{t('profile', 'loadingYourDetails')}</span></div>;
    }

    const renderInputField = (
        labelKey: string,
        name: string,
        value: string | undefined,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void,
        type: string = 'text',
        isEditing: boolean,
        isRequired: boolean = false,
        placeholderKey?: string,
        options?: { value: string; labelKey: string }[],
        icon?: any,
        disabled?: boolean
    ) => {
        const IconComponent = icon;
        return (
            <div className="mb-4">
                <label htmlFor={name} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    {IconComponent && <IconComponent size={14} className="inline mr-1.5 relative -top-px text-neutral-500" />}
                    {t('profileFieldLabels', labelKey)} {isRequired && isEditing && <span className="text-red-500">*</span>}
                </label>
                {isEditing ? (
                    options ? (
                        <select
                            id={name} name={name} value={value || ''} onChange={onChange} required={isRequired} disabled={disabled || isLoadingCustomData}
                            className="mt-1 block w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-neutral-100 dark:disabled:bg-neutral-800"
                        >
                            <option value="">{t('common', 'selectOption')}</option>
                            {options.map(opt => <option key={opt.value} value={opt.value}>{t('profileFieldLabels', opt.labelKey) || t('common', opt.labelKey, { defaultValue: opt.labelKey })}</option>)}
                        </select>
                    ) : (
                        <input
                            type={type} id={name} name={name} value={value || ''} onChange={onChange} required={isRequired} disabled={disabled || isLoadingCustomData}
                            placeholder={placeholderKey ? t('profileFieldPlaceholders', placeholderKey) : undefined}
                            className="mt-1 block w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-neutral-100 dark:disabled:bg-neutral-800"
                        />
                    )
                ) : (
                    <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-700/50 px-3 py-2 rounded-md min-h-[40px] break-words">
                        {value || <span className="text-neutral-400 dark:text-neutral-500">{t('common', 'notProvided')}</span>}
                    </p>
                )}
            </div>
        );
    };

    const renderDisplayField = (labelKey: string, value?: string | null | Date, icon?: React.ElementType) => {
        const IconComponent = icon;
        let displayValue = value instanceof Date ? value.toLocaleDateString(lang) : value;
        if (value === null || value === undefined || value === '') {
            displayValue = t('common', 'notProvided');
        }
        return (
            <div className="flex items-start py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0">
                {IconComponent && <IconComponent className="h-5 w-5 text-neutral-500 dark:text-neutral-400 mr-3 flex-shrink-0 mt-0.5" />}
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 w-1/3 md:w-1/4">{t('profileFieldLabels', labelKey)}:</span>
                <span className={`text-sm text-neutral-800 dark:text-neutral-200 flex-1 break-words ${displayValue === t('common', 'notProvided') ? 'italic text-neutral-500 dark:text-neutral-500' : ''}`}>{displayValue}</span>
            </div>
        );
    };

    return (
        <div className="space-y-10 p-4 md:p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-xl">
            {/* --- Section 1: Clerk Profile Overview (Commented out as per original, but can be re-enabled) --- */}
            {/*
            <section>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 flex items-center mb-2 sm:mb-0">
                        <UserCircle size={28} className="mr-3 text-primary" /> {t('profile', 'clerkProfileOverviewTitle')}
                    </h3>
                    <Link href={`/${lang}/profile`} passHref legacyBehavior>
                        <a className="text-sm text-primary hover:underline flex items-center">
                            <Edit3 size={16} className="mr-1" /> {t('profile', 'editCoreProfileLink')}
                        </a>
                    </Link>
                </div>
                {clerkDataMissing && (
                    <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-700/20 border border-yellow-300 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 rounded-md text-sm flex items-center">
                        <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                        {t('profile', 'clerkDataMissingPrompt')} {' '}
                        <Link href={`/${lang}/profile`} className="font-semibold hover:underline ml-1">
                            {t('profile', 'updateHerePrompt')}
                        </Link>
                    </div>
                )}
                <div className="bg-white dark:bg-neutral-900/50 shadow-sm rounded-lg p-4 sm:p-6 space-y-1 border border-neutral-200 dark:border-neutral-700">
                    <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
                        <img
                            src={user.imageUrl || `https://ui-avatars.com/api/?name=${user.firstName || 'User'}+${user.lastName || ''}&background=random&color=fff`}
                            alt={t('profile', 'profilePictureAlt')}
                            className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-2 border-primary"
                        />
                        <div className="text-center sm:text-left">
                            <h4 className="text-2xl font-bold text-neutral-700 dark:text-neutral-200">
                                {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || t('common', 'nameNotSet')}
                            </h4>
                            {user.username && <p className="text-sm text-neutral-500 dark:text-neutral-400">@{user.username}</p>}
                        </div>
                    </div>
                    {renderDisplayField('emailLabel', user.primaryEmailAddress?.emailAddress, Mail)}
                    {renderDisplayField('phoneLabel', user.primaryPhoneNumber?.phoneNumber, Phone)}
                    {user.createdAt && renderDisplayField('joinedDateLabel', new Date(user.createdAt), CalendarIcon)}
                    {user.lastSignInAt && renderDisplayField('lastSignInLabel', new Date(user.lastSignInAt), CalendarIcon)}
                </div>
            </section>
            */}

            {saveStatus && (
                <div className={`p-3 rounded-md text-sm my-6 ${saveStatus.type === 'success' ? 'bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600' : 'bg-red-100 dark:bg-red-700/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-600'}`}>
                    {saveStatus.type === 'success' ? <CheckCircle className="inline mr-2" /> : <AlertCircle className="inline mr-2" />}
                    {saveStatus.message}
                </div>
            )}

            {/* --- Section 2: Custom Personal Data --- */}
            <section className="bg-white dark:bg-neutral-900/50 shadow-lg rounded-lg p-4 sm:p-6 border border-neutral-200 dark:border-neutral-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 flex items-center mb-2 sm:mb-0">
                        <UserSquare2 size={28} className="mr-3 text-primary" /> {t('profile', 'customPersonalDataTitle')}
                    </h3>
                    <button
                        onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                        className="text-sm text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary flex items-center px-3 py-1.5 rounded-md hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
                    >
                        {isEditingPersonal ? <><Save size={16} className="mr-1" /> {t('common', 'viewMode')}</> : <><Edit3 size={16} className="mr-1" /> {t('common', 'editMode')}</>}
                    </button>
                </div>
                {customPersonalDataMissing && !isEditingPersonal && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-700/20 border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 rounded-md text-sm flex items-center">
                        <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                        <span>{t('profile', 'customPersonalDataMissingPrompt')}</span>
                        <button onClick={() => setIsEditingPersonal(true)} className="font-semibold text-primary hover:underline ml-1 shrink-0">{t('profile', 'addInfoPrompt')}</button>
                    </div>
                )}
                <form onSubmit={handleSavePersonalData}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        {renderInputField('firstNameLabel', 'firstName', customPersonalData.firstName, handlePersonalDataChange, 'text', isEditingPersonal, true, 'firstNamePlaceholder', undefined, undefined, !user?.firstName)}
                        {renderInputField('lastNameLabel', 'lastName', customPersonalData.lastName, handlePersonalDataChange, 'text', isEditingPersonal, true, 'lastNamePlaceholder', undefined, undefined, !user?.lastName)}
                        {renderInputField('dateOfBirthLabel', 'dateOfBirth', customPersonalData.dateOfBirth, handlePersonalDataChange, 'date', isEditingPersonal, true, undefined, undefined, CalendarIcon)}
                        {renderInputField('genderLabel', 'gender', customPersonalData.gender, handlePersonalDataChange, 'select', isEditingPersonal, false, undefined, [
                            { value: 'male', labelKey: 'genderMale' }, { value: 'female', labelKey: 'genderFemale' }, { value: 'non-binary', labelKey: 'genderNonBinary' }, { value: 'other', labelKey: 'genderOther' }, { value: 'prefer_not_to_say', labelKey: 'genderPreferNotToSay' }
                        ], Users)}
                        {renderInputField('nationalityLabel', 'nationality', customPersonalData.nationality, handlePersonalDataChange, 'text', isEditingPersonal, true, 'nationalityPlaceholder', undefined, Globe)}
                        {renderInputField('countryOfResidenceLabel', 'countryOfResidence', customPersonalData.countryOfResidence, handlePersonalDataChange, 'text', isEditingPersonal, true, 'countryOfResidencePlaceholder', undefined, MapPin)}
                    </div>
                    <h4 className="text-md font-semibold text-neutral-700 dark:text-neutral-300 mt-6 mb-3 border-b dark:border-neutral-600 pb-2 flex items-center"><Home size={18} className="mr-2 text-primary" />{t('profileFieldLabels', 'addressSubHeader')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        {renderInputField('streetAddressLabel', 'streetAddress', customPersonalData.streetAddress, handlePersonalDataChange, 'text', isEditingPersonal, true, 'streetAddressPlaceholder')}
                        {renderInputField('cityLabel', 'city', customPersonalData.city, handlePersonalDataChange, 'text', isEditingPersonal, true, 'cityPlaceholder')}
                        {renderInputField('stateProvinceLabel', 'stateProvince', customPersonalData.stateProvince, handlePersonalDataChange, 'text', isEditingPersonal, true, 'stateProvincePlaceholder')}
                        {renderInputField('postalCodeLabel', 'postalCode', customPersonalData.postalCode, handlePersonalDataChange, 'text', isEditingPersonal, true, 'postalCodePlaceholder')}
                        {renderInputField('addressCountryLabel', 'addressCountry', customPersonalData.addressCountry, handlePersonalDataChange, 'text', isEditingPersonal, true, 'countryPlaceholder', undefined)}
                    </div>
                    <h4 className="text-md font-semibold text-neutral-700 dark:text-neutral-300 mt-6 mb-3 border-b dark:border-neutral-600 pb-2 flex items-center"><KeyRound size={18} className="mr-2 text-primary" />{t('profileFieldLabels', 'passportSubHeader')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        {renderInputField('passportNumberLabel', 'passportNumber', customPersonalData.passportNumber, handlePersonalDataChange, 'text', isEditingPersonal, false, 'passportNumberPlaceholder')}
                        {renderInputField('passportExpiryDateLabel', 'passportExpiryDate', customPersonalData.passportExpiryDate, handlePersonalDataChange, 'date', isEditingPersonal, false, undefined, undefined, CalendarIcon)}
                    </div>
                    <h4 className="text-md font-semibold text-neutral-700 dark:text-neutral-300 mt-6 mb-3 border-b dark:border-neutral-600 pb-2 flex items-center"><Heart size={18} className="mr-2 text-red-500" />{t('profileFieldLabels', 'emergencyContactSubHeader')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        {renderInputField('emergencyContactNameLabel', 'emergencyContactName', customPersonalData.emergencyContactName, handlePersonalDataChange, 'text', isEditingPersonal, true, 'emergencyContactNamePlaceholder', undefined)}
                        {renderInputField('emergencyContactRelationshipLabel', 'emergencyContactRelationship', customPersonalData.emergencyContactRelationship, handlePersonalDataChange, 'text', isEditingPersonal, true, 'emergencyContactRelationshipPlaceholder', undefined)}
                        {renderInputField('emergencyContactPhoneLabel', 'emergencyContactPhone', customPersonalData.emergencyContactPhone, handlePersonalDataChange, 'tel', isEditingPersonal, true, 'emergencyContactPhonePlaceholder', undefined)}
                        {renderInputField('emergencyContactEmailLabel', 'emergencyContactEmail', customPersonalData.emergencyContactEmail, handlePersonalDataChange, 'email', isEditingPersonal, false, 'emergencyContactEmailPlaceholder', undefined)}
                    </div>

                    {isEditingPersonal && (
                        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                            <button type="button" onClick={() => { setIsEditingPersonal(false); fetchActualCustomProfileData(); }} className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-md order-2 sm:order-1">
                                {t('common', 'cancel')}
                            </button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md flex items-center justify-center disabled:opacity-70 order-1 sm:order-2" disabled={isLoadingCustomData}>
                                {isLoadingCustomData ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save size={16} className="mr-2" />}
                                {t('common', 'saveChanges')}
                            </button>
                        </div>
                    )}
                </form>
            </section>

            {/* --- Section 3: Educational Information --- */}
            <section className="bg-white dark:bg-neutral-900/50 shadow-lg rounded-lg p-4 sm:p-6 border border-neutral-200 dark:border-neutral-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 flex items-center mb-2 sm:mb-0">
                        <GraduationCap size={28} className="mr-3 text-primary" /> {t('profile', 'educationalInformationTitle')}
                    </h3>
                    <button
                        onClick={() => setIsEditingEducation(!isEditingEducation)}
                        className="text-sm text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary flex items-center px-3 py-1.5 rounded-md hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
                    >
                        {isEditingEducation ? <><Save size={16} className="mr-1" /> {t('common', 'viewMode')}</> : <><Edit3 size={16} className="mr-1" /> {t('common', 'editMode')}</>}
                    </button>
                </div>
                {customEducationalDataMissing && !isEditingEducation && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-700/20 border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 rounded-md text-sm flex items-center">
                        <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                        <span>{t('profile', 'customEducationalDataMissingPrompt')}</span>
                        <button onClick={() => setIsEditingEducation(true)} className="font-semibold text-primary hover:underline ml-1 shrink-0">{t('profile', 'addInfoPrompt')}</button>
                    </div>
                )}
                <form onSubmit={handleSaveEducationalData}>
                    {renderInputField('highestLevelOfEducationLabel', 'highestLevelOfEducation', customEducationalData.highestLevelOfEducation, handleEducationalDataChange, 'select', isEditingEducation, true, undefined, [
                        { value: 'High School', labelKey: 'educationLevelHighSchool' }, { value: "Associate's Degree", labelKey: 'educationLevelAssociate' },
                        { value: "Bachelor's Degree", labelKey: 'educationLevelBachelor' }, { value: "Master's Degree", labelKey: 'educationLevelMaster' },
                        { value: "Doctorate (PhD)", labelKey: 'educationLevelPhD' }, { value: "Other", labelKey: 'educationLevelOther' },
                    ], GraduationCap)}

                    <h4 className="text-md font-semibold text-neutral-700 dark:text-neutral-300 mt-6 mb-1 border-b dark:border-neutral-600 pb-2 flex items-center"><Building size={18} className="mr-2 text-primary" />{t('profileFieldLabels', 'previousEducationSubHeader')}</h4>
                    {(customEducationalData.previousEducation || []).map((entry, index) => (
                        <div key={entry.id || index} className="mt-4 p-4 border border-neutral-200 dark:border-neutral-700 rounded-md relative bg-neutral-50 dark:bg-neutral-800/40">
                            {isEditingEducation && (customEducationalData.previousEducation || []).length > 0 && ( // Show remove only if there's at least one entry
                                <button type="button" onClick={() => removeEducationEntry(index)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 z-10 disabled:opacity-50" disabled={(customEducationalData.previousEducation || []).length <= 1 && !entry.institutionName}>
                                    <Trash2 size={16} />
                                </button>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                {renderInputField(`institutionNameLabel`, `institutionName`, entry.institutionName, (e) => handleEducationEntryChange(index, e), 'text', isEditingEducation, true, 'institutionNamePlaceholder')}
                                {renderInputField(`institutionCountryLabel`, `institutionCountry`, entry.institutionCountry, (e) => handleEducationEntryChange(index, e), 'text', isEditingEducation, true, 'countryPlaceholder')}
                                {renderInputField(`institutionCityLabel`, `institutionCity`, entry.institutionCity, (e) => handleEducationEntryChange(index, e), 'text', isEditingEducation, false, 'cityPlaceholder')}
                                {renderInputField(`degreeNameLabel`, `degreeName`, entry.degreeName, (e) => handleEducationEntryChange(index, e), 'text', isEditingEducation, true, 'degreeNamePlaceholder')}
                                {renderInputField(`fieldOfStudyLabel`, `fieldOfStudy`, entry.fieldOfStudy, (e) => handleEducationEntryChange(index, e), 'text', isEditingEducation, true, 'fieldOfStudyPlaceholder')}
                                {renderInputField(`graduationYearLabel`, `graduationYear`, entry.graduationYear, (e) => handleEducationEntryChange(index, e), 'number', isEditingEducation, true, 'graduationYearPlaceholder')}
                                {renderInputField(`graduationMonthLabel`, `graduationMonth`, entry.graduationMonth, (e) => handleEducationEntryChange(index, e), 'select', isEditingEducation, false, undefined, Array.from({ length: 12 }, (_, i) => ({ value: (i + 1).toString(), labelKey: `month${i + 1}` })))}
                                {renderInputField(`gpaLabel`, `gpa`, entry.gpa, (e) => handleEducationEntryChange(index, e), 'text', isEditingEducation, false, 'gpaPlaceholder')}
                                {renderInputField(`gradingScaleLabel`, `gradingScale`, entry.gradingScale, (e) => handleEducationEntryChange(index, e), 'text', isEditingEducation, false, 'gradingScalePlaceholder')}
                            </div>
                            {isEditingEducation && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 flex items-center"><Info size={12} className="mr-1" />{t('profileFieldLabels', 'transcriptUploadNote')}</p>}
                        </div>
                    ))}
                    {isEditingEducation && (
                        <button type="button" onClick={addEducationEntry} className="mt-4 text-sm text-primary hover:underline flex items-center">
                            <PlusCircle size={16} className="mr-1" /> {t('profile', 'addAnotherInstitution')}
                        </button>
                    )}

                    <h4 className="text-md font-semibold text-neutral-700 dark:text-neutral-300 mt-6 mb-3 border-b dark:border-neutral-600 pb-2 flex items-center"><Languages size={18} className="mr-2 text-primary" />{t('profileFieldLabels', 'englishProficiencySubHeader')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        {renderInputField('isNativeEnglishSpeakerLabel', 'isNativeEnglishSpeaker', customEducationalData.languageProficiency?.isNativeEnglishSpeaker, handleLanguageProficiencyChange, 'select', isEditingEducation, true, undefined, [
                            { value: 'yes', labelKey: 'yes' }, { value: 'no', labelKey: 'no' }
                        ])}
                        {customEducationalData.languageProficiency?.isNativeEnglishSpeaker === 'no' && (
                            <>
                                {renderInputField('englishTestTakenLabel', 'testTaken', customEducationalData.languageProficiency?.testTaken, handleLanguageProficiencyChange, 'select', isEditingEducation, true, undefined, [
                                    { value: 'TOEFL', labelKey: 'testTOEFL' }, { value: 'IELTS', labelKey: 'testIELTS' }, { value: 'Duolingo', labelKey: 'testDuolingo' }, { value: 'Cambridge', labelKey: 'testCambridge' }, { value: 'Other', labelKey: 'testOther' }
                                ])}
                                {renderInputField('englishOverallScoreLabel', 'overallScore', customEducationalData.languageProficiency?.overallScore, handleLanguageProficiencyChange, 'text', isEditingEducation, true, 'overallScorePlaceholder')}
                                {renderInputField('englishTestDateLabel', 'testDate', customEducationalData.languageProficiency?.testDate, handleLanguageProficiencyChange, 'date', isEditingEducation, true, undefined, undefined, CalendarIcon)}
                                {isEditingEducation && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 md:col-span-2 flex items-center"><Info size={12} className="mr-1" />{t('profileFieldLabels', 'englishCertUploadNote')}</p>}
                            </>
                        )}
                    </div>

                    <h4 className="text-md font-semibold text-neutral-700 dark:text-neutral-300 mt-6 mb-1 border-b dark:border-neutral-600 pb-2 flex items-center"><Award size={18} className="mr-2 text-primary" />{t('profileFieldLabels', 'otherTestsSubHeader')}</h4>
                    {(customEducationalData.otherStandardizedTests || []).map((test, index) => (
                        <div key={test.id || index} className="mt-4 p-4 border border-neutral-200 dark:border-neutral-700 rounded-md relative bg-neutral-50 dark:bg-neutral-800/40">
                            {isEditingEducation && (
                                <button type="button" onClick={() => removeStandardizedTest(index)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 z-10">
                                    <Trash2 size={16} />
                                </button>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                                {renderInputField(`testNameLabel`, `testName`, test.testName, (e) => handleStandardizedTestChange(index, e), 'text', isEditingEducation, true, 'testNamePlaceholder')}
                                {renderInputField(`testScoreLabel`, `score`, test.score, (e) => handleStandardizedTestChange(index, e), 'text', isEditingEducation, true, 'testScorePlaceholder')}
                                {renderInputField(`testDateTakenLabel`, `dateTaken`, test.dateTaken, (e) => handleStandardizedTestChange(index, e), 'date', isEditingEducation, true, undefined, undefined, CalendarIcon)}
                            </div>
                            {isEditingEducation && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 flex items-center"><Info size={12} className="mr-1" />{t('profileFieldLabels', 'testReportUploadNote')}</p>}
                        </div>
                    ))}
                    {isEditingEducation && (
                        <button type="button" onClick={addStandardizedTest} className="mt-4 text-sm text-primary hover:underline flex items-center">
                            <PlusCircle size={16} className="mr-1" /> {t('profile', 'addAnotherTest')}
                        </button>
                    )}

                    {isEditingEducation && (
                        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                            <button type="button" onClick={() => { setIsEditingEducation(false); fetchActualCustomProfileData(); }} className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-md order-2 sm:order-1">
                                {t('common', 'cancel')}
                            </button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md flex items-center justify-center disabled:opacity-70 order-1 sm:order-2" disabled={isLoadingCustomData}>
                                {isLoadingCustomData ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save size={16} className="mr-2" />}
                                {t('common', 'saveChanges')}
                            </button>
                        </div>
                    )}
                </form>
            </section>
        </div>
    );
};

export default UserProfileDetails;

