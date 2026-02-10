// components/university-hub/TabNavigation.tsx
'use client';

import React from 'react';
import { School, BookOpen, MessageSquare, Home as HomeIcon, Clock, FileText } from 'lucide-react';
import { Translation } from '@/app/i18n/types';

export type TabId = 'about' | 'courses' | 'deadlines' | 'entrance_exams' | 'network_discussion' | 'network_housing';

interface Tab {
  id: TabId;
  labelKey: string;
  fallbackLabel: string;
  icon: React.ElementType;
  isNew?: boolean;
}

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  t: (namespace: keyof Translation, key: string, interpolations?: Record<string, string | number>) => string;
}

// Info-first flow: About → Courses → Deadlines → Exams → Community
const tabs: Tab[] = [
  // { id: 'about', labelKey: 'aboutTab', fallbackLabel: 'About', icon: School },
  { id: 'courses', labelKey: 'coursesTab', fallbackLabel: 'Courses', icon: BookOpen },
  { id: 'deadlines', labelKey: 'deadlinesTab', fallbackLabel: 'Deadlines', icon: Clock },
  { id: 'entrance_exams', labelKey: 'entranceExamsTab', fallbackLabel: 'Entrance Exams', icon: FileText, isNew: true },
  { id: 'network_discussion', labelKey: 'discussionsTab', fallbackLabel: 'Discussions', icon: MessageSquare },
  { id: 'network_housing', labelKey: 'housingTab', fallbackLabel: 'Housing', icon: HomeIcon },
];

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange, t }) => {
  return (
    <div className="bg-white rounded-t-2xl border border-b-0 border-slate-200 overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-2 pt-2">
        <div className="flex items-center gap-1 overflow-x-auto pb-0 tab-scroll">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={[
                  'flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-t-xl text-sm font-semibold',
                  'transition-all duration-200 whitespace-nowrap border-b-2',
                  isActive
                    ? 'bg-white text-slate-900 border-slate-900 shadow-sm'
                    : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-white/60',
                ].join(' ')}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                <span>
                  {t('universityHubs', tab.labelKey) || tab.fallbackLabel}
                </span>
                {tab.isNew && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .tab-scroll::-webkit-scrollbar {
          height: 4px;
        }
        .tab-scroll::-webkit-scrollbar-thumb {
          background-color: rgb(203 213 225);
          border-radius: 2px;
        }
        .tab-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default TabNavigation;