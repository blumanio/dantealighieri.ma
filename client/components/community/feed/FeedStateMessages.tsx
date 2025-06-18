'use client';
import React from 'react';
import { Loader2, AlertTriangle, Search, Award } from 'lucide-react';

type State = 'loading' | 'error' | 'empty' | 'loadingMore' | 'endOfFeed';

interface FeedStateMessagesProps {
    state: State;
    message?: string;
    onRetry?: () => void;
}

const FeedStateMessages: React.FC<FeedStateMessagesProps> = ({ state, message, onRetry }) => {
    switch (state) {
        case 'loading':
            return (
                <div className="flex justify-center py-16 px-4">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            );

        case 'error':
            return (
                <div className="mx-4 my-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 mb-3">{message}</p>
                            {onRetry && (
                                <button 
                                    onClick={onRetry}
                                    className="text-sm text-gray-900 underline hover:no-underline"
                                >
                                    Try again
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );

        case 'empty':
            return (
                <div className="text-center py-16 px-4">
                    <Search className="w-8 h-8 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                    <p className="text-sm text-gray-500">Try adjusting your filters or be the first to post!</p>
                </div>
            );

        case 'loadingMore':
            return (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
            );

        case 'endOfFeed':
            return (
                <div className="text-center py-12 px-4">
                    <Award className="w-6 h-6 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm font-medium text-gray-600">You're all caught up! 🎉</p>
                </div>
            );

        default:
            return null;
    }
};

export default FeedStateMessages;