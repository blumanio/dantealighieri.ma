'use client';

import React, { useState, useMemo } from 'react';
import {
    Search, X, SlidersHorizontal, ArrowUpDown,
    Lock, BookOpen, GraduationCap
} from 'lucide-react';
import UniversityCard, { UniversityCardProps } from './UniversityCard'; // Assume this exists
import Link from 'next/link';
import { University } from '@/app/[lang]/university/page';

type SortOption = 'name' | 'tuition_low' | 'tuition_high';

interface UniversityTableProps {
    universities: University[];
    isSignedIn: boolean;
}

export default function UniversityTable({ universities, isSignedIn }: UniversityTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('name');

    // LOGIC: Filter and Sort
    // Note: We do this client side for instant feedback on small lists (<500 items)
    const filteredData = useMemo(() => {
        let data = [...universities];

        // 1. Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            data = data.filter(u =>
                u.name.toLowerCase().includes(lowerTerm) ||
                u.location?.toLowerCase().includes(lowerTerm)
            );
        }

        // 2. Sort
        data.sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'tuition_low') return (a.admission_fee || 0) - (b.admission_fee || 0);
            if (sortBy === 'tuition_high') return (b.admission_fee || 0) - (a.admission_fee || 0);
            return 0;
        });

        return data;
    }, [universities, searchTerm, sortBy]);

    // LOGIC: Gating
    // If not signed in, we only show the first 5 results of the FILTERED list.
    const FREE_LIMIT = 5;
    const showLockedState = !isSignedIn && filteredData.length > FREE_LIMIT;
    const visibleUniversities = isSignedIn ? filteredData : filteredData.slice(0, FREE_LIMIT);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

            {/* --- HEADER: Controls --- */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">

                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                            <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                        </button>
                    )}
                </div>

                {/* Sort & Stats */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <div className="hidden sm:block text-xs font-medium text-slate-500">
                        {filteredData.length} Universities
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
                            style={{ backgroundImage: 'none' }} // Custom arrow handled by wrapper if needed, simplistic here
                        >
                            <option value="name">Name (A-Z)</option>
                            <option value="tuition_low">Tuition (Low to High)</option>
                            <option value="tuition_high">Tuition (High to Low)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* --- BODY: List --- */}
            <div className="divide-y divide-slate-100">
                {visibleUniversities.length > 0 ? (
                    visibleUniversities.map((uni, index) => (
                        <UniversityCard
                            index={index}
                            university={uni}
                        />
                    ))
                ) : (
                    <div className="p-12 text-center text-slate-500">
                        <GraduationCap className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                        <p>No universities found matching "{searchTerm}"</p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="mt-2 text-blue-600 font-medium hover:underline"
                        >
                            Clear Search
                        </button>
                    </div>
                )}
            </div>

            {/* --- FOOTER: Gating Logic (The Money Maker) --- */}
            {showLockedState && (
                <div className="relative">
                    {/* Visual Faux Rows (Blurred) */}
                    <div className="opacity-40 blur-[2px] pointer-events-none select-none overflow-hidden h-40 bg-slate-50">
                        {/* We simulate rows here just for visual density */}
                        <div className="p-6 border-b border-slate-100"><div className="h-4 w-1/3 bg-slate-200 rounded mb-2"></div><div className="h-3 w-1/4 bg-slate-100 rounded"></div></div>
                        <div className="p-6 border-b border-slate-100"><div className="h-4 w-1/3 bg-slate-200 rounded mb-2"></div><div className="h-3 w-1/4 bg-slate-100 rounded"></div></div>
                    </div>

                    {/* The Lock Overlay */}
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-t from-white via-white/90 to-transparent pt-10">
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-md text-center">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                Unlock {filteredData.length - FREE_LIMIT} More Universities
                            </h3>
                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                Join 5,000+ students. Create a free account to view the full directory, access expert admission tips, and track your deadlines.
                            </p>
                            <div className="space-y-3">
                                <Link
                                    href="/sign-in?redirect=/universities"
                                    className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                                >
                                    View Full List (Free)
                                </Link>
                                <p className="text-xs text-slate-400">
                                    Already have an account? <Link href="/sign-in" className="text-slate-600 underline">Sign in</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}