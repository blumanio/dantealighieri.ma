import { Metadata } from 'next';
import Link from 'next/link';

const countryNames: Record<string, string> = {
  usa: 'United States',
  canada: 'Canada',
  uk: 'United Kingdom',
  germany: 'Germany',
  australia: 'Australia',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; country: string }>;
}): Promise<Metadata> {
  const { lang, country } = await params;
  const name = countryNames[country] ?? country;
  return {
    title: `Study in Italy Guide for Students from ${name} | StudentItaly.it`,
    description: `A step-by-step guide to Italian university admissions for students from ${name}, covering documents, visas, and deadlines.`,
    alternates: { canonical: `https://studentitaly.it/${lang}/guides/${country}` },
  };
}

export default async function CountryGuidePage({
  params,
}: {
  params: Promise<{ lang: string; country: string }>;
}) {
  const { country } = await params;
  const name = countryNames[country] ?? country;

  return (
    <main className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">
        Study in Italy Guide — Students from {name}
      </h1>
      <p className="text-lg text-slate-600 leading-relaxed mb-4">
        This guide covers everything students from {name} need to know about applying to Italian universities: credential evaluation, Universitaly registration, language requirements, visa applications, and scholarship deadlines.
        Every step is explained in plain language so you can prepare without surprises.
      </p>
      <p className="text-lg text-slate-600 leading-relaxed mb-10">
        Want a personalised roadmap? Our advisors can map out your exact next steps based on your chosen program and start date.
      </p>
      <Link
        href="/en/pricing"
        className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Get personalised guidance →
      </Link>
    </main>
  );
}
