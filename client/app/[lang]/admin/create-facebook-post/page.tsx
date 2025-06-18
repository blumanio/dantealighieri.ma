// app/admin/create-facebook-post/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
// import { useUser } from '@clerk/nextjs'; // Mocked below for preview
// import { useRouter } from 'next/navigation'; // Mocked below for preview
// import { useLanguage } from '@/context/LanguageContext'; // Mocked below for preview
import { Loader2 } from 'lucide-react';
// import { PostCategory } from '@/lib/models/Post'; // Mocked below for preview

// --- MOCKS FOR PREVIEW ENVIRONMENT ---
// These mocks simulate the behavior of external dependencies for the preview.

const useUser = () => ({
    isSignedIn: true,
    user: {
        publicMetadata: { role: 'admin' },
        fullName: 'Admin User',
        id: 'mock_user_123',
    },
});

const useRouter = () => ({
    push: (path: string) => {
        console.log(`Mock navigation: Pushing to ${path}`);
        // In a real app, this would change the URL.
        // For the preview, we can show an alert or log to the console.
    },
});

const useLanguage = () => ({
    t: (key: string, fallback?: string) => fallback || key,
    language: 'en',
});

const ALL_POST_CATEGORIES_VALUES = [
    'discussion', 'housing', 'scholarships', 'event', 'other', 'academic', 'career', 'visa_process'
] as const;
type PostCategory = typeof ALL_POST_CATEGORIES_VALUES[number];

// --- END MOCKS ---


// Matches the IPost schema structure for creation (with original author fields)
interface PostFormData {
    userFullName: string; // Original author's display name
    userAvatarUrl: string; // Original author's avatar URL
    userId: string; // Original author's external ID (e.g., Facebook ID)
    content: string;
    category: PostCategory; // Renamed from postType
    communityType: 'University' | 'Course' | 'Country' | 'City' | 'General'; // New field
    communityId: string; // New field (e.g., university slug, if type is University)
    communityName: string; // New field (e.g., "Bocconi University")
    communitySlug: string; // New field (e.g., "bocconi-university")
    tags: string[];
    originalUserCountry: string; // Used this field for original user country
    isClaimable: boolean;
}

// Matches the IComment schema structure for creation
interface CommentFormData {
    targetPostId: string;
    userFullName: string; // Original commenter's display name
    userAvatarUrl: string; // Original commenter's avatar URL
    content: string;
    userId: string; // Original commenter's external ID
}

const PREDEFINED_TAGS: string[] = [
    'visa_application', 'housing_search', 'declaration_of_value', 'study_permit',
    'scholarships', 'university_admission', 'italian_culture', 'language_learning',
    'part_time_jobs', 'student_life', 'city_registration', 'health_insurance',
    'bank_account', 'codice_fiscale', 'travel_tips', 'local_events', "language", "careers", "DOV_appointment", "VISA_appointment", "VISA_guarantee",
    'medicine', 'computer_science', 'engineering', 'architecture', 'law',
    'business_economics', 'humanities', 'arts_design', 'sciences', 'social_sciences'
];

// All possible categories from PostCategory enum
const ALL_POST_CATEGORIES: PostCategory[] = [
    'discussion', 'housing', 'scholarships', 'event', 'other', 'academic', 'career', 'visa_process'
];

