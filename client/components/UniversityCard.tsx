// File: client/components/UniversityCard.tsx
import React, { useState, useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { useLanguage } from "@/context/LanguageContext";
import { Translation }
  from "@/app/i18n/types"; // Assuming this is your main translation type
import {
  Calendar, ChevronDown, ChevronUp, Euro, ExternalLink,
  Globe, GraduationCap, MapPin, Lock, School, Eye, Heart, CalendarPlus, CalendarCheck, Loader2
} from "lucide-react";
import { parseDeadlineDateString } from '@/lib/data'; // Ensure this function is robust

// Extended University interface
export interface University {
  id: number; // Changed from string to number to match lib/data.ts
  name: string;
  location: string;
  status?: 'Open' | 'Closed' | 'Coming Soon'; // This will be dynamically calculated
  deadline?: string; // Keep for display of the "main" deadline if any
  admission_fee: number;
  cgpa_requirement: string;
  english_requirement?: string;
  intakes?: { name: string; start_date?: string; end_date?: string; notes?: string }[];
  application_link?: string;
  // New fields for interactions
  viewCount?: number;
  favoriteCount?: number;
  trackedCount?: number;
  isFavoriteInitial?: boolean;
  isTrackedInitial?: boolean;
  apiFavoriteId?: string | null;
  apiTrackedId?: string | null;
}

interface UniversityCardProps {
  university: University;
  isSignedIn: boolean;
  isExpanded: boolean;
  onToggle: (universityId: number) => void; // Pass universityId for view tracking
  t: (namespaceKey: keyof Translation, MKey: string, options?: any) => string;
  // Callbacks for parent component to update its state if necessary
  onFavoriteToggle?: (universityId: number, isFavorite: boolean, newFavoriteId: string | null) => void;
  onTrackToggle?: (universityId: number, isTracked: boolean, newTrackedId: string | null) => void;
}

const UniversityCard = ({
  university,
  isSignedIn,
  isExpanded,
  onToggle,
  t,
  onFavoriteToggle,
  onTrackToggle
}: UniversityCardProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const [currentStatus, setCurrentStatus] = useState<'Open' | 'Closed' | 'Coming Soon' | 'TBA'>(university.status || 'TBA');
  const [viewCount, setViewCount] = useState(university.viewCount || 0);
  const [isFavorite, setIsFavorite] = useState(university.isFavoriteInitial || false);
  const [apiFavoriteId, setApiFavoriteId] = useState(university.apiFavoriteId || null);
  const [favoriteCount, setFavoriteCount] = useState(university.favoriteCount || 0);
  const [isTracked, setIsTracked] = useState(university.isTrackedInitial || false);
  const [apiTrackedId, setApiTrackedId] = useState(university.apiTrackedId || null);
  const [trackedCount, setTrackedCount] = useState(university.trackedCount || 0);

  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);


  useEffect(() => {
    const calculateStatus = () => {
      if (!university.intakes || university.intakes.length === 0) {
        setCurrentStatus('TBA'); // Or 'Closed' if no intakes means it's not open
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to start of day for fair comparison

      let isOpen = false;
      let hasFutureIntakes = false;
      let earliestFutureStartDate: Date | null = null;

      for (const intake of university.intakes) {
        const startDate = intake.start_date ? parseDeadlineDateString(intake.start_date, today.getFullYear()) : null;
        const endDate = intake.end_date ? parseDeadlineDateString(intake.end_date, today.getFullYear()) : null;

        if (startDate && endDate) {
          if (today >= startDate && today <= endDate) {
            isOpen = true;
            break; // Found an open intake
          }
          if (startDate > today) {
            hasFutureIntakes = true;
            if (!earliestFutureStartDate || startDate < earliestFutureStartDate) {
              earliestFutureStartDate = startDate;
            }
          }
        } else if (startDate && !endDate) { // If only start date, assume open from start onwards until explicitly closed
          if (today >= startDate) {
            // This could be considered open if no end date implies rolling or long duration
            // For simplicity, let's assume an end date is needed for "Open"
            // Or, treat as "Coming Soon" if start is future, "TBA" otherwise without end.
            if (startDate > today) {
              hasFutureIntakes = true;
              if (!earliestFutureStartDate || startDate < earliestFutureStartDate) {
                earliestFutureStartDate = startDate;
              }
            }
          }
        }
      }

      if (isOpen) {
        setCurrentStatus('Open');
      } else if (hasFutureIntakes) {
        setCurrentStatus('Coming Soon');
      } else {
        setCurrentStatus('Closed');
      }
    };

    calculateStatus();
  }, [university.intakes]);

  const handleToggleExpand = () => {
    if (!isExpanded) { // View counted when expanding
      setViewCount(prev => prev + 1);
      // Placeholder for API call to update view count
      // console.log(`University ${university.id} view incremented. New count: ${viewCount + 1}`);
      // try { await fetch(`/api/universities/${university.id}/view`, { method: 'POST' }); } catch (e) { console.error(e); }
    }
    onToggle(university.id);
  };

  const handleToggleFavorite = async () => {
    if (!isSignedIn) {
      // Consider showing a login prompt
      setFeedbackMessage(t('universities', 'loginPromptShort', { defaultValue: "Login to favorite" }));
      setTimeout(() => setFeedbackMessage(null), 3000);
      return;
    }
    setIsFavoriteLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    if (isFavorite) {
      setIsFavorite(false);
      setFavoriteCount(prev => Math.max(0, prev - 1));
      // console.log(`Removed university ${university.id} from favorites. Favorite ID: ${apiFavoriteId}`);
      // try { await fetch(`/api/favorites/university?id=${apiFavoriteId}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
      if (onFavoriteToggle) onFavoriteToggle(university.id, false, null);
      setApiFavoriteId(null);
    } else {
      setIsFavorite(true);
      setFavoriteCount(prev => prev + 1);
      const newMockId = `fav-${university.id}-${Date.now()}`;
      setApiFavoriteId(newMockId);
      // console.log(`Added university ${university.id} to favorites. New Favorite ID: ${newMockId}`);
      // try { const res = await fetch(`/api/favorites/university`, { method: 'POST', body: JSON.stringify({ universityId: university.id }) }); /* handle response */ } catch (e) { console.error(e); }
      if (onFavoriteToggle) onFavoriteToggle(university.id, true, newMockId);
    }
    setIsFavoriteLoading(false);
  };

  const handleToggleTrack = async () => {
    if (!isSignedIn) {
      setFeedbackMessage(t('universities', 'loginPromptShort', { defaultValue: "Login to track" }));
      setTimeout(() => setFeedbackMessage(null), 3000);
      return;
    }
    setIsTrackingLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    if (isTracked) {
      setIsTracked(false);
      setTrackedCount(prev => Math.max(0, prev - 1));
      // console.log(`Stopped tracking university ${university.id}. Tracked ID: ${apiTrackedId}`);
      // try { await fetch(`/api/tracked-items/university?id=${apiTrackedId}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
      if (onTrackToggle) onTrackToggle(university.id, false, null);
      setApiTrackedId(null);
    } else {
      setIsTracked(true);
      setTrackedCount(prev => prev + 1);
      const newMockId = `track-${university.id}-${Date.now()}`;
      setApiTrackedId(newMockId);
      // console.log(`Started tracking university ${university.id}. New Tracked ID: ${newMockId}`);
      // try { const res = await fetch(`/api/tracked-items/university`, { method: 'POST', body: JSON.stringify({ universityId: university.id }) }); /* handle response */ } catch (e) { console.error(e); }
      if (onTrackToggle) onTrackToggle(university.id, true, newMockId);
    }
    setIsTrackingLoading(false);
  };

  const statusText = t('universities', currentStatus.toLowerCase().replace(/\s+/g, '') as keyof Translation['universities'], {
    defaultValue: currentStatus
  });
  let statusColorClass = 'bg-secondary/10 text-secondary';
  if (currentStatus === 'Open') statusColorClass = 'bg-primary/10 text-primary';
  else if (currentStatus === 'Coming Soon') statusColorClass = 'bg-yellow-400/10 text-yellow-500';


  if (!isSignedIn && !isExpanded) { // Compact view for non-signed-in users when card is not expanded
    return (
      <div className="bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300">
        <div className="p-6">
          <div className={`flex justify-between items-start gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h3 className="text-xl font-semibold text-primary mb-1">
                {university.name}
              </h3>
              <div className={`flex items-center gap-2 text-sm text-textSecondary ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MapPin className="h-4 w-4 text-primary/70" />
                <span>{university.location}</span>
              </div>
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
            <h3 className="text-xl font-semibold text-primary group-hover:text-primary-dark transition-colors duration-300 mb-2">
              {university.name}
            </h3>
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
        {/* Interaction Buttons - Only show if signed in */}
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
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              className={`p-2 rounded-full transition-colors ${isFavoriteLoading ? 'cursor-not-allowed' : ''} ${isFavorite ? 'bg-red-100 text-red-500 hover:bg-red-200' : 'bg-neutral-100 text-neutral-500 hover:bg-red-100 hover:text-red-500'}`}
            >
              {isFavoriteLoading ? <Loader2 size={16} className="animate-spin" /> : <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />}
            </button>
            <button
              onClick={handleToggleTrack}
              disabled={isTrackingLoading}
              title={isTracked ? "Stop tracking" : "Track deadlines"}
              className={`p-2 rounded-full transition-colors ${isTrackingLoading ? 'cursor-not-allowed' : ''} ${isTracked ? 'bg-sky-100 text-sky-600 hover:bg-sky-200' : 'bg-neutral-100 text-neutral-500 hover:bg-sky-100 hover:text-sky-600'}`}
            >
              {isTrackingLoading ? <Loader2 size={16} className="animate-spin" /> : (isTracked ? <CalendarCheck size={16} /> : <CalendarPlus size={16} />)}
            </button>
          </div>
        )}
        {feedbackMessage && (
          <p className={`text-xs text-center my-2 ${feedbackMessage.includes('Login') ? 'text-red-500' : 'text-green-600'}`}>
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
                    <span className="font-medium text-primary">{university.cgpa_requirement}</span>
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