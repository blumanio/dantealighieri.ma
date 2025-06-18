// 2. Sidebar Component: components/feed/FeedSidebar.tsx (New File)
// -----------------------------------------------------------------------------
// 'use client'; // This will be a client component if it has interactive elements

import React from 'react';
import { Tag as TagIcon, LayoutGrid, Filter } from 'lucide-react'; // Using Tag from lucide-react

// Re-using PREDEFINED_TAGS from your admin page for consistency
const PREDEFINED_TAGS = [
    'visa_application', 'housing_search', 'declaration_of_value', 'study_permit',
    'scholarships', 'university_admission', 'italian_culture', 'language_learning',
    'part_time_jobs', 'student_life', 'city_registration', 'health_insurance',
    'bank_account', 'codice_fiscale', 'travel_tips', 'local_events',
    'medicine', 'computer_science', 'engineering', 'architecture', 'law',
    'business_economics', 'humanities', 'arts_design', 'sciences', 'social_sciences'
];

interface FeedSidebarProps {
    selectedTags: string[];
    onTagToggle: (tag: string) => void;
    // Add other filter props here if needed in the future (e.g., post types)
}

const FeedSidebar: React.FC<FeedSidebarProps> = ({ selectedTags, onTagToggle }) => {
    // In a real app, you might fetch popular or all unique tags from your DB
    // const [allTags, setAllTags] = useState<string[]>(PREDEFINED_TAGS);

    return (
        <aside className="w-full md:w-72 lg:w-80 p-4 md:p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 h-fit sticky top-24">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center">
                    <Filter size={20} className="mr-2 text-indigo-600 dark:text-indigo-400" />
                    Filter by Tags
                </h3>
                <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto pr-1">
                    {PREDEFINED_TAGS.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => onTagToggle(tag)}
                            className={`
                                px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 ease-in-out
                                flex items-center gap-1.5 group
                                ${selectedTags.includes(tag)
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md hover:bg-indigo-700'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-300'
                                }
                            `}
                        >
                            <TagIcon size={14} className={`transition-colors duration-200 ${selectedTags.includes(tag) ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400'}`} />
                            {tag.replace(/_/g, ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Placeholder for other filters */}
            {/* <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center">
                    <LayoutGrid size={20} className="mr-2 text-indigo-600 dark:text-indigo-400" />
                    Post Types
                </h3>
                {/* Add post type filters here *}
            </div> */}

            {selectedTags.length > 0 && (
                 <button
                    onClick={() => selectedTags.forEach(tag => onTagToggle(tag))} // Clear all selected tags
                    className="w-full mt-4 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 border border-red-200 dark:border-red-700 rounded-lg transition-colors duration-200"
                >
                    Clear All Filters
                </button>
            )}
        </aside>
    );
};

 export default FeedSidebar; // Export if used in FeedPage