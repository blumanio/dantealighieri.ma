// client/components/profile/PremiumApplicationHub.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
// Assuming you have a way to get user's detailed profile (degree, nationality)
// import { useUserProfileDetails } from '@/hooks/useUserProfileDetails'; // Hypothetical hook

import { ChevronDown, ChevronUp, CheckCircle, AlertCircle, ExternalLink, HelpCircle, UserCircle, Link } from 'lucide-react';

// Define types for roadmap phases, checklist items etc. (ideally in a shared types file)
interface RoadmapStep {
    id: string;
    titleKey: string; // for t('premiumHub', titleKey)
    descriptionKey: string;
    isCompleted: boolean; // User-specific progress
    subTasks?: { id: string; taskKey: string; isCompleted: boolean; link?: string }[];
    relatedFaqIds?: string[];
}
interface RoadmapPhase {
    id: string;
    titleKey: string;
    isOpen?: boolean;
    steps: RoadmapStep[];
}
// ... other types for DocumentChecklistItem, FaqItem ...

interface PremiumApplicationHubProps {
    t: (namespace: string, key: string, options?: any) => string;
    lang: string;
    // User's specific profile data needed for personalization
    userTargetDegree?: string; // e.g., "Master's"
    userNationality?: string; // e.g., "IN" (India), "US" (USA)
    userTargetLanguage?: string; // e.g., "English"
}

// Mock data structure for the roadmap - this would be more complex and possibly fetched
const INITIAL_ROADMAP_STRUCTURE: RoadmapPhase[] = [
    {
        id: 'phase1', titleKey: 'roadmapPhase1Title', isOpen: true, steps: [
            { id: '1.1', titleKey: 'stepResearchProgramsTitle', descriptionKey: 'stepResearchProgramsDesc', isCompleted: false, subTasks: [{ id: '1.1.1', taskKey: 'subtaskUseSearch', isCompleted: false, link: '/program-search' }] },
            { id: '1.2', titleKey: 'stepCheckRequirementsTitle', descriptionKey: 'stepCheckRequirementsDesc', isCompleted: false },
        ]
    },
    { id: 'phase2', titleKey: 'roadmapPhase2Title', steps: [ /* ... */] },
    {
        id: 'phase3', titleKey: 'roadmapPhase3Title_UniversitalyVisa', steps: [
            { id: '3.1', titleKey: 'stepUniversitalyTitle', descriptionKey: 'stepUniversitalyDesc', isCompleted: false },
            { id: '3.2', titleKey: 'stepVisaDTitle', descriptionKey: 'stepVisaDDesc', isCompleted: false },
            { id: '3.3', titleKey: 'stepDoVCIMEATitle', descriptionKey: 'stepDoVCIMEAChứngDesc', isCompleted: false },
        ]
    },
    // ... other phases
];

// Mock for Document Checklist - generation logic would be here
const generateDocumentChecklist = (degree?: string, nationality?: string, lang?: string) => {
    let checklist = [
        { id: 'doc1', labelKey: 'docPassport', detailsKey: 'docPassportDetails', acquired: false },
        { id: 'doc2', labelKey: 'docAcademicTranscripts', detailsKey: 'docAcademicTranscriptsDetails', acquired: false },
    ];
    if (degree === "Master's") {
        checklist.push({ id: 'doc3', labelKey: 'docBachelorsDegree', detailsKey: 'docBachelorsDegreeDetails', acquired: false });
    }
    if (nationality && !['EU_COUNTRY_CODE_EXAMPLE'].includes(nationality.toUpperCase())) { // Simplified Non-EU check
        checklist.push({ id: 'doc4', labelKey: 'docVisaApplicationForm', detailsKey: 'docVisaApplicationFormDetails', acquired: false });
        checklist.push({ id: 'doc5', labelKey: 'docFinancialProof', detailsKey: 'docFinancialProofDetails', acquired: false });
    }
    if (lang === 'English') {
        checklist.push({ id: 'doc6', labelKey: 'docEnglishProficiency', detailsKey: 'docEnglishProficiencyDetails', acquired: false });
    }
    return checklist;
};

