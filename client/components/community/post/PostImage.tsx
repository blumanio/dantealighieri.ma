'use client';

import React from 'react';

interface PostImageProps {
    imageUrl: string;
    alt: string;
}

const PostImage: React.FC<PostImageProps> = ({ imageUrl, alt }) => {
    return (
        <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
            <img
                src={imageUrl}
                alt={alt}
                className="w-full h-auto object-cover max-h-96 hover:scale-105 transition-transform duration-500"
            />
        </div>
    );
};

export default PostImage;