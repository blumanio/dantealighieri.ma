import { Metadata } from 'next';
import Link from 'next/link';

const examNames: Record<string, string> = {
  ielts: 'IELTS',
  toefl: 'TOEFL',
  gre: 'GRE',
  gmat: 'GMAT',
};

const examDescriptions: Record<string, string> = {
  ielts:
    'Most Italian universities require an IELTS score of 5.5–6.5 for English-taught programs — we help you reach your target band efficiently.',
  toefl:
    'The TOEFL iBT is accepted as proof of English proficiency at Italian universities; we guide your preparation from diagnostics to test day.',
  gre:
    'A strong GRE score can strengthen your application to competitive Italian master\'s and PhD programs; our prep plan targets your weakest sections first.',
  gmat:
    'Italian business schools accept the GMAT for MBA and management programs; we build a study schedule around your available time and target score.',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; exam: string }>;
}): Promise<Metadata> {
  const { lang, exam } = await params;
  const name = examNames[exam] ?? exam.toUpperCase();
  return {
    title: `${name} Preparation for Italy Applications | StudentItaly.it`,
    description: examDescriptions[exam] ?? `Targeted ${name} preparation to meet Italian university language and admissions requirements.`,
    alternates: { canonical: `https://studentitaly.it/${lang}/prep/${exam}` },
  };
}

export default async function ExamPrepPage({
  params,
}: {
  params: Promise<{ lang: string; exam: string }>;
}) {
  const { exam } = await params;
  const name = examNames[exam] ?? exam.toUpperCase();
  const description = examDescriptions[exam] ?? `Targeted ${name} preparation to meet Italian university language and admissions requirements.`;

  return (
    <main className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">{name} Preparation</h1>
      <p className="text-lg text-slate-600 leading-relaxed mb-4">{description}</p>
      <p className="text-lg text-slate-600 leading-relaxed mb-10">
        Test prep is bundled into our premium guidance packages — view our pricing to see which plan includes {name} coaching alongside your full application support.
      </p>
      <Link
        href="/en/pricing"
        className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        View packages with {name} prep →
      </Link>
    </main>
  );
}