const PremiumApplicationHub: React.FC<PremiumApplicationHubProps> = ({
    t,
    lang,
    userTargetDegree, // e.g., "Master's" - fetched from user's extended profile
    userNationality,  // e.g., "IN" - fetched from user's extended profile
    userTargetLanguage // e.g., "English" - fetched from user's extended profile
}) => {
    const { user, isSignedIn, isLoaded } = useUser();
    const [roadmap, setRoadmap] = useState<RoadmapPhase[]>(INITIAL_ROADMAP_STRUCTURE); // User progress would be fetched and merged
    const [documentChecklist, setDocumentChecklist] = useState<any[]>([]);
    const [activeFaqs, setActiveFaqs] = useState<Record<string, boolean>>({});

    // ---- TODO: API Interaction for Roadmap & Checklist Progress ----
    // useEffect to fetch user's progress for roadmap & checklist and merge it.
    // Functions to save progress back to the backend.

    useEffect(() => {
        // Generate personalized document checklist
        setDocumentChecklist(generateDocumentChecklist(userTargetDegree, userNationality, userTargetLanguage));
        // In a real app, fetch user's saved progress for this checklist
    }, [userTargetDegree, userNationality, userTargetLanguage]);

    const toggleRoadmapPhase = (phaseId: string) => {
        setRoadmap(prev => prev.map(p => p.id === phaseId ? { ...p, isOpen: !p.isOpen } : p));
    };

    const toggleRoadmapStepCompletion = (phaseId: string, stepId: string) => {
        setRoadmap(prevRoadmap => prevRoadmap.map(phase => {
            if (phase.id === phaseId) {
                return {
                    ...phase,
                    steps: phase.steps.map(step =>
                        step.id === stepId ? { ...step, isCompleted: !step.isCompleted } : step
                    )
                };
            }
            return phase;
        }));
        // TODO: Call API to save this specific step's progress
        console.log(`Step ${stepId} in phase ${phaseId} toggled.`);
    };

    const toggleDocumentAcquired = (docId: string) => {
        setDocumentChecklist(prevDocs => prevDocs.map(doc =>
            doc.id === docId ? { ...doc, acquired: !doc.acquired } : doc
        ));
        // TODO: Call API to save document checklist progress
        console.log(`Document ${docId} toggled.`);
    };

    const toggleFaq = (faqId: string) => {
        setActiveFaqs(prev => ({ ...prev, [faqId]: !prev[faqId] }));
    };


    if (!isLoaded) return <div className="flex justify-center items-center p-8"><p>Loading application hub...</p></div>;
    if (!isSignedIn || !user) return <div className="p-8 text-center"><p>{t('common', 'signInToAccessPremium', { defaultValue: "Please sign in to access your personalized application hub." })}</p></div>;

    // Calculate overall progress (example)
    const totalSteps = roadmap.reduce((acc, phase) => acc + phase.steps.length, 0);
    const completedSteps = roadmap.reduce((acc, phase) => acc + phase.steps.filter(s => s.isCompleted).length, 0);
    const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    return (
        <div className="space-y-8">
            <header className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                    {t('premiumHub', 'title', { userName: user.firstName || 'Student' })}
                </h2>
                <p className="text-neutral-600">{t('premiumHub', 'subtitle')}</p>
                <div className="mt-4">
                    <p className="text-sm font-medium text-neutral-700">{t('premiumHub', 'overallProgress', { progress: progressPercentage })}</p>
                    <div className="w-full bg-neutral-200 rounded-full h-2.5 mt-1">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>
            </header>

            {/* 1. Step-by-Step Application Roadmap */}
            <section id="roadmap">
                <h3 className="text-xl font-semibold text-neutral-700 mb-4">{t('premiumHub', 'roadmapSectionTitle')}</h3>
                <div className="space-y-3">
                    {roadmap.map(phase => (
                        <div key={phase.id} className="border border-neutral-200 rounded-lg shadow-sm">
                            <button
                                onClick={() => toggleRoadmapPhase(phase.id)}
                                className="w-full flex justify-between items-center p-4 text-left bg-neutral-50 hover:bg-neutral-100 rounded-t-lg"
                            >
                                <span className="font-medium text-neutral-800">{t('premiumHub', phase.titleKey)}</span>
                                {phase.isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            {phase.isOpen && (
                                <div className="p-4 bg-white border-t border-neutral-200 space-y-4">
                                    {phase.steps.map(step => (
                                        <div key={step.id} className={`p-3 rounded-md flex items-start gap-3 transition-colors ${step.isCompleted ? 'bg-green-50 border-l-4 border-green-500' : 'bg-white hover:bg-neutral-50'}`}>
                                            <button onClick={() => toggleRoadmapStepCompletion(phase.id, step.id)} className="mt-1">
                                                {step.isCompleted ? <CheckCircle size={20} className="text-green-600" /> : <UserCircle size={20} className="text-neutral-400 hover:text-primary" />}
                                            </button>
                                            <div className="flex-1">
                                                <h4 className={`font-medium ${step.isCompleted ? 'line-through text-neutral-500' : 'text-neutral-700'}`}>{t('premiumHub', step.titleKey)}</h4>
                                                <p className={`text-xs text-neutral-500 ${step.isCompleted ? 'line-through' : ''}`}>{t('premiumHub', step.descriptionKey)}</p>
                                                {step.subTasks && step.subTasks.length > 0 && (
                                                    <ul className="mt-1 list-disc list-inside pl-1 space-y-0.5">
                                                        {step.subTasks.map(sub => (
                                                            <li key={sub.id} className="text-xs text-neutral-500">
                                                                {/* TODO: subtask completion logic */}
                                                                {sub.link ?
                                                                    <Link href={sub.link.startsWith('/') ? `/${lang}${sub.link}` : sub.link} className="hover:underline text-primary">
                                                                        {t('premiumHub', sub.taskKey)} <ExternalLink size={10} className="inline-block ml-0.5" />
                                                                    </Link>
                                                                    : t('premiumHub', sub.taskKey)}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* 2. Interactive Document Checklist */}
            <section id="documents">
                <h3 className="text-xl font-semibold text-neutral-700 mb-4">{t('premiumHub', 'docChecklistSectionTitle')}</h3>
                <div className="bg-white p-4 sm:p-6 border border-neutral-200 rounded-lg shadow-sm space-y-3">
                    {(documentChecklist.length === 0) && <p className="text-sm text-neutral-500">{t('premiumHub', 'docChecklistLoadingOrNotApplicable')}</p>}
                    {documentChecklist.map(doc => (
                        <div key={doc.id} className={`p-3 rounded-md flex items-center gap-3 transition-colors ${doc.acquired ? 'bg-green-50' : 'bg-white hover:bg-neutral-50 border border-neutral-100'}`}>
                            <button onClick={() => toggleDocumentAcquired(doc.id)}>
                                {doc.acquired ? <CheckCircle size={20} className="text-green-600" /> : <UserCircle size={20} className="text-neutral-400 hover:text-primary" />}
                            </button>
                            <div className="flex-1">
                                <span className={`font-medium text-sm ${doc.acquired ? 'line-through text-neutral-500' : 'text-neutral-700'}`}>{t('premiumHub', doc.labelKey)}</span>
                                {doc.detailsKey && <p className={`text-xs text-neutral-500 ${doc.acquired ? 'line-through' : ''}`}>{t('premiumHub', doc.detailsKey)}</p>}
                            </div>
                        </div>
                    ))}
                    <p className="text-xs text-neutral-500 pt-2">{t('premiumHub', 'docChecklistNote')}</p>
                </div>
            </section>

            {/* 3. Application Timeline Widget - Simplified version showing general key dates */}
            <section id="timeline">
                <h3 className="text-xl font-semibold text-neutral-700 mb-4">{t('premiumHub', 'timelineSectionTitle')}</h3>
                <div className="bg-white p-4 sm:p-6 border border-neutral-200 rounded-lg shadow-sm">
                    <p className="text-sm text-neutral-600 mb-2">{t('premiumHub', 'timelineGeneralDatesNote')}</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li><span className="font-medium">{t('premiumHub', 'timelinePreEnrollOpen')}:</span> {t('premiumHub', 'timelinePreEnrollOpenDate')}</li>
                        <li><span className="font-medium">{t('premiumHub', 'timelineVisaApplicationStart')}:</span> {t('premiumHub', 'timelineVisaApplicationStartDate')}</li>
                        <li><span className="font-medium">{t('premiumHub', 'timelineDSUScholarship')}:</span> {t('premiumHub', 'timelineDSUScholarshipDate')} (<Link href={`/${lang}/scholarships`} className="text-primary hover:underline">{t('common', 'learnMore')}</Link>)</li>
                    </ul>
                    <p className="text-xs text-neutral-500 mt-3">{t('premiumHub', 'timelineCheckOfficialNote')}</p>
                </div>
            </section>

            {/* 4. Pre-enrollment & Visa Guidance */}
            <section id="visa-guidance">
                <h3 className="text-xl font-semibold text-neutral-700 mb-4">{t('premiumHub', 'visaGuidanceSectionTitle')}</h3>
                <div className="bg-white p-4 sm:p-6 border border-neutral-200 rounded-lg shadow-sm space-y-4">
                    <div>
                        <h4 className="font-semibold text-neutral-800">{t('premiumHub', 'universitalyTitle')}</h4>
                        <p className="text-sm text-neutral-600 mt-1">{t('premiumHub', 'universitalyDesc')} <a href="https://www.universitaly.it/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{t('common', 'officialSiteLink')} <ExternalLink size={12} className="inline" /></a></p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-neutral-800">{t('premiumHub', 'dovCIMEAChứngTitle')}</h4>
                        <p className="text-sm text-neutral-600 mt-1">{t('premiumHub', 'dovCIMEAChứngDesc')}</p>
                        {/* TODO: Add smart links to more detailed guides */}
                    </div>
                    <div>
                        <h4 className="font-semibold text-neutral-800">{t('premiumHub', 'visaDTitle')}</h4>
                        <p className="text-sm text-neutral-600 mt-1">{t('premiumHub', 'visaDDesc_NonEU')}</p>
                        {/* TODO: Add smart links to more detailed guides or your visa services */}
                    </div>
                </div>
            </section>

            {/* 5. Scholarships & Tuition Insights */}
            <section id="scholarships-insights">
                <h3 className="text-xl font-semibold text-neutral-700 mb-4">{t('premiumHub', 'scholarshipTuitionSectionTitle')}</h3>
                <div className="bg-white p-4 sm:p-6 border border-neutral-200 rounded-lg shadow-sm space-y-3">
                    <p className="text-sm text-neutral-600">{t('premiumHub', 'scholarshipTuitionIntro')}</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>{t('premiumHub', 'scholarshipInsightDSU')} (<Link href={`/${lang}/scholarships/dsu`} className="text-primary hover:underline">{t('common', 'detailsHere')}</Link>)</li>
                        <li>{t('premiumHub', 'scholarshipInsightGov')} (<Link href={`/${lang}/scholarships/government`} className="text-primary hover:underline">{t('common', 'detailsHere')}</Link>)</li>
                        <li>{t('premiumHub', 'tuitionFeeInsight')}</li>
                    </ul>
                </div>
            </section>

            {/* 6. FAQs with Smart Links */}
            <section id="faqs">
                <h3 className="text-xl font-semibold text-neutral-700 mb-4">{t('premiumHub', 'faqSectionTitle')}</h3>
                <div className="space-y-3">
                    {/* Example FAQ Item - these would be curated */}
                    {[
                        { id: 'faq1', qKey: 'faqVisaWhenToApplyQ', aKey: 'faqVisaWhenToApplyA', relatedLinks: [{ textKey: 'linkOfficialVisaInfo', url: '#' }] },
                        { id: 'faq2', qKey: 'faqAccommodationBestWayQ', aKey: 'faqAccommodationBestWayA', relatedLinks: [] }
                    ].map(faq => (
                        <div key={faq.id} className="border border-neutral-200 rounded-lg bg-white shadow-sm">
                            <button
                                onClick={() => toggleFaq(faq.id)}
                                className="w-full flex justify-between items-center p-4 text-left hover:bg-neutral-50 rounded-lg"
                            >
                                <span className="font-medium text-neutral-700">{t('premiumHub', faq.qKey)}</span>
                                {activeFaqs[faq.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            {activeFaqs[faq.id] && (
                                <div className="p-4 border-t border-neutral-200 text-sm text-neutral-600 space-y-1">
                                    <p>{t('premiumHub', faq.aKey)}</p>
                                    {faq.relatedLinks && faq.relatedLinks.map((link, index) => (
                                        <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs block">
                                            {t('premiumHub', link.textKey)} <ExternalLink size={10} className="inline" />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>


            {/* This is a premium section, so a small note about accessing more detailed services could be here */}
            <div className="mt-10 p-4 bg-gradient-to-r from-primary/80 to-primary text-white rounded-lg text-center shadow-xl">
                <h4 className="font-bold text-lg">{t('premiumHub', 'needMoreHelpTitle')}</h4>
                <p className="text-sm mt-1 mb-3">{t('premiumHub', 'needMoreHelpDesc')}</p>
                <Link href={`/${lang}/services`} className="bg-white text-primary font-semibold py-2 px-4 rounded-md hover:bg-neutral-100 transition-colors">
                    {t('premiumHub', 'exploreServicesButton')}
                </Link>
            </div>

        </div>
    );
};

export default PremiumApplicationHub;