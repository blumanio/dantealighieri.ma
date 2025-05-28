// File: client/components/profile/TrackedUniversityItem.tsx
// Create this new file

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { University } from '@/components/UniversityCard'; // Re-use the extended University type
import { CalendarDays, MapPin, Trash2, Loader2, ChevronDown, ChevronUp, ExternalLink as LinkIcon } from 'lucide-react';
import { parseDeadlineDateString } from '@/lib/data'; // Ensure this is robust
import { useLanguage } from '@/context/LanguageContext';

interface TrackedUniversityItemProps {
    university: University; // Using the extended University type from UniversityCard
    onUntrack: (universityId: number) => void;
    t: (namespace: string, key: string, options?: any) => string;
}

const TrackedUniversityItem: React.FC<TrackedUniversityItemProps> = ({ university, onUntrack, t }) => {
    const { language } = useLanguage();
    const [isUntracking, setIsUntracking] = useState(false);
    const [status, setStatus] = useState<'Open' | 'Closed' | 'Coming Soon' | 'TBA'>('TBA');
    const [deadlines, setDeadlines] = useState<any[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let isOpen = false;
        let hasFutureIntakes = false;
        const processedDeadlines: any[] = [];

        if (university.intakes && university.intakes.length > 0) {
            university.intakes.forEach((intake, index) => {
                const startDate = intake.start_date ? parseDeadlineDateString(intake.start_date, today.getFullYear()) : null;
                const endDate = intake.end_date ? parseDeadlineDateString(intake.end_date, today.getFullYear()) : null;
                
                if (endDate && endDate >= today) { // Only consider upcoming or ongoing
                    processedDeadlines.push({
                        id: `${university.id}-intake-${index}`,
                        type: intake.name || `Intake ${index + 1}`,
                        date: endDate,
                        startDate: startDate,
                        notes: intake.notes,
                        isUpcoming: startDate ? startDate > today : endDate > today,
                        isOngoing: startDate && endDate ? (today >= startDate && today <= endDate) : false,
                    });
                }

                if (startDate && endDate && today >= startDate && today <= endDate) {
                    isOpen = true;
                }
                if (startDate && startDate > today) {
                    hasFutureIntakes = true;
                }
            });
            
            processedDeadlines.sort((a, b) => a.date.getTime() - b.date.getTime());
            setDeadlines(processedDeadlines);
        }
        
        if (isOpen) setStatus('Open');
        else if (hasFutureIntakes) setStatus('Coming Soon');
        else if (university.intakes && university.intakes.length > 0) setStatus('Closed');
        else setStatus('TBA');

    }, [university.intakes, university.id]);


    const handleUntrackClick = async () => {
        setIsUntracking(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 700));
        console.log(`Placeholder: Untracked university ${university.id}`);
        onUntrack(university.id); // Callback to parent to update its state
        setIsUntracking(false);
    };
    
    const statusText = t('universities', status.toLowerCase().replace(/\s+/g, ''), { defaultValue: status });
    let statusColorClass = 'bg-gray-100 text-gray-700';
    if (status === 'Open') statusColorClass = 'bg-green-100 text-green-700';
    else if (status === 'Coming Soon') statusColorClass = 'bg-yellow-100 text-yellow-700';
    else if (status === 'Closed') statusColorClass = 'bg-red-100 text-red-700';


    return (
        <div className="bg-white p-4 shadow rounded-lg border border-neutral-200 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start">
                <div className="flex-1 mb-3 sm:mb-0">
                    <h4 className="text-lg font-semibold text-primary hover:underline">
                        <Link href={university.application_link || '#'} target="_blank" rel="noopener noreferrer">
                            {university.name}
                        </Link>
                    </h4>
                    <p className="text-sm text-neutral-600 flex items-center"><MapPin size={14} className="mr-1 text-neutral-400"/>{university.location}</p>
                    <span className={`mt-1 inline-block px-2 py-0.5 text-xs font-medium rounded-full ${statusColorClass}`}>
                        {statusText}
                    </span>
                </div>
                <button
                    onClick={handleUntrackClick}
                    disabled={isUntracking}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                    title={t('profile', 'trackedUniversitiesUntrackTooltip', { defaultValue: 'Stop tracking this university' })}
                >
                    {isUntracking ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                </button>
            </div>

            {deadlines.length > 0 && (
                 <div className="mt-3 pt-3 border-t border-neutral-100">
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-sm text-primary hover:underline flex items-center w-full justify-between"
                    >
                        <span>{isExpanded ? t('common','hideDeadlines') : t('common','showDeadlines', {count: deadlines.length})}</span>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {isExpanded && (
                        <div className="mt-2 space-y-2 pl-2">
                            {deadlines.map(deadline => (
                                <div key={deadline.id} className="p-2 bg-neutral-50 rounded-md border-l-2 border-primary/50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-neutral-700">{deadline.type}</p>
                                            {deadline.startDate && <p className="text-xs text-neutral-500">{t('universities', 'start')}: {new Date(deadline.startDate).toLocaleDateString(language)}</p>}
                                            {deadline.notes && <p className="text-xs italic text-neutral-500 mt-0.5">{deadline.notes}</p>}
                                        </div>
                                        <div className="text-right ml-2 shrink-0">
                                            <p className="text-sm font-semibold text-neutral-800">
                                                {new Date(deadline.date).toLocaleDateString(language, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                     {university.application_link && (
                                        <a href={university.application_link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center mt-1">
                                            {t('common', 'moreInfo')} <LinkIcon size={12} className="ml-1" />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            {deadlines.length === 0 && (
                 <p className="text-xs text-neutral-500 mt-2 pt-2 border-t border-neutral-100">{t('profile','trackedUniversitiesNoUpcomingDeadlines')}</p>
            )}
        </div>
    );
};

export default TrackedUniversityItem;