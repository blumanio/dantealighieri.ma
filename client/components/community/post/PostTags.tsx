'use client';

import React from 'react';

interface PostTagsProps {
    tags: string[];
}

const PostTags: React.FC<PostTagsProps> = ({ tags }) => {
    if (!tags || tags.length === 0) return null;

    return (
        <div className="mb-6 flex flex-wrap gap-2">
            {tags.map(tag => (
                <span
                    key={tag}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-full border border-slate-200 transition-colors duration-300 cursor-pointer"
                >
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    #{tag}
                </span>
            ))}
        </div>
    );
};

export default PostTags;