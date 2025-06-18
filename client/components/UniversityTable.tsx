// File: client/components/UniversityTable.tsx
import React, { useState, useMemo } from 'react';
import UniversityCard, { University } from './UniversityCard';
import { 
  ChevronDown, FilterIcon, Search, X, Sparkles, TrendingUp, 
  Users, Award, MapPin, Clock, Star, Zap, Target, Grid3X3,
  List, SortAsc, SortDesc, Filter
} from 'lucide-react';
import { Translation } from '@/app/i18n/types';
import { useLanguage } from '@/context/LanguageContext';
import { SignInButton } from '@clerk/nextjs';
import AnimatedLogos from './AnimatedLogos';

type SortOption = 'name' | 'location' | 'popularity' | 'deadline' | 'fee';
type ViewMode = 'grid' | 'list';

type UniversityTableProps = {
    universities: University[];
    isSignedIn: boolean;
};

const UniversityTable = ({ universities, isSignedIn }: UniversityTableProps) => {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<{ status: string[], hasFee: boolean | null }>({
        status: [],
        hasFee: null
    });
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>('popularity');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const { language, t } = useLanguage();
    const isRTL = language === 'ar';

    const toggleRow = (universityId: string) => {
        setExpandedRows(prev => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(universityId)) {
                newExpanded.delete(universityId);
            } else {
                newExpanded.add(universityId);
            }
            return newExpanded;
        });
    };

    const sortedAndFilteredUniversities = useMemo(() => {
        let filtered = universities.filter(uni => {
            const matchesSearch = searchTerm === '' ||
                uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (uni.location?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

            const matchesStatusFilter = filters.status.length === 0 || filters.status.includes(uni.status || 'TBA');
            const matchesFee = filters.hasFee === null ||
                (filters.hasFee ? (uni.admission_fee ?? 0) > 0 : (uni.admission_fee ?? 0) === 0);

            return matchesSearch && matchesStatusFilter && matchesFee;
        });

        // Sort universities
        filtered.sort((a, b) => {
            let aValue: any, bValue: any;
            
            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'location':
                    aValue = (a.location || '').toLowerCase();
                    bValue = (b.location || '').toLowerCase();
                    break;
                case 'popularity':
                    aValue = (a.favoriteCount || 0) + (a.trackedCount || 0) + (a.viewCount || 0);
                    bValue = (b.favoriteCount || 0) + (b.trackedCount || 0) + (b.viewCount || 0);
                    break;
                case 'fee':
                    aValue = a.admission_fee || 0;
                    bValue = b.admission_fee || 0;
                    break;
                default:
                    return 0;
            }

            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

        return filtered;
    }, [universities, searchTerm, filters, sortBy, sortOrder]);

    const handleFavoriteToggle = (universityId: string, isFavorite: boolean, newCount?: number) => {
        console.log(`University ${universityId} favorite status: ${isFavorite}, Count: ${newCount}`);
    };

    const handleTrackToggle = (universityId: string, isTracked: boolean, newCount?: number) => {
        console.log(`University ${universityId} track status: ${isTracked}, Count: ${newCount}`);
    };

    const handleSort = (newSortBy: SortOption) => {
        if (sortBy === newSortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('desc');
        }
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setFilters({ status: [], hasFee: null });
        setSortBy('popularity');
        setSortOrder('desc');
    };

    const statusOptions = [
        { key: 'Open', icon: Zap, color: 'emerald' },
        { key: 'Closed', icon: X, color: 'red' },
        { key: 'Coming Soon', icon: Clock, color: 'amber' },
        { key: 'TBA', icon: Target, color: 'slate' }
    ];

    return (
        <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 relative z-30 overflow-hidden min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/5 to-blue-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16 relative">
                {/* Animated Logos */}
                <div className="w-full relative mb-12">
                    <AnimatedLogos />
                </div>

                {/* Premium Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                            <Sparkles className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                            {t('universities', 'pageTitle')}
                        </h1>
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                            <Award className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-1 w-16 bg-gradient-to-r from-transparent to-blue-500 rounded-full" />
                        <div className="px-6 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full shadow-sm">
                            <p className="text-lg font-bold text-blue-800 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                {t('universities', 'found')} {sortedAndFilteredUniversities.length} {t('universities', 'university')}
                            </p>
                        </div>
                        <div className="h-1 w-16 bg-gradient-to-l from-transparent to-indigo-500 rounded-full" />
                    </div>
                    
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        Discover premium educational opportunities with our curated selection of top Italian universities
                    </p>
                </div>

                {/* Premium Sign-in Prompt */}
                {!isSignedIn && (
                    <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 text-center mb-12 group hover:border-blue-400 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-tr-full" />
                        
                        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-6">
                            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                                <Users className="h-8 w-8 text-white" />
                            </div>
                            <div className="text-center sm:text-left">
                                <p className="text-lg text-slate-700 mb-2">
                                    <SignInButton mode="modal">
                                        <button className="font-black text-blue-600 hover:text-blue-700 inline-flex items-center gap-2 group/btn transition-all duration-300">
                                            <Star className="h-5 w-5 group-hover/btn:rotate-12 transition-transform" />
                                            {t('universities', 'login')}
                                            <span className="text-xl group-hover/btn:translate-x-1 transition-transform">→</span>
                                        </button>
                                    </SignInButton>
                                    {' '}{t('universities', 'loginPrompt')}
                                </p>
                                <p className="text-sm text-slate-500">Access detailed information, save favorites, and track deadlines</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Premium Search and Controls */}
                <div className="mb-12">
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
                        {/* Search Bar */}
                        <div className="relative mb-8">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="h-6 w-6 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={t('universities', 'searchPlaceholder')}
                                className={`w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${isRTL ? 'pr-14 pl-6 text-right' : 'pl-14 pr-6 text-left'}`}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>

                        {/* Controls Row */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            {/* View Mode & Filters */}
                            <div className="flex items-center gap-4">
                                {/* View Mode Toggle */}
                                <div className="flex items-center bg-slate-100 rounded-2xl p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-3 rounded-xl transition-all duration-300 ${viewMode === 'grid' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <Grid3X3 className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-3 rounded-xl transition-all duration-300 ${viewMode === 'list' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <List className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Filters Toggle */}
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${showFilters ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                >
                                    <Filter className="h-5 w-5" />
                                    <span>{t('universities', 'filters')}</span>
                                    <ChevronDown className={`h-4 w-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                                </button>
                            </div>

                            {/* Sort Controls */}
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-slate-600">Sort by:</span>
                                <div className="flex items-center gap-2">
                                    {[
                                        { key: 'popularity', label: 'Popularity', icon: TrendingUp },
                                        { key: 'name', label: 'Name', icon: Target },
                                        { key: 'location', label: 'Location', icon: MapPin },
                                        { key: 'fee', label: 'Fee', icon: Award }
                                    ].map(({ key, label, icon: Icon }) => (
                                        <button
                                            key={key}
                                            onClick={() => handleSort(key as SortOption)}
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${sortBy === key ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {label}
                                            {sortBy === key && (sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Advanced Filters Panel */}
                        {showFilters && (
                            <div className="mt-8 p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Status Filter */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <Zap className="h-5 w-5 text-blue-600" />
                                            {t('universities', 'filterByStatus')}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {statusOptions.map(({ key: statusKey, icon: Icon, color }) => (
                                                <button
                                                    key={statusKey}
                                                    onClick={() => setFilters(prev => ({
                                                        ...prev,
                                                        status: prev.status.includes(statusKey)
                                                            ? prev.status.filter(s => s !== statusKey)
                                                            : [...prev.status, statusKey]
                                                    }))}
                                                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                                                        filters.status.includes(statusKey)
                                                            ? `bg-${color}-100 border-${color}-300 text-${color}-800 shadow-lg`
                                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                    }`}
                                                >
                                                    <div className={`p-2 rounded-xl ${filters.status.includes(statusKey) ? `bg-${color}-200` : 'bg-slate-100'}`}>
                                                        <Icon className="h-4 w-4" />
                                                    </div>
                                                    <span className="font-bold">
                                                        {t('universities', statusKey.toLowerCase().replace(/\s+/g, '') as keyof Translation['universities'], { defaultValue: statusKey })}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Fee Filter */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <Award className="h-5 w-5 text-emerald-600" />
                                            {t('universities', 'feeFilter')}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => setFilters(prev => ({ ...prev, hasFee: prev.hasFee === false ? null : false }))}
                                                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                                                    filters.hasFee === false 
                                                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800 shadow-lg' 
                                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                }`}
                                            >
                                                <div className={`p-2 rounded-xl ${filters.hasFee === false ? 'bg-emerald-200' : 'bg-slate-100'}`}>
                                                    <Star className="h-4 w-4" />
                                                </div>
                                                <span className="font-bold">{t('universities', 'free')}</span>
                                            </button>
                                            <button
                                                onClick={() => setFilters(prev => ({ ...prev, hasFee: prev.hasFee === true ? null : true }))}
                                                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                                                    filters.hasFee === true 
                                                        ? 'bg-blue-100 border-blue-300 text-blue-800 shadow-lg' 
                                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                }`}
                                            >
                                                <div className={`p-2 rounded-xl ${filters.hasFee === true ? 'bg-blue-200' : 'bg-slate-100'}`}>
                                                    <Award className="h-4 w-4" />
                                                </div>
                                                <span className="font-bold">{t('universities', 'paid')}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Clear Filters */}
                                {(filters.status.length > 0 || filters.hasFee !== null || searchTerm) && (
                                    <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                                        <button
                                            onClick={clearAllFilters}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                                        >
                                            <X className="h-4 w-4" />
                                            {t('universities', 'clearFilters')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Universities Display */}
                <div className="relative">
                    {sortedAndFilteredUniversities.length > 0 ? (
                        <>
                            {/* Results Summary */}
                            <div className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-xl">
                                        <Target className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-blue-900">Showing Results</h3>
                                        <p className="text-sm text-blue-700">
                                            {sortedAndFilteredUniversities.length} universities match your criteria
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-blue-700 font-semibold">
                                        Sorted by {sortBy} ({sortOrder})
                                    </div>
                                </div>
                            </div>

                            {/* Universities Grid/List */}
                            <div className={`${viewMode === 'grid' 
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
                                : 'space-y-6'
                            }`}>
                                {sortedAndFilteredUniversities.map((uni: University, index) => (
                                    <div
                                        key={uni._id}
                                        className="animate-fade-in-up"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <UniversityCard
                                            university={uni}
                                            isSignedIn={isSignedIn}
                                            isExpanded={expandedRows.has(uni._id)}
                                            onToggle={toggleRow}
                                            t={t}
                                            onFavoriteToggled={handleFavoriteToggle}
                                            onTrackToggled={handleTrackToggle}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Load More / Pagination could go here */}
                            <div className="mt-16 text-center">
                                <div className="inline-flex items-center gap-4 p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
                                    <div className="p-3 bg-emerald-100 rounded-xl">
                                        <Award className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-slate-900 mb-1">All Universities Loaded</h4>
                                        <p className="text-sm text-slate-600">
                                            You've seen all {sortedAndFilteredUniversities.length} universities matching your search
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* No Results State */
                        <div className="text-center py-20">
                            <div className="max-w-md mx-auto">
                                <div className="p-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl mb-8">
                                    <div className="p-6 bg-white rounded-2xl shadow-lg mb-6">
                                        <Search className="h-16 w-16 text-slate-400 mx-auto" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                                        {t('universities', 'noResults')}
                                    </h3>
                                    <p className="text-slate-600 mb-8 leading-relaxed">
                                        No universities match your current search criteria. Try adjusting your filters or search terms.
                                    </p>
                                    <button
                                        onClick={clearAllFilters}
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl"
                                    >
                                        <Sparkles className="h-5 w-5" />
                                        {t('universities', 'clearAllFilters')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Stats */}
                <div className="mt-20 text-center">
                    <div className="inline-flex items-center gap-6 p-6 bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 rounded-3xl border border-slate-200 shadow-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 animate-pulse" />
                            <span className="text-sm font-bold text-slate-700">
                                {t('universities', 'lastUpdate')}: 20/02/2025
                            </span>
                        </div>
                        <div className="h-4 w-px bg-slate-300" />
                        <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-bold text-slate-700">
                                Premium Quality Data
                            </span>
                        </div>
                        <div className="h-4 w-px bg-slate-300" />
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-bold text-slate-700">
                                Verified Universities
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                    opacity: 0;
                }
                
                /* Premium glassmorphism effects */
                .glass-effect {
                    backdrop-filter: blur(10px);
                    background: rgba(255, 255, 255, 0.8);
                }
                
                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: rgb(241, 245, 249);
                    border-radius: 10px;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, rgb(59, 130, 246), rgb(99, 102, 241));
                    border-radius: 10px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, rgb(37, 99, 235), rgb(79, 70, 229));
                }
            `}</style>
        </div>
    );
};

export default UniversityTable;