'use client';

import React from 'react';
import {
    MessageCircle,
    Home,
    Users as StudyGroupIcon,
    Award as ScholarshipIcon,
    Calendar as EventIcon,
    BookOpen as AcademicIcon,
    Briefcase as CareerIcon,
    FileText as VisaIcon,
    HelpCircle,
} from 'lucide-react';

// FIXED: The PostCategory type now includes all categories handled in the component logic.
type PostCategory =
    | 'discussion'
    | 'housing_seeking'
    | 'housing_offering' // Added
    | 'scholarships'
    | 'event'
    | 'other'
    | 'academic'
    | 'career'
    | 'visa_process'
    | 'study_group_looking' // Added
    | 'study_group_forming'; // Added

interface PostTypeIconProps {
    category: PostCategory;
}

const PostTypeIcon: React.FC<PostTypeIconProps> = ({ category }) => {
    const getIconConfig = () => {
        // Unified to a single neutral theme to adhere to the color palette rules.
        const baseConfig = {
            colorClass: 'text-gray-500', // Uses the standard secondary text color.
            bgClass: 'bg-gray-100', // Uses a standard neutral background color.
        };

        // This switch statement is now exhaustive and correctly handles all defined categories.
        switch (category) {
            case 'discussion':
                return { ...baseConfig, icon: MessageCircle, label: 'Discussion' };
            case 'housing_seeking':
                return { ...baseConfig, icon: Home, label: 'Seeking Housing' };
            case 'housing_offering':
                return { ...baseConfig, icon: Home, label: 'Offering Housing' };
            case 'scholarships':
                return { ...baseConfig, icon: ScholarshipIcon, label: 'Scholarships' };
            case 'event':
                return { ...baseConfig, icon: EventIcon, label: 'Event' };
            case 'academic':
                return { ...baseConfig, icon: AcademicIcon, label: 'Academic' };
            case 'career':
                return { ...baseConfig, icon: CareerIcon, label: 'Career' };
            case 'visa_process':
                return { ...baseConfig, icon: VisaIcon, label: 'Visa Process' };
            case 'study_group_looking':
            case 'study_group_forming':
                return { ...baseConfig, icon: StudyGroupIcon, label: 'Study Group' };
            case 'other':
                return { ...baseConfig, icon: HelpCircle, label: 'Other' };
            default:
                // This fallback ensures that any unhandled category will not crash the app.
                return { ...baseConfig, icon: MessageCircle, label: 'Post' };
        }
    };

    const { icon: Icon, colorClass, bgClass, label } = getIconConfig();

    return (
        <div
            className={`p-1.5 ${bgClass} rounded-lg hover:bg-gray-200 transition-colors duration-200`}
            title={label}
        >
            <Icon className={`h-4 w-4 ${colorClass}`} />
        </div>
    );
};

export default PostTypeIcon;