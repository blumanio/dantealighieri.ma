// components/admin/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, School, BookOpen, FileText, Settings, MessageSquare, LogOut,
  Library, Newspaper, UserCheck, Briefcase, Star, ListTodo, BarChart3, Palette, Tags, Rocket
} from 'lucide-react';
import { DanteAlighieriLogo } from '@/components/SocialIcons';
import { useLanguage } from '@/context/LanguageContext';

interface NavItem {
  href: string;
  labelKey: string;
  defaultLabel: string;
  icon: React.ElementType;
  subItems?: NavItem[];
  basePath?: string; // For highlighting parent when a sub-item is active
}

interface AdminSidebarProps {
  lang: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ lang }) => {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems: NavItem[] = [
    { href: `/${lang}/admin`, labelKey: 'dashboard', defaultLabel: 'Dashboard', icon: LayoutDashboard, basePath: `/${lang}/admin` },
    { href: `/${lang}/admin/users`, labelKey: 'users', defaultLabel: 'Users', icon: Users, basePath: `/${lang}/admin/users` },
    { href: `/${lang}/admin/courses`, labelKey: 'courses', defaultLabel: 'Courses', icon: School, basePath: `/${lang}/admin/courses` },
    { href: `/${lang}/admin/universities`, labelKey: 'universities', defaultLabel: 'Universities', icon: Library, basePath: `/${lang}/admin/universities` },
    {
      href: '#', labelKey: 'content', defaultLabel: 'Content', icon: Newspaper, basePath: `/${lang}/admin/content`,
      subItems: [
        { href: `/${lang}/admin/content/blog`, labelKey: 'blogPosts', defaultLabel: 'Blog Posts', icon: BookOpen },
        { href: `/${lang}/admin/content/community`, labelKey: 'communityPosts', defaultLabel: 'Community Hubs', icon: MessageSquare },
        // Future: { href: `/${lang}/admin/content/pages`, labelKey: 'staticPages', defaultLabel: 'Static Pages', icon: FileText },
      ]
    },
    { href: `/${lang}/admin/applications`, labelKey: 'applications', defaultLabel: 'Applications', icon: FileText, basePath: `/${lang}/admin/applications` },
    {
      href: '#', labelKey: 'userActivity', defaultLabel: 'User Activity', icon: UserCheck, basePath: `/${lang}/admin/activity`,
      subItems: [
        { href: `/${lang}/admin/activity/favorites`, labelKey: 'favorites', defaultLabel: 'Favorites', icon: Star },
        { href: `/${lang}/admin/activity/tracked-items`, labelKey: 'trackedItems', defaultLabel: 'Tracked Courses', icon: ListTodo },
      ]
    },
    {
        href: '#', labelKey: 'tiersAndFeatures', defaultLabel: 'Tiers & Features', icon: Palette, basePath: `/${lang}/admin/tiers`,
        subItems: [
            { href: `/${lang}/admin/tiers/manage`, labelKey: 'manageTiers', defaultLabel: 'Manage Tiers', icon: Palette},
            { href: `/${lang}/admin/features/manage`, labelKey: 'manageFeatures', defaultLabel: 'Manage Features', icon: Tags}
        ]
    },
    { href: `/${lang}/admin/analytics`, labelKey: 'analytics', defaultLabel: 'Analytics', icon: BarChart3, basePath: `/${lang}/admin/analytics` },
    { href: `/${lang}/admin/settings`, labelKey: 'settings', defaultLabel: 'Settings', icon: Settings, basePath: `/${lang}/admin/settings` },
  ];


  const isActive = (basePath: string | undefined, exactHref: string) => {
    if (!pathname) return false;
    if (basePath) return pathname.startsWith(basePath);
    return pathname === exactHref;
  };

  return (
    <aside className="w-64 bg-neutral-800 text-neutral-100 p-4 space-y-3 flex-col hidden md:flex">
      <Link href={`/${lang}/admin`} className="flex items-center gap-2 px-2 py-1 mb-4">
        <DanteAlighieriLogo className="h-10 w-auto text-white" />
        <span className="font-semibold text-xl">Admin</span>
      </Link>
      <nav className="flex-grow space-y-1">
        {navItems.map((item) =>
          item.subItems ? (
            <div key={item.labelKey}>
              <span
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-default
                            ${isActive(item.basePath, item.href) ? 'text-white' : 'text-neutral-400'}`}
              >
                <item.icon size={18} />
                {t('adminNav', item.labelKey) || item.defaultLabel}
              </span>
              <ul className={`mt-1 space-y-px ${lang === 'ar' ? 'mr-3 border-r border-neutral-700 pr-1' : 'ml-3 border-l border-neutral-700 pl-1'}`}>
                {item.subItems.map(subItem => (
                  <li key={subItem.href}>
                    <Link
                      href={subItem.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-neutral-700 transition-colors text-sm
                                  ${pathname === subItem.href ? 'bg-neutral-700 text-white font-medium' : 'text-neutral-300 hover:text-white'}`}
                    >
                      <subItem.icon size={16} className="opacity-75" />
                      {t('adminNav', subItem.labelKey) || subItem.defaultLabel}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-neutral-700 transition-colors text-sm
                          ${isActive(item.basePath, item.href) ? 'bg-neutral-700 text-white font-medium' : 'text-neutral-300 hover:text-white'}`}
            >
              <item.icon size={18} />
              {t('adminNav', item.labelKey) || item.defaultLabel}
            </Link>
          )
        )}
      </nav>
      {/* Footer of sidebar can have user info or logout */}
    </aside>
  );
};

export default AdminSidebar;