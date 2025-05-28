// app/[lang]/admin/page.tsx
'use client';

import React from 'react';
import StatCard from '@/components/admin/StatCard'; // Will create this
import { Users, School, Newspaper, FileText, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminDashboardPage() {
  const { t } = useLanguage();

  // Mock data - replace with actual data fetching from your API
  const stats = [
    { titleKey: 'totalUsers', defaultTitle: 'Total Users', value: '1,234', icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { titleKey: 'totalCourses', defaultTitle: 'Total Courses', value: '567', icon: School, color: 'text-green-500', bgColor: 'bg-green-50' },
    { titleKey: 'blogPosts', defaultTitle: 'Blog Posts', value: '89', icon: Newspaper, color: 'text-purple-500', bgColor: 'bg-purple-50' },
    { titleKey: 'pendingApplications', defaultTitle: 'Pending Applications', value: '12', icon: FileText, color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-textPrimary">
        {t('adminDashboard', 'title') || 'Admin Dashboard Overview'}
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.titleKey}
            title={t('adminDashboard', stat.titleKey) || stat.defaultTitle}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      {/* Recent Activity & Quick Actions (Placeholders) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-textPrimary mb-4">
            {t('adminDashboard', 'recentActivity') || 'Recent Activity'}
          </h2>
          <ul className="space-y-3 text-sm text-textSecondary">
            <li>User 'John Doe' signed up.</li>
            <li>New blog post 'Study in Florence' published.</li>
            <li>Application #789 received for 'Politecnico di Milano'.</li>
            {/* Replace with actual activity feed */}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-textPrimary mb-4">
            {t('adminDashboard', 'quickActions') || 'Quick Actions'}
          </h2>
          <div className="space-y-3">
            <button className="btn btn-secondary w-full text-sm">{t('adminDashboard', 'createNewCourse') || 'Create New Course'}</button>
            <button className="btn btn-secondary w-full text-sm">{t('adminDashboard', 'viewPendingApps') || 'View Pending Applications'}</button>
            <button className="btn btn-secondary w-full text-sm">{t('adminDashboard', 'moderateContent') || 'Moderate Community Content'}</button>
          </div>
        </div>
      </div>
       {/* Placeholder for more charts or data */}
       <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-textPrimary mb-4 flex items-center">
                <BarChart3 size={24} className="mr-2 text-primary" />
                {t('adminDashboard', 'siteAnalyticsPlaceholder') || 'Site Analytics Overview'}
            </h2>
            <div className="h-64 bg-neutral-100 rounded-md flex items-center justify-center text-textSecondary">
                {t('adminDashboard', 'analyticsChartComingSoon') || 'Analytics charts coming soon...'}
            </div>
        </div>
    </div>
  );
}