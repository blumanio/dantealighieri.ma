'use client';

import React from 'react';
import { Eye, RefreshCw, List, Grid } from 'lucide-react';

interface FeedControlsProps {
    postCount: number;
    totalPosts: number;
    selectedTags: string[];
    viewMode: 'list' | 'compact';
    onViewModeChange: (mode: 'list' | 'compact') => void;
    onRefresh: () => void;
}

const FeedControls: React.FC<FeedControlsProps> = ({ 
    postCount, 
    totalPosts, 
    selectedTags, 
    viewMode, 
    onViewModeChange, 
    onRefresh 
}) => {
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Post Count Info */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Eye className="w-4 h-4" />
                    <span>
                        <span className="font-medium">{postCount}</span> of{' '}
                        <span className="font-medium">{totalPosts}</span> posts
                    </span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between sm:justify-end gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        <button 
                            onClick={() => onViewModeChange('list')} 
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                viewMode === 'list' 
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' 
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                        >
                            <List className="w-3 h-3" />
                            <span className="hidden sm:inline">List</span>
                        </button>
                        <button 
                            onClick={() => onViewModeChange('compact')} 
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                viewMode === 'compact' 
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' 
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                        >
                            <Grid className="w-3 h-3" />
                            <span className="hidden sm:inline">Compact</span>
                        </button>
                    </div>

                    {/* Refresh Button */}
                    <button 
                        onClick={onRefresh} 
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors" 
                        title="Refresh Feed"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Selected Tags (if any) */}
            {selectedTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Filtered by:</span>
                    {selectedTags.map(tag => (
                        <span 
                            key={tag}
                            className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-md"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FeedControls;