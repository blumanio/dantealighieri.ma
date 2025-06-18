import { TrendingUp, Clock, Star, MessageCircle, LucideIcon } from 'lucide-react';

export const TAG_CATEGORIES = {
    'Legal & Administrative': {
        icon: '📋',
        tags: ['visa_application', 'declaration_of_value', 'study_permit', 'city_registration', 'codice_fiscale', 'health_insurance', 'bank_account']
    },
    'Housing & Life': {
        icon: '🏠',
        tags: ['housing_search', 'student_life', 'local_events', 'travel_tips', 'italian_culture']
    },
    'Academic & Career': {
        icon: '🎓',
        tags: ['scholarships', 'university_admission', 'part_time_jobs', 'language_learning']
    },
    'Study Fields': {
        icon: '📚',
        tags: ['medicine', 'computer_science', 'engineering', 'architecture', 'law', 'business_economics', 'humanities', 'arts_design', 'sciences', 'social_sciences']
    }
};

export const QUICK_FILTERS: { label: string; icon: LucideIcon; color: string }[] = [
    { label: 'Trending', icon: TrendingUp, color: 'text-red-500' },
    { label: 'Recent', icon: Clock, color: 'text-blue-500' },
    { label: 'Popular', icon: Star, color: 'text-yellow-500' },
    { label: 'Unanswered', icon: MessageCircle, color: 'text-green-500' },
];

export const TRENDING_TOPICS = [
    { name: 'Visa Updates 2025', posts: 248, trend: '+12%' },
    { name: 'Housing in Milan', posts: 156, trend: '+8%' },
    { name: 'Scholarship Deadlines', posts: 89, trend: '+23%' },
    { name: 'Italian Language Tips', posts: 134, trend: '+5%' }
];