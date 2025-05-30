// app/[lang]/admin/users/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, User, Edit, Trash2, Search, ShieldCheck, UserCheck, Loader2 } from 'lucide-react';
// You'd create a reusable DataTable component
// import DataTable from '@/components/admin/DataTable';
import { useLanguage } from '@/context/LanguageContext';
import { useParams } from 'next/navigation'; // Import useParams

interface AdminUser {
  id: string; // Clerk User ID
  clerkId: string;
  fullName?: string;
  email?: string;
  role?: string;
  premiumTier?: string;
  createdAt: string; // ISO Date string
  // Add other fields you need from UserProfileDetail + Clerk
  avatarUrl?: string;
}

// This is a placeholder. In a real app, you'd fetch from your API.
async function fetchAdminUsers(page = 1, limit = 10, searchTerm = '', roleFilter = '', tierFilter = ''): Promise<{ users: AdminUser[], total: number }> {
  console.log(`Mock fetch: page=${page}, limit=${limit}, search=${searchTerm}, role=${roleFilter}, tier=${tierFilter}`);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  // Replace with actual API call: /api/admin/users?page=...&search=...
  const mockUsers: AdminUser[] = [
    { id: 'user_1abc', clerkId: 'user_1abc', fullName: 'Mario Rossi', email: 'mario@example.com', role: 'Studente', premiumTier: 'Dante', createdAt: new Date().toISOString(), avatarUrl: `https://ui-avatars.com/api/?name=Mario+Rossi&background=random` },
    { id: 'user_2def', clerkId: 'user_2def', fullName: 'Luigi Verdi', email: 'luigi@example.com', role: 'Mentore', premiumTier: 'da Vinci', createdAt: new Date().toISOString(), avatarUrl: `https://ui-avatars.com/api/?name=Luigi+Verdi&background=random` },
    { id: 'user_3ghi', clerkId: 'user_3ghi', fullName: 'Sofia Neri', email: 'sofia@example.com', role: 'Viaggiatore', premiumTier: 'Michelangelo', createdAt: new Date().toISOString(), avatarUrl: `https://ui-avatars.com/api/?name=Sofia+Neri&background=random` },
  ];
  const filtered = mockUsers.filter(u =>
    (u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!roleFilter || u.role === roleFilter) &&
    (!tierFilter || u.premiumTier === tierFilter)
  );
  return { users: filtered.slice((page - 1) * limit, page * limit), total: filtered.length };
}

// Remove params from props definition if it's not explicitly passed by a parent Server Component
// interface AdminUsersPageProps {
//   params: { lang: string }; // This line was causing the issue due to direct access
// }
// export default function AdminUsersPage({ params }: AdminUsersPageProps) {

export default function AdminUsersPage() { // params removed from props
  const routeParams = useParams(); // Use the hook instead
  const lang = typeof routeParams?.lang === 'string' ? routeParams.lang : 'en'; // Default to 'en'

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    setIsLoading(true);
    fetchAdminUsers(currentPage, 10, searchTerm, roleFilter, tierFilter)
      .then(data => {
        setUsers(data.users);
        setTotalPages(Math.ceil(data.total / 10));
        setError(null);
      })
      .catch(err => {
        console.error("Error fetching users for admin:", err);
        setError("Failed to load users.");
      })
      .finally(() => setIsLoading(false));
  }, [currentPage, searchTerm, roleFilter, tierFilter]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);
  };
  const handleTierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTierFilter(e.target.value);
    setCurrentPage(1);
  };

  const columns = [
    {
      header: 'User', accessor: 'fullName', render: (user: AdminUser) => (
        <div className="flex items-center">
          <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.fullName || 'U'}&background=random&color=fff`} alt={user.fullName} className="w-8 h-8 rounded-full mr-2" />
          <div>
            <div className="font-medium text-textPrimary">{user.fullName || user.clerkId}</div>
            <div className="text-xs text-textSecondary">{user.email}</div>
          </div>
        </div>
      )
    },
    { header: 'Role', accessor: 'role' },
    { header: 'Tier', accessor: 'premiumTier' },
    { header: 'Joined', accessor: 'createdAt', render: (user: AdminUser) => new Date(user.createdAt).toLocaleDateString(lang) },
    {
      header: 'Actions', accessor: 'actions', render: (user: AdminUser) => (
        <div className="flex space-x-2">
          <Link href={`/${lang}/admin/users/${user.id}`} className="p-1.5 text-blue-600 hover:text-blue-800"><Edit size={16} /></Link>
          <button onClick={() => alert(`Delete ${user.id}? Implement me.`)} className="p-1.5 text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-textPrimary flex items-center">
          <Users size={30} className="mr-3 text-primary" /> {t('adminUsersPage', 'title') || 'User Management'}
        </h1>
        {/* <Link href={`/${lang}/admin/users/new`} className="btn btn-primary text-sm">Add New User</Link> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow">
        <input
          type="text"
          placeholder={t('adminUsersPage', 'searchPlaceholder') || "Search by name or email..."}
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="p-2 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary"
        />
        <select value={roleFilter} onChange={handleRoleChange} className="p-2 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary">
          <option value="">{t('adminUsersPage', 'allRoles') || "All Roles"}</option>
          <option value="Viaggiatore">{t('profileFieldLabels', 'role_viaggiatore')}</option>
          <option value="Studente">{t('profileFieldLabels', 'role_studente')}</option>
          <option value="Accademico">{t('profileFieldLabels', 'role_accademico')}</option>
          <option value="Mentore">{t('profileFieldLabels', 'role_mentore')}</option>
          <option value="Coordinatore">{t('profileFieldLabels', 'role_coordinatore')}</option>
          <option value="admin">{t('profileFieldLabels', 'role_admin')}</option>
        </select>
        <select value={tierFilter} onChange={handleTierChange} className="p-2 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary">
          <option value="">{t('adminUsersPage', 'allTiers') || "All Tiers"}</option>
          <option value="Michelangelo">{t('profileFieldLabels', 'tier_michelangelo')}</option>
          <option value="Dante">{t('profileFieldLabels', 'tier_dante')}</option>
          <option value="da Vinci">{t('profileFieldLabels', 'tier_davinci')}</option>
        </select>
      </div>

      {isLoading && <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}
      {error && <div className="text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}

      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                {columns.map(col => <th key={col.accessor} className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">{t('adminUsersPage', `column${col.header.replace(/\s+/g, '')}`, { defaultValue: col.header })}</th>)}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {users.length > 0 ? users.map(user => (
                <tr key={user.id} className="hover:bg-neutral-50/50">
                  {columns.map(col => (
                    <td key={`${user.id}-${col.accessor}`} className="px-6 py-4 whitespace-nowrap text-sm">
                      {col.render ? col.render(user) : (user as any)[col.accessor]}
                    </td>
                  ))}
                </tr>
              )) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-10 text-textSecondary">
                    {t('adminUsersPage', 'noUsersFound') || 'No users found matching your criteria.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-50">{t('common', 'previous') || "Previous"}</button>
          <span className="text-sm text-textSecondary">{t('common', 'pageIndicator', { currentPage, totalPages }) || `Page ${currentPage} of ${totalPages}`}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-50">{t('common', 'next') || "Next"}</button>
        </div>
      )}
    </div>
  );
}