'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, GraduationCap, CheckCircle, AlertCircle, Plus, Trash2,
    Save, Loader2, MapPin, Calendar, Building, Award, Briefcase, Languages,
    ArrowLeft, ArrowRight
} from 'lucide-react';

// --- Types (Interfaces remain the same) ---
interface PersonalData {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    countryOfResidence?: string;
    streetAddress?: string;
    city?: string;
    stateProvince?: string;
    postalCode?: string;
}

interface EducationEntry {
    id: string;
    institutionName?: string;
    degreeName?: string;
    fieldOfStudy?: string;
    graduationYear?: string;
}

interface LanguageProficiency {
    isNativeEnglishSpeaker?: 'yes' | 'no' | '';
    testTaken?: 'TOEFL' | 'IELTS' | 'Duolingo' | 'Cambridge' | 'Other' | '';
    overallScore?: string;
    testDate?: string;
}

interface EducationalData {
    highestLevelOfEducation?: 'High School' | "Associate's Degree" | "Bachelor's Degree" | "Master's Degree" | "Doctorate (PhD)" | 'Other' | '';
    previousEducation?: EducationEntry[];
}

// --- Initial States ---
const initialPersonalData: PersonalData = {
    firstName: '', lastName: '', dateOfBirth: '', gender: '', nationality: '', countryOfResidence: '',
    streetAddress: '', city: '', stateProvince: '', postalCode: '',
};
const initialEducationalData: EducationalData = {
    highestLevelOfEducation: '',
    previousEducation: [{ id: Date.now().toString(), institutionName: '', degreeName: '', fieldOfStudy: '', graduationYear: '' }],
};
const initialLanguageData: LanguageProficiency = {
    isNativeEnglishSpeaker: '', testTaken: '', overallScore: '', testDate: ''
};


// --- Mock API Functions (using localStorage) ---
const fetchProfileData = async (): Promise<{ personal: PersonalData, education: EducationalData, language: LanguageProficiency }> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const storedData = localStorage.getItem('userProfileDataV3');
    if (storedData) return JSON.parse(storedData);
    return { personal: { ...initialPersonalData }, education: { ...initialEducationalData }, language: { ...initialLanguageData } };
};

const saveProfileData = async (data: { personal?: PersonalData, education?: EducationalData, language?: LanguageProficiency }): Promise<{ success: boolean; message: string; }> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const storedData = localStorage.getItem('userProfileDataV3');
    const currentData = storedData ? JSON.parse(storedData) : { personal: { ...initialPersonalData }, education: { ...initialEducationalData }, language: { ...initialLanguageData } };
    const newData = {
        personal: { ...currentData.personal, ...data.personal },
        education: { ...currentData.education, ...data.education },
        language: { ...currentData.language, ...data.language },
    };
    localStorage.setItem('userProfileDataV3', JSON.stringify(newData));
    return { success: true, message: 'Profile updated successfully!' };
};

