import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: 'Profile Dashboard | StudentItaly.it',
    description: 'View your application progress, upcoming deadlines, and personalised recommendations in your StudentItaly.it dashboard.',
    alternates: { canonical: `https://studentitaly.it/${lang}/profile/dashboard` },
  };
}

export default function ProfileDashboardPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">Profile Dashboard</h1>
      <p className="text-lg text-slate-600 leading-relaxed mb-4">
        Your dashboard gives you a real-time view of your application pipeline, document checklist, and advisor messages — all in one place.
        Stay on top of every deadline so nothing falls through the cracks.
      </p>
      <p className="text-lg text-slate-600 leading-relaxed mb-10">
        Ready to upgrade your support level? Browse our packages to get dedicated advisor access and faster turnaround on your documents.
      </p>
      <Link
        href="/en/pricing"
        className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Upgrade your package →
      </Link>
    </main>
  );
}