const CreateAdminPostPage = () => { // Renamed component for clarity
    const { isSignedIn, user } = useUser();
    const router = useRouter();
    const { t, language } = useLanguage();

    const [postFormData, setPostFormData] = useState<PostFormData>({
        userFullName: '',
        userAvatarUrl: '',
        userId: '', // This will be the external ID (e.g., Facebook ID)
        content: '',
        category: 'discussion', // Renamed from postType
        communityType: 'General', // Default, should be set by user
        communityId: '', // Should be set by user
        communityName: '', // Should be set by user
        communitySlug: '', // Should be set by user
        tags: [],
        originalUserCountry: '',
        isClaimable: true,
    });

    const [commentFormData, setCommentFormData] = useState<CommentFormData>({
        targetPostId: '',
        userFullName: '',
        userAvatarUrl: '',
        content: '',
        userId: '', // This will be the external ID (e.g., Facebook ID)
    });

    const [isLoadingPost, setIsLoadingPost] = useState(false);
    const [postError, setPostError] = useState<string | null>(null);
    const [postSuccessMessage, setPostSuccessMessage] = useState<string | null>(null);

    const [isLoadingComment, setIsLoadingComment] = useState(false);
    const [commentError, setCommentError] = useState<string | null>(null);
    const [commentSuccessMessage, setCommentSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        // Basic admin check: Redirect if not signed in.
        // TODO: Implement more robust admin role check (e.g., user.publicMetadata?.role !== 'admin')
        if (isSignedIn === false) router.push(`/${language}/sign-in`);
    }, [isSignedIn, router, language]);

    const handlePostFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            if (name === 'isClaimable') {
                setPostFormData(prev => ({ ...prev, isClaimable: checked }));
            } else { // For tags
                setPostFormData(prev => ({
                    ...prev,
                    tags: checked
                        ? [...prev.tags, value]
                        : prev.tags.filter(tag => tag !== value),
                }));
            }
        } else {
            setPostFormData(prev => ({ ...prev, [name]: value as any })); // Type assertion for flexibility
        }
    };

    const handleCommentFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCommentFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoadingPost(true);
        setPostError(null);
        setPostSuccessMessage(null);

        // Validation logic updated to use new field names
        if (!postFormData.communityId || !postFormData.communityType || !postFormData.communityName || !postFormData.communitySlug) {
            setPostError(t('adminPost.errorCommunityDetails', 'Community details are required.'));
            setIsLoadingPost(false);
            return;
        }
        if (!postFormData.content) {
            setPostError(t('adminPost.errorContent', 'Content is required.'));
            setIsLoadingPost(false);
            return;
        }
        if (!postFormData.userFullName) {
            setPostError(t('adminPost.errorUserFullName', 'Original User Full Name is required.'));
            setIsLoadingPost(false);
            return;
        }
        // UserId is required if post is claimable
        if (postFormData.isClaimable && !postFormData.userId) {
            setPostError(t('adminPost.errorUserIdClaimable', 'Original User ID is required if post is claimable.'));
            setIsLoadingPost(false);
            return;
        }

        try {
            // Payload now matches the IPost schema (with original author fields)
            const payload = {
                content: postFormData.content,
                category: postFormData.category, // Renamed from postType
                communityType: postFormData.communityType,
                communityId: postFormData.communityId,
                communityName: postFormData.communityName,
                communitySlug: postFormData.communitySlug,
                tags: postFormData.tags,
                originalUserCountry: postFormData.originalUserCountry,
                isClaimable: postFormData.isClaimable,
                userFullName: postFormData.userFullName, // Maps to originalAuthorFullName on backend
                userAvatarUrl: postFormData.userAvatarUrl, // Maps to originalAuthorAvatarUrl on backend
                userId: postFormData.userId, // Maps to originalAuthorExternalId on backend
            };

            console.log("Submitting Post:", payload);
            // In a real app, this would make a fetch call.
            // For the preview, we'll simulate a successful API call.
            setTimeout(() => {
                const mockResult = { _id: `post_${new Date().getTime()}` };
                setPostSuccessMessage(t('adminPost.successCreate', 'Post created successfully! Post ID: ') + mockResult._id);
                setPostFormData(prev => ({ // Reset all fields except for convenience fields like community
                    userFullName: '', userAvatarUrl: '', userId: '',
                    content: '', category: 'discussion',
                    communityType: prev.communityType,
                    communityId: prev.communityId,
                    communityName: prev.communityName,
                    communitySlug: prev.communitySlug,
                    tags: [], originalUserCountry: '', isClaimable: true,
                }));
                setIsLoadingPost(false);
            }, 1000);

        } catch (err: any) {
            setPostError(err.message);
            setIsLoadingPost(false);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoadingComment(true);
        setCommentError(null);
        setCommentSuccessMessage(null);

        // Validation logic updated for new field names and added userId
        if (!commentFormData.targetPostId) {
            setCommentError(t('adminComment.errorPostId', 'Target Post ID is required.'));
            setIsLoadingComment(false);
            return;
        }
        if (!commentFormData.content) {
            setCommentError(t('adminComment.errorCommentContent', 'Comment content is required.'));
            setIsLoadingComment(false);
            return;
        }
        if (!commentFormData.userFullName) {
            setCommentError(t('adminComment.errorCommenterFullName', 'Commenter Full Name is required.'));
            setIsLoadingComment(false);
            return;
        }
        if (!commentFormData.userId) {
            setCommentError(t('adminComment.errorCommenterId', 'Commenter User ID is required.'));
            setIsLoadingComment(false);
            return;
        }

        try {
            // Payload now matches the IComment schema (with original author fields)
            const payload = {
                content: commentFormData.content,
                userFullName: commentFormData.userFullName, // Maps to originalAuthorFullName on backend
                userAvatarUrl: commentFormData.userAvatarUrl, // Maps to originalAuthorAvatarUrl on backend
                userId: commentFormData.userId, // Maps to originalAuthorExternalId on backend
            };

            console.log(`Submitting Comment to Post ${commentFormData.targetPostId}:`, payload);
            // In a real app, this would make a fetch call.
            // For the preview, we'll simulate a successful API call.
            setTimeout(() => {
                const mockResult = { _id: `comment_${new Date().getTime()}` };
                setCommentSuccessMessage(t('adminComment.successCreate', 'Comment added successfully! Comment ID: ') + mockResult._id);
                setCommentFormData({
                    targetPostId: commentFormData.targetPostId, // Keep target ID for convenience
                    userFullName: '', userAvatarUrl: '', content: '', userId: ''
                });
                setIsLoadingComment(false);
            }, 1000);

        } catch (err: any) {
            setCommentError(err.message);
            setIsLoadingComment(false);
        }
    };

    const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100";
    const labelStyle = "block text-sm font-medium text-gray-700";

    if (!isSignedIn || !user) {
        return <div className="container mx-auto p-4 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>;
    }

    // TODO: Add robust admin role check (e.g., based on user.publicMetadata.role)
    // if (!user.publicMetadata?.role === 'admin') {
    //    return <div className="container mx-auto p-4 text-center text-red-500">Access Denied</div>;
    // }

    return (
        <div className="container mx-auto p-4 md:p-8">
            {/* Create Post Section */}
            <section className="mb-12">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-800">{t('adminPost.title', 'Create Community Post (Admin)')}</h1>
                <form onSubmit={handlePostSubmit} className="space-y-6 bg-white p-6 md:p-8 rounded-xl shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Original User Details */}
                        <div>
                            <label htmlFor="userFullName" className={labelStyle}>{t('adminPost.userFullNameLabel', 'Original User Full Name')}*</label>
                            <input type="text" name="userFullName" id="userFullName" value={postFormData.userFullName} onChange={handlePostFormChange} required className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="userAvatarUrl" className={labelStyle}>{t('adminPost.userAvatarUrlLabel', "Original User Avatar URL (Optional)")}</label>
                            <input type="url" name="userAvatarUrl" id="userAvatarUrl" value={postFormData.userAvatarUrl} onChange={handlePostFormChange} className={inputStyle} placeholder="https://..." />
                        </div>
                        <div>
                            <label htmlFor="userId" className={labelStyle}>{t('adminPost.userIdLabel', 'Original User External ID (e.g., Facebook ID)')}</label>
                            <input type="text" name="userId" id="userId" value={postFormData.userId} onChange={handlePostFormChange} className={inputStyle} aria-describedby="userIdHelp" />
                            <p id="userIdHelp" className="mt-1 text-xs text-gray-500">{t('adminPost.userIdHelp', 'Required if post is claimable (e.g., Facebook ID).')}</p>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="content" className={labelStyle}>{t('adminPost.contentLabel', 'Post Content')}*</label>
                        <textarea name="content" id="content" rows={8} value={postFormData.content} onChange={handlePostFormChange} required className={inputStyle}></textarea>
                    </div>
                    {/* Community Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="communityType" className={labelStyle}>{t('adminPost.communityTypeLabel', 'Community Type')}*</label>
                            <select name="communityType" id="communityType" value={postFormData.communityType} onChange={handlePostFormChange} required className={inputStyle}>
                                <option value="University">University</option>
                                <option value="Course">Course</option>
                                <option value="Country">Country</option>
                                <option value="City">City</option>
                                <option value="General">General</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="communityId" className={labelStyle}>{t('adminPost.communityIdLabel', 'Community ID')}*</label>
                            <input type="text" name="communityId" id="communityId" value={postFormData.communityId} onChange={handlePostFormChange} required className={inputStyle} placeholder="e.g., sapienza-university-of-rome or a country code" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="communityName" className={labelStyle}>{t('adminPost.communityNameLabel', 'Community Name')}*</label>
                            <input type="text" name="communityName" id="communityName" value={postFormData.communityName} onChange={handlePostFormChange} required className={inputStyle} placeholder="e.g., Sapienza University of Rome" />
                        </div>
                        <div>
                            <label htmlFor="communitySlug" className={labelStyle}>{t('adminPost.communitySlugLabel', 'Community Slug')}*</label>
                            <input type="text" name="communitySlug" id="communitySlug" value={postFormData.communitySlug} onChange={handlePostFormChange} required className={inputStyle} placeholder="e.g., sapienza-university-of-rome" />
                        </div>
                    </div>
                    {/* Post Category and Tags */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="category" className={labelStyle}>{t('adminPost.categoryLabel', 'Post Category')}*</label>
                            <select name="category" id="category" value={postFormData.category} onChange={handlePostFormChange} required className={inputStyle}>
                                {ALL_POST_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="originalUserCountry" className={labelStyle}>{t('adminPost.userCountryLabel', 'Original User Country (Optional)')}</label>
                            <input type="text" name="originalUserCountry" id="originalUserCountry" value={postFormData.originalUserCountry} onChange={handlePostFormChange} className={inputStyle} />
                        </div>
                    </div>
                    <div>
                        <label className={labelStyle}>{t('adminPost.tagsLabel', 'Tags (select relevant topics)')}</label>
                        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                            {PREDEFINED_TAGS.map(tag => (
                                <div key={tag} className="flex items-center">
                                    <input type="checkbox" id={`tag-${tag}`} name="tags" value={tag} checked={postFormData.tags.includes(tag)} onChange={handlePostFormChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                    <label htmlFor={`tag-${tag}`} className="ml-2 text-sm text-gray-700 capitalize">{tag.replace(/_/g, ' ')}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Claimable checkbox */}
                    <div className="flex items-center pt-6">
                        <input type="checkbox" name="isClaimable" id="isClaimable" checked={postFormData.isClaimable} onChange={handlePostFormChange} className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                        <label htmlFor="isClaimable" className="ml-2 block text-sm font-medium text-gray-800">{t('adminPost.claimableLabel', 'User can claim this post (Requires Original User External ID)')}</label>
                    </div>
                    <div className="pt-4">
                        {postError && <p className="text-red-600 text-sm mb-3 bg-red-50 p-3 rounded-md">{postError}</p>}
                        {postSuccessMessage && <p className="text-green-600 text-sm mb-3 bg-green-50 p-3 rounded-md">{postSuccessMessage}</p>}
                        <button type="submit" disabled={isLoadingPost} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                            {isLoadingPost ? <Loader2 className="h-5 w-5 animate-spin" /> : t('adminPost.submitButton', 'Create Post')}
                        </button>
                    </div>
                </form>
            </section>

            {/* Add Comment Section */}
            <section className="mt-16">
                <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-gray-800 border-t pt-8">{t('adminComment.title', 'Add Comment to Existing Post')}</h2>
                <form onSubmit={handleCommentSubmit} className="space-y-6 bg-white p-6 md:p-8 rounded-xl shadow-xl">
                    <div>
                        <label htmlFor="targetPostId" className={labelStyle}>{t('adminComment.targetPostIdLabel', 'Target Post ID')}*</label>
                        <input type="text" name="targetPostId" id="targetPostId" value={commentFormData.targetPostId} onChange={handleCommentFormChange} required className={inputStyle} placeholder="Enter MongoDB _id of the post" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="commenter-userFullName" className={labelStyle}>{t('adminComment.commenterFullNameLabel', 'Commenter Full Name')}*</label>
                            <input type="text" name="userFullName" id="commenter-userFullName" value={commentFormData.userFullName} onChange={handleCommentFormChange} required className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="commenter-userAvatarUrl" className={labelStyle}>{t('adminComment.commenterAvatarUrlLabel', "Commenter Avatar URL (Optional)")}</label>
                            <input type="url" name="userAvatarUrl" id="commenter-userAvatarUrl" value={commentFormData.userAvatarUrl} onChange={handleCommentFormChange} className={inputStyle} placeholder="https://..." />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="commenter-userId" className={labelStyle}>{t('adminComment.commenterUserIdLabel', 'Commenter External ID')}*</label>
                        <input type="text" name="userId" id="commenter-userId" value={commentFormData.userId} onChange={handleCommentFormChange} required className={inputStyle} placeholder="Enter the commenter's external ID" />
                    </div>
                    <div>
                        <label htmlFor="comment-content" className={labelStyle}>{t('adminComment.commentContentLabel', 'Comment Content')}*</label>
                        <textarea name="content" id="comment-content" rows={5} value={commentFormData.content} onChange={handleCommentFormChange} required className={inputStyle}></textarea>
                    </div>
                    <div className="pt-4">
                        {commentError && <p className="text-red-600 text-sm mb-3 bg-red-50 p-3 rounded-md">{commentError}</p>}
                        {commentSuccessMessage && <p className="text-green-600 text-sm mb-3 bg-green-50 p-3 rounded-md">{commentSuccessMessage}</p>}
                        <button type="submit" disabled={isLoadingComment} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50">
                            {isLoadingComment ? <Loader2 className="h-5 w-5 animate-spin" /> : t('adminComment.submitButton', 'Add Comment')}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default CreateAdminPostPage;
