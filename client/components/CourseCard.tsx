import React, { useState, useEffect } from 'react';
import { SignInButton, useUser } from '@clerk/nextjs';
import {
  BookOpen, ExternalLink, Award, Globe, MapPin, Clock, Star,
  Heart, Loader2, Eye, CheckSquare, CalendarPlus, CalendarCheck,
  School, ArrowRight, Lock
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Course {
  _id: string;
  nome: string;
  link: string;
  tipo?: string;
  uni: string;
  accesso?: string;
  area?: string;
  lingua?: string;
  comune: string;
  viewCount?: number;
  favoriteCount?: number;
  trackedCount?: number;
}

interface CourseCardProps {
  course: Course;
  index: number;
  initialIsFavorite?: boolean;
  initialFavoriteId?: string | null;
  initialIsTracked?: boolean;
  initialTrackedItemId?: string | null;
  onFavoriteToggle?: (courseId: string, isFavorite: boolean, favoriteId: string | null) => void;
  onTrackToggle?: (courseId: string, isTracked: boolean, trackedItemId: string | null) => void;
  onViewIncrement?: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  index,
  initialIsFavorite = false,
  initialFavoriteId = null,
  initialIsTracked = false,
  initialTrackedItemId = null,
  onFavoriteToggle,
  onTrackToggle,
  onViewIncrement
}) => {
  const { isSignedIn, user } = useUser();
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  // Local state for this card - initialize with props values
  const [isFavorite, setIsFavorite] = useState(() => initialIsFavorite);
  const [favoriteId, setFavoriteId] = useState<string | null>(() => initialFavoriteId);
  const [isTracked, setIsTracked] = useState(() => initialIsTracked);
  const [trackedItemId, setTrackedItemId] = useState<string | null>(() => initialTrackedItemId);

  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);

  // Display counts - these will be updated optimistically
  const [displayedViewCount, setDisplayedViewCount] = useState(() => course.viewCount || 0);
  const [displayedFavoriteCount, setDisplayedFavoriteCount] = useState(() => course.favoriteCount || 0);
  const [displayedTrackedCount, setDisplayedTrackedCount] = useState(() => course.trackedCount || 0);

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Update local state when props change (for dynamic updates)
  useEffect(() => {
    setIsFavorite(initialIsFavorite);
    setFavoriteId(initialFavoriteId);
  }, [initialIsFavorite, initialFavoriteId]);

  useEffect(() => {
    setIsTracked(initialIsTracked);
    setTrackedItemId(initialTrackedItemId);
  }, [initialIsTracked, initialTrackedItemId]);

  useEffect(() => {
    setDisplayedViewCount(course.viewCount || 0);
    setDisplayedFavoriteCount(course.favoriteCount || 0);
    setDisplayedTrackedCount(course.trackedCount || 0);
  }, [course.viewCount, course.favoriteCount, course.trackedCount]);

  // Debug log to verify initial state (remove in production)
  useEffect(() => {
    console.log(`CourseCard ${course._id} initial state:`, {
      initialIsFavorite,
      initialFavoriteId,
      initialIsTracked,
      initialTrackedItemId,
      isFavorite,
      isTracked
    });
  }, []);

  const showAuthPrompt = (actionKey: string, defaultActionText: string) => {
    const message = t('profile', actionKey, { defaultValue: `Please sign in to ${defaultActionText}.` });
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const showFeedback = (message: string, isError: boolean = false) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleLinkClick = async (e: React.MouseEvent) => {
    // Increment view count optimistically
    setDisplayedViewCount(prev => prev + 1);

    try {
      const response = await fetch(`/api/courses/${course._id}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to increment view count');
      }

      // Notify parent component
      if (onViewIncrement) {
        onViewIncrement(course._id);
      }
    } catch (error) {
      console.error("Failed to increment view count on backend:", error);
      // Rollback optimistic update
      setDisplayedViewCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn || !user) {
      showAuthPrompt('signInToManageFavorites', 'manage favorites');
      return;
    }

    if (!course._id) {
      showFeedback("Course ID is missing.", true);
      return;
    }

    setIsFavoriteLoading(true);
    setFeedbackMessage(null);

    try {
      let response;
      let result;

      if (isFavorite && favoriteId) {
        // Remove from favorites
        response = await fetch(`/api/favorites?id=${favoriteId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        result = await response.json();

        if (result.success) {
          setIsFavorite(false);
          setFavoriteId(null);
          setDisplayedFavoriteCount(prev => Math.max(0, prev - 1));
          showFeedback(result.message || t('profile', 'favoritesRemoved', { defaultValue: 'Removed from favorites.' }));

          if (onFavoriteToggle) {
            onFavoriteToggle(course._id, false, null);
          }
        } else {
          throw new Error(result.message || 'Failed to remove favorite.');
        }
      } else {
        // Add to favorites
        const courseDataForApi = {
          courseId: course._id,
          uni: course.uni,
          nome: course.nome,
          link: course.link,
          comune: course.comune
        };

        response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ course: courseDataForApi }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        result = await response.json();

        if (result.success && result.data) {
          setIsFavorite(true);
          setFavoriteId(result.data._id);
          setDisplayedFavoriteCount(prev => prev + 1);
          showFeedback(result.message || t('profile', 'favoritesAdded', { defaultValue: 'Added to favorites!' }));

          if (onFavoriteToggle) {
            onFavoriteToggle(course._id, true, result.data._id);
          }
        } else {
          throw new Error(result.message || 'Failed to add favorite.');
        }
      }
    } catch (error: any) {
      console.error('Failed to toggle favorite:', error);
      showFeedback(error.message || 'An error occurred with favorites.', true);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const handleToggleTrackDeadline = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn || !user) {
      showAuthPrompt('signInToTrackDeadlines', 'track deadlines');
      return;
    }

    if (!course._id) {
      showFeedback("Course ID is missing for tracking.", true);
      return;
    }

    setIsTrackingLoading(true);
    setFeedbackMessage(null);

    try {
      let response;
      let result;

      if (isTracked && trackedItemId) {
        // Remove from tracking
        response = await fetch(`/api/tracked-items?id=${trackedItemId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        result = await response.json();

        if (result.success) {
          setIsTracked(false);
          setTrackedItemId(null);
          setDisplayedTrackedCount(prev => Math.max(0, prev - 1));
          showFeedback(result.message || t('profile', 'trackingStopped', { defaultValue: 'Stopped tracking deadlines.' }));

          if (onTrackToggle) {
            onTrackToggle(course._id, false, null);
          }
        } else {
          throw new Error(result.message || 'Failed to remove from tracker.');
        }
      } else {
        // Add to tracking
        response = await fetch('/api/tracked-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId: course._id,
            courseLink: course.link
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        result = await response.json();

        if (result.success && result.data) {
          setIsTracked(true);
          setTrackedItemId(result.data._id);
          setDisplayedTrackedCount(prev => prev + 1);
          showFeedback(result.message || t('profile', 'trackingStarted', { defaultValue: 'Deadlines now tracked!' }));

          if (onTrackToggle) {
            onTrackToggle(course._id, true, result.data._id);
          }
        } else {
          throw new Error(result.message || 'Failed to add to tracker.');
        }
      }
    } catch (error: any) {
      console.error('Failed to toggle deadline tracking:', error);
      showFeedback(error.message || 'An error occurred during tracking update.', true);
    } finally {
      setIsTrackingLoading(false);
    }
  };

  // Non-signed in view
  if (!isSignedIn) {
    return (
      <div
        className="animate-fade-in-up bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Course Icon */}
            <div className="flex-shrink-0">
              <div className="p-4 bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Course Info */}
            <div className="flex-grow min-w-0">
              <div className="flex flex-wrap items-start gap-3 mb-3">
                <h3 className="text-xl font-black text-slate-900 flex-grow line-clamp-2">
                  {course.nome}
                </h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary whitespace-nowrap">
                  <Lock className="h-3.5 w-3.5 mr-1" />
                  {t('universities', 'protectedContent', { defaultValue: 'Restricted' })}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="p-1.5 bg-slate-100 rounded-lg">
                    <School className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold">University</div>
                    <div className="font-bold text-slate-800">{course.uni}</div>
                  </div>
                </div>
                {course.comune && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <div className="p-1.5 bg-slate-100 rounded-lg">
                      <MapPin className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-semibold">Location</div>
                      <div className="font-bold text-slate-800">{course.comune}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats for non-signed users */}
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500 mb-4">
                <span className="flex items-center" title={`${displayedViewCount} views`}>
                  <Eye size={12} className="mr-0.5 text-neutral-400" /> {displayedViewCount}
                </span>
                <span className="flex items-center" title={`${displayedFavoriteCount} favorites`}>
                  <Heart size={12} className="mr-0.5 text-neutral-400" /> {displayedFavoriteCount}
                </span>
                <span className="flex items-center" title={`${displayedTrackedCount} tracking`}>
                  <CheckSquare size={12} className="mr-0.5 text-neutral-400" /> {displayedTrackedCount}
                </span>
              </div>

              {/* Sign in prompt */}
              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <School className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1 text-center">
                    <h4 className="font-medium text-primary text-sm">
                      {t('universities', 'protectedContent', { defaultValue: 'Protected Content' })}
                    </h4>
                    <p className="text-xs text-textSecondary max-w-sm mx-auto">
                      {t('programs', 'signInToAccess', { defaultValue: 'Sign in to access course details and features' })}
                    </p>
                  </div>
                  <SignInButton mode="modal">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-full transition-all duration-300 text-sm hover:shadow-soft active:scale-95">
                      {t('universities', 'login', { defaultValue: 'Sign In' })}
                      <ArrowRight className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                  </SignInButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Signed-in user view
  return (
    <div
      className="animate-fade-in-up group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-slate-200 hover:border-emerald-300 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Course Icon */}
          <div className="flex-shrink-0">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Course Info */}
          <div className="flex-grow min-w-0">
            <div className="flex flex-wrap items-start gap-3 mb-3">
              <div className="flex-grow min-w-0">
                <p className="text-xs text-textSecondary mb-1">
                  {t('programs', 'clickLink', { defaultValue: 'Click to visit course page' })}
                </p>
                <a
                  href={course.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkClick}
                  className="group/link inline-flex items-center gap-1.5 font-black text-xl text-slate-900 hover:text-emerald-600 transition-colors duration-300"
                >
                  <span className="underline-offset-4 group-hover/link:underline line-clamp-2 break-words">
                    {course.nome}
                  </span>
                  <ExternalLink className="h-4 w-4 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300 flex-shrink-0" />
                </a>
              </div>
              <div className="flex flex-wrap gap-2">
                {course.tipo && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
                    <Award className="h-3 w-3" />
                    {course.tipo}
                  </span>
                )}
                {course.lingua && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full border border-purple-200">
                    <Globe className="h-3 w-3" />
                    {course.lingua}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 text-slate-600">
                <div className="p-1.5 bg-slate-100 rounded-lg">
                  <School className="h-4 w-4 text-slate-500" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-semibold">University</div>
                  <div className="font-bold text-slate-800">{course.uni}</div>
                </div>
              </div>
              {course.area && (
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="p-1.5 bg-slate-100 rounded-lg">
                    <Star className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold">Study Area</div>
                    <div className="font-bold text-slate-800">{course.area}</div>
                  </div>
                </div>
              )}
              {course.comune && (
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="p-1.5 bg-slate-100 rounded-lg">
                    <MapPin className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold">Location</div>
                    <div className="font-bold text-slate-800">{course.comune}</div>
                  </div>
                </div>
              )}
              {course.accesso && (
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="p-1.5 bg-slate-100 rounded-lg">
                    <Clock className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold">Access</div>
                    <div className="font-bold text-slate-800">{course.accesso}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500 mb-3">
              <span className="flex items-center" title={t('programRow', 'viewCountTooltip', { count: displayedViewCount, defaultValue: `${displayedViewCount} views` })}>
                <Eye size={12} className="mr-0.5 text-neutral-400" /> {displayedViewCount}
              </span>
              <span className="flex items-center" title={t('programRow', 'favoriteCountTooltip', { count: displayedFavoriteCount, defaultValue: `${displayedFavoriteCount} favorites` })}>
                <Heart size={12} className="mr-0.5 text-neutral-400" /> {displayedFavoriteCount}
              </span>
              <span className="flex items-center" title={t('programRow', 'trackedCountTooltip', { count: displayedTrackedCount, defaultValue: `${displayedTrackedCount} tracking` })}>
                <CheckSquare size={12} className="mr-0.5 text-neutral-400" /> {displayedTrackedCount}
              </span>
            </div>

            {/* Feedback Message */}
            {feedbackMessage && (
              <p className={`mb-3 text-xs text-center sm:text-left font-medium ${feedbackMessage.includes('Failed') ||
                  feedbackMessage.includes('error') ||
                  feedbackMessage.includes('Please sign in')
                  ? 'text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2'
                  : 'text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2'
                }`}>
                {feedbackMessage}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex-shrink-0 flex gap-3">
            <button
              onClick={handleToggleFavorite}
              disabled={isFavoriteLoading}
              title={
                isFavoriteLoading
                  ? (t('profile', 'favoritesUpdating') || "Updating...")
                  : (isFavorite
                    ? (t('profile', 'favoritesRemoveTooltip') || "Remove from favorites")
                    : (t('programSearch', 'favoritesAddTooltip') || "Add to favorites")
                  )
              }
              className={`p-3 rounded-2xl transition-all duration-200 ease-in-out transform border-2
                         ${isFavoriteLoading
                  ? 'cursor-not-allowed bg-neutral-200 border-neutral-300'
                  : 'hover:scale-105 active:scale-95'
                }
                         ${isFavorite
                  ? 'text-red-500 bg-red-50 border-red-200 shadow-md hover:bg-red-100'
                  : 'text-neutral-400 bg-white border-neutral-200 hover:text-red-400 hover:bg-red-50 hover:border-red-200'
                }`}
              aria-label={isFavorite ? (t('actions', 'unfavorite') || 'Unfavorite') : (t('actions', 'favorite') || 'Favorite')}
            >
              {isFavoriteLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Heart
                  className="h-5 w-5"
                  fill={isFavorite ? "currentColor" : "none"}
                  stroke={isFavorite ? "currentColor" : "currentColor"}
                  strokeWidth={isFavorite ? 1 : 2}
                />
              )}
            </button>
            <button
              onClick={handleToggleTrackDeadline}
              disabled={isTrackingLoading}
              title={
                isTrackingLoading
                  ? (t('profile', 'trackingUpdating') || "Updating tracker...")
                  : (isTracked
                    ? (t('profile', 'trackingStopTooltip') || "Stop tracking")
                    : "Track deadlines"
                  )
              }
              className={`p-3 rounded-2xl transition-all duration-200 ease-in-out transform border-2
                         ${isTrackingLoading
                  ? 'cursor-not-allowed bg-neutral-200 border-neutral-300'
                  : 'hover:scale-105 active:scale-95'
                }
                         ${isTracked
                  ? 'text-sky-600 bg-sky-50 border-sky-200 shadow-md hover:bg-sky-100'
                  : 'text-neutral-400 bg-white border-neutral-200 hover:text-sky-500 hover:bg-sky-50 hover:border-sky-200'
                }`}
              aria-label={isTracked ? (t('actions', 'untrack') || 'Untrack') : (t('actions', 'track') || 'Track deadlines')}
            >
              {isTrackingLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                isTracked ? <CalendarCheck className="h-5 w-5" /> : <CalendarPlus className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;