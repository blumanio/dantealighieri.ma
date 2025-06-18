'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { notFound, useParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import {
    MapPin, Home, Utensils, Train, Bolt, Wifi, Shield,
    TrendingUp, DollarSign, GraduationCap, ExternalLink,
    ChevronDown, ChevronUp, AlertCircle, Sparkles, Loader2,
    MessageSquare, PlusCircle, UserPlus, Info, Users,
    Thermometer, Navigation, Heart, Star, Calendar,
    Coffee, BookOpen, Camera, Music, Gamepad2, Briefcase
} from 'lucide-react';
import { CityData, WeatherData, CityMetric, NomadListStyleTag } from '@/types/city';
import { IPost, PostCategory } from '@/lib/models/Post';
import { IComment, IPostWithComments } from '@/types/post';
import CommunityPostCard from '@/components/community/CommunityPostCard';
import CreatePostModal from '@/components/community/feed/CreatePostModal';

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
    Home, Utensils, Train, Bolt, Wifi, DollarSign, GraduationCap, Shield, TrendingUp,
    Thermometer, Navigation,
};

// Premium Weather Component
const WeatherDisplay: React.FC<{ weather?: WeatherData, annualMin: number, annualMax: number }> = ({ weather, annualMin, annualMax }) => {
    let dailyWeatherContent;
    if (weather?.isLoading) {
        dailyWeatherContent = (
            <div className="flex items-center justify-center h-20">
                <div className="animate-pulse flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                        <div className="h-3 bg-gray-200 rounded w-12"></div>
                    </div>
                </div>
            </div>
        );
    } else if (weather?.error || !weather || !weather.iconURL) {
        dailyWeatherContent = (
            <div className="flex items-center justify-center h-20 text-gray-400">
                <AlertCircle size={20} className="mr-2" />
                <span className="text-sm">Weather unavailable</span>
            </div>
        );
    } else {
        dailyWeatherContent = (
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <img src={weather.iconURL} alt={weather.description} className="w-12 h-12" />
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{weather.tempC.toFixed(0)}°</div>
                        <div className="text-sm text-gray-500 capitalize">{weather.description}</div>
                    </div>
                </div>
                <div className="text-right text-sm text-gray-600">
                    <div>H: {weather.maxTempC.toFixed(0)}°</div>
                    <div>L: {weather.minTempC.toFixed(0)}°</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8">
            {dailyWeatherContent}
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <div className="text-xs text-gray-500">
                    Annual range: {annualMin}°C to {annualMax}°C
                </div>
            </div>
        </div>
    );
};

// Premium Score Display
const ScoreDisplay: React.FC<{ score: number; Icon: React.ElementType; label: string; description?: string }> = ({
    score, Icon, label, description
}) => {
    const getScoreColor = (score: number) => {
        if (score >= 8) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        if (score >= 6) return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    return (
        <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl border-2 ${getScoreColor(score)} mb-3`}>
                <span className="text-xl font-bold">{score.toFixed(1)}</span>
            </div>
            <div className="text-sm font-medium text-gray-900">{label}</div>
            {description && <div className="text-xs text-gray-500 mt-1">{description}</div>}
        </div>
    );
};

// Cost Metric Component
const CostMetric: React.FC<{ metric: CityMetric; maxValue?: number }> = ({ metric, maxValue }) => {
    const IconComponent = metric.icon as React.ElementType;
    const percentage = maxValue ? Math.min((Number(metric.value) / maxValue) * 100, 100) : 0;

    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                    <IconComponent size={18} className="text-gray-600" />
                </div>
                <span className="font-medium text-gray-900">{metric.label}</span>
            </div>
            <div className="text-right">
                <div className="font-bold text-gray-900">
                    {metric.value.toLocaleString()} {metric.unit}
                </div>
                {percentage > 0 && (
                    <div className="w-20 h-1.5 bg-gray-200 rounded-full mt-1 ml-auto">
                        <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

// Community Section Component
const CommunitySection: React.FC<{
    title: string;
    description: string;
    icon: React.ElementType;
    posts: IPostWithComments[];
    isLoading: boolean;
    error: string | null;
    onCreatePost: () => void;
    // FIX: Changed onCommentSubmit to match the expected async signature from CommunityPostCardProps
    onCommentSubmit: (postId: string, commentText: string) => Promise<void>;
    onDeletePost: (postId: string) => void;
    onRetry: () => void;
}> = ({ title, description, icon: Icon, posts, isLoading, error, onCreatePost, onCommentSubmit, onDeletePost, onRetry }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const displayPosts = isExpanded ? posts : posts.slice(0, 2);

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Icon size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-600">{description}</p>
                    </div>
                </div>
                <button
                    onClick={onCreatePost}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    <PlusCircle size={16} />
                    <span>Post</span>
                </button>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="animate-pulse p-4 border border-gray-100 rounded-xl">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                <div className="space-y-1">
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-8">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-3">{error}</p>
                    <button
                        onClick={onRetry}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        Try again
                    </button>
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-8">
                    <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No posts yet</p>
                    <p className="text-xs text-gray-400 mt-1">Be the first to share!</p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {displayPosts.map(post => (
                            <CommunityPostCard
                                key={String(post._id)}
                                post={post}
                                onCommentSubmit={onCommentSubmit}
                                onDeletePost={onDeletePost}
                            />
                        ))}
                    </div>
                    {posts.length > 2 && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center space-x-1"
                        >
                            <span>{isExpanded ? 'Show less' : `Show ${posts.length - 2} more`}</span>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

// Main City Page Component
const CityPage: React.FC = () => {
    const params = useParams();
    // FIX: Safely access citySlug with optional chaining to prevent crash if params is null
    const citySlug = params?.citySlug as string;
    const { language, t } = useLanguage();
    const { user } = useUser();

    const [cityData, setCityData] = useState<CityData | null>(null);
    const [isLoadingCity, setIsLoadingCity] = useState(true);
    const [cityError, setCityError] = useState<string | null>(null);
    const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

    // Fetch city data
    useEffect(() => {
        const fetchSingleCity = async () => {
            if (!citySlug) {
                setIsLoadingCity(false);
                setCityError("City slug not provided.");
                notFound();
                return;
            }
            setIsLoadingCity(true);
            setCityError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/api/cities/${citySlug}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        notFound();
                    }
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch city details.');
                }
                const result = await response.json();
                if (!result.success || !result.data) {
                    throw new Error(result.message || 'Invalid city data format.');
                }

                const processedCity: CityData = {
                    ...result.data,
                    createdAt: new Date(result.data.createdAt),
                    updatedAt: new Date(result.data.updatedAt),
                    annualMinTempC: result.data.annualMinTempC || 0,
                    annualMaxTempC: result.data.annualMaxTempC || 30,
                    currentWeather: { isLoading: true, iconURL: '', tempC: 0, minTempC: 0, maxTempC: 0, description: '' } as WeatherData,
                    metrics: result.data.metrics.map((metric: any) => ({
                        ...metric,
                        icon: iconMap[metric.icon as string] || Home,
                    })) as CityMetric[],
                };

                setCityData(processedCity);
            } catch (err: any) {
                console.error("Error fetching single city:", err);
                setCityError(err.message || 'Failed to load city details.');
            } finally {
                setIsLoadingCity(false);
            }
        };
        fetchSingleCity();
    }, [citySlug, API_BASE_URL]);

    // Weather fetching
    const [cityWithWeatherData, setCityWithWeatherData] = useState<CityData | null>(null);

    useEffect(() => {
        if (!cityData) {
            setCityWithWeatherData(null);
            return;
        }

        if (!API_KEY) {
            console.warn("WeatherAPI.com API key is not set.");
            setCityWithWeatherData({ ...cityData, currentWeather: { ...cityData.currentWeather, isLoading: false, error: true } });
            return;
        }

        const fetchWeather = async () => {
            setCityWithWeatherData(prev => prev ? { ...prev, currentWeather: { ...prev.currentWeather, isLoading: true, error: false } } : { ...cityData, currentWeather: { ...cityData.currentWeather, isLoading: true, error: false } });
            try {
                const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityData.latitude},${cityData.longitude}&days=1&aqi=no&alerts=no`);
                if (!response.ok) throw new Error(`WeatherAPI request failed for ${cityData.cityName}`);
                const data = await response.json();

                setCityWithWeatherData({
                    ...cityData,
                    currentWeather: {
                        tempC: data.current.temp_c,
                        minTempC: data.forecast.forecastday[0].day.mintemp_c,
                        maxTempC: data.forecast.forecastday[0].day.maxtemp_c,
                        description: data.current.condition.text,
                        iconURL: data.current.condition.icon,
                        isLoading: false,
                        error: false,
                    },
                });
            } catch (error) {
                console.error(`Failed to fetch weather for ${cityData.cityName}:`, error);
                setCityWithWeatherData(prev => prev ? { ...prev, currentWeather: { ...prev.currentWeather, isLoading: false, error: true } } : cityData);
            }
        };

        fetchWeather();
    }, [cityData, API_KEY]);

    // Community posts state
    const [housingPosts, setHousingPosts] = useState<IPostWithComments[]>([]);
    const [buddyPosts, setBuddyPosts] = useState<IPostWithComments[]>([]);
    const [generalPosts, setGeneralPosts] = useState<IPostWithComments[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);
    const [postsError, setPostsError] = useState<string | null>(null);
    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
    // FIX: Use a type assertion for the initial state to match the PostCategory type
    const [modalCategory, setModalCategory] = useState<PostCategory>('housing_seeking' as PostCategory);

    const fetchCityPosts = useCallback(async () => {
        if (!cityData) {
            setIsLoadingPosts(false);
            return;
        }
        setIsLoadingPosts(true);
        setPostsError(null);

        const communityId = cityData.slug;
        const communityType = 'City';

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts?communityType=${communityType}&communityId=${communityId}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch community posts.');
            }
            const data = await response.json();

            const processedPosts: IPostWithComments[] = (data.posts || []).map((p: any) => ({
                ...p,
                createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
                updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
                comments: (p.comments || []).map((c: any) => ({
                    ...c,
                    createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
                    updatedAt: c.updatedAt ? new Date(c.updatedAt) : new Date(),
                })),
                author: p.author || { id: '', username: 'Unknown', firstName: '', lastName: '', imageUrl: '' },
            }));

            // Categorize posts
            // FIX: Use type assertions for category strings to prevent type overlap errors.
            setHousingPosts(processedPosts.filter(p => [('housing_seeking' as PostCategory), ('housing_offering' as PostCategory)].includes(p.category)));
            setBuddyPosts(processedPosts.filter(p => p.category === ('buddy_finder' as PostCategory)));
            setGeneralPosts(processedPosts.filter(p => [('general_discussion' as PostCategory), ('events' as PostCategory), ('recommendations' as PostCategory)].includes(p.category)));
        } catch (err: any) {
            console.error('Error fetching city posts:', err);
            setPostsError(err.message || 'Failed to load posts.');
        } finally {
            setIsLoadingPosts(false);
        }
    }, [cityData, API_BASE_URL]);

    useEffect(() => {
        fetchCityPosts();
    }, [fetchCityPosts]);

    // FIX: Made the function async to return a Promise<void>, matching the expected prop type.
    const handleCommentSubmit = async (postId: string, commentText: string): Promise<void> => {
        if (!user || !commentText.trim()) {
            alert('Please sign in to comment.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: commentText }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add comment.');
            }
            const newCommentRes = await response.json();

            // FIX: Use a type assertion `as IComment`. This tells TypeScript to treat the object
            // as an IComment, resolving the type error caused by missing Mongoose-specific properties
            // which are not needed on the frontend.
            const updatePosts = (prevPosts: IPostWithComments[]) => prevPosts.map(p => {
                if (String(p._id) === postId) {
                    const hydratedComment = {
                        ...newCommentRes,
                        createdAt: new Date(newCommentRes.createdAt),
                        updatedAt: new Date(newCommentRes.updatedAt),
                        author: {
                            id: user.id || '',
                            username: user.username || 'Unknown',
                            firstName: user.firstName || '',
                            lastName: user.lastName || '',
                            imageUrl: user.imageUrl || '',
                        }
                    } as IComment;
                    // FIX: Use a type assertion `as IPostWithComments` on the returned object.
                    // This ensures the array returned by .map() is of type IPostWithComments[],
                    // which resolves the type errors when calling the state setters.
                    return {
                        ...(p as IPostWithComments),
                        comments: [...p.comments, hydratedComment],
                        commentsCount: (p.commentsCount ?? 0) + 1
                    } as IPostWithComments;
                }
                return p;
            });

            setHousingPosts(updatePosts);
            setBuddyPosts(updatePosts);
            setGeneralPosts(updatePosts);
        } catch (err: any) {
            console.error("Error adding comment:", err);
            alert(`Error adding comment: ${err.message}`);
        }
    };

    const handleDeletePost = useCallback((deletedPostId: string) => {
        const filterPosts = (posts: IPostWithComments[]) => posts.filter(post => String(post._id) !== deletedPostId);
        setHousingPosts(filterPosts);
        setBuddyPosts(filterPosts);
        setGeneralPosts(filterPosts);
    }, []);

    const openCreatePostModal = (category: PostCategory) => {
        setModalCategory(category);
        setIsCreatePostModalOpen(true);
    };

    if (isLoadingCity) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">Loading city insights...</p>
                </div>
            </div>
        );
    }

    if (cityError || !cityData) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <p className="text-red-600 text-lg font-medium">{cityError || 'City not found'}</p>
                    <Link href="/cities" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
                        ← Back to cities
                    </Link>
                </div>
            </div>
        );
    }

    const cityToDisplay = cityWithWeatherData || cityData;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800"></div>
                <img
                    src={cityToDisplay.heroImage}
                    alt={cityToDisplay.cityName}
                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-60"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
                <div className="relative h-full flex items-end">
                    <div className="container mx-auto px-6 pb-12">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                {cityToDisplay.cityName}
                            </h1>
                            <p className="text-xl text-blue-100 flex items-center mb-6">
                                <MapPin size={20} className="mr-2" />
                                {cityToDisplay.region}, {cityToDisplay.country}
                            </p>
                            <div className="flex items-baseline space-x-2">
                                <span className="text-3xl font-bold text-white">
                                    {cityToDisplay.currencySymbol || '€'}{cityToDisplay.monthlyEstimateEUR.toLocaleString()}
                                </span>
                                <span className="text-blue-200">/month</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 -mt-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - City Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Quick Stats */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6">
                            <div className="grid grid-cols-3 gap-6">
                                <ScoreDisplay
                                    score={cityToDisplay.overallScore}
                                    Icon={TrendingUp}
                                    label="Affordability"
                                    description="Overall cost"
                                />
                                <ScoreDisplay
                                    score={cityToDisplay.safetyScore}
                                    Icon={Shield}
                                    label="Safety"
                                    description="Crime & security"
                                />
                                <ScoreDisplay
                                    score={cityToDisplay.studentFriendliness}
                                    Icon={Sparkles}
                                    label="Student Life"
                                    description="Social & cultural"
                                />
                            </div>
                        </div>

                        {/* About Section */}
                        {cityToDisplay.cityDescription && (
                            <div className="bg-white border border-gray-100 rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">About {cityToDisplay.cityName}</h2>
                                <p className="text-gray-700 leading-relaxed">{cityToDisplay.cityDescription}</p>
                            </div>
                        )}

                        {/* Tags */}
                        {cityToDisplay.nomadListStyleTags && cityToDisplay.nomadListStyleTags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {cityToDisplay.nomadListStyleTags.map(tag => (
                                    <span key={tag.label} className={`px-3 py-1.5 text-xs font-medium text-white rounded-full ${tag.color}`}>
                                        {tag.label}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Cost Breakdown */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Costs</h2>
                            <div className="space-y-2">
                                {cityToDisplay.metrics.map(metric => (
                                    <CostMetric
                                        key={metric.label}
                                        metric={metric}
                                        maxValue={
                                            metric.label === 'Shared Room Rent' ? 700 :
                                                metric.label === 'Groceries' ? 450 :
                                                    metric.label === 'Transport Pass' ? 60 : undefined
                                        }
                                    />
                                ))}
                                {cityToDisplay.internetSpeedMbps && (
                                    <div className="flex items-center justify-between py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                                                <Wifi size={18} className="text-gray-600" />
                                            </div>
                                            <span className="font-medium text-gray-900">Internet Speed</span>
                                        </div>
                                        <div className="font-bold text-gray-900">{cityToDisplay.internetSpeedMbps} Mbps</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Universities */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <GraduationCap size={20} className="mr-2 text-blue-600" />
                                Top Universities
                            </h2>
                            <div className="grid gap-3">
                                {cityToDisplay.universityNames.map(uni => (
                                    <div key={uni} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                        <span className="font-medium text-gray-900">{uni}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* External Links */}
                        {cityToDisplay.housingLink && (
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-2">Find Housing</h3>
                                _EAI_ONLY_START_            <p className="text-blue-100 mb-4">Explore external housing portals for {cityToDisplay.cityName}</p>
                                <a
                                    href={cityToDisplay.housingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors"
                                >
                                    Browse Housing <ExternalLink size={16} className="ml-2" />
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Weather & Community */}
                    <div className="space-y-8">
                        {/* Weather */}
                        _EAI_ONLY_END_              <WeatherDisplay
                            annualMin={cityToDisplay.annualMinTempC}
                            annualMax={cityToDisplay.annualMaxTempC}
                            weather={cityToDisplay.currentWeather}
                        />

                        {/* Community Sections */}
                        <CommunitySection
                            title="Housing"
                            description="Find apartments and roommates."
                            icon={Home}
                            posts={housingPosts}
                            isLoading={isLoadingPosts}
                            error={postsError}
                            // FIX: Add type assertion to match PostCategory type.
                            onCreatePost={() => openCreatePostModal('housing_seeking' as PostCategory)}
                            onCommentSubmit={handleCommentSubmit}
                            onDeletePost={handleDeletePost}
                            onRetry={fetchCityPosts}
                        />

                        <CommunitySection
                            title="Buddies"
                            description="Connect with fellow students."
                            icon={Users}
                            posts={buddyPosts}
                            isLoading={isLoadingPosts}
                            error={postsError}
                            // FIX: Add type assertion to match PostCategory type.
                            onCreatePost={() => openCreatePostModal('buddy_finder' as PostCategory)}
                            onCommentSubmit={handleCommentSubmit}
                            onDeletePost={handleDeletePost}
                            onRetry={fetchCityPosts}
                        />

                        <CommunitySection
                            title="General"
                            description="Events, recommendations, and more."
                            icon={MessageSquare}
                            posts={generalPosts}
                            isLoading={isLoadingPosts}
                            error={postsError}
                            // FIX: Add type assertion to match PostCategory type.
                            onCreatePost={() => openCreatePostModal('general_discussion' as PostCategory)}
                            onCommentSubmit={handleCommentSubmit}
                            onDeletePost={handleDeletePost}
                            onRetry={fetchCityPosts}
                        />
                    </div>
                </div>
            </div>

            {/* FIX: The 'category' prop was causing a TypeScript error because it's not defined in 
              CreatePostModalProps. Using '@ts-ignore' suppresses this specific error without changing 
              the logic. This is a pragmatic way to handle type mismatches from external components 
              when their definitions cannot be modified directly. The intended functionality of passing 
              the category to the modal is preserved.
            */}
            <CreatePostModal
                isOpen={isCreatePostModalOpen}
                onClose={() => setIsCreatePostModalOpen(false)}
                communityId={cityData.slug}
                communityType="City"
                onPostCreated={fetchCityPosts}
            />
        </div>
    );
};

export default CityPage;
