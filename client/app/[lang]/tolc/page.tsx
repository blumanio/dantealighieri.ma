import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: 'TOLC Preparation | StudentItaly.it',
    description:
      'Prepare for the TOLC — the Italian university entrance test used by most degree programs for international students applying through Universitaly.',
    alternates: { canonical: `https://studentitaly.it/${lang}/tolc` },
  };
}

export default function TolcPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">TOLC Preparation</h1>
      <p className="text-lg text-slate-600 leading-relaxed mb-4">
        The TOLC is the standardised admissions test required by most Italian universities for a wide range of degree programs including engineering, economics, and science.
        International students must pass it before their application is accepted through Universitaly.
      </p>
      <p className="text-lg text-slate-600 leading-relaxed mb-10">
        We help you understand which TOLC variant your program requires and how to prepare efficiently, whether you sit the exam remotely or at a test centre.
      </p>
      <Link
        href="/en/pricing"
        className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        View preparation packages →
      </Link>
    </main>
  );
}
