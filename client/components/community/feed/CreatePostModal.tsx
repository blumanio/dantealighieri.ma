'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { Loader2, X, Send, Users, BookOpen, MapPin, Hash } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// Types and constants...
interface CommunityOption {
    _id: string;
    name: string;
    type: 'University' | 'City' | 'Country' | 'General';
}

type CommunityType = 'University' | 'City' | 'Country' | 'General';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated: () => void;
    communityId: string;
    communityType: CommunityType;
}

const ALL_POST_CATEGORIES: string[] = ['discussion', 'housing', 'scholarships', 'event', 'other', 'academic', 'career', 'visa_process'];
const CATEGORY_DISPLAY: { [key: string]: { label: string; emoji: string } } = { /* ... your category display data ... */ };

const COMMUNITY_TYPE_ICONS: { [key in CommunityType]: React.ElementType } = {
    'University': BookOpen,
    'City': MapPin,
    'Country': MapPin,
    'General': Users,
};

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPostCreated }) => {
    const { user } = useUser();
    const { t } = useLanguage();

    // State for the stepped flow
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('discussion');
    const [selectedCommunityType, setSelectedCommunityType] = useState<CommunityType | null>(null);
    const [availableCommunities, setAvailableCommunities] = useState<CommunityOption[]>([]);
    const [selectedCommunityId, setSelectedCommunityId] = useState('');

    // New state for search functionality
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const [isLoadingCommunities, setIsLoadingCommunities] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Reset the entire state when the modal is closed
    useEffect(() => {
        if (!isOpen) {
            setContent('');
            setCategory('discussion');
            setSelectedCommunityType(null);
            setAvailableCommunities([]);
            setSelectedCommunityId('');
            setSearchTerm('');
            setError(null);
        }
    }, [isOpen]);

    // Handle community type selection
    useEffect(() => {
        if (!selectedCommunityType) {
            setAvailableCommunities([]);
            setSearchTerm('');
            setSelectedCommunityId('');
            return;
        }

        // Reset search and communities when type changes
        setSearchTerm('');
        setAvailableCommunities([]);
        setSelectedCommunityId('');

        // Handle General and Country types immediately
        if (selectedCommunityType === 'General') {
            // For General, create a default general community option
            setAvailableCommunities([{ _id: 'general', name: 'General Community', type: 'General' }]);
            setSelectedCommunityId('general');
        } else if (selectedCommunityType === 'Country') {
            // Handle country selection as before
            fetchCountryCommunities();
        }
    }, [selectedCommunityType]);

    // Search effect for City and University
    useEffect(() => {
        if ((selectedCommunityType === 'City' || selectedCommunityType === 'University') && searchTerm.length >= 3) {
            const timeoutId = setTimeout(() => {
                searchCommunities();
            }, 300); // Debounce search

            return () => clearTimeout(timeoutId);
        } else if (searchTerm.length < 3) {
            setAvailableCommunities([]);
            setSelectedCommunityId('');
        }
    }, [searchTerm, selectedCommunityType]);

    const fetchCountryCommunities = async () => {
        setIsLoadingCommunities(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/communities?type=Country`);
            if (!response.ok) throw new Error('Failed to fetch country communities');
            const data: CommunityOption[] = await response.json();

            // If the user's country is pre-selected, find that specific community
            if (user?.publicMetadata?.countryId) {
                const countryCommunity = data.find(c => c._id === user.publicMetadata.countryId);
                setAvailableCommunities(countryCommunity ? [countryCommunity] : []);
                setSelectedCommunityId(countryCommunity?._id || '');
            } else {
                setAvailableCommunities(data);
                setSelectedCommunityId(data[0]?._id || '');
            }
        } catch (err) {
            setError(t('createPostModal.errorFetchCommunities' as any, 'Could not load communities.'));
        } finally {
            setIsLoadingCommunities(false);
        }
    };

    const searchCommunities = async () => {
        setIsSearching(true);
        setError(null);
        try {
            let response;
            let data;

            if (selectedCommunityType === 'City') {
                response = await fetch(`${API_BASE_URL}/api/courses?search=${encodeURIComponent(searchTerm)}`);
                if (!response.ok) throw new Error('Failed to search cities');
                const cities = await response.json();

                // Transform cities to community format
                data = cities.map((city: any) => ({
                    _id: city._id || city.id,
                    name: city.comune,
                    type: 'City' as CommunityType
                }));
            } else if (selectedCommunityType === 'University') {
                response = await fetch(`${API_BASE_URL}/api/courses?search=${encodeURIComponent(searchTerm)}`);
                if (!response.ok) throw new Error('Failed to search universities');
                const courses = await response.json();

                // Extract unique universities from courses
                const uniqueUniversities = new Map();
                courses.forEach((course: any) => {
                    if (course.uni && !uniqueUniversities.has(course.uni)) {
                        uniqueUniversities.set(course.uni, {
                            _id: `uni_${course.uni.toLowerCase().replace(/\s+/g, '_')}`,
                            name: course.uni,
                            type: 'University' as CommunityType
                        });
                    }
                });

                data = Array.from(uniqueUniversities.values());
            }

            setAvailableCommunities(data || []);
            setSelectedCommunityId(''); // Reset selection when new results come in
        } catch (err) {
            setError(`Could not search ${(selectedCommunityType ?? '').toLowerCase()}s.`);
            setAvailableCommunities([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!selectedCommunityId) {
            setError(t('createPostModal.errorCommunityRequired' as any, 'You must select a community.'));
            setIsSubmitting(false);
            return;
        }

        const postData = { communityId: selectedCommunityId, content, category };

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Failed to create post.');
            }

            onPostCreated();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="relative px-8 py-6 border-b border-gray-100/50">
                    <h2 className="text-2xl font-semibold text-gray-900">{t('createPostModal', 'title')}</h2>
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100/80 transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
                <div className="overflow-y-auto flex-grow">
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Content Textarea */}
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={5}
                            required
                            placeholder={t('createPostModal', 'contentPlaceholder')}
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40"
                        />

                        {/* Two-Step Community Selection */}
                        <div className="space-y-4 p-4 border rounded-xl bg-gray-50/30">
                            {/* STEP 1: Select Community Type */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Step 1: Choose a Community Type</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {(['University', 'City', 'Country', 'General'] as CommunityType[]).map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setSelectedCommunityType(type)}
                                            disabled={type === 'Country'} // Disabled as per requirement
                                            className={`p-3 rounded-lg border text-center transition-all duration-200 text-sm font-medium flex flex-col items-center gap-1.5 ${selectedCommunityType === type
                                                ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                } ${type === 'Country' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {React.createElement(COMMUNITY_TYPE_ICONS[type], { className: 'w-5 h-5 mb-1' })}
                                            <span>{type}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* STEP 2: Select Specific Community */}
                            {selectedCommunityType && (
                                <div className="space-y-2 pt-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Step 2: Select a Specific Community
                                    </label>

                                    {/* Search input for City and University */}
                                    {(selectedCommunityType === 'City' || selectedCommunityType === 'University') && (
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder={`Search for ${selectedCommunityType.toLowerCase()}s... (min 3 characters)`}
                                                className="w-full px-4 py-3 bg-white border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40"
                                            />
                                            {searchTerm.length > 0 && searchTerm.length < 3 && (
                                                <p className="text-sm text-gray-500">Please enter at least 3 characters to search</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Loading state */}
                                    {(isLoadingCommunities || isSearching) && (
                                        <div className="w-full h-12 flex items-center justify-center bg-gray-100 rounded-xl">
                                            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                                        </div>
                                    )}

                                    {/* Community selection dropdown */}
                                    {!isLoadingCommunities && !isSearching && availableCommunities.length > 0 && (
                                        <select
                                            value={selectedCommunityId}
                                            onChange={(e) => setSelectedCommunityId(e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40"
                                        >
                                            <option value="">Select a {selectedCommunityType.toLowerCase()}</option>
                                            {availableCommunities.map(community => (
                                                <option key={community._id} value={community._id}>
                                                    {community.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}

                                    {/* No results message */}
                                    {!isLoadingCommunities && !isSearching &&
                                        ((selectedCommunityType === 'City' || selectedCommunityType === 'University') && searchTerm.length >= 3 && availableCommunities.length === 0) && (
                                            <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-xl">
                                                No {selectedCommunityType.toLowerCase()}s found for "{searchTerm}"
                                            </p>
                                        )}
                                </div>
                            )}
                        </div>

                        {/* Category Selection */}
                        <div className="space-y-3">
                            {/* ... your existing category selection UI ... */}
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                {error}
                            </div>
                        )}
                    </form>
                </div>
                <div className="px-8 py-5 bg-gray-50/30 border-t border-gray-100/50">
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-gray-600 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isSubmitting || !content.trim() || !selectedCommunityId}
                            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Create Post
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;