// =============================================================================
// ANALYTICS — Typed event system for GA4
// Covers: goals, discovery, engagement, gamification, funnels
// =============================================================================

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// ─── Event type definitions ───────────────────────────────────────────────────

export type GoalEvent =
  | 'goal_onboarding_complete'
  | 'goal_profile_complete'
  | 'goal_university_shortlisted'
  | 'goal_course_tracked'
  | 'goal_application_status_changed'
  | 'goal_document_uploaded'
  | 'goal_premium_upgrade';

export type DiscoveryEvent =
  | 'search_performed'
  | 'filter_applied'
  | 'course_viewed'
  | 'university_viewed'
  | 'course_favorited'
  | 'university_favorited'
  | 'scholarship_viewed'
  | 'city_explored';

export type FunnelEvent =
  | 'funnel_search_started'
  | 'funnel_course_detail_viewed'
  | 'funnel_course_saved'
  | 'funnel_university_shortlisted'
  | 'funnel_application_started'
  | 'funnel_application_submitted'
  | 'onboarding_step_viewed'
  | 'onboarding_step_completed'
  | 'onboarding_abandoned';

export type EngagementEvent =
  | 'dashboard_tab_changed'
  | 'post_liked'
  | 'post_bookmarked'
  | 'post_created'
  | 'comment_created'
  | 'cta_clicked'
  | 'lead_magnet_clicked'
  | 'whatsapp_clicked'
  | 'calendly_opened'
  | 'pricing_plan_viewed'
  | 'upgrade_cta_clicked'
  | 'page_section_visible';

export type GamificationEvent =
  | 'xp_gained'
  | 'level_up'
  | 'streak_updated'
  | 'feature_unlocked'
  | 'achievement_unlocked';

export type AnalyticsEvent =
  | GoalEvent
  | DiscoveryEvent
  | FunnelEvent
  | EngagementEvent
  | GamificationEvent;

// ─── User properties (set once per session) ──────────────────────────────────

export interface UserAnalyticsProperties {
  user_tier: 'Viaggiatore' | 'Esploratore' | 'Maestro';
  user_level: number;
  user_xp: number;
  user_country?: string;
  language: string;
  onboarding_complete: boolean;
}

// ─── Core send function ───────────────────────────────────────────────────────

function send(event: AnalyticsEvent, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', event, params);
}

// ─── User properties ─────────────────────────────────────────────────────────

export function setUserProperties(props: Partial<UserAnalyticsProperties>) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('set', 'user_properties', props);
}

export function identifyUser(clerkId: string) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('config', 'G-845LV1ZMN9', { user_id: clerkId });
}

// ─── Goal events ─────────────────────────────────────────────────────────────

export const goals = {
  onboardingComplete(params?: { country?: string; language?: string }) {
    send('goal_onboarding_complete', params);
  },

  profileComplete() {
    send('goal_profile_complete');
  },

  universityShortlisted(params: { university_name: string; university_id: string }) {
    send('goal_university_shortlisted', params);
  },

  courseTracked(params: { course_name: string; course_id: string; university: string; status: string }) {
    send('goal_course_tracked', params);
  },

  applicationStatusChanged(params: {
    course_id: string;
    course_name: string;
    old_status: string;
    new_status: string;
  }) {
    send('goal_application_status_changed', params);
  },

  documentUploaded(params: { document_type?: string }) {
    send('goal_document_uploaded', params);
  },

  premiumUpgrade(params: { plan: string; trigger_location?: string }) {
    send('goal_premium_upgrade', params);
  },
};

// ─── Discovery events ─────────────────────────────────────────────────────────

