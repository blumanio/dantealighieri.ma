// File: client/components/UniversityCard.tsx
import React, { useState, useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { useLanguage } from "@/context/LanguageContext";
import { Translation } from "@/app/i18n/types";
// Assuming Next.js Link is intended for navigation. If not, this import might need adjustment.
import Link from 'next/link';
import {
  Calendar, ChevronDown, ChevronUp, Euro, ExternalLink,
  Globe, GraduationCap, MapPin, Lock, School, Eye, Heart, CalendarPlus, CalendarCheck, Loader2,
  Link as LinkIcon // Renamed to avoid conflict if a navigation Link component is also used
} from "lucide-react";
import { parseDeadlineDateString } from '@/lib/data';

// Updated University interface
export interface University {
  status: string;
  isFavoriteInitial: boolean;
  isTrackedInitial: boolean;
  _id: string;
  name: string;
  slug: string;
  location?: string;
  city?: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  contacts?: { email?: string; phone?: string };
  deadline?: string;
  admission_fee?: number;
  cgpa_requirement?: string;
  english_requirement?: string;
  intakes?: { name: string; start_date?: string; end_date?: string; notes?: string }[];
  application_link?: string;
  viewCount: number;
  favoriteCount: number;
  trackedCount: number;
  id?: number;
}

interface UniversityCardProps {
  university: University;
  isSignedIn: boolean;
  isExpanded: boolean;
  onToggle: (universityId: string) => void;
  t: (namespaceKey: keyof Translation, MKey: string, options?: any) => string;
  onFavoriteToggled?: (universityId: string, isFavorite: boolean, newCount?: number) => void;
  onTrackToggled?: (universityId: string, isTracked: boolean, newCount?: number) => void;
}

const UniversityCard = ({
  university,
  isSignedIn,
  isExpanded,
  onToggle,
  t,
  onFavoriteToggled,
  onTrackToggled
}: UniversityCardProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const allowedStatuses = ['Open', 'Closed', 'Coming Soon', 'TBA'] as const;
  const initialStatus: 'Open' | 'Closed' | 'Coming Soon' | 'TBA' =
    allowedStatuses.includes(university.status as any) ? university.status as any : 'TBA';
  const [currentStatus, setCurrentStatus] = useState<'Open' | 'Closed' | 'Coming Soon' | 'TBA'>(initialStatus);

  const [viewCount, setViewCount] = useState(university.viewCount || 0);
  const [favoriteCount, setFavoriteCount] = useState(university.favoriteCount || 0);
  const [trackedCount, setTrackedCount] = useState(university.trackedCount || 0);

  const [isFavorite, setIsFavorite] = useState(university.isFavoriteInitial || false);
  const [isTracked, setIsTracked] = useState(university.isTrackedInitial || false);

  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsFavorite(university.isFavoriteInitial || false);
  }, [university.isFavoriteInitial]);

  useEffect(() => {
    setIsTracked(university.isTrackedInitial || false);
  }, [university.isTrackedInitial]);

  useEffect(() => {
    setViewCount(university.viewCount || 0);
    setFavoriteCount(university.favoriteCount || 0);
    setTrackedCount(university.trackedCount || 0);
  }, [university.viewCount, university.favoriteCount, university.trackedCount]);


  useEffect(() => {
    const calculateStatus = () => {
      if (!university.intakes || university.intakes.length === 0) {
        setCurrentStatus('TBA');
        return;
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let isOpen = false;
      let hasFutureIntakes = false;
      for (const intake of university.intakes) {
        const startDate = intake.start_date ? parseDeadlineDateString(intake.start_date, today.getFullYear()) : null;
        const endDate = intake.end_date ? parseDeadlineDateString(intake.end_date, today.getFullYear()) : null;
        if (startDate && endDate) {
          if (today >= startDate && today <= endDate) { isOpen = true; break; }
          if (startDate > today) hasFutureIntakes = true;
        } else if (startDate && today >= startDate) {
          // Assuming open if only start date and it has passed. Logic might need refinement.
        }
        if (startDate && startDate > today) hasFutureIntakes = true;
      }
      if (isOpen) setCurrentStatus('Open');
      else if (hasFutureIntakes) setCurrentStatus('Coming Soon');
      else setCurrentStatus('Closed');
    };
    calculateStatus();
  }, [university.intakes]);

  const handleToggleExpand = async () => {
    if (!isExpanded && university._id) {
      setViewCount(prev => prev + 1);
      try {
        const response = await fetch(`/api/universities/${university._id}/view`, { method: 'POST' });
        if (response.ok) {
          const result = await response.json();
          if (result.success && typeof result.data.viewCount === 'number') {
            setViewCount(result.data.viewCount);
          }
        } else {
          // setViewCount(prev => prev -1); // Optional: Revert
        }
      } catch (e) {
        console.error("Failed to record view:", e);
        // setViewCount(prev => prev - 1); // Optional: Revert
      }
    }
    onToggle(university._id);
  };

  const handleToggleFavorite = async () => {
    if (!isSignedIn) {
      setFeedbackMessage(t('universities', 'loginPromptShort', { defaultValue: "Login to favorite" }));
      setTimeout(() => setFeedbackMessage(null), 3000);
      return;
    }
    if (!university._id) return;

    setIsFavoriteLoading(true);
    const originalIsFavorite = isFavorite;
    const originalFavoriteCount = favoriteCount;

    setIsFavorite(!originalIsFavorite);
    setFavoriteCount(prev => originalIsFavorite ? Math.max(0, prev - 1) : prev + 1);

    try {
      const response = await fetch(`/api/universities/${university._id}/favorite`, {
        method: originalIsFavorite ? 'DELETE' : 'POST',
      });
      const result = await response.json();

      if (result.success) {
        if (typeof result.favoriteCount === 'number') {
          setFavoriteCount(result.favoriteCount);
        }
        if (onFavoriteToggled) onFavoriteToggled(university._id, !originalIsFavorite, result.favoriteCount);
      } else {
        setIsFavorite(originalIsFavorite);
        setFavoriteCount(originalFavoriteCount);
        setFeedbackMessage(result.message || t('universities', 'actionFailed'));
        setTimeout(() => setFeedbackMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setIsFavorite(originalIsFavorite);
      setFavoriteCount(originalFavoriteCount);
      setFeedbackMessage(t('universities', 'actionFailed'));
      setTimeout(() => setFeedbackMessage(null), 3000);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const handleToggleTrack = async () => {
    if (!isSignedIn) {
      setFeedbackMessage(t('universities', 'loginPromptShort', { defaultValue: "Login to track" }));
      setTimeout(() => setFeedbackMessage(null), 3000);
      return;
    }
    if (!university._id) return;

    setIsTrackingLoading(true);
    const originalIsTracked = isTracked;
    const originalTrackedCount = trackedCount;

    setIsTracked(!originalIsTracked);
    setTrackedCount(prev => originalIsTracked ? Math.max(0, prev - 1) : prev + 1);

    try {
      const response = await fetch(`/api/universities/${university._id}/track`, {
        method: originalIsTracked ? 'DELETE' : 'POST',
      });
      const result = await response.json();

      if (result.success) {
        if (typeof result.trackedCount === 'number') {
          setTrackedCount(result.trackedCount);
        }
        if (onTrackToggled) onTrackToggled(university._id, !originalIsTracked, result.trackedCount);
      } else {
        setIsTracked(originalIsTracked);
        setTrackedCount(originalTrackedCount);
        setFeedbackMessage(result.message || t('universities', 'actionFailed'));
        setTimeout(() => setFeedbackMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error toggling track:', error);
      setIsTracked(originalIsTracked);
      setTrackedCount(originalTrackedCount);
      setFeedbackMessage(t('universities', 'actionFailed'));
      setTimeout(() => setFeedbackMessage(null), 3000);
    } finally {
      setIsTrackingLoading(false);
    }
  };

  const statusText = t('universities', currentStatus.toLowerCase().replace(/\s+/g, '') as keyof Translation['universities'], {
    defaultValue: currentStatus
  });
  let statusColorClass = 'bg-secondary/10 text-secondary';
  if (currentStatus === 'Open') statusColorClass = 'bg-primary/10 text-primary';
  else if (currentStatus === 'Coming Soon') statusColorClass = 'bg-yellow-400/10 text-yellow-500';

  if (!isSignedIn && !isExpanded) {
    return (
      <div className="bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300">
        <div className="p-6">
          <div className={`flex justify-between items-start gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Link href={`/${language}/university-hubs/${encodeURIComponent(university.name)}`} passHref className="block hover:underline">
                  <h3 className="text-xl font-semibold text-primary mb-1">
                    {university.name}
                  </h3>
                  <div className={`flex items-center gap-2 text-sm text-textSecondary ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <MapPin className="h-4 w-4 text-primary/70" />
                    <span>{university.location}</span>
                  </div>
                </Link>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColorClass}`}>
              {statusText}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500">
            <span className="flex items-center" title={`${viewCount} views`}><Eye size={12} className="mr-0.5" /> {viewCount}</span>
            <span className="flex items-center" title={`${favoriteCount} favorites`}><Heart size={12} className="mr-0.5" /> {favoriteCount}</span>
            <span className="flex items-center" title={`${trackedCount} tracking`}><CalendarCheck size={12} className="mr-0.5" /> {trackedCount}</span>
          </div>
          <div className="mt-5">
            <button
              onClick={handleToggleExpand}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-5
                                     text-sm font-medium text-white bg-primary hover:bg-primary-dark
                                     rounded-full transition-all duration-300 hover:shadow-soft
                                     active:scale-95"
            >
              {t('universities', 'showMore')}
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 group">
      <div className="p-6">
        <div className={`flex justify-between items-start gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <Link href={`/${language}/university-hubs/${encodeURIComponent(university.name)}`} passHref className="hover:shadow-medium group hover:border-primary ">
              
                <h3 className="text-xl font-semibold text-primary group-hover:text-primary-dark transition-colors duration-300 mb-2">
                  {university.name}
                </h3>
            </Link>
            <div className={`flex items-center gap-2 text-textSecondary ${isRTL ? 'flex-row-reverse' : ''}`}>
              <MapPin className="h-4 w-4 text-primary/70" />
              <span>{university.location}</span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 whitespace-nowrap ${statusColorClass}`}>
            {statusText}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-neutral-50 rounded-lg p-3 hover:bg-primary/5 transition-colors duration-300">
            <div className={`flex items-center gap-2 text-textSecondary text-xs mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Calendar className="h-3.5 w-3.5 text-primary/70" />
              <span>{t('universities', 'deadline')}</span>
            </div>
            <p className={`font-medium text-primary text-sm ${isRTL ? 'text-right' : ''}`}>
              {university.deadline || t('universities', 'tba')}
            </p>
          </div>
          <div className="bg-neutral-50 rounded-lg p-3 hover:bg-primary/5 transition-colors duration-300">
            <div className={`flex items-center gap-2 text-textSecondary text-xs mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Euro className="h-3.5 w-3.5 text-primary/70" />
              <span>{t('universities', 'fee')}</span>
            </div>
            <p className={`font-medium text-primary text-sm ${isRTL ? 'text-right' : ''}`}>
              {university.admission_fee === 0 ? <span className="text-secondary">{t('universities', 'free')}</span> : `€${university.admission_fee}`}
            </p>
          </div>
        </div>

        {isSignedIn && (
          <div className="flex items-center justify-end gap-2 mb-4 border-t pt-3 border-neutral-100">
            <div className="flex items-center gap-2 text-xs text-neutral-500 mr-auto">
              <span title={`${viewCount} views`}><Eye size={14} className="inline mr-0.5" />{viewCount}</span>
              <span title={`${favoriteCount} favorites`}><Heart size={14} className="inline mr-0.5" />{favoriteCount}</span>
              <span title={`${trackedCount} tracking`}><CalendarCheck size={14} className="inline mr-0.5" />{trackedCount}</span>
            </div>
            <button
              onClick={handleToggleFavorite}
              disabled={isFavoriteLoading}
              title={isFavorite ? t('universities', 'removeFromFavorites', { defaultValue: "Remove from favorites" }) : t('universities', 'addToFavorites', { defaultValue: "Add to favorites" })}
              className={`p-2 rounded-full transition-colors ${isFavoriteLoading ? 'cursor-not-allowed' : ''} ${isFavorite ? 'bg-red-100 text-red-500 hover:bg-red-200' : 'bg-neutral-100 text-neutral-500 hover:bg-red-100 hover:text-red-500'}`}
            >
              {isFavoriteLoading ? <Loader2 size={16} className="animate-spin" /> : <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />}
            </button>
            <button
              onClick={handleToggleTrack}
              disabled={isTrackingLoading}
              title={isTracked ? t('universities', 'stopTracking', { defaultValue: "Stop tracking" }) : t('universities', 'trackDeadlines', { defaultValue: "Track deadlines" })}
              className={`p-2 rounded-full transition-colors ${isTrackingLoading ? 'cursor-not-allowed' : ''} ${isTracked ? 'bg-sky-100 text-sky-600 hover:bg-sky-200' : 'bg-neutral-100 text-neutral-500 hover:bg-sky-100 hover:text-sky-600'}`}
            >
              {isTrackingLoading ? <Loader2 size={16} className="animate-spin" /> : (isTracked ? <CalendarCheck size={16} /> : <CalendarPlus size={16} />)}
            </button>
          </div>
        )}
        {feedbackMessage && (
          <p className={`text-xs text-center my-2 ${feedbackMessage.includes(t('universities', 'login', { defaultValue: "Login" })) ? 'text-red-500' : 'text-green-600'}`}>
            {feedbackMessage}
          </p>
        )}

        <button
          onClick={handleToggleExpand}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-6 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-full transition-all duration-300 hover:shadow-soft active:scale-95"
        >
          {isExpanded ? t('universities', 'showLess') : t('universities', 'showMore')}
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-neutral-200 p-6 bg-neutral-50/70">
          {!isSignedIn ? (
            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2 text-center">
                  <h4 className="font-medium text-primary">{t('universities', 'protectedContent')}</h4>
                  <p className="text-sm text-textSecondary max-w-sm mx-auto">{t('universities', 'loginPrompt')}</p>
                </div>
                <SignInButton mode="modal">
                  <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-full transition-all duration-300 text-sm hover:shadow-soft active:scale-95">
                    {t('universities', 'login')}
                    <span className={`${isRTL ? 'rotate-180' : ''}`}>→</span>
                  </button>
                </SignInButton>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className={`flex items-center gap-2 text-primary mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <GraduationCap className="h-5 w-5" />
                  <span className="font-medium">{t('universities', 'requirements')}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-textSecondary">CGPA:</span>
                    <span className="font-medium text-primary">{university.cgpa_requirement || t('universities', 'tba')}</span>
                  </div>
                  {university.english_requirement && (
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-textSecondary">English:</span>
                      <span className="font-medium text-primary">{university.english_requirement}</span>
                    </div>
                  )}
                </div>
              </div>

              {university.intakes && university.intakes.length > 0 && (
                <div>
                  <h4 className={`font-medium text-primary mb-3 ${isRTL ? 'text-right' : ''}`}>{t('universities', 'availableIntakes')}</h4>
                  <div className="space-y-3">
                    {university.intakes.map((intake, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                        <h5 className={`font-medium text-primary mb-2 ${isRTL ? 'text-right' : ''}`}>{intake.name}</h5>
                        <div className="space-y-1 text-sm">
                          {intake.start_date && (
                            <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className="text-textSecondary">{t('universities', 'start')}:</span>
                              <span className="font-medium text-primary">{intake.start_date}</span>
                            </div>
                          )}
                          {intake.end_date && (
                            <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className="text-textSecondary">{t('universities', 'end')}:</span>
                              <span className="font-medium text-primary">{intake.end_date}</span>
                            </div>
                          )}
                          {intake.notes && <p className="mt-2 text-xs bg-primary/5 text-primary rounded p-2">{intake.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {university.application_link && (
                <a
                  href={university.application_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-full transition-all duration-300 hover:shadow-soft active:scale-95"
                >
                  {t('universities', 'apply')}
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UniversityCard;