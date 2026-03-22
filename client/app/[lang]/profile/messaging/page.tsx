import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: 'Messages | StudentItaly.it',
    description: 'Communicate directly with your StudentItaly.it advisor to get answers and guidance on your application.',
    alternates: { canonical: `https://studentitaly.it/${lang}/profile/messaging` },
  };
}

export default function ProfileMessagingPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">Messages</h1>
      <p className="text-lg text-slate-600 leading-relaxed mb-4">
        Send and receive messages with your dedicated advisor — ask questions, share documents, and get real-time feedback on your application strategy.
        All conversations are saved so you never lose important guidance.
      </p>
      <p className="text-lg text-slate-600 leading-relaxed mb-10">
        Don't have an advisor yet? Upgrade to a paid package to unlock direct messaging and priority response times.
      </p>
      <Link
        href="/en/pricing"
        className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Get advisor access →
      </Link>
    </main>
  );
}
