import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: 'My Applications | StudentItaly.it',
    description: 'Track the status of every university application you have submitted through StudentItaly.it.',
    alternates: { canonical: `https://studentitaly.it/${lang}/profile/applications` },
  };
}

export default function ProfileApplicationsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">My Applications</h1>
      <p className="text-lg text-slate-600 leading-relaxed mb-4">
        View all your active and past university applications in one place, with real-time status updates and a checklist of outstanding documents.
        Our advisors will flag anything that needs your attention before a deadline passes.
      </p>
      <p className="text-lg text-slate-600 leading-relaxed mb-10">
        Not sure which university to apply to next? Our matching tool compares your profile against hundreds of Italian programs.
      </p>
      <Link
        href="/en/university-match"
        className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Find more universities →
      </Link>
    </main>
  );
}
