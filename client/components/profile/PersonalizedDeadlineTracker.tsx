// client/components/profile/PersonalizedDeadlineTracker.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import {
    Loader2, CalendarDays, Trash2, Edit2, AlertTriangle, Info, PlusCircle,
    Archive, ExternalLink as LinkIcon, ChevronDown, ChevronUp
} from 'lucide-react';
import Link from 'next/link';

// Interfaces (ensure these match your actual API response structure)
interface UniversityDeadline {
    _id?: string; // Pseudo-ID for key
    deadlineType: string;
    date: string | null; // ISO string from API
    startDate?: string | null; // ISO string from API
    description?: string;
    isRollingAdmission?: boolean;
    relatedLink?: string;
    isNearest?: boolean; // Flag from API
    totalUpcomingIntakesCount?: number; // Flag from API
    source?: 'real' | 'mock'; // Flag from API
    // --- Add dateObj for client-side use after parsing ---
    dateObj?: Date | null; 
}

interface CourseForTracker {
    _id: string;
    nome: string;
    uni: string;
    tipo?: string;
    academicYear?: string;
    intake?: string;
    link?: string;
}

interface TrackedItemData {
    _id: string; // ID of the TrackedItem document
    courseDetails: CourseForTracker;
    universityDeadlines: UniversityDeadline[]; // Array of ALL upcoming deadlines for this course, sorted
    userApplicationStatus: string;
    userNotes?: string;
    isArchived?: boolean;
    createdAt: string;
}

interface PersonalizedDeadlineTrackerProps {
    t: (namespace: string, key: string, options?: any) => string;
    lang: string;
}

