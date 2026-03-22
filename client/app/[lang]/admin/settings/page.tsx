import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: 'Admin Settings | StudentItaly.it',
    description: 'Configure platform-wide settings for the StudentItaly.it admin panel.',
    alternates: { canonical: `https://studentitaly.it/${lang}/admin/settings` },
  };
}

export default function AdminSettingsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">Admin Settings</h1>
      <p className="text-lg text-slate-600 leading-relaxed mb-4">
        Configure platform-wide options including email templates, feature flags, and content moderation rules from this settings panel.
        Changes made here affect all users and take effect immediately.
      </p>
      <p className="text-lg text-slate-600 leading-relaxed mb-10">
        Return to the admin dashboard to manage users, blog posts, and university listings.
      </p>
      <Link
        href="/en/admin"
        className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Back to admin dashboard →
      </Link>
    </main>
  );
}
