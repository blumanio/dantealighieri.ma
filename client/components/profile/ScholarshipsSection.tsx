// components/profile/ScholarshipsSection.tsx
'use client';

import React from 'react';
import { CalendarDays, ExternalLink, Info } from 'lucide-react';
import type { Scholarship } from '@/app/[lang]/scholarships/page'; // Adjust path if types moved

interface ScholarshipsSectionProps {
    scholarships: Scholarship[];
    t: (namespace: string, key: string) => string;
}

const ScholarshipsSection: React.FC<ScholarshipsSectionProps> = ({ scholarships, t }) => {
    return (
        <div>
            <h2 className="text-2xl font-semibold text-neutral-700 mb-6">{t('profile', 'scholarshipsTitle')}</h2>
            {/* TODO: Add filters for scholarships: by Field, Degree, Region etc. */}
            {scholarships?.length > 0 ? (
                <div className="space-y-4">
                    {scholarships.map(sch => (
                        <div key={sch.id} className="bg-neutral-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold text-primary mb-1">{sch.title}</h3>
                                {sch.amount && <p className="text-sm font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{sch.amount}</p>}
                            </div>
                            <p className="text-xs text-neutral-500 mb-1">{t('profile', 'scholarshipsProvider')}: {sch.provider}</p>
                            <p className="text-sm text-neutral-600 mb-2">{sch.eligibilitySummary}</p>
                            <div className="flex justify-between items-center text-xs text-neutral-500">
                                <p className="flex items-center gap-1"><CalendarDays size={14} /> {t('profile', 'scholarshipsDeadline')}: {sch.keyInfo.applicationDeadline}</p>
                                <a href={sch.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium flex items-center gap-1">
                                    {t('profile', 'scholarshipsViewDetails')} <ExternalLink size={12} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <Info size={40} className="text-neutral-400 mx-auto mb-3" />
                    <p className="text-neutral-500">{t('profile', 'scholarshipsNoScholarships')}</p>
                    <p className="text-sm text-neutral-400 mt-2">{t('profile', 'scholarshipsCheckResources')}</p>
                    {/* TODO: Add links to general scholarship resources */}
                </div>
            )}
        </div>
    );
};

export default ScholarshipsSection;