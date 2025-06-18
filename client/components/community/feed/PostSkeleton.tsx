// components/community/PostSkeleton.tsx
import React from 'react';

const PostSkeleton: React.FC = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
        </div>
        
        {/* Content skeleton */}
        <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            <div className="h-4 bg-gray-200 rounded w-3/5"></div>
        </div>
        
        {/* Actions skeleton */}
        <div className="flex items-center space-x-4 pt-3 border-t border-gray-100">
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
    </div>
);

export default PostSkeleton;