const PersonalizedDeadlineTracker: React.FC<PersonalizedDeadlineTrackerProps> = ({ t, lang }) => {
    const { user, isSignedIn, isLoaded } = useUser();
    const [trackedItems, setTrackedItems] = useState<TrackedItemData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [currentNotes, setCurrentNotes] = useState('');
    const [currentStatus, setCurrentStatus] = useState('');
    const [expandedDeadlines, setExpandedDeadlines] = useState<Record<string, boolean>>({});


    const fetchTrackedItems = async () => {
        if (!user) return;
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/tracked-items');
            const result = await response.json();
            if (response.ok && result.success) {
                // Process deadlines to create dateObj right after fetching
                const processedData = (result.data || []).map((item: TrackedItemData) => ({
                    ...item,
                    universityDeadlines: (item.universityDeadlines || []).map(d => ({
                        ...d,
                        dateObj: d.date ? new Date(d.date) : null
                    })).sort((a,b) => (a.dateObj?.getTime() || 0) - (b.dateObj?.getTime() || 0)) // Ensure sorted
                }));
                setTrackedItems(processedData);
            } else {
                throw new Error(result.message || 'Failed to fetch tracked items');
            }
        } catch (err: any) {
            setError(err.message);
            setTrackedItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetchTrackedItems();
        } else if (isLoaded && !isSignedIn) {
            setIsLoading(false);
            setTrackedItems([]);
        }
    }, [isLoaded, isSignedIn, user]);

    const handleRemoveItem = async (trackedItemId: string) => {
        // ... (same as your existing function)
        if (!window.confirm(t('profile', 'confirmRemoveTrackedItem', { defaultValue: "Are you sure you want to stop tracking this item?" }))) {
            return;
        }
        try {
            const response = await fetch(`/api/tracked-items/${trackedItemId}`, { method: 'DELETE' });
            const result = await response.json();
            if (response.ok && result.success) {
                setTrackedItems(prev => prev.filter(item => item._id !== trackedItemId));
            } else {
                throw new Error(result.message || 'Failed to remove item');
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleEditItem = (item: TrackedItemData) => {
        // ... (same as your existing function)
        setEditingItemId(item._id);
        setCurrentNotes(item.userNotes || '');
        setCurrentStatus(item.userApplicationStatus);
    };

    const handleSaveEditedItem = async (trackedItemId: string) => {
        // ... (same as your existing function, but ensure API returns enriched data)
        try {
            const response = await fetch(`/api/tracked-items/${trackedItemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userApplicationStatus: currentStatus, userNotes: currentNotes })
            });
            const result = await response.json();
            if (response.ok && result.success && result.data) {
                 const updatedItemWithDateObjs = {
                    ...result.data,
                    universityDeadlines: (result.data.universityDeadlines || []).map((d: any) => ({
                        ...d,
                        dateObj: d.date ? new Date(d.date) : null
                    })).sort((a:any,b:any) => (a.dateObj?.getTime() || 0) - (b.dateObj?.getTime() || 0))
                };
                setTrackedItems(prev => prev.map(item => item._id === trackedItemId ? updatedItemWithDateObjs : item));
                setEditingItemId(null);
            } else {
                throw new Error(result.message || 'Failed to update item');
            }
        } catch (err: any) {
            setError(err.message);
        }
    };
    
    const handleArchiveItem = async (trackedItemId: string, archiveStatus: boolean) => {
        // ... (same as your existing function)
         try {
            const response = await fetch(`/api/tracked-items/${trackedItemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isArchived: archiveStatus })
            });
            const result = await response.json();
            if (response.ok && result.success) {
                fetchTrackedItems(); 
            } else {
                throw new Error(result.message || 'Failed to update archive status');
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const toggleExpandDeadlines = (trackedItemId: string) => {
        setExpandedDeadlines(prev => ({
            ...prev,
            [trackedItemId]: !prev[trackedItemId]
        }));
    };

    const getDaysRemaining = (dateObj: Date | null | undefined): number | null => {
        if (!dateObj) return null;
        const today = new Date();
        const currentDateMidnight = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
        const deadlineDateMidnight = new Date(Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate()));
        
        if (deadlineDateMidnight >= currentDateMidnight) {
            return Math.ceil((deadlineDateMidnight.getTime() - currentDateMidnight.getTime()) / (1000 * 60 * 60 * 24));
        }
        return -1; // Indicates past
    };
    
    const applicationStatusOptions = [
        'Not Started', 'Researching', 'Preparing Documents', 'Awaiting Pre Enrollment',
        'Applied', 'Awaiting Results', 'Accepted', 'Rejected', 'Enrolled'
    ];

    // ... (isLoading, error, !isSignedIn checks from your existing code) ...
    if (isLoading) {
        return <div className="flex justify-center items-center p-10"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }
    if (error) {
        return <div className="p-4 my-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            <span className="font-medium">{t('common', 'errorOccurred', { defaultValue: 'Error:'})}</span> {error}
        </div>;
    }
    if (!isSignedIn) {
        return ( <div className="text-center p-10"> <Info size={48} className="mx-auto text-primary mb-4" /> <p className="text-lg font-semibold">{t('profile', 'signInToTrackDeadlinesTitle', { defaultValue: "Sign in to Track Your Deadlines" })}</p> <p className="text-neutral-600">{t('profile', 'signInToTrackDeadlinesPrompt', { defaultValue: "Log in or create an account to add programs to your personalized deadline tracker." })}</p> </div> );
    }

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-semibold text-neutral-800 mb-1 flex items-center">
                    <CalendarDays size={28} className="mr-3 text-primary" /> {t('profile', 'personalizedDeadlineTrackerTitle', { defaultValue: "Personalized Deadline Tracker" })}
                </h3>
                <p className="text-sm text-neutral-600">{t('profile', 'deadlineTrackerDescription', {defaultValue: "Deadlines for courses you are actively tracking, based on university intake information."})}</p>
                 <div className="mt-4">
                    <Link href={`/${lang}/program-search`} 
                         className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        <PlusCircle size={18} className="mr-2" />
                        {t('profile', 'findAndTrackCourses', {defaultValue: "Find & Track Courses"})}
                    </Link>
                </div>
            </div>

            {trackedItems.length === 0 && !isLoading && (
                <div className="text-center p-10 border-2 border-dashed border-neutral-300 rounded-lg">
                     <Info size={48} className="mx-auto text-neutral-400 mb-4" />
                    <p className="text-lg font-semibold text-neutral-700">{t('profile', 'noTrackedItemsTitle', { defaultValue: "No Deadlines Tracked Yet" })}</p>
                    <p className="text-neutral-600">{t('profile', 'noTrackedItemsPrompt', { defaultValue: "Start by finding programs and adding them to your tracker to see relevant deadlines here." })}</p>
                </div>
            )}

            {trackedItems.length > 0 && (
                 <div className="mt-6 mb-4">
                    <h4 className="text-xl font-medium text-neutral-700">{t('profile', 'trackedCoursesAndDeadlines', {defaultValue: "Your Tracked Courses & Deadlines"})}</h4>
                 </div>
            )}
            <div className="space-y-6">
                {trackedItems.map(item => {
                    // Find the nearest deadline for this item
                    // The API already sorts universityDeadlines and flags 'isNearest' on the first upcoming one.
                    // Or, we can just take the first one if the array is guaranteed to be sorted and filtered for upcoming.
                    const nearestDeadline = item.universityDeadlines?.find(d => d.isNearest) || item.universityDeadlines?.[0];
                    const totalUpcomingForThisItem = nearestDeadline?.totalUpcomingIntakesCount || item.universityDeadlines?.length || 0;
                    const daysRemainingForNearest = nearestDeadline?.dateObj ? getDaysRemaining(nearestDeadline.dateObj) : null;

                    return (
                        <div key={item._id} className={`bg-white p-4 shadow rounded-lg border hover:shadow-md transition-shadow ${nearestDeadline?.isNearest && daysRemainingForNearest !== null && daysRemainingForNearest >=0 ? 'border-primary ring-1 ring-primary' : 'border-neutral-200'}`}>
                            {/* Course Info */}
                            <div className="flex flex-col sm:flex-row justify-between items-start">
                                <div className="flex-grow mb-3 sm:mb-0">
                                    <h5 className="text-lg font-semibold text-primary">
                                        <Link href={item.courseDetails.link || `/${lang}/program-search`}
                                              target={item.courseDetails.link ? "_blank" : "_self"} rel="noopener noreferrer" className="hover:underline">
                                            {item.courseDetails.nome || t('common', 'unknownCourse')}
                                        </Link>
                                    </h5>
                                    <p className="text-sm text-neutral-600">{item.courseDetails.uni || t('common', 'unknownUniversity')}</p>
                                    {item.courseDetails.academicYear && <p className="text-xs text-neutral-500">{t('profileFieldLabels', 'academicYearLabel', {defaultValue: "Academic Year"})}: {item.courseDetails.academicYear}</p>}
                                </div>
                                <div className="flex-shrink-0 flex flex-col items-start sm:items-end">
                                   {nearestDeadline && nearestDeadline.date ? (
                                        <>
                                            <p className="text-md font-semibold text-red-600">
                                                {t('profileFieldLabels', 'nextDeadline', { defaultValue: "Next Deadline" })}: {new Date(nearestDeadline.date).toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                            {(daysRemainingForNearest !== null && daysRemainingForNearest >= 0) && (
                                                <p className="text-xs text-neutral-500">
                                                    {daysRemainingForNearest === 0 ? t('common', 'today', { defaultValue: "Today!" }) : t('common', 'daysRemaining', { count: daysRemainingForNearest })}
                                                </p>
                                            )}
                                            <p className="text-xs text-neutral-600 mt-1">({nearestDeadline.deadlineType})</p>
                                        </>
                                    ) : (
                                        <p className="text-sm text-neutral-500">{t('profile', 'noUpcomingDeadlinesFound', {defaultValue: "No upcoming deadlines found for this item."})}</p>
                                    )}
                                </div>
                            </div>

                            {/* All Deadlines for this item (expandable) */}
                            {item.universityDeadlines && item.universityDeadlines.length > 0 && (
                                <div className="mt-3">
                                    <button
                                        onClick={() => toggleExpandDeadlines(item._id)}
                                        className="text-xs  hover:text-sky-800 flex items-center"
                                    >
                                        {expandedDeadlines[item._id] ? 
                                            <ChevronUp size={14} className="mr-1" /> : 
                                            <ChevronDown size={14} className="mr-1" />
                                        }
                                        {expandedDeadlines[item._id] ? 
                                            t('common', 'hideAllDeadlines', {defaultValue: "Hide all deadlines"}) : 
                                            t('common', 'showAllDeadlines', {count: item.universityDeadlines.length, defaultValue: `Show all ${item.universityDeadlines.length} deadline(s)`})
                                        }
                                         {nearestDeadline?.source === 'mock' && !expandedDeadlines[item._id] && <span className="ml-2 text-xs text-amber-600">({t('common', 'mockDataNoticeShort', {defaultValue: 'Sample Data'})})</span>}
                                    </button>
                                    {expandedDeadlines[item._id] && (
                                        <div className="mt-2 space-y-2 pl-4 border-l-2 border-neutral-200">
                                            {item.universityDeadlines.map(d => {
                                                const dDaysRemaining = getDaysRemaining(d.dateObj);
                                                return (
                                                <div key={d._id} className={`p-2 rounded ${d.isNearest ? 'bg-primary/5':''}`}>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="text-sm font-medium text-neutral-700">{d.deadlineType}</p>
                                                            {d.startDate && <p className="text-xs text-neutral-500">{t('profileFieldLabels', 'startDateLabel', {defaultValue: "Starts"})}: {new Date(d.startDate).toLocaleDateString(lang, {month:'short', day:'numeric', year:'numeric'})}</p>}
                                                            {d.description && <p className="text-xs italic text-neutral-500">{d.description}</p>}
                                                            {d.source === 'mock' && <p className="text-xs text-amber-600">({t('common', 'mockDataNotice', { defaultValue: 'Sample data shown. Please verify.'})})</p>}
                                                        </div>
                                                        <div className="text-right ml-2 shrink-0">
                                                            <p className={`text-sm font-semibold ${dDaysRemaining !== null && dDaysRemaining < 7 ? 'text-red-500' : 'text-neutral-800'}`}>
                                                                {d.date ? new Date(d.date).toLocaleDateString(lang, {month:'short', day:'numeric', year:'numeric'}) : t('common', 'dateTBA')}
                                                            </p>
                                                            {(dDaysRemaining !== null && dDaysRemaining >= 0) && (
                                                                <p className="text-xs text-neutral-500">
                                                                    {dDaysRemaining === 0 ? t('common', 'today') : t('common', 'daysRemaining', {count: dDaysRemaining})}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {d.relatedLink && d.relatedLink !== "#mock-application" && d.relatedLink !== "#mock-scholarship" &&
                                                        <a href={d.relatedLink} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center mt-1">
                                                            {t('common', 'moreInfo')} <LinkIcon size={12} className="ml-1" />
                                                        </a>
                                                    }
                                                </div>
                                            )}
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {/* Editing UI for status and notes (same as before) */}
                            <div className="mt-3 pt-3 border-t border-neutral-200">
                                {/* ... (Your existing editing UI for status and notes - make sure it references `item.userApplicationStatus` and `item.userNotes`) ... */}
                                {editingItemId === item._id ? (
                                    <div className="space-y-3"> {/* ... form ... */} 
                                         <div>
                                            <label htmlFor={`status-${item._id}`} className="block text-xs font-medium text-neutral-700">{t('profileFieldLabels', 'applicationStatusLabel', {defaultValue: "Application Status"})}</label>
                                            <select id={`status-${item._id}`} value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value)}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                                                {applicationStatusOptions.map(opt => (<option key={opt} value={opt}>{t('profileFieldLabels', opt.replace(/\s+/g, ''), {defaultValue: opt})}</option>))}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor={`notes-${item._id}`} className="block text-xs font-medium text-neutral-700">{t('profileFieldLabels', 'notesLabel', {defaultValue: "Notes"})}</label>
                                            <textarea id={`notes-${item._id}`} rows={2} value={currentNotes} onChange={(e) => setCurrentNotes(e.target.value)}
                                                className="mt-1 block w-full p-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                                                placeholder={t('profilePlaceholders', 'addYourNotesHere', {defaultValue: "Add your notes here..."})} />
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <button onClick={() => setEditingItemId(null)} className="px-3 py-1 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md">{t('common', 'cancel')}</button>
                                            <button onClick={() => handleSaveEditedItem(item._id)} className="px-3 py-1 text-xs font-medium text-white bg-primary hover:bg-primary-dark rounded-md">{t('common', 'saveChanges')}</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-1 text-sm">
                                        <p><span className="font-medium">{t('profileFieldLabels', 'applicationStatusLabel', {defaultValue: "Status"})}:</span> {t('profileFieldLabels', item.userApplicationStatus.replace(/\s+/g, ''), {defaultValue: item.userApplicationStatus})}</p>
                                        {item.userNotes && <p className="text-xs text-neutral-500 whitespace-pre-wrap break-words"><span className="font-medium">{t('profileFieldLabels', 'notesLabel', {defaultValue: "Notes"})}:</span> {item.userNotes}</p>}
                                    </div>
                                )}
                            </div>
                            <div className="mt-3 flex justify-end space-x-2">
                                {editingItemId !== item._id &&
                                    <button onClick={() => handleEditItem(item)} className="p-1.5 text-neutral-500 hover:text-primary" title={t('common', 'editStatusNotes', {defaultValue: "Edit Status/Notes"})}>
                                        <Edit2 size={16} /> <span className="sr-only">{t('common', 'edit')}</span>
                                    </button>
                                }
                                <button onClick={() => handleArchiveItem(item._id, true)} className="p-1.5 text-neutral-500 hover:text-yellow-600" title={t('common', 'archive', {defaultValue: "Archive"})}>
                                    <Archive size={16} /> <span className="sr-only">{t('common', 'archive')}</span>
                                </button>
                                <button onClick={() => handleRemoveItem(item._id)} className="p-1.5 text-neutral-500 hover:text-red-600" title={t('common', 'remove', {defaultValue: "Remove"})}>
                                    <Trash2 size={16} /> <span className="sr-only">{t('common', 'remove')}</span>
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default PersonalizedDeadlineTracker;