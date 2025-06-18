// components/university-hub/TabNavigation.tsx
'use client';

import React from 'react';
import { School, BookOpen, MessageSquare, Home as HomeIcon, Clock } from 'lucide-react';
import { Translation } from '@/app/i18n/types';

export type TabId = 'about' | 'courses' | 'network_discussion' | 'network_housing' | 'deadlines';

interface Tab {
  id: TabId;
  labelKey: string;
  icon: React.ElementType;
  color: string;
}

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  t: (namespace: keyof Translation, key: string, interpolations?: Record<string, string | number>) => string;
}

const tabs: Tab[] = [
  { id: 'about', labelKey: 'aboutTab', icon: School, color: 'blue' },
  { id: 'courses', labelKey: 'coursesTab', icon: BookOpen, color: 'emerald' },
  { id: 'network_discussion', labelKey: 'discussionsTab', icon: MessageSquare, color: 'purple' },
  { id: 'network_housing', labelKey: 'housingTab', icon: HomeIcon, color: 'orange' },
  { id: 'deadlines', labelKey: 'deadlinesTab', icon: Clock, color: 'red' },
];

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange, t }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Tab Headers */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 p-2">
        <div className="flex items-center justify-start overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`text-white flex-shrink-0 flex items-center gap-3 px-6 py-4 mx-1 rounded-2xl font-bold transition-all duration-300 transform whitespace-nowrap ${
                activeTab === tab.id
                  ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-lg scale-105`
                  : 'text-slate-600 hover:bg-white hover:text-slate-800 hover:shadow-md hover:scale-[1.02]'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-sm">
                {t('universityHubs', tab.labelKey, {
                  defaultValue: tab.id.charAt(0).toUpperCase() + tab.id.slice(1).replace('_', ' ')
                })}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom CSS for scrollbar */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }
        
        .scrollbar-thumb-slate-300::-webkit-scrollbar-thumb {
          background-color: rgb(203 213 225);
          border-radius: 3px;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default TabNavigation;