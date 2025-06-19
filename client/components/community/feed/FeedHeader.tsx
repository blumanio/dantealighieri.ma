'use client';

import React from 'react';
import { Menu, X, Edit, BarChart3, User } from 'lucide-react';

interface FeedHeaderProps {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: () => void;
    onOpenCreatePostModal: () => void;
    onOpenCreatePollModal: () => void;
}

const FeedHeader: React.FC<FeedHeaderProps> = ({
    sidebarOpen,
    toggleSidebar,
    onOpenCreatePostModal,
    onOpenCreatePollModal
}) => {
    return (
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
            <div className="px-4 py-3">
                {/* Mobile Sidebar Toggle */}
                <div className="flex items-center justify-between mb-4 md:hidden">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        aria-label="Toggle sidebar"
                    >
                        {sidebarOpen ? (
                            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        ) : (
                            <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        )}
                    </button>
                </div>

                {/* Create Post Section */}
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    {/* Input Area */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <button
                            onClick={onOpenCreatePostModal}
                            className="flex-1 text-left px-4 py-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-full transition-colors"
                        >
                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                                Ask or help others about studying in Italy  🇮🇹 ...
                            </span>
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={onOpenCreatePostModal}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            <span className="hidden sm:inline">Write Post</span>
                            <span className="sm:hidden">Post</span>
                        </button>

                        <button
                            onClick={onOpenCreatePollModal}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors"
                        >
                            <BarChart3 className="w-4 h-4" />
                            <span className="hidden sm:inline">Create Poll</span>
                            <span className="sm:hidden">Poll</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default FeedHeader;