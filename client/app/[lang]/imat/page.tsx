import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: 'IMAT Preparation | StudentItaly.it',
    description:
      'Prepare for the International Medical Admissions Test (IMAT) required for English-taught medicine programs at Italian public universities.',
    alternates: { canonical: `https://studentitaly.it/${lang}/imat` },
  };
}

export default function ImatPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">IMAT Preparation</h1>
      <p className="text-lg text-slate-600 leading-relaxed mb-4">
        The IMAT is a competitive entrance exam for English-taught medicine and surgery programs at Italian public universities, taken each September.
        Scoring well requires targeted preparation in biology, chemistry, physics, maths, and critical reasoning.
      </p>
      <p className="text-lg text-slate-600 leading-relaxed mb-10">
        Our IMAT resources and coaching packages guide you through every section so you can maximise your score and secure a place at your target university.
      </p>
      <Link
        href="/en/pricing"
        className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        View coaching packages →
      </Link>
    </main>
  );
}
