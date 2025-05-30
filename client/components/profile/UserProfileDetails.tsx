// components/profile/UserProfileDetails.tsx
'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import {
    UserCircle, Mail, Phone, Calendar as CalendarIcon, Globe, Home, ShieldCheck, Briefcase,
    GraduationCap, BookOpen, Edit3, Save, AlertCircle, CheckCircle, PlusCircle, Trash2,
    Languages, FileText, Award, MapPin, UserSquare2, Heart, Loader2 // Added Loader2
} from 'lucide-react';

// --- Types (Ideally, move these to a shared types file) ---
interface CustomPersonalData {
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

// --- Actual API functions ---
const fetchActualCustomProfileData = async (): Promise<{ personal: CustomPersonalData, education: CustomEducationalData }> => {
    const response = await fetch('/api/user-profile-details');
    if (!response.ok) {
        const errorResult = await response.json().catch(() => ({ message: 'Failed to fetch profile data and parse error.' }));
        throw new Error(errorResult.message || 'Failed to fetch profile data');
    }
    const result = await response.json();
    if (result.success && result.data) {
        // API returns entire document, extract personal and educational parts
        // Ensure default structures if parts are missing
        return {
            personal: result.data.personalData || {},
            education: {
                highestLevelOfEducation: result.data.educationalData?.highestLevelOfEducation || '',
                previousEducation: result.data.educationalData?.previousEducation || [{ id: Date.now().toString() }],
                languageProficiency: result.data.educationalData?.languageProficiency || { isNativeEnglishSpeaker: '' },
                otherStandardizedTests: result.data.educationalData?.otherStandardizedTests || [],
            }
        };
    } else if (result.success && !result.data) { // Case where user has no profile data yet
         return {
            personal: {},
            education: { highestLevelOfEducation: '', previousEducation: [{id: Date.now().toString()}], languageProficiency: {isNativeEnglishSpeaker: ''}, otherStandardizedTests: [] }
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
    return result; // API now returns { success, message, data }
};


// --- Main Component ---
const UserProfileDetails: React.FC<UserProfileDetailsProps> = ({ t, lang }) => {
    const { user, isLoaded } = useUser();
    console.log("UserProfileDetails.tsx loaded", user);

    const [customPersonalData, setCustomPersonalData] = useState<CustomPersonalData>({});
    const [customEducationalData, setCustomEducationalData] = useState<CustomEducationalData>({ previousEducation: [{id: Date.now().toString()}], otherStandardizedTests: [], languageProficiency: {isNativeEnglishSpeaker: ''} });

    const [isLoadingCustomData, setIsLoadingCustomData] = useState(true);
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingEducation, setIsEditingEducation] = useState(false);
    const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        // Only fetch if Clerk user is loaded and available
        if (isLoaded && user?.id) {
            setIsLoadingCustomData(true);
            fetchActualCustomProfileData() // Removed userId, as API gets it from session
                .then(data => {
                    setCustomPersonalData(data.personal || {});
                    setCustomEducationalData(data.education || { highestLevelOfEducation: '', previousEducation: [{id: Date.now().toString()}], languageProficiency: {isNativeEnglishSpeaker: ''}, otherStandardizedTests: [] });
                })
                .catch(err => {
                    console.error("Failed to load custom data:", err.message);
                    setSaveStatus({type: 'error', message: t('profile', 'errorLoadingCustomData')})
                    // Initialize with empty structures on error to prevent UI breaks
                    setCustomPersonalData({});
                    setCustomEducationalData({ highestLevelOfEducation: '', previousEducation: [{id: Date.now().toString()}], languageProficiency: {isNativeEnglishSpeaker: ''}, otherStandardizedTests: [] });
                })
                .finally(() => setIsLoadingCustomData(false));
        } else if (isLoaded && !user) {
            // If Clerk is loaded but no user, means not signed in or error.
            setIsLoadingCustomData(false); // Stop loading if no user
            setCustomPersonalData({});
            setCustomEducationalData({ highestLevelOfEducation: '', previousEducation: [{id: Date.now().toString()}], languageProficiency: {isNativeEnglishSpeaker: ''}, otherStandardizedTests: [] });
        }
    }, [isLoaded, user?.id, t]); // Added t to dependencies for error message

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
                ...prev.languageProficiency,
                [name]: name === 'isNativeEnglishSpeaker' ? value : value,
            } as LanguageProficiency
        }));
    };

    const handleEducationEntryChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const updatedEntries = [...(customEducationalData.previousEducation || [])];
        updatedEntries[index] = { ...updatedEntries[index], id: updatedEntries[index].id || Date.now().toString() , [name]: value }; // Ensure ID exists
        setCustomEducationalData(prev => ({ ...prev, previousEducation: updatedEntries }));
    };

    const addEducationEntry = () => {
        setCustomEducationalData(prev => ({
            ...prev,
            previousEducation: [...(prev.previousEducation || []), { id: Date.now().toString() }]
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
        updatedTests[index] = { ...updatedTests[index], id: updatedTests[index].id || Date.now().toString(), [name]: value }; // Ensure ID exists
        setCustomEducationalData(prev => ({ ...prev, otherStandardizedTests: updatedTests }));
    };

    const addStandardizedTest = () => {
        setCustomEducationalData(prev => ({
            ...prev,
            otherStandardizedTests: [...(prev.otherStandardizedTests || []), { id: Date.now().toString() }]
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
        try {
            const result = await saveActualCustomProfileData({ personal: customPersonalData });
            setSaveStatus({ type: result.success ? 'success' : 'error', message: result.message });
            setIsEditingPersonal(false);
            // Optionally re-fetch or update state with result.data if needed
        } catch (error: any) {
            setSaveStatus({ type: 'error', message: error.message || t('profile', 'errorSavingPersonalData') });
        } finally {
            setIsLoadingCustomData(false);
            setTimeout(() => setSaveStatus(null), 4000);
        }
    };

    const handleSaveEducationalData = async (e: FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;
        setIsLoadingCustomData(true);
         try {
            const result = await saveActualCustomProfileData({ education: customEducationalData });
            setSaveStatus({ type: result.success ? 'success' : 'error', message: result.message });
            setIsEditingEducation(false);
            // Optionally re-fetch or update state with result.data if needed
        } catch (error: any) {
            setSaveStatus({ type: 'error', message: error.message || t('profile', 'errorSavingEducationalData') });
        } finally {
            setIsLoadingCustomData(false);
            setTimeout(() => setSaveStatus(null), 4000);
        }
    };

    const clerkDataMissing = isLoaded && user && (!user.firstName || !user.lastName || !user.primaryEmailAddress?.emailAddress);
    const customPersonalDataMissing = isLoaded && user && (!customPersonalData.dateOfBirth || !customPersonalData.nationality || !customPersonalData.streetAddress);
    const customEducationalDataMissing = isLoaded && user && (!customEducationalData.highestLevelOfEducation || !(customEducationalData.previousEducation && customEducationalData.previousEducation.length > 0 && customEducationalData.previousEducation[0].institutionName));

    // Initial loading for Clerk session
    if (!isLoaded) {
        return <div className="flex justify-center items-center py-10"><Loader2 size={32} className="animate-spin text-primary" /> <span className="ml-3">{t('profile', 'loadingProfile')}</span></div>;
    }
    // After Clerk loaded, if no user signed in
    if (!user) {
        return <div className="text-center py-10"><p>{t('profile', 'notSignedIn')}</p><p>{t('profile', 'signInToManage')}</p></div>;
    }
    // If custom data is still loading after user is confirmed
    if (isLoadingCustomData) {
         return <div className="flex justify-center items-center py-10"><Loader2 size={32} className="animate-spin text-primary" /> <span className="ml-3">{t('profile', 'loadingYourDetails')}</span></div>;
    }

    // --- Helper function to render form fields (example) ---
    // ... (renderInputField and renderDisplayField remain the same as your provided code)
    // Make sure they are defined within this component or imported

    // (renderInputField and renderDisplayField from your provided code should be here)
    // Definition of renderInputField (assuming it's the same as you provided)
    const renderInputField = (
        labelKey: string,
        name: string,
        value: string | undefined,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void,
        type: string = 'text',
        isEditing: boolean,
        isRequired: boolean = false,
        placeholderKey?: string,
        options?: { value: string; labelKey: string }[]
    ) => (
        <div className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium text-neutral-700 mb-1">
                {t('profileFieldLabels', labelKey)} {isRequired && <span className="text-red-500">*</span>}
            </label>
            {isEditing ? (
                options ? (
                    <select
                        id={name} name={name} value={value || ''} onChange={onChange} required={isRequired}
                        className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-neutral-50"
                    >
                        <option value="">{t('common', 'selectOption')}</option>
                        {options.map(opt => <option key={opt.value} value={opt.value}>{t('profileFieldLabels', opt.labelKey)}</option>)}
                    </select>
                ) : (
                    <input
                        type={type} id={name} name={name} value={value || ''} onChange={onChange} required={isRequired}
                        placeholder={placeholderKey ? t('profileFieldPlaceholders', placeholderKey) : undefined}
                        className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-neutral-50"
                    />
                )
            ) : (
                <p className="mt-1 text-sm text-neutral-900 bg-neutral-50 px-3 py-2 rounded-md min-h-[40px] break-words">
                    {value || <span className="text-neutral-400">{t('common', 'notProvided')}</span>}
                </p>
            )}
        </div>
    );

    const renderDisplayField = (labelKey: string, value?: string | null | Date, icon?: React.ElementType) => {
        const IconComponent = icon;
        let displayValue = value instanceof Date ? value.toLocaleDateString(lang) : value;
        if (value === null || value === undefined || value === '') {
            displayValue = t('common', 'notProvided');
        }
        return (
            <div className="flex items-start py-3 border-b border-neutral-100 last:border-b-0">
                {IconComponent && <IconComponent className="h-5 w-5 text-neutral-500 mr-3 flex-shrink-0 mt-0.5" />}
                <span className="text-sm font-medium text-neutral-600 w-1/3 md:w-1/4">{t('profileFieldLabels', labelKey)}:</span>
                <span className={`text-sm text-neutral-800 flex-1 break-words ${displayValue === t('common', 'notProvided') ? 'italic text-neutral-500' : ''}`}>{displayValue}</span>
            </div>
        );
    };

    return (
        <div className="space-y-10">
            {/* --- Section 1: Clerk Profile Overview --- 
            <section>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h3 className="text-xl font-semibold text-neutral-800 flex items-center mb-2 sm:mb-0">
                        <UserCircle size={28} className="mr-3 text-primary" /> {t('profile', 'clerkProfileOverviewTitle')}
                    </h3>
                     Ensure this Link points to the page where <UserProfile /> is fully rendered for editing 
                    <Link href={`/${lang}/profile`} passHref legacyBehavior>
                        <a className="text-sm text-primary hover:underline flex items-center">
                            <Edit3 size={16} className="mr-1" /> {t('profile', 'editCoreProfileLink')}
                        </a>
                    </Link>
                </div>
                {clerkDataMissing && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 text-yellow-700 rounded-md text-sm flex items-center">
                        <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                        {t('profile', 'clerkDataMissingPrompt')} {' '}
                        <Link href={`/${lang}/profile`} className="font-semibold hover:underline ml-1">
                            {t('profile', 'updateHerePrompt')}
                        </Link>
                    </div>
                )}
                <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6 space-y-1 border border-neutral-200">
                    <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
                        <img
                            src={user.imageUrl || `https://ui-avatars.com/api/?name=${user.firstName || 'User'}+${user.lastName || ''}&background=random&color=fff`}
                            alt={t('profile', 'profilePictureAlt')}
                            className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-2 border-primary"
                        />
                        <div className="text-center sm:text-left">
                            <h4 className="text-2xl font-bold text-neutral-700">
                                {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || t('common', 'nameNotSet')}
                            </h4>
                            {user.username && <p className="text-sm text-neutral-500">@{user.username}</p>}
                        </div>
                    </div>
                    {renderDisplayField('emailLabel', user.primaryEmailAddress?.emailAddress, Mail)}
                    {renderDisplayField('phoneLabel', user.primaryPhoneNumber?.phoneNumber, Phone)}
                    {user.createdAt && renderDisplayField('joinedDateLabel', new Date(user.createdAt), CalendarIcon)}
                    {user.lastSignInAt && renderDisplayField('lastSignInLabel', new Date(user.lastSignInAt), CalendarIcon)}
                </div>
            </section>
            */}

            {/* Save Status Message */}
            {saveStatus && (
                <div className={`p-3 rounded-md text-sm my-6 ${saveStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-300' : 'bg-red-50 text-red-700 border border-red-300'}`}>
                    {saveStatus.message}
                </div>
            )}


            {/* --- Section 2: Custom Personal Data --- */}
            <section>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h3 className="text-xl font-semibold text-neutral-800 flex items-center mb-2 sm:mb-0">
                        <UserSquare2 size={28} className="mr-3 text-primary" /> {t('profile', 'customPersonalDataTitle')}
                    </h3>
                    <button
                        onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                        className="text-sm text-white hover:underline flex items-center px-3 py-1.5 rounded-md hover:test-primary hover:bg-primary/10 transition-colors"
                    >
                        {isEditingPersonal ? <><Save size={16} className=" mr-1" /> {t('common', 'viewMode')}</> : <><Edit3 size={16} className="mr-1 text-white" /> {t('common', 'editMode')}</>}
                    </button>
                </div>
                {customPersonalDataMissing && !isEditingPersonal && (
                     <div className="mb-4 p-3 bg-blue-50 border border-blue-300 text-blue-700 rounded-md text-sm flex items-center">
                        <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                        <span>{t('profile', 'customPersonalDataMissingPrompt')}</span>
                        <button onClick={() => setIsEditingPersonal(true)} className="font-semibold text-white hover:underline ml-1 shrink-0">{t('profile', 'addInfoPrompt')}</button>
                    </div>
                )}
                <form onSubmit={handleSavePersonalData} className="bg-white shadow-sm rounded-lg p-4 sm:p-6 border border-neutral-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        {renderInputField('dateOfBirthLabel', 'dateOfBirth', customPersonalData.dateOfBirth, handlePersonalDataChange, 'date', isEditingPersonal, true)}
                        {renderInputField('genderLabel', 'gender', customPersonalData.gender, handlePersonalDataChange, 'select', isEditingPersonal, false, undefined, [
                            { value: 'male', labelKey: 'genderMale' }, { value: 'female', labelKey: 'genderFemale' }, { value: 'non-binary', labelKey: 'genderNonBinary' }, { value: 'prefer_not_to_say', labelKey: 'genderPreferNotToSay' }
                        ])}
                        {renderInputField('nationalityLabel', 'nationality', customPersonalData.nationality, handlePersonalDataChange, 'text', isEditingPersonal, true)}
                        {renderInputField('countryOfResidenceLabel', 'countryOfResidence', customPersonalData.countryOfResidence, handlePersonalDataChange, 'text', isEditingPersonal, true)}
                    </div>
                    <h4 className="text-md font-semibold text-neutral-700 mt-6 mb-3 border-b pb-2">{t('profileFieldLabels', 'addressSubHeader')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        {renderInputField('streetAddressLabel', 'streetAddress', customPersonalData.streetAddress, handlePersonalDataChange, 'text', isEditingPersonal, true)}
                        {renderInputField('cityLabel', 'city', customPersonalData.city, handlePersonalDataChange, 'text', isEditingPersonal, true)}
                        {renderInputField('stateProvinceLabel', 'stateProvince', customPersonalData.stateProvince, handlePersonalDataChange, 'text', isEditingPersonal, true)}
                        {renderInputField('postalCodeLabel', 'postalCode', customPersonalData.postalCode, handlePersonalDataChange, 'text', isEditingPersonal, true)}
                        {renderInputField('addressCountryLabel', 'addressCountry', customPersonalData.addressCountry, handlePersonalDataChange, 'text', isEditingPersonal, true)}
                    </div>
                     <h4 className="text-md font-semibold text-neutral-700 mt-6 mb-3 border-b pb-2">{t('profileFieldLabels', 'passportSubHeader')}</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        {renderInputField('passportNumberLabel', 'passportNumber', customPersonalData.passportNumber, handlePersonalDataChange, 'text', isEditingPersonal)}
                        {renderInputField('passportExpiryDateLabel', 'passportExpiryDate', customPersonalData.passportExpiryDate, handlePersonalDataChange, 'date', isEditingPersonal)}
                    </div>
                    <h4 className="text-md font-semibold text-neutral-700 mt-6 mb-3 border-b pb-2 flex items-center"><Heart size={18} className="mr-2 text-red-500" />{t('profileFieldLabels', 'emergencyContactSubHeader')}</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        {renderInputField('emergencyContactNameLabel', 'emergencyContactName', customPersonalData.emergencyContactName, handlePersonalDataChange, 'text', isEditingPersonal, true)}
                        {renderInputField('emergencyContactRelationshipLabel', 'emergencyContactRelationship', customPersonalData.emergencyContactRelationship, handlePersonalDataChange, 'text', isEditingPersonal, true)}
                        {renderInputField('emergencyContactPhoneLabel', 'emergencyContactPhone', customPersonalData.emergencyContactPhone, handlePersonalDataChange, 'tel', isEditingPersonal, true)}
                        {renderInputField('emergencyContactEmailLabel', 'emergencyContactEmail', customPersonalData.emergencyContactEmail, handlePersonalDataChange, 'email', isEditingPersonal)}
                    </div>

                    {isEditingPersonal && (
                        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                            <button type="button" onClick={() => { setIsEditingPersonal(false); fetchActualCustomProfileData(); /* Re-fetch to discard changes */ }} className="text-white px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md order-2 sm:order-1">
                                {t('common', 'cancel')}
                            </button>
                            <button type="submit" className="text-white px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md flex items-center justify-center disabled:opacity-70 order-1 sm:order-2" disabled={isLoadingCustomData}>
                                {isLoadingCustomData ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save size={16} className="mr-2" />}
                                {t('common', 'saveChanges')}
                            </button>
                        </div>
                    )}
                </form>
            </section>

            {/* --- Section 3: Educational Information --- */}
            <section>
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h3 className="text-xl font-semibold text-neutral-800 flex items-center mb-2 sm:mb-0">
                        <GraduationCap size={28} className="mr-3 text-primary" /> {t('profile', 'educationalInformationTitle')}
                    </h3>
                     <button
                        onClick={() => setIsEditingEducation(!isEditingEducation)}
                        className="text-sm text-white hover:underline flex items-center px-3 py-1.5 rounded-md hover:bg-primary/10 transition-colors"
                    >
                        {isEditingEducation ? <><Save size={16} className="mr-1" /> {t('common', 'viewMode')}</> : <><Edit3 size={16} className="mr-1 text-white" /> {t('common', 'editMode')}</>}
                    </button>
                </div>
                 {customEducationalDataMissing && !isEditingEducation && (
                     <div className="mb-4 p-3 bg-blue-50 border border-blue-300 text-blue-700 rounded-md text-sm flex items-center">
                        <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                         <span>{t('profile', 'customEducationalDataMissingPrompt')}</span>
                        <button onClick={() => setIsEditingEducation(true)} className=" text-white font-semibold hover:underline ml-1 shrink-0">{t('profile', 'addInfoPrompt')}</button>
                    </div>
                )}
                <form onSubmit={handleSaveEducationalData} className="bg-white shadow-sm rounded-lg p-4 sm:p-6 border border-neutral-200">
                    {renderInputField('highestLevelOfEducationLabel', 'highestLevelOfEducation', customEducationalData.highestLevelOfEducation, handleEducationalDataChange, 'select', isEditingEducation, true, undefined, [
                        { value: 'High School', labelKey: 'educationLevelHighSchool' },
                        { value: "Associate's Degree", labelKey: 'educationLevelAssociate' },
                        { value: "Bachelor's Degree", labelKey: 'educationLevelBachelor' },
                        { value: "Master's Degree", labelKey: 'educationLevelMaster' },
                        { value: "Doctorate (PhD)", labelKey: 'educationLevelPhD' },
                        { value: "Other", labelKey: 'educationLevelOther' },
                    ])}

                    <h4 className="text-md font-semibold text-neutral-700 mt-6 mb-1 border-b pb-2">{t('profileFieldLabels', 'previousEducationSubHeader')}</h4>
                    {(customEducationalData.previousEducation || []).map((entry, index) => (
                        <div key={entry.id} className="mt-4 p-4 border border-neutral-200 rounded-md relative">
                            {isEditingEducation && (customEducationalData.previousEducation || []).length > 1 && (
                                <button type="button" onClick={() => removeEducationEntry(index)} className="text-white absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 z-10">
                                    <Trash2 size={16} />
                                </button>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                {renderInputField(`institutionNameLabel`, `institutionName`, entry.institutionName, (e) => handleEducationEntryChange(index, e), 'text', isEditingEducation, true)}
                                {renderInputField(`institutionCountryLabel`, `institutionCountry`, entry.institutionCountry, (e) => handleEducationEntryChange(index, e), 'text', isEditingEducation, true)}
                                {renderInputField(`institutionCityLabel`, `institutionCity`, entry.institutionCity, (e) => handleEducationEntryChange(index, e), 'text', isEditingEducation)}
                                {renderInputField(`degreeNameLabel`, `degreeName`, entry.degreeName, (e) => handleEducationEntryChange(index, e), 'text', isEditingEducation, true)}
                                {renderInputField(`fieldOfStudyLabel`, `fieldOfStudy`, entry.fieldOfStudy, (e) => handleEducationEntryChange(index, e), 'text', isEditingEducation, true)}
                                {renderInputField(`graduationYearLabel`, `graduationYear`, entry.graduationYear, (e) => handleEducationEntryChange(index, e), 'number', isEditingEducation, true)}
                                {renderInputField(`graduationMonthLabel`, `graduationMonth`, entry.graduationMonth, (e) => handleEducationEntryChange(index, e), 'select', isEditingEducation, false, undefined, Array.from({ length: 12 }, (_, i) => ({ value: (i + 1).toString(), labelKey: `month${i + 1}` })))}
                                {renderInputField(`gpaLabel`, `gpa`, entry.gpa, (e) => handleEducationEntryChange(index, e), 'text', isEditingEducation)}
                                {renderInputField(`gradingScaleLabel`, `gradingScale`, entry.gradingScale, (e) => handleEducationEntryChange(index, e), 'text', isEditingEducation)}
                            </div>
                             {isEditingEducation && <p className="text-xs text-neutral-500 mt-2">{t('profileFieldLabels', 'transcriptUploadNote')}</p>}
                        </div>
                    ))}
                    {isEditingEducation && (
                        <button type="button" onClick={addEducationEntry} className="text-white mt-4 text-sm text-primary hover:underline flex items-center">
                            <PlusCircle size={16} className="mr-1" /> {t('profile', 'addAnotherInstitution')}
                        </button>
                    )}

                    <h4 className="text-md font-semibold text-neutral-700 mt-6 mb-3 border-b pb-2 flex items-center"><Languages size={18} className="mr-2 text-primary" />{t('profileFieldLabels', 'englishProficiencySubHeader')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        {renderInputField('isNativeEnglishSpeakerLabel', 'isNativeEnglishSpeaker', customEducationalData.languageProficiency?.isNativeEnglishSpeaker, handleLanguageProficiencyChange, 'select', isEditingEducation, true, undefined, [
                            { value: 'yes', labelKey: 'yes' }, { value: 'no', labelKey: 'no' }
                        ])}
                        {customEducationalData.languageProficiency?.isNativeEnglishSpeaker === 'no' && (
                            <>
                                {renderInputField('englishTestTakenLabel', 'testTaken', customEducationalData.languageProficiency?.testTaken, handleLanguageProficiencyChange, 'select', isEditingEducation, true, undefined, [
                                    { value: 'TOEFL', labelKey: 'testTOEFL' }, { value: 'IELTS', labelKey: 'testIELTS' }, { value: 'Duolingo', labelKey: 'testDuolingo' }, { value: 'Cambridge', labelKey: 'testCambridge' }, { value: 'Other', labelKey: 'testOther' }
                                ])}
                                {renderInputField('englishOverallScoreLabel', 'overallScore', customEducationalData.languageProficiency?.overallScore, handleLanguageProficiencyChange, 'text', isEditingEducation, true)}
                                {renderInputField('englishTestDateLabel', 'testDate', customEducationalData.languageProficiency?.testDate, handleLanguageProficiencyChange, 'date', isEditingEducation, true)}
                                {isEditingEducation && <p className="text-xs text-neutral-500 mt-2 md:col-span-2">{t('profileFieldLabels', 'englishCertUploadNote')}</p>}
                            </>
                        )}
                    </div>

                    <h4 className="text-md font-semibold text-neutral-700 mt-6 mb-1 border-b pb-2 flex items-center"><Award size={18} className="mr-2 text-primary" />{t('profileFieldLabels', 'otherTestsSubHeader')}</h4>
                    {(customEducationalData.otherStandardizedTests || []).map((test, index) => (
                         <div key={test.id} className="mt-4 p-4 border border-neutral-200 rounded-md relative">
                            {isEditingEducation && (customEducationalData.otherStandardizedTests || []).length > 0 && ( // Only show remove if there are entries
                                <button type="button" onClick={() => removeStandardizedTest(index)} className=" text-white absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 z-10">
                                    <Trash2 size={16} />
                                </button>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                                {renderInputField(`testNameLabel`, `testName`, test.testName, (e) => handleStandardizedTestChange(index, e), 'text', isEditingEducation, true)}
                                {renderInputField(`testScoreLabel`, `score`, test.score, (e) => handleStandardizedTestChange(index, e), 'text', isEditingEducation, true)}
                                {renderInputField(`testDateTakenLabel`, `dateTaken`, test.dateTaken, (e) => handleStandardizedTestChange(index, e), 'date', isEditingEducation, true)}
                            </div>
                            {isEditingEducation && <p className="text-xs text-neutral-500 mt-2">{t('profileFieldLabels', 'testReportUploadNote')}</p>}
                        </div>
                    ))}
                    {isEditingEducation && (
                        <button type="button" onClick={addStandardizedTest} className="mt-4 text-sm text-white hover:underline flex items-center">
                            <PlusCircle size={16} className="mr-1" /> {t('profile', 'addAnotherTest')}
                        </button>
                    )}


                    {isEditingEducation && (
                        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                             <button type="button" onClick={() => { setIsEditingEducation(false); fetchActualCustomProfileData(); /* Re-fetch to discard changes */}} className=" px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md order-2 sm:order-1">
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