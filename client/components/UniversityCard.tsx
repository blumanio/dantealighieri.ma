// File: client/components/UniversityCard.tsx
import React, { useState, useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { useLanguage } from "@/context/LanguageContext";
import { Translation } from "@/app/i18n/types";
import Link from 'next/link';
import {
  Calendar, ChevronDown, ChevronUp, Euro, ExternalLink,
  Globe, GraduationCap, MapPin, Lock, School, Eye, Heart, CalendarPlus, CalendarCheck, Loader2,
  Link as LinkIcon, Sparkles, Award, Users, TrendingUp, Clock, Target
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
  const [isHovered, setIsHovered] = useState(false);

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
          // Assuming open if only start date and it has passed
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
        }
      } catch (e) {
        console.error("Failed to record view:", e);
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

  const getStatusStyles = () => {
    switch (currentStatus) {
      case 'Open':
        return 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-200 shadow-emerald-100';
      case 'Coming Soon':
        return 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border border-amber-200 shadow-amber-100';
      case 'Closed':
        return 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200 shadow-red-100';
      default:
        return 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 border border-slate-200 shadow-slate-100';
    }
  };

  const cardClasses = `
    group relative bg-white rounded-2xl border border-slate-200/60 
    transition-all duration-500 ease-out
    hover:border-slate-300/80 hover:shadow-2xl hover:shadow-slate-200/40
    hover:-translate-y-1 
    ${isHovered ? 'scale-[1.02]' : 'scale-100'}
    overflow-hidden
    backdrop-blur-sm
  `;

  if (!isSignedIn && !isExpanded) {
    return (
      <div 
        className={cardClasses}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Premium accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative p-6">
          <div className={`flex justify-between items-start gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Link href={`/${language}/university-hubs/${encodeURIComponent(university.name)}`} className="block group/link">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 group-hover/link:border-blue-200 transition-colors">
                    <School className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover/link:text-blue-600 transition-colors duration-300">
                    {university.name}
                  </h3>
                </div>
                <div className={`flex items-center gap-2 text-slate-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span className="font-medium">{university.location}</span>
                </div>
              </Link>
            </div>
            <div className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap shadow-sm ${getStatusStyles()}`}>
              {statusText}
            </div>
          </div>

          {/* Enhanced metrics with premium styling */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
              <div className="flex items-center justify-center mb-1">
                <Eye className="h-4 w-4 text-slate-500" />
              </div>
              <div className="text-lg font-bold text-slate-900">{viewCount}</div>
              <div className="text-xs text-slate-500 font-medium">Views</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200">
              <div className="flex items-center justify-center mb-1">
                <Heart className="h-4 w-4 text-rose-500" />
              </div>
              <div className="text-lg font-bold text-rose-700">{favoriteCount}</div>
              <div className="text-xs text-rose-600 font-medium">Favorites</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="flex items-center justify-center mb-1">
                <CalendarCheck className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-lg font-bold text-blue-700">{trackedCount}</div>
              <div className="text-xs text-blue-600 font-medium">Tracking</div>
            </div>
          </div>

          <button
            onClick={handleToggleExpand}
            className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
            <div className="relative flex items-center justify-center gap-3">
              <Sparkles className="h-5 w-5" />
              {t('universities', 'showMore')}
              <ChevronDown className="h-5 w-5 group-hover/btn:translate-y-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cardClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Premium accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6">
        {/* Header Section */}
        <div className={`flex justify-between items-start gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <Link href={`/${language}/university-hubs/${encodeURIComponent(university.name)}`} className="block group/link">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 group-hover/link:border-blue-200 transition-all duration-300 group-hover/link:shadow-lg">
                  <School className="h-6 w-6 text-blue-600" />
                  <div className="absolute -top-1 -right-1">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 group-hover/link:text-blue-600 transition-colors duration-300 mb-1">
                    {university.name}
                  </h3>
                  <div className={`flex items-center gap-2 text-slate-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="font-semibold">{university.location}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap shadow-lg ${getStatusStyles()}`}>
            {statusText}
          </div>
        </div>

        {/* Premium Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200 hover:border-slate-300 transition-all duration-300 group/card">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-3xl" />
            <div className={`flex items-center gap-3 text-slate-600 text-sm mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="font-semibold">{t('universities', 'deadline')}</span>
            </div>
            <p className={`font-bold text-slate-900 text-lg ${isRTL ? 'text-right' : ''}`}>
              {university.deadline || t('universities', 'tba')}
            </p>
          </div>
          
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 border border-emerald-200 hover:border-emerald-300 transition-all duration-300 group/card">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-bl-3xl" />
            <div className={`flex items-center gap-3 text-emerald-700 text-sm mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Euro className="h-4 w-4 text-emerald-600" />
              <span className="font-semibold">{t('universities', 'fee')}</span>
            </div>
            <p className={`font-bold text-emerald-800 text-lg ${isRTL ? 'text-right' : ''}`}>
              {university.admission_fee === 0 ? (
                <span className="text-emerald-600 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  {t('universities', 'free')}
                </span>
              ) : (
                `€${university.admission_fee}`
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons for Signed-in Users */}
        {isSignedIn && (
          <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-100">
                  <Eye className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <span className="font-semibold">{viewCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-100">
                  <Heart className="h-3.5 w-3.5 text-rose-600" />
                </div>
                <span className="font-semibold">{favoriteCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100">
                  <CalendarCheck className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <span className="font-semibold">{trackedCount}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleFavorite}
                disabled={isFavoriteLoading}
                className={`relative p-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                  isFavorite 
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-200' 
                    : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-rose-300 hover:bg-rose-50'
                }`}
              >
                {isFavoriteLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
                )}
              </button>
              
              <button
                onClick={handleToggleTrack}
                disabled={isTrackingLoading}
                className={`relative p-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                  isTracked 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-200' 
                    : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {isTrackingLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isTracked ? (
                  <CalendarCheck className="h-5 w-5" />
                ) : (
                  <CalendarPlus className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Feedback Message */}
        {feedbackMessage && (
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-center">
            <p className="text-sm font-semibold text-amber-800">{feedbackMessage}</p>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <button
          onClick={handleToggleExpand}
          className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
          <div className="relative flex items-center justify-center gap-3">
            <Target className="h-5 w-5" />
            {isExpanded ? t('universities', 'showLess') : t('universities', 'showMore')}
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 group-hover/btn:-translate-y-0.5 transition-transform" />
            ) : (
              <ChevronDown className="h-5 w-5 group-hover/btn:translate-y-0.5 transition-transform" />
            )}
          </div>
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-200 bg-gradient-to-br from-slate-50 to-white">
          {!isSignedIn ? (
            <div className="p-8">
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 border border-blue-200">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-tr-full" />
                
                <div className="relative flex flex-col items-center gap-6 text-center">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-xl">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {t('universities', 'protectedContent')}
                    </h4>
                    <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                      {t('universities', 'loginPrompt')}
                    </p>
                  </div>
                  <SignInButton mode="modal">
                    <button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <div className="relative flex items-center gap-3">
                        <Sparkles className="h-5 w-5" />
                        {t('universities', 'login')}
                        <span className={`text-xl ${isRTL ? 'rotate-180' : ''}`}>→</span>
                      </div>
                    </button>
                  </SignInButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 space-y-8">
              {/* Requirements Section */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                <div className={`flex items-center gap-3 text-blue-600 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="p-2 rounded-xl bg-blue-100">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <span className="text-xl font-bold">{t('universities', 'requirements')}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-700">CGPA</span>
                    </div>
                    <span className="text-lg font-bold text-emerald-800">
                      {university.cgpa_requirement || t('universities', 'tba')}
                    </span>
                  </div>
                  {university.english_requirement && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-700">English</span>
                      </div>
                      <span className="text-lg font-bold text-blue-800">{university.english_requirement}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Intakes Section */}
              {university.intakes && university.intakes.length > 0 && (
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                  <div className={`flex items-center gap-3 text-indigo-600 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="p-2 rounded-xl bg-indigo-100">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <span className="text-xl font-bold">{t('universities', 'availableIntakes')}</span>
                  </div>
                  <div className="grid gap-4">
                    {university.intakes.map((intake, index) => (
                      <div key={index} className="relative overflow-hidden bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-5 border border-slate-200 hover:border-slate-300 transition-all duration-300 group/intake">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-400/10 to-transparent rounded-bl-2xl" />
                        <div className="relative">
                          <h5 className={`text-lg font-bold text-slate-900 mb-4 ${isRTL ? 'text-right' : ''}`}>
                            {intake.name}
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {intake.start_date && (
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-100">
                                  <Clock className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div>
                                  <div className="text-xs text-slate-500 font-semibold">{t('universities', 'start')}</div>
                                  <div className="font-bold text-slate-900">{intake.start_date}</div>
                                </div>
                              </div>
                            )}
                            {intake.end_date && (
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-red-100">
                                  <Target className="h-4 w-4 text-red-600" />
                                </div>
                                <div>
                                  <div className="text-xs text-slate-500 font-semibold">{t('universities', 'end')}</div>
                                  <div className="font-bold text-slate-900">{intake.end_date}</div>
                                </div>
                              </div>
                            )}
                          </div>
                          {intake.notes && (
                            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                              <p className="text-sm text-blue-800 font-medium">{intake.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Application Link */}
              {university.application_link && (
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                  <a
                    href={university.application_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl flex items-center justify-center gap-4 w-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <div className="relative flex items-center gap-4">
                      <div className="p-2 bg-white/20 rounded-xl">
                        <ExternalLink className="h-6 w-6" />
                      </div>
                      <span className="text-xl">{t('universities', 'apply')}</span>
                      <TrendingUp className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </a>
                </div>
              )}

              {/* Additional Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {university.websiteUrl && (
                  <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200 hover:border-slate-300 transition-all duration-300 group/website">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-xl bg-blue-100 group-hover/website:bg-blue-200 transition-colors">
                        <Globe className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="font-bold text-slate-900">Official Website</span>
                    </div>
                    <a
                      href={university.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-2 group/link"
                    >
                      Visit Website
                      <ExternalLink className="h-4 w-4 group-hover/link:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                )}
                
                {university.contacts?.email && (
                  <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200 hover:border-slate-300 transition-all duration-300 group/contact">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-xl bg-emerald-100 group-hover/contact:bg-emerald-200 transition-colors">
                        <LinkIcon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <span className="font-bold text-slate-900">Contact</span>
                    </div>
                    <a
                      href={`mailto:${university.contacts.email}`}
                      className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
                    >
                      {university.contacts.email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UniversityCard;