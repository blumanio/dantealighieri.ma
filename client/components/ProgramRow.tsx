// client/components/ProgramRow.tsx
// No changes were strictly required in this file based on the backend updates,
// as the API endpoints it consumes were preserved.
// The existing logic for optimistic updates and state management appears sound.
// Ensure that the `CourseFromAPI` interface matches the data structure being returned
// by the parent component that fetches the list of courses. Specifically, ensure `trackedCount`
// and `favoriteCount` are indeed available on the `course` prop if they are to be displayed initially.

import React, { useState, useEffect } from 'react';
import { SignInButton, useUser } from '@clerk/nextjs';
import {
  Lock, MapPin, ExternalLink, School, ArrowRight, Heart, Loader2,
  Eye,          // For View Count
  CheckSquare,  // For Tracked Count
  CalendarPlus, // Icon for Add to Tracker
  CalendarCheck,// Icon for Already Tracking
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext'; // Adjust path as necessary

interface CourseFromAPI {
  _id: string;
  uni: string;
  comune: string;
  link: string;
  nome: string;
  viewCount?: number;   // Expected from API after parent fetches course list
  favoriteCount?: number; // Expected from API after parent fetches course list
  trackedCount?: number;  // Expected from API after parent fetches course list
}

interface ProgramRowProps {
  course: CourseFromAPI;
  initialIsFavorite?: boolean;
  initialFavoriteId?: string | null;
  onFavoriteToggle?: (courseId: string, isFavorite: boolean, favoriteId: string | null) => void;

  initialIsTracked?: boolean;
  initialTrackedItemId?: string | null;
  onTrackToggle?: (courseId: string, isTracked: boolean, trackedItemId: string | null) => void;
}

const ProgramRow: React.FC<ProgramRowProps> = ({
  course,
  initialIsFavorite = false,
  initialFavoriteId = null,
  onFavoriteToggle,
  initialIsTracked = false,
  initialTrackedItemId = null,
  onTrackToggle,
}) => {
  const { isSignedIn, user } = useUser();
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [favoriteId, setFavoriteId] = useState<string | null>(initialFavoriteId);
  const [isTracked, setIsTracked] = useState(initialIsTracked);
  const [trackedItemId, setTrackedItemId] = useState<string | null>(initialTrackedItemId);

  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);

  // Counts displayed in UI, initialized from props, updated optimistically or by prop changes
  const [displayedViewCount, setDisplayedViewCount] = useState(course.viewCount || 0);
  const [displayedFavoriteCount, setDisplayedFavoriteCount] = useState(course.favoriteCount || 0);
  const [displayedTrackedCount, setDisplayedTrackedCount] = useState(course.trackedCount || 0);

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

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


  const handleLinkClick = async () => {
    setDisplayedViewCount(prev => prev + 1); 
    try {
      await fetch(`/api/courses/${course._id}/view`, { method: 'POST' });
    } catch (error) {
      console.error("Failed to increment view count on backend:", error);
      setDisplayedViewCount(prev => Math.max(0, prev - 1)); 
    }
  };

  const showAuthPrompt = (actionKey: string, defaultActionText: string) => {
    setFeedbackMessage(t('profile', actionKey, { defaultValue: `Please sign in to ${defaultActionText}.` }));
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleToggleFavorite = async () => {
    if (!isSignedIn || !user) {
      showAuthPrompt('signInToManageFavorites', 'manage favorites');
      return;
    }
    if (!course._id) {
      setFeedbackMessage("Course ID is missing.");
      setTimeout(() => setFeedbackMessage(null), 3000);
      return;
    }

    setIsFavoriteLoading(true);
    setFeedbackMessage(null);

    try {
      let response;
      let result;

      if (isFavorite && favoriteId) {
        response = await fetch(`/api/favorites?id=${favoriteId}`, { method: 'DELETE' });
        result = await response.json();
        if (response.ok && result.success) {
          setIsFavorite(false);
          setFavoriteId(null);
          setDisplayedFavoriteCount(prev => Math.max(0, prev - 1)); // Optimistic update
          setFeedbackMessage(result.message || t('profile', 'favoritesRemoved', { defaultValue: 'Removed from favorites.' }));
          if (onFavoriteToggle) onFavoriteToggle(course._id, false, null);
        } else {
          throw new Error(result.message || 'Failed to remove favorite.');
        }
      } else {
        const courseDataForApi = {
          courseId: course._id, 
          uni: course.uni, // These details might be used by the /api/favorites POST endpoint
          nome: course.nome,
          link: course.link,
          comune: course.comune
        };
        response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ course: courseDataForApi }), // Assuming /api/favorites expects this structure
        });
        result = await response.json();
        if (response.ok && result.success && result.data) {
          setIsFavorite(true);
          setFavoriteId(result.data._id); // Assuming the new favorite item's ID is in result.data._id
          setDisplayedFavoriteCount(prev => prev + 1); // Optimistic update
          setFeedbackMessage(result.message || t('profile', 'favoritesAdded', { defaultValue: 'Added to favorites!' }));
          if (onFavoriteToggle) onFavoriteToggle(course._id, true, result.data._id);
        } else {
          throw new Error(result.message || 'Failed to add favorite.');
        }
      }
    } catch (error: any) {
      console.error('Failed to toggle favorite:', error);
      setFeedbackMessage(error.message || 'An error occurred with favorites.');
    } finally {
      setIsFavoriteLoading(false);
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  const handleToggleTrackDeadline = async () => {
    if (!isSignedIn || !user) {
      showAuthPrompt('signInToTrackDeadlines', 'track deadlines');
      return;
    }
    if (!course._id) {
      setFeedbackMessage("Course ID is missing for tracking.");
      setTimeout(() => setFeedbackMessage(null), 3000);
      return;
    }

    setIsTrackingLoading(true);
    setFeedbackMessage(null);

    try {
      let response;
      let result;

      if (isTracked && trackedItemId) {
        // This API call is to DELETE /api/tracked-items?id=...
        // which is handled by client/app/api/tracked-items/route.ts
        response = await fetch(`/api/tracked-items?id=${trackedItemId}`, { method: 'DELETE' });
        result = await response.json();
        if (response.ok && result.success) {
          setIsTracked(false);
          setTrackedItemId(null);
          setDisplayedTrackedCount(prev => Math.max(0, prev - 1)); // Optimistic update
          setFeedbackMessage(result.message || t('profile', 'trackingStopped', { defaultValue: 'Stopped tracking deadlines.' }));
          if (onTrackToggle) onTrackToggle(course._id, false, null);
        } else {
          throw new Error(result.message || 'Failed to remove from tracker.');
        }
      } else {
        // This API call is to POST /api/tracked-items
        // which is handled by client/app/api/tracked-items/route.ts
        response = await fetch('/api/tracked-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId: course._id, courseLink: course.link }),
        });
        result = await response.json();
        if (response.ok && result.success && result.data) {
          setIsTracked(true);
          // The tracked item's ID is result.data._id from the backend
          setTrackedItemId(result.data._id); 
          setDisplayedTrackedCount(prev => prev + 1); // Optimistic update
          setFeedbackMessage(result.message || t('profile', 'trackingStarted', { defaultValue: 'Deadlines now tracked!' }));
          if (onTrackToggle) onTrackToggle(course._id, true, result.data._id);
        } else {
          throw new Error(result.message || 'Failed to add to tracker.');
        }
      }
    } catch (error: any) {
      console.error('Failed to toggle deadline tracking:', error);
      setFeedbackMessage(error.message || 'An error occurred during tracking update.');
    } finally {
      setIsTrackingLoading(false);
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  // Non-signed in view
  if (!isSignedIn) {
    return (
      <div className="bg-white rounded-xl shadow-soft overflow-hidden border border-neutral-200 hover:shadow-medium transition-all duration-300">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-primary mb-2 line-clamp-2 hover:line-clamp-none transition-all duration-300">{course.uni}</h3>
              <div className="flex items-center gap-2 text-textSecondary text-sm"><MapPin className="h-4 w-4 text-primary/70" /><span>{course.comune}</span></div>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary whitespace-nowrap"><Lock className="h-3.5 w-3.5 mr-1" />Restricted</span>
          </div>
          <p className="mt-4 text-lg font-semibold text-textSecondary line-clamp-2 hover:line-clamp-none transition-all duration-300">{course.nome}</p>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500">
            <span className="flex items-center" title={t('programSearch', 'viewCountTooltip', { count: displayedViewCount, defaultValue: `${displayedViewCount} views` })}>
              <Eye size={12} className="mr-0.5 text-neutral-400" /> {displayedViewCount}
            </span>
            <span className="flex items-center" title={t('programSearch', 'favoriteCountTooltip', { count: displayedFavoriteCount, defaultValue: `${displayedFavoriteCount} favorites` })}>
              <Heart size={12} className="mr-0.5 text-neutral-400" /> {displayedFavoriteCount}
            </span>
            <span className="flex items-center" title={t('programSearch', 'trackedCountTooltip', { count: displayedTrackedCount, defaultValue: `${displayedTrackedCount} tracking` })}>
              <CheckSquare size={12} className="mr-0.5 text-neutral-400" /> {displayedTrackedCount}
            </span>
          </div>
          <div className="mt-6"><div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200"><div className="flex flex-col items-center gap-4"><div className="p-3 bg-primary/10 rounded-full"><School className="h-6 w-6 text-primary" /></div><div className="space-y-2 text-center"><h4 className="font-medium text-primary">{t('universities', 'protectedContent')}</h4><p className="text-sm text-textSecondary max-w-sm mx-auto">{t('programs', 'signInToAccess')}</p></div><SignInButton mode="modal"><button className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-full transition-all duration-300 text-sm hover:shadow-soft active:scale-95">{t('universities', 'login')}<ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} /></button></SignInButton></div></div></div>
        </div>
      </div>
    );
  }

  // Signed-in user view
  return (
    <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4 sm:p-5 hover:shadow-medium transition-all duration-300 hover:border-primary/20 group relative">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
        <div className="space-y-2 flex-grow min-w-0">
          <p className="text-xs text-textSecondary mb-0.5">{t('programs', 'clickLink')}</p>
          <a
            href={course.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className="group/link inline-flex items-center gap-1.5 font-semibold text-base text-primary hover:text-primary-dark transition-colors duration-300"
          >
            <span className="underline-offset-4 group-hover/link:underline line-clamp-2 break-words">{course.nome}</span>
            <ExternalLink className="h-3.5 w-3.5 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300 flex-shrink-0" />
          </a>
          <div className="flex items-center text-xs text-textSecondary">
            <MapPin className="h-3.5 w-3.5 text-primary/70 mr-1.5 flex-shrink-0" />
            <span className="font-medium truncate">{course.comune}</span>
          </div>
          <div className="flex items-center gap-1.5 text-textPrimary font-medium text-xs">
            <School className="h-4 w-4 text-primary/70 flex-shrink-0" />
            <span className="group-hover:text-primary transition-colors duration-300 truncate">{course.uni}</span>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1.5 flex-shrink-0 pt-1 self-start sm:self-center">
          <button
            onClick={handleToggleFavorite}
            disabled={isFavoriteLoading}
            title={isFavoriteLoading ? (t('profile', 'favoritesUpdating') || "Updating...") : (isFavorite ? (t('profile', 'favoritesRemoveTooltip') || "Remove from favorites") : (t('programSearch', 'favoritesAddTooltip') || "Add to favorites"))}
            className={`p-2 rounded-full transition-all duration-200 ease-in-out 
                         ${isFavoriteLoading ? 'cursor-not-allowed bg-neutral-200' : 'hover:bg-red-50 active:bg-red-100'}
                         ${isFavorite ? 'text-red-500 bg-red-50' : 'text-neutral-400 hover:text-red-400'}`}
            aria-label={isFavorite ? (t('actions', 'unfavorite') || 'Unfavorite') : (t('actions', 'favorite') || 'Favorite')}
          >
            {isFavoriteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />}
          </button>
          <button
            onClick={handleToggleTrackDeadline}
            disabled={isTrackingLoading}
            title={isTrackingLoading ? (t('profile', 'trackingUpdating') || "Updating tracker...") : (isTracked ? (t('profile', 'trackingStopTooltip') || "Stop tracking") : (t('trackingStartTooltip', 'trackingStartTooltip') || "Track deadlines"))}
            className={`p-2 rounded-full transition-all duration-200 ease-in-out 
                         ${isTrackingLoading ? 'cursor-not-allowed bg-neutral-200' : 'hover:bg-sky-50 active:bg-sky-100'}
                         ${isTracked ? 'text-sky-600 bg-sky-50' : 'text-neutral-400 hover:text-sky-500'}`}
            aria-label={isTracked ? (t('actions', 'untrack') || 'Untrack') : (t('actions', 'track') || 'Track deadlines')}
          >
            {isTrackingLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isTracked ? <CalendarCheck className="h-4 w-4" /> : <CalendarPlus className="h-4 w-4" />)}
          </button>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500">
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

      {feedbackMessage && (
        <p className={`mt-1.5 text-xs text-center sm:text-left ${feedbackMessage.includes('Failed') || feedbackMessage.includes('error') || feedbackMessage.includes('Please sign in') ? 'text-red-600' : 'text-green-600'}`}>
          {feedbackMessage}
        </p>
      )}
    </div>
  );
};

export default ProgramRow;