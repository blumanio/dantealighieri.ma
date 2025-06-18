// components/community/feed/FeedSkeleton.tsx
import React from 'react';

const FeedSkeleton: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
            {/* Header with avatar and user info */}
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>

            {/* Content */}
            <div className="space-y-3 mb-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/5"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/5"></div>
            </div>

            {/* Tags */}
            <div className="flex space-x-2 mb-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-14"></div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10"></div>
                    </div>
                </div>
                <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        </div>
    );
};

export default FeedSkeleton;