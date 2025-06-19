// components/profile/ChecklistItemUI.tsx
'use client';

import React from 'react';
import { CheckCircle, Circle, ExternalLink } from 'lucide-react';
// If ChecklistItem is a default export:
// import type ChecklistItem from '@/app/[lang]/profile/[[...userProfile]]/page';

// If ChecklistItem is a named export, ensure it is exported as such in the target file:
import type { ChecklistItem } from '@/types/checklist'; // Adjust path if types moved

interface ChecklistItemUIProps {
    item: any;
    phaseId: string;
    onToggleItem: (phaseId: string, itemId: string, subItemId?: string) => void;
    t: (namespace: string, key: string) => string;
    language: string;
    isFirstIncomplete?: boolean;
}
const ChecklistItemUI: React.FC<ChecklistItemUIProps> = ({ item, phaseId, onToggleItem, t, language, isFirstIncomplete }) => {
    const ItemIcon = item.icon || Circle;

    const handleToggle = () => {
        // This function is called for the main item itself
        // The onToggleItem prop passed from parent for subitems is already curried
        onToggleItem(phaseId, item.id);
    };

    const handleSubItemToggle = (subItemId: string) => {
        onToggleItem(phaseId, item.id, subItemId);
    };

    return (
        <div className={`pl-2 ${item.isCompleted ? 'opacity-70' : ''}`}>
            <div className="flex items-start gap-3 group">
                <button
                    onClick={handleToggle}
                    className="mt-1 flex-shrink-0"
                    title={item.isCompleted ? t('profile', 'applicationGuideMarkAsIncomplete') : t('profile', 'applicationGuideMarkAsComplete')}
                    aria-label={item.isCompleted ? t('profile', 'applicationGuideMarkAsIncomplete') : t('profile', 'applicationGuideMarkAsComplete')}
                >
                    {item.isCompleted ? <CheckCircle size={20} className="text-green-500" /> : <Circle size={20} className="text-neutral-400 group-hover:text-primary" />}
                </button>
                <div className="flex-grow">
                    <span // Changed label to span for non-interactive text, click handled by button/div
                        className={`font-medium text-neutral-700 group-hover:text-primary cursor-pointer ${item.isCompleted ? 'line-through text-neutral-500 group-hover:text-neutral-500' : ''}`}
                        onClick={handleToggle} // Allow clicking text to toggle
                    >
                        {item.icon && <item.icon size={16} className={`inline ${language === 'ar' ? 'ml-2' : 'mr-2'} mb-0.5 ${item.isCompleted ? 'text-neutral-400' : 'text-primary/70'}`} />}
                        {t('profile', item.labelKey)}
                    </span>
                    {item.descriptionKey && <p className="text-xs text-neutral-500 mt-0.5">{t('profile', item.descriptionKey)}</p>}
                    {item.link && (
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5"
                        >
                            {t('profile', 'applicationGuideLearnMore')} <ExternalLink size={12} />
                        </a>
                    )}
                </div>
            </div>
            {item.subItems && item.subItems.length > 0 && (
                item.subItems.map((subItem: ChecklistItem) => (
                    <ChecklistItemUI
                        key={subItem.id}
                        item={subItem}
                        phaseId={phaseId}
                        onToggleItem={onToggleItem}
                        t={t}
                        language={language}
                    />
                ))
            )}
        </div>
    );
};

export default ChecklistItemUI;