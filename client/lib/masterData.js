// lib/masterData.js

export const allSections = [
    {
        id: 'userProfileDetails',
        titleKey: 'Personal Information',
        descriptionKey: 'Complete your profile with academic background and preferences',
        completion: 85,
        statusKey: 'inProgress',
        ctaKey: 'Complete Profile',
        urgency: 'medium',
        estimatedTime: 5,
        lastUpdated: new Date(Date.now() - 7200000).toISOString(),
        category: 'academic'
    },
    {
        id: 'applicationGuide',
        titleKey: 'Application Checklist',
        descriptionKey: 'Track your progress through essential application steps',
        completion: 60,
        statusKey: 'inProgress',
        ctaKey: 'Continue',
        urgency: 'high',
        estimatedTime: 15,
        lastUpdated: new Date(Date.now() - 86400000).toISOString(),
        category: 'application'
    },
    {
        id: 'favorites',
        titleKey: 'Favorite Universities',
        descriptionKey: 'Manage your shortlisted universities and programs',
        completion: 100,
        statusKey: 'completed',
        ctaKey: 'View Favorites',
        estimatedTime: 3,
        lastUpdated: new Date(Date.now() - 2 * 86400000).toISOString(),
        category: 'academic'
    },
    {
        id: 'deadlines',
        titleKey: 'Application Deadlines',
        descriptionKey: 'Stay on top of important dates and requirements',
        completion: 25,
        statusKey: 'actionRequired',
        ctaKey: 'Set Reminders',
        urgency: 'high',
        estimatedTime: 8,
        category: 'application'
    },
    {
        id: 'scholarships',
        titleKey: 'Scholarship Opportunities',
        descriptionKey: 'Discover and apply for financial aid options',
        completion: 0,
        statusKey: 'notStarted',
        ctaKey: 'Explore Scholarships',
        estimatedTime: 12,
        category: 'financial'
    },
    {
        id: 'documents',
        titleKey: 'Document Manager',
        descriptionKey: 'Upload and organize your application documents',
        completion: 40,
        statusKey: 'inProgress',
        ctaKey: 'Upload Documents',
        urgency: 'medium',
        estimatedTime: 20,
        category: 'application'
    },
    {
        id: 'messages',
        titleKey: 'Messages',
        descriptionKey: 'Communicate with counselors and universities',
        completion: 70,
        statusKey: 'inProgress',
        ctaKey: 'View Messages',
        urgency: 'low',
        estimatedTime: 5,
        category: 'social',
    },
    {
        id: 'premium',
        titleKey: 'Premium Application Hub',
        descriptionKey: 'Access exclusive tools and dedicated support for your applications',
        completion: 0,
        statusKey: 'notStarted',
        ctaKey: 'Unlock Premium',
        urgency: 'low',
        estimatedTime: 5,
        category: 'financial',
        disabled: true, // Example of a disabled section
    }
]

export const allAchievements = [
    { id: 'firstStep', titleKey: 'First Steps', descriptionKey: 'Created your profile', unlocked: true, category: 'milestone' },
    { id: 'dreamCollector', titleKey: 'Dream Collector', descriptionKey: 'Added 5+ universities to favorites', unlocked: true, category: 'academic' },
    { id: 'consistentScholar', titleKey: 'Consistent Scholar', descriptionKey: 'Maintained login streak', unlocked: true, progress: 12, total: 30, category: 'engagement' },
    { id: 'connected', titleKey: 'Community Member', descriptionKey: 'Connected with fellow students', unlocked: false, progress: 2, total: 5, category: 'social' },
    { id: 'prepared', titleKey: 'Well Prepared', descriptionKey: 'Completed all document uploads', unlocked: false, progress: 0, total: 1, category: 'application' },
    { id: 'applicant', titleKey: 'Future Applicant', descriptionKey: 'Submitted your first application', unlocked: false, progress: 0, total: 1, category: 'application' }
]

// This is your mock checklist data, now acting as a master template
export { italyChecklistData as masterChecklist } from './italyChecklistData';