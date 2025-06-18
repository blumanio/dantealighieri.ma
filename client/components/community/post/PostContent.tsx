'use client';

import React from 'react';
import { DisplayablePost } from '@/types/community';

interface PostContentProps {
    post: DisplayablePost;
}

const PostContent: React.FC<PostContentProps> = ({ post }) => {
    return (
        // The parent component should handle horizontal padding (e.g., px-4 sm:px-0).
        // This margin creates vertical space *after* the content block.
        // Spacing is slightly reduced on mobile and scales up for larger screens.
        <div className="mb-6 md:mb-8">
            {post.title && (
                <h3 className="text-xl md:text-2xl font-medium text-gray-900 mb-4">
                    {post.title}
                </h3>
            )}
            {/*
              - `text-base`: Sets the primary body text size.
              - `text-gray-700`: Applies the default text color.
              - `leading-relaxed`: Improves readability for blocks of text.
              - `whitespace-pre-wrap`: Preserves line breaks and spaces from the content.
            */}
            <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
            </p>
        </div>
    );
};

export default PostContent;