export const discovery = {
  searchPerformed(params: {
    search_term: string;
    results_count: number;
    degree_type?: string;
    academic_area?: string;
    course_language?: string;
    access_type?: string;
  }) {
    send('search_performed', params);
  },

  filterApplied(params: { filter_name: string; filter_value: string; results_count?: number }) {
    send('filter_applied', params);
  },

  courseViewed(params: { course_id: string; course_name: string; university: string; area?: string }) {
    send('course_viewed', params);
  },

  universityViewed(params: { university_id: string; university_name: string }) {
    send('university_viewed', params);
  },

  courseFavorited(params: { course_id: string; course_name: string; university: string }) {
    send('course_favorited', params);
  },

  universityFavorited(params: { university_id: string; university_name: string }) {
    send('university_favorited', params);
  },

  scholarshipViewed(params: { scholarship_name?: string; page_path: string }) {
    send('scholarship_viewed', params);
  },

  cityExplored(params: { city_name: string }) {
    send('city_explored', params);
  },
};

// ─── Funnel events ────────────────────────────────────────────────────────────

export const funnel = {
  searchStarted() {
    send('funnel_search_started');
  },

  courseDetailViewed(params: { course_id: string; course_name: string; university: string }) {
    send('funnel_course_detail_viewed', params);
  },

  courseSaved(params: { course_id: string; course_name: string }) {
    send('funnel_course_saved', params);
  },

  universityShortlisted(params: { university_id: string; university_name: string }) {
    send('funnel_university_shortlisted', params);
  },

  applicationStarted(params: { course_id: string; course_name: string }) {
    send('funnel_application_started', params);
  },

  applicationSubmitted(params: { course_id: string; course_name: string }) {
    send('funnel_application_submitted', params);
  },

  onboardingStepViewed(step: number, step_name: string) {
    send('onboarding_step_viewed', { step, step_name });
  },

  onboardingStepCompleted(step: number, step_name: string) {
    send('onboarding_step_completed', { step, step_name });
  },

  onboardingAbandoned(step: number) {
    send('onboarding_abandoned', { last_step: step });
  },
};

// ─── Engagement events ────────────────────────────────────────────────────────

export const engagement = {
  dashboardTabChanged(params: { from_tab: string; to_tab: string }) {
    send('dashboard_tab_changed', params);
  },

  postLiked(params: { post_id: string; community?: string }) {
    send('post_liked', params);
  },

  postBookmarked(params: { post_id: string; community?: string }) {
    send('post_bookmarked', params);
  },

  postCreated(params: { community?: string; category?: string }) {
    send('post_created', params);
  },

  commentCreated(params: { post_id: string }) {
    send('comment_created', params);
  },

  ctaClicked(params: { cta_label: string; location: string; value?: number }) {
    send('cta_clicked', params);
  },

  leadMagnetClicked(params: { guide_name: string; location: string }) {
    send('lead_magnet_clicked', params);
  },

  whatsappClicked(params?: { location?: string }) {
    send('whatsapp_clicked', params);
  },

  calendlyOpened(params?: { location?: string }) {
    send('calendly_opened', params);
  },

  pricingPlanViewed(params: { plan: string }) {
    send('pricing_plan_viewed', params);
  },

  upgradeCTAClicked(params: { location: string; current_tier: string }) {
    send('upgrade_cta_clicked', params);
  },

  pageSectionVisible(params: { section_name: string; page_path: string }) {
    send('page_section_visible', params);
  },
};

// ─── Gamification events ──────────────────────────────────────────────────────

export const gamification = {
  xpGained(params: { action: string; xp_gained: number; new_xp_total: number }) {
    send('xp_gained', params);
  },

  levelUp(params: { old_level: number; new_level: number; xp: number }) {
    send('level_up', params);
  },

  streakUpdated(params: { streak_count: number }) {
    send('streak_updated', params);
  },

  featureUnlocked(params: { feature_name: string; xp_at_unlock: number }) {
    send('feature_unlocked', params);
  },

  achievementUnlocked(params: { achievement_id: string; achievement_name: string }) {
    send('achievement_unlocked', params);
  },
};

// ─── Legacy compat ────────────────────────────────────────────────────────────

/** @deprecated Use typed namespaces (goals, discovery, engagement, etc.) */
export const trackCustomEvent = (eventName: string, eventParams: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  }
};
