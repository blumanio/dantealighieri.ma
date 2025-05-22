// components/profile/ApplicationGuideSection.tsx
'use client';

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ChecklistItemUI from './ChecklistItemUI'; // Ensure this path is correct
import type { ChecklistPhase } from '@/app/[lang]/profile/[[...userProfile]]/page'; // Adjust path if types moved

interface ApplicationGuideSectionProps {
    checklistData: ChecklistPhase[];
    onToggleItem: (phaseId: string, itemId: string, subItemId?: string) => void;
    onPhaseToggle: (phaseId: string) => void;
    t: (namespace: string, key: string) => string;
    language: string;
}

const ApplicationGuideSection: React.FC<ApplicationGuideSectionProps> = ({ checklistData, onToggleItem, onPhaseToggle, t, language }) => {
    return (
        <div>
            <h2 className="text-2xl font-semibold text-neutral-700 mb-1">{t('profile', 'applicationGuideTitle')}</h2>
            <p className="text-sm text-neutral-500 mb-6">{t('profile', 'applicationGuideSubtitle')}</p>
            <div className="space-y-4">
                {checklistData.map((phase, phaseIndex) => (
                    <div key={phase.id} className="border border-neutral-200 rounded-lg">
                        <button
                            onClick={() => onPhaseToggle(phase.id)}
                            className={`w-full flex justify-between items-center p-4 text-left ${phase.isOpen ? 'bg-primary/5 text-primary font-semibold' : 'bg-neutral-50 hover:bg-neutral-100'} rounded-t-lg transition-colors`}
                        >
                            <span className="text-lg">{`${t('profile', 'applicationGuidePhase')} ${phaseIndex + 1}: ${t('profile', phase.titleKey)}`}</span>
                            {phase.isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        {phase.isOpen && (
                            <div className="p-4 space-y-3 border-t border-neutral-200 bg-white">
                                {phase.items.map((item:any) => (
                                    <ChecklistItemUI
                                        key={item.id}
                                        item={item}
                                        phaseId={phase.id}
                                        onToggleItem={onToggleItem}
                                        t={t}
                                        language={language}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ApplicationGuideSection;