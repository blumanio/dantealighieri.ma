// File: client/components/UniversityTable.tsx
// (Ensure imports are correct)
import React, { useState, useMemo } from 'react';
import UniversityCard, { University } from './UniversityCard'; // University type might need to be defined here or imported from a shared types file
import { ChevronDown, FilterIcon, Search, X } from 'lucide-react';
import { Translation } from '@/app/i18n/types';
import { useLanguage } from '@/context/LanguageContext';
import { SignInButton } from '@clerk/nextjs';
import AnimatedLogos from './AnimatedLogos';

type UniversityTableProps = {
    universities: University[];
    isSignedIn: boolean;
};

const UniversityTable = ({ universities, isSignedIn }: UniversityTableProps) => {
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<{ status: string[], hasFee: boolean | null }>({
        status: [],
        hasFee: null
    });
    const [showFilters, setShowFilters] = useState(false);
    const { language, t } = useLanguage();
    const isRTL = language === 'ar';

    const toggleRow = (id: number) => {
        setExpandedRows(prev => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(id)) {
                newExpanded.delete(id);
            } else {
                newExpanded.add(id);
            }
            return newExpanded;
        });
    };

    const filteredUniversities = useMemo(() => {
        return universities.filter(uni => {
            const matchesSearch = searchTerm === '' ||
                uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                uni.location.toLowerCase().includes(searchTerm.toLowerCase());

            // Status is now dynamic, so we filter based on calculated currentStatus if needed,
            // or use the static `uni.status` for filtering if preferred.
            // For dynamic status filtering, one would need to calculate status for all unis first.
            // Here, we'll assume uni.status from data is the primary filter.
            const matchesStatusFilter = filters.status.length === 0 || filters.status.includes(uni.status || 'TBA');


            const matchesFee = filters.hasFee === null ||
                (filters.hasFee ? uni.admission_fee > 0 : uni.admission_fee === 0);

            return matchesSearch && matchesStatusFilter && matchesFee;
        });
    }, [universities, searchTerm, filters]);

    // Placeholder callbacks for favorite/track toggles
    const handleFavoriteToggle = (universityId: number, isFavorite: boolean, newFavoriteId: string | null) => {
        console.log(`University ${universityId} favorite status: ${isFavorite}, ID: ${newFavoriteId}`);
        // Here you might update a global state or refetch data if counts are shown in the table summary
    };

    const handleTrackToggle = (universityId: number, isTracked: boolean, newTrackedId: string | null) => {
        console.log(`University ${universityId} track status: ${isTracked}, ID: ${newTrackedId}`);
    };


    return (
        <div className="bg-neutral-50 relative z-30 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
                {/* ... (AnimatedLogos, Header, SignIn prompt remain the same) ... */}
                <div className="w-full relative mb-8">
                    <AnimatedLogos />
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {t('universities', 'pageTitle')}
                    </h1>
                    <p className="text-gray-600">
                        {t('universities', 'found')} {filteredUniversities.length}  {t('universities', 'university')}
                    </p>
                </div>

                {!isSignedIn && (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center mb-8">
                        <p className="text-sm text-gray-600">
                            <SignInButton mode="modal">
                                <button className="font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1">
                                    {t('universities', 'login')}
                                    <span className="text-xs">→</span>
                                </button>
                            </SignInButton>
                            {' '}{t('universities', 'loginPrompt')}
                        </p>
                    </div>
                )}


                {/* Search and Filters (UI remains largely the same) */}
                <div className="mb-8 space-y-4">
                    <div className="relative">
                        <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t('universities', 'searchPlaceholder')}
                            className={`w-full border border-gray-300 rounded-lg py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'}`}
                        />
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-dark transition-colors"
                    >
                        <FilterIcon className="h-4 w-4" />
                        <span>{t('universities', 'filters')}</span>
                        <ChevronDown
                            className={`h-4 w-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>

                    {showFilters && (
                        <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-4">
                             <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-2">
                                    {t('universities', 'filterByStatus')}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Open', 'Closed', 'Coming Soon', 'TBA'].map(statusKey => (
                                        <button
                                            key={statusKey}
                                            onClick={() => setFilters(prev => ({
                                                ...prev,
                                                status: prev.status.includes(statusKey)
                                                    ? prev.status.filter(s => s !== statusKey)
                                                    : [...prev.status, statusKey]
                                            }))}
                                            className={`px-3 py-1 rounded-full text-sm 
                                                ${filters.status.includes(statusKey)
                                                    ? 'bg-primary/20 text-primary ring-1 ring-primary/30'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                } transition-colors`}
                                        >
                                           {t('universities', statusKey.toLowerCase().replace(/\s+/g, '') as keyof Translation['universities'], {defaultValue: statusKey})}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Fee filter remains the same */}
                             <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-2">
                                    {t('universities', 'feeFilter')}
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, hasFee: prev.hasFee === false ? null : false }))}
                                        className={`px-3 py-1 rounded-full text-sm ${filters.hasFee === false ? 'bg-primary/20 text-primary ring-1 ring-primary/30' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
                                    >
                                        {t('universities', 'free')}
                                    </button>
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, hasFee: prev.hasFee === true ? null : true }))}
                                        className={`px-3 py-1 rounded-full text-sm ${filters.hasFee === true ? 'bg-primary/20 text-primary ring-1 ring-primary/30' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
                                    >
                                        {t('universities', 'paid')}
                                    </button>
                                </div>
                            </div>
                            {(filters.status.length > 0 || filters.hasFee !== null) && (
                                <button
                                    onClick={() => setFilters({ status: [], hasFee: null })}
                                    className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors mt-2">
                                    <X className="h-4 w-4" />
                                    {t('universities', 'clearFilters')}
                                </button>
                            )}
                        </div>
                    )}
                </div>
                {/* Universities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUniversities.length > 0 ? (
                        filteredUniversities.map((uni: University) => (
                            <UniversityCard
                                key={uni.id}
                                university={uni}
                                isSignedIn={isSignedIn}
                                isExpanded={expandedRows.has(uni.id)}
                                onToggle={toggleRow}
                                t={t}
                                onFavoriteToggle={handleFavoriteToggle} // Pass down handlers
                                onTrackToggle={handleTrackToggle}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 text-lg">{t('universities', 'noResults')}</p>
                            <button
                                onClick={() => { setSearchTerm(''); setFilters({ status: [], hasFee: null }); }}
                                className="mt-4 text-primary hover:text-primary-dark text-sm">
                                {t('universities', 'clearAllFilters')}
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        {t('universities', 'lastUpdate')}: 20/02/2025 {/* This should be dynamic if possible */}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default UniversityTable;
