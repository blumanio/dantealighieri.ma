'use client';

import React, { useState } from 'react';
import { Filter, ChevronDown, Zap, TrendingUp, X } from 'lucide-react';

// Mock data for demonstration
const TAG_CATEGORIES = {
    'Legal & Administrative': {
        icon: '⚖️',
        tags: ['visa_application', 'work_permit', 'residence_permit', 'legal_advice', 'tax_information', 'identity_card', 'residence_registration']
    },
    'Housing & Life': {
        icon: '🏠',
        tags: ['apartment_hunting', 'utilities', 'neighborhood', 'moving', 'daily_life']
    },
    'Career & Work': {
        icon: '💼',
        tags: ['job_search', 'networking', 'workplace_culture', 'career_advice', 'freelancing']
    },
    'Healthcare': {
        icon: '🏥',
        tags: ['insurance_visa', 'insurance_italy', 'doctors', 'emergency']
    }
};

const QUICK_FILTERS = [
    { label: 'Recent', icon: Zap },
    { label: 'Popular', icon: TrendingUp }
];

interface FeedSidebarProps {
    selectedTags: string[];
    onTagToggle: (tag: string) => void;
    selectedQuickFilter: string;
    onQuickFilterChange: (filter: string) => void;
    onClearFilters: () => void;
}

const FeedSidebar: React.FC<FeedSidebarProps> = ({
    selectedTags = [],
    onTagToggle,
    selectedQuickFilter,
    onQuickFilterChange,
    onClearFilters
}) => {
    const [expandedCategories, setExpandedCategories] = useState<string[]>(['Legal & Administrative', 'Housing & Life']);

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    return (
        <aside className="w-full lg:w-80 space-y-4">
            {/* Quick Filters */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3 text-sm">
                    Quick Filters
                </h3>

                <div className="grid grid-cols-2 gap-2">
                    {QUICK_FILTERS.map((filter) => {
                        const isSelected = selectedQuickFilter === filter.label;
                        return (
                            <button
                                key={filter.label}
                                onClick={() => onQuickFilterChange(filter.label)}
                                className={`p-3 rounded-lg transition-colors flex flex-col items-center gap-2 text-sm ${isSelected
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                <filter.icon className="w-4 h-4" />
                                <span className="font-medium">{filter.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Topic Categories */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                Filter by Topics
                            </h3>
                        </div>
                        {selectedTags.length > 0 && (
                            <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                                {selectedTags.length}
                            </span>
                        )}
                    </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                    {Object.entries(TAG_CATEGORIES).map(([categoryName, categoryData]) => {
                        const isExpanded = expandedCategories.includes(categoryName);
                        return (
                            <div key={categoryName} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                                <button
                                    onClick={() => toggleCategory(categoryName)}
                                    className="w-full p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-base">{categoryData.icon}</span>
                                        <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                                            {categoryName}
                                        </span>
                                    </div>
                                    <ChevronDown
                                        className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                {isExpanded && (
                                    <div className="px-3 pb-3">
                                        <div className="flex flex-wrap gap-1.5">
                                            {categoryData.tags.map((tag) => {
                                                const isSelected = selectedTags.includes(tag);
                                                return (
                                                    <button
                                                        key={tag}
                                                        onClick={() => onTagToggle(tag)}
                                                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${isSelected
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                            }`}
                                                    >
                                                        {tag.replace(/_/g, ' ')}
                                                        {isSelected && (
                                                            <X className="w-3 h-3" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {selectedTags.length > 0 && (
                    <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                        <button
                            onClick={onClearFilters}
                            className="w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                        >
                            Clear all filters ({selectedTags.length})
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default FeedSidebar;