import { Metadata } from 'next';
import Link from 'next/link';

const serviceNames: Record<string, string> = {
  selection: 'University Selection',
  sop: 'Statement of Purpose',
  lor: 'Letter of Recommendation',
  visa: 'Visa Application',
};

const serviceDescriptions: Record<string, string> = {
  selection:
    'We analyse your academic profile and match you with Italian universities where your application has the strongest chance of acceptance.',
  sop:
    'Our advisors help you write a compelling Statement of Purpose that clearly communicates your motivation and academic fit to Italian admissions committees.',
  lor:
    'We guide you on how to request strong Letters of Recommendation and provide templates tailored to Italian university expectations.',
  visa:
    'We prepare a complete, error-free Italian student visa file and coach you for the consulate interview so you can secure your visa with confidence.',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; service: string }>;
}): Promise<Metadata> {
  const { lang, service } = await params;
  const name = serviceNames[service] ?? service;
  return {
    title: `${name} Service | StudentItaly.it`,
    description: serviceDescriptions[service] ?? `Expert ${name} support for students applying to Italian universities.`,
    alternates: { canonical: `https://studentitaly.it/${lang}/services/${service}` },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ lang: string; service: string }>;
}) {
  const { service } = await params;
  const name = serviceNames[service] ?? service;
  const description = serviceDescriptions[service] ?? `Expert ${name} support for students applying to Italian universities.`;

  return (
    <main className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">{name}</h1>
      <p className="text-lg text-slate-600 leading-relaxed mb-4">{description}</p>
      <p className="text-lg text-slate-600 leading-relaxed mb-10">
        This service is included in select StudentItaly.it packages — view our pricing page to find the plan that covers everything you need for your Italian university application.
      </p>
      <Link
        href="/en/pricing"
        className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        View packages →
      </Link>
    </main>
  );
}
