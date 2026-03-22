import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: 'Profile Settings | StudentItaly.it',
    description: 'Update your personal details, notification preferences, and account settings on StudentItaly.it.',
    alternates: { canonical: `https://studentitaly.it/${lang}/profile/settings` },
  };
}

export default function ProfileSettingsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">Profile Settings</h1>
      <p className="text-lg text-slate-600 leading-relaxed mb-4">
        Manage your account details, language preferences, and notification settings to keep your StudentItaly.it experience personalised and up to date.
        Changes are saved instantly and reflected across all your devices.
      </p>
      <p className="text-lg text-slate-600 leading-relaxed mb-10">
        Looking to find a better-fit university? Use our matching tool to reassess your options at any time.
      </p>
      <Link
        href="/en/university-match"
        className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Re-run university match →
      </Link>
    </main>
  );
}
