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
    title: `Italian Universities for Students from ${name} | StudentItaly.it`,
    description: `Discover Italian university options and application guidance tailored for students coming from ${name}.`,
    alternates: { canonical: `https://studentitaly.it/${lang}/universities/${country}` },
  };
}

export default async function CountryUniversitiesPage({
  params,
}: {
  params: Promise<{ lang: string; country: string }>;
}) {
  const { country } = await params;
  const name = countryNames[country] ?? country;

  return (
    <main className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">
        Italian Universities for Students from {name}
      </h1>
      <p className="text-lg text-slate-600 leading-relaxed mb-4">
        We help students from {name} navigate the Italian university application process — from choosing the right program to obtaining your student visa.
        Our advisors understand the specific document requirements and credential recognition rules for your country.
      </p>
      <p className="text-lg text-slate-600 leading-relaxed mb-10">
        Use our matching tool to find the Italian university that best fits your academic profile and budget.
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