// ============================================================================
// Reusable UI Sub-components
// ============================================================================
const Card = ({ children, className = "" }) => (
    <motion.div
        layout="position"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm ${className}`}>
        {children}
    </motion.div>
);

const SectionHeader = ({ title, subtitle, icon: Icon }) => (
    <div className="p-6 sm:p-8 border-b border-orange-200">
        <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Icon size={24} className="text-orange-500" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-orange-900">{title}</h2>
                {subtitle && <p className="text-orange-500 text-sm">{subtitle}</p>}
            </div>
        </div>
    </div>
);

const InputField = ({ label, name, value, onChange, type = 'text', isRequired = false, placeholder, icon: Icon, options }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
            {Icon && <Icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
            {options ? (
                <select id={name} name={name} value={value || ''} onChange={onChange} required={isRequired}
                    className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:bg-slate-100`}>
                    <option value="">Select...</option>
                    {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            ) : (
                <input type={type} id={name} name={name} value={value || ''} onChange={onChange} required={isRequired} placeholder={placeholder}
                    className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:bg-slate-100 placeholder-slate-400`} />
            )}
        </div>
    </div>
);

const SaveButton = ({ onClick, isSaving, text = "Save Changes", icon: Icon = Save }) => (
    <button onClick={onClick} disabled={isSaving}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed">
        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Icon size={18} />}
        {isSaving ? 'Saving...' : text}
    </button>
);

const NavButton = ({ onClick, text, icon: Icon }) => (
    <button onClick={onClick} type="button"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
        <Icon size={18} />
        {text}
    </button>
)

const HorizontalNav = ({ activeTab, onTabChange }) => {
    const navItems = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'language', label: 'Language', icon: Languages },
    ];

    return (
        <div className="mb-8 pb-2 border-b border-orange-200">
            <nav className="-mb-px flex space-x-6">
                {navItems.map(item => (
                    <button key={item.id} type="button" onClick={() => onTabChange(item.id)}
                        className={` bg-transparent group inline-flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-all
                            ${activeTab === item.id
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}>
                        <item.icon size={18} />
                        {item.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};


// ============================================================================
// Section Components
// ============================================================================

const SectionFooter = ({ children }) => (
    <div className="border-t border-slate-200 p-4 sm:p-6 flex justify-between items-center  rounded-b-2xl">
        {children}
    </div>
);

const PersonalInfoSection = ({ data, onChange, onSave, isSaving, onNext }) => (
    <Card>
        <SectionHeader title="Personal Information" subtitle="Your basic personal details and contact information" icon={User} />
        <div className="p-6 sm:p-8 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <InputField label="First Name" name="firstName" value={data.firstName} onChange={onChange} isRequired placeholder="Enter first name" />
                <InputField label="Last Name" name="lastName" value={data.lastName} onChange={onChange} isRequired placeholder="Enter last name" />
                <InputField label="Date of Birth" name="dateOfBirth" value={data.dateOfBirth} onChange={onChange} type="date" icon={Calendar} isRequired />
                <InputField label="Gender" name="gender" value={data.gender} onChange={onChange} options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }]} />
                <InputField label="Nationality" name="nationality" value={data.nationality} onChange={onChange} placeholder="e.g., American" isRequired />
                <InputField label="Country of Residence" name="countryOfResidence" value={data.countryOfResidence} onChange={onChange} placeholder="e.g., United States" isRequired />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2"><InputField label="Street Address" name="streetAddress" value={data.streetAddress} onChange={onChange} placeholder="123 Main St" icon={MapPin} /></div>
                <InputField label="City" name="city" value={data.city} onChange={onChange} placeholder="New York" />
                <InputField label="State / Province" name="stateProvince" value={data.stateProvince} onChange={onChange} placeholder="NY" />
                <InputField label="Postal Code" name="postalCode" value={data.postalCode} onChange={onChange} placeholder="10001" />
            </div>
        </div>
        <SectionFooter>
            <div /> {/* Spacer */}
            <SaveButton onClick={async () => { await onSave(); onNext(); }} isSaving={isSaving} text="Save and Next" icon={ArrowRight} />
        </SectionFooter>
    </Card>
);

