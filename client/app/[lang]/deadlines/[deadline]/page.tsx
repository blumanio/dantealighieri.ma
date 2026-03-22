import { Metadata } from 'next';
import Link from 'next/link';

const deadlineNames: Record<string, string> = {
  'fall-2024': 'Fall 2024',
  'spring-2025': 'Spring 2025',
  mba: 'MBA',
  phd: 'PhD',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; deadline: string }>;
}): Promise<Metadata> {
  const { lang, deadline } = await params;
  const name = deadlineNames[deadline] ?? deadline;
  return {
    title: `Italian University Deadlines — ${name} | StudentItaly.it`,
    description: `Key application deadlines for Italian universities for the ${name} intake, including Universitaly, scholarship, and visa cut-off dates.`,
    alternates: { canonical: `https://studentitaly.it/${lang}/deadlines/${deadline}` },
  };
}

export default async function DeadlinePage({
  params,
}: {
  params: Promise<{ lang: string; deadline: string }>;
}) {
  const { deadline } = await params;
  const name = deadlineNames[deadline] ?? deadline;

  return (
    <main className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">
        Italian University Deadlines — {name}
      </h1>
      <p className="text-lg text-slate-600 leading-relaxed mb-4">
        The {name} intake has strict, non-negotiable deadlines for Universitaly pre-enrollment, scholarship applications, and student visa requests — missing any one of them can delay your start by a full year.
        We track every key date and alert you well in advance.
      </p>
      <p className="text-lg text-slate-600 leading-relaxed mb-10">
        Get a personalised deadline calendar built around your target university and program by booking a guidance package today.
      </p>
      <Link
        href="/en/pricing"
        className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Get my deadline calendar →
      </Link>
    </main>
  );
}
