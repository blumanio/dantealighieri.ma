
'use client'

import React, { useState, useMemo } from 'react'
import {
    Building2,
    Euro,
    Calendar,
    Search,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    MapPin,
    GraduationCap,
    FilterIcon,
    X
} from 'lucide-react'
import AnimatedLogos from './AnimatedLogos'
import UniversityCard from './UniversityCard'
import { useLanguage } from '../app/[lang]/LanguageContext'
import { UniversitiesTranslation } from '@/app/i18n/types'
import { SignInButton } from '@clerk/nextjs'

export interface University {
    id: number
    name: string
    location: string
    tutorial: string | null
    blog: string | null
    admission_fee: number
    english_requirement: string
    deadline: string
    status: 'Open' | 'Closed' | 'Coming Soon'
    cgpa_requirement: string
    application_link: string
    intakes: Array<{
        name: string
        start_date: string
        end_date: string
        notes: string
    }>
}

interface UniversityTableProps {
    universities: University[]
    isSignedIn: boolean
}

export const UniversityTable = ({ universities, isSignedIn }: UniversityTableProps) => {
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState({
        status: [] as string[],
        hasFee: null as boolean | null
    })
    const [showFilters, setShowFilters] = useState(false)
    const { language, t } = useLanguage()
    const isRTL = language === 'ar'

    const toggleRow = (id: number) => {
        const newExpanded = new Set(expandedRows)
        if (expandedRows.has(id)) {
            newExpanded.delete(id)
        } else {
            newExpanded.add(id)
        }
        setExpandedRows(newExpanded)
    }

    // const formatCGPA = (requirement: string | null) => {
    //     if (!requirement) return t('universities', 'noCgpaRequired')
    //     if (requirement === 'NO CGPA REQUIREMENT') return t('universities', 'noCgpaRequired')
    //     return requirement
    //         .replace('MINIMUM ', '')
    //         .replace(' FOR PAKISTAN', '')
    //         .replace('DIFFERENT CGPA REQUIREMENTS', t('universities', 'variousRequirements'))
    // }

    const filteredUniversities = useMemo(() => {
        return universities.filter(uni => {
            const matchesSearch = searchTerm === '' ||
                uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                uni.location.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus = filters.status.length === 0 ||
                filters.status.includes(uni.status)

            const matchesFee = filters.hasFee === null ||
                (filters.hasFee ? uni.admission_fee > 0 : uni.admission_fee === 0)

            return matchesSearch && matchesStatus && matchesFee
        })
    }, [universities, searchTerm, filters])

    return (
        <div className="bg-background relative z-30 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
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
                                <button className="font-semibold text-white-600 hover:text-white-700 inline-flex items-center gap-1">
                                    {t('universities', 'login')}
                                    <span className="text-xs">→</span>
                                </button>
                            </SignInButton>
                            {' '}{t('universities', 'loginPrompt')}
                        </p>
                    </div>
                )}

                {/* Search and Filters */}
                <div className="mb-8 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t('universities', 'searchPlaceholder')}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 
                                     focus:outline-none focus:ring-2 focus:ring-teal-500 
                                     focus:border-transparent"
                        />
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="inline-flex items-center gap-2 text-sm text-white-600 
                                 hover:text-white-900 transition-colors"
                    >
                        <FilterIcon className="h-4 w-4" />
                        <span>{t('universities', 'filters')}</span>
                        <ChevronDown
                            className={`h-4 w-4 transform transition-transform 
                                ${showFilters ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {showFilters && (
                        <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-2">
                                    {t('universities', 'filterByStatus')}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Open', 'Closed', 'Coming Soon'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => setFilters(prev => ({
                                                ...prev,
                                                status: prev.status.includes(status)
                                                    ? prev.status.filter(s => s !== status)
                                                    : [...prev.status, status]
                                            }))}
                                            className={`px-3 py-1 rounded-full text-sm 
                                                ${filters.status.includes(status)
                                                    ? 'bg-teal-100 text-teal-700 ring-1 ring-teal-600/20'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                } transition-colors`}
                                        >
                                            {t('universities', status.toLowerCase() as keyof UniversitiesTranslation)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-2">
                                    {t('universities', 'feeFilter')}
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setFilters(prev => ({
                                            ...prev,
                                            hasFee: prev.hasFee === false ? null : false
                                        }))}
                                        className={`px-3 py-1 rounded-full text-sm 
                                            ${filters.hasFee === false
                                                ? 'bg-teal-100 text-teal-700 ring-1 ring-teal-600/20'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            } transition-colors`}
                                    >
                                        {t('universities', 'free')}
                                    </button>
                                    <button
                                        onClick={() => setFilters(prev => ({
                                            ...prev,
                                            hasFee: prev.hasFee === true ? null : true
                                        }))}
                                        className={`px-3 py-1 rounded-full text-sm 
                                            ${filters.hasFee === true
                                                ? 'bg-teal-100 text-teal-700 ring-1 ring-teal-600/20'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            } transition-colors`}
                                    >
                                        {t('universities', 'paid')}
                                    </button>
                                </div>
                            </div>

                            {(filters.status.length > 0 || filters.hasFee !== null) && (
                                <button
                                    onClick={() => setFilters({ status: [], hasFee: null })}
                                    className="inline-flex items-center gap-2 text-sm text-red-600 
                                             hover:text-red-700 transition-colors"
                                >
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
                        filteredUniversities.map((uni) => (
                            <UniversityCard
                                key={uni.id}
                                university={uni}
                                isSignedIn={isSignedIn}
                                isExpanded={expandedRows.has(uni.id)}
                                onToggle={() => toggleRow(uni.id)}
                                t={t}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 text-lg">
                                {t('universities', 'noResults')}
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm('')
                                    setFilters({ status: [], hasFee: null })
                                }}
                                className="mt-4 text-teal-600 hover:text-teal-700 text-sm"
                            >
                                {t('universities', 'clearAllFilters')}
                            </button>
                        </div>
                    )}
                </div>

                {filteredUniversities.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-white-500 text-lg">
                            {t('universities', 'noResults')}
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm('')
                                setFilters({ status: [], hasFee: null })
                            }}
                            className="mt-4 text-white-600 hover:text-white-700 text-sm"
                        >
                            {t('universities', 'clearAllFilters')}
                        </button>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        {t('universities', 'lastUpdate')}: 11/02/2025
                    </span>
                </div>
            </div>
        </div>
    )
}

export default UniversityTable