import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: 'My Profile | StudentItaly.it',
    description: 'Manage your StudentItaly.it profile, track your applications, and access your personalised guidance.',
    alternates: { canonical: `https://studentitaly.it/${lang}/profile` },
  };
}

export default function ProfilePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">Your Profile</h1>
      <p className="text-lg text-slate-600 leading-relaxed mb-4">
        Your profile is your central hub for tracking university applications, managing documents, and accessing the guidance you have purchased.
        Keep your details up to date so our advisors can give you the most accurate recommendations.
      </p>
      <p className="text-lg text-slate-600 leading-relaxed mb-10">
        If you haven't started your journey yet, explore our matching tool to find the right Italian university for your academic profile.
      </p>
      <Link
        href="/en/university-match"
        className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Find your university →
      </Link>
    </main>
  );
}