const EducationSection = ({ data, onEducationalChange, onEntryChange, addEntry, removeEntry, onSave, isSaving, onNext, onPrev }) => (
    <Card>
        <SectionHeader title="Educational Background" subtitle="Your academic qualifications" icon={GraduationCap} />
        <div className="p-6 sm:p-8 pt-0 space-y-8">
            <InputField label="Highest Level of Education" name="highestLevelOfEducation" value={data.highestLevelOfEducation} onChange={onEducationalChange} icon={Award} isRequired
                options={[{ value: 'High School', label: "High School" }, { value: "Associate's Degree", label: "Associate's Degree" }, { value: "Bachelor's Degree", label: "Bachelor's Degree" }, { value: "Master's Degree", label: "Master's Degree" }, { value: "Doctorate (PhD)", label: "Doctorate (PhD)" }, { value: "Other", label: "Other" }]} />

            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2"><Briefcase size={20} className="text-slate-500" /> Previous Education</h3>
                {data.previousEducation?.map((entry, index) => (
                    <motion.div key={entry.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="p-5 border border-slate-200 rounded-xl space-y-4 relative bg-slate-50/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <InputField label="Institution Name" name="institutionName" value={entry.institutionName} onChange={(e) => onEntryChange(index, e)} placeholder="University of Example" icon={Building} />
                            <InputField label="Degree Name" name="degreeName" value={entry.degreeName} onChange={(e) => onEntryChange(index, e)} placeholder="Bachelor of Science" />
                            <InputField label="Field of Study" name="fieldOfStudy" value={entry.fieldOfStudy} onChange={(e) => onEntryChange(index, e)} placeholder="Computer Science" />
                            <InputField label="Graduation Year" name="graduationYear" value={entry.graduationYear} onChange={(e) => onEntryChange(index, e)} type="number" placeholder="2024" icon={Calendar} />
                        </div>
                        {data.previousEducation.length > 1 && (
                            <button type="button" onClick={() => removeEntry(index)} disabled={isSaving}
                                className="absolute top-3 right-3 p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500">
                                <Trash2 size={16} />
                            </button>
                        )}
                    </motion.div>
                ))}
                <button type="button" onClick={addEntry} disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 text-slate-600 rounded-lg hover:bg-slate-100 hover:border-solid hover:border-slate-400 transition-all duration-200 font-medium text-sm">
                    <Plus size={16} /> Add Education
                </button>
            </div>
        </div>
        <SectionFooter>
            <NavButton onClick={onPrev} text="Previous" icon={ArrowLeft} />
            <SaveButton onClick={async () => { await onSave(); onNext(); }} isSaving={isSaving} text="Save and Next" icon={ArrowRight} />
        </SectionFooter>
    </Card>
);

const LanguageSection = ({ data, onChange, onSave, isSaving, onPrev }) => (
    <Card>
        <SectionHeader title="Language Proficiency" subtitle="Details about your English language skills" icon={Languages} />
        <div className="p-6 sm:p-8 pt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Are you a native English speaker?" name="isNativeEnglishSpeaker" value={data.isNativeEnglishSpeaker} onChange={onChange}
                    options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />
                <AnimatePresence>
                    {data.isNativeEnglishSpeaker === 'no' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden pt-4 border-t border-slate-200">
                            <InputField label="English Test Taken" name="testTaken" value={data.testTaken} onChange={onChange}
                                options={[{ value: 'TOEFL', label: 'TOEFL' }, { value: 'IELTS', label: 'IELTS' }, { value: 'Duolingo', label: 'Duolingo' }, { value: 'Cambridge', label: 'Cambridge English' }, { value: 'Other', label: 'Other' }]} />
                            <InputField label="Overall Score" name="overallScore" value={data.overallScore} onChange={onChange} placeholder="e.g., 7.5 or 100" />
                            <InputField label="Test Date" name="testDate" value={data.testDate} onChange={onChange} type="date" icon={Calendar} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
        <SectionFooter>
            <NavButton onClick={onPrev} text="Previous" icon={ArrowLeft} />
            <SaveButton onClick={onSave} isSaving={isSaving} />
        </SectionFooter>
    </Card>
);


// ============================================================================
// Main Component
// ============================================================================
const UserProfileDetails = () => {
    const { user, isLoaded } = useUser();

    // State Management
    const TABS = ['personal', 'education', 'language'];
    const [activeTab, setActiveTab] = useState(TABS[0]);

    const [personalData, setPersonalData] = useState(initialPersonalData);
    const [educationalData, setEducationalData] = useState(initialEducationalData);
    const [languageData, setLanguageData] = useState(initialLanguageData);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);

    // Data Loading Effect
    useEffect(() => {
        if (!isLoaded) return;
        if (!user) { setIsLoading(false); return; }

        setIsLoading(true);
        fetchProfileData().then(data => {
            setPersonalData(prev => ({
                ...prev, ...data.personal,
                firstName: user.firstName || data.personal.firstName || '',
                lastName: user.lastName || data.personal.lastName || '',
            }));
            setEducationalData(prev => ({
                ...prev, ...data.education,
                previousEducation: (data.education.previousEducation?.length > 0)
                    ? data.education.previousEducation
                    : [{ id: Date.now().toString(), institutionName: '', degreeName: '', fieldOfStudy: '', graduationYear: '' }],
            }));
            setLanguageData(prev => ({ ...prev, ...data.language }));
        }).catch(err => console.error("Failed to load profile data:", err))
            .finally(() => setIsLoading(false));
    }, [isLoaded, user]);

    // Handlers
    const handleTabChange = (tabId) => {
        if (TABS.includes(tabId)) {
            setActiveTab(tabId);
        }
    };

    const goToNextTab = () => {
        const currentIndex = TABS.indexOf(activeTab);
        if (currentIndex < TABS.length - 1) {
            setActiveTab(TABS[currentIndex + 1]);
        }
    };

    const goToPrevTab = () => {
        const currentIndex = TABS.indexOf(activeTab);
        if (currentIndex > 0) {
            setActiveTab(TABS[currentIndex - 1]);
        }
    };

    const handlePersonalChange = (e) => setPersonalData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleEducationalChange = (e) => setEducationalData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleLanguageChange = (e) => setLanguageData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleEducationEntryChange = (index, e) => {
        const updatedEntries = [...educationalData.previousEducation];
        updatedEntries[index] = { ...updatedEntries[index], [e.target.name]: e.target.value };
        setEducationalData(prev => ({ ...prev, previousEducation: updatedEntries }));
    };
    const addEducationEntry = () => setEducationalData(prev => ({ ...prev, previousEducation: [...prev.previousEducation, { id: Date.now().toString(), institutionName: '', degreeName: '', fieldOfStudy: '', graduationYear: '' }] }));
    const removeEducationEntry = (index) => setEducationalData(prev => ({ ...prev, previousEducation: prev.previousEducation.filter((_, i) => i !== index) }));

    const handleSave = async (section) => {
        if (!user) return;
        setIsSaving(true); setSaveStatus(null);
        try {
            let dataToSave;
            if (section === 'personal') dataToSave = { personal: personalData };
            else if (section === 'education') dataToSave = { education: educationalData };
            else if (section === 'language') dataToSave = { language: languageData };
            else return;

            const result = await saveProfileData(dataToSave);
            setSaveStatus({ type: 'success', message: result.message });
        } catch (error) {
            setSaveStatus({ type: 'error', message: 'Error updating profile. Please try again.' });
            // Re-throw to prevent navigation on save failure
            throw error;
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveStatus(null), 4000);
        }
    };

    // Render Logic
    if (!isLoaded || isLoading) {
        return <div className="w-full flex justify-center items-center p-20"><Loader2 size={32} className="text-blue-500 animate-spin" /></div>;
    }
    if (!user) {
        return <div className="w-full text-center p-20"><p>Please sign in to manage your profile.</p></div>;
    }

    return (
        <div className="space-y-6">
            <AnimatePresence>
                {saveStatus && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className={`p-4 rounded-lg flex items-center gap-3 text-sm font-medium ${saveStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                        {saveStatus.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        {saveStatus.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <HorizontalNav activeTab={activeTab} onTabChange={handleTabChange} />

            <AnimatePresence mode="wait">
                <div key={activeTab}>
                    {activeTab === 'personal' && (
                        <PersonalInfoSection
                            data={personalData}
                            onChange={handlePersonalChange}
                            onSave={() => handleSave('personal')}
                            isSaving={isSaving}
                            onNext={goToNextTab}
                        />
                    )}
                    {activeTab === 'education' && (
                        <EducationSection
                            data={educationalData}
                            onEducationalChange={handleEducationalChange}
                            onEntryChange={handleEducationEntryChange}
                            addEntry={addEducationEntry}
                            removeEntry={removeEducationEntry}
                            onSave={() => handleSave('education')}
                            isSaving={isSaving}
                            onNext={goToNextTab}
                            onPrev={goToPrevTab}
                        />
                    )}
                    {activeTab === 'language' && (
                        <LanguageSection
                            data={languageData}
                            onChange={handleLanguageChange}
                            onSave={() => handleSave('language')}
                            isSaving={isSaving}
                            onPrev={goToPrevTab}
                        />
                    )}
                </div>
            </AnimatePresence>
        </div>
    );
};

export default UserProfileDetails;