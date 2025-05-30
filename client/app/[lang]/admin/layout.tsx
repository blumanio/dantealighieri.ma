// app/[lang]/admin/layout.tsx
'use client';

import React, { useEffect, useState, use } from 'react'; // Import 'use'
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation'; // Import useParams
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  // params prop is automatically provided by Next.js to layout components
  // It's better to use useParams() hook inside the client component for route params
}

// Mock role check function - REPLACE WITH ACTUAL API CALL AND LOGIC
async function checkAdminRole(userId: string | undefined): Promise<boolean> {
  if (!userId) return false;
  console.warn("DEVELOPMENT: Using mock admin role check for AdminLayout. Implement actual DB role verification!");
  return true; // Placeholder for development
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // Use the useParams hook to get route parameters
  const routeParams = useParams();
  const lang = typeof routeParams?.lang === 'string' ? routeParams.lang : 'en'; // Default to 'en' if not found or array

  const { isSignedIn, isLoaded, user } = useUser();
  const { signOut } = useAuth();
  const _user : any = user
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace(`/${lang}/sign-in?redirect_url=/${lang}/admin`);
    } else if (isLoaded && isSignedIn && user) {
      checkAdminRole(user.id).then(hasAdminRole => {
        if (!hasAdminRole) {
          console.warn("User is not admin, redirecting from admin layout.");
          router.replace(`/${lang}`);
        }
        setIsAdmin(hasAdminRole);
        setIsCheckingRole(false);
      });
    } else if (isLoaded && !user) {
        setIsCheckingRole(false);
        router.replace(`/${lang}/sign-in?redirect_url=/${lang}/admin`);
    }
  }, [isLoaded, isSignedIn, user, router, lang]);

  if (!isLoaded || isCheckingRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-100">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-3 text-lg text-textPrimary">
          {t('adminLayout', 'loadingAdminPanel') || 'Loading Admin Panel...'}
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-100">
        <p className="text-lg text-red-600">
          {t('adminLayout', 'unauthorizedAccess') || 'Unauthorized Access.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-100" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <AdminSidebar lang={lang} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader user={_user} lang={lang} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-neutral-50">
          {children}
        </main>
      </div>
    </div>
  );
}