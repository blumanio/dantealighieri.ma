import { Metadata } from 'next';
import Link from 'next/link';

const courseNames: Record<string, string> = {
  'computer-science': 'Computer Science',
  medicine: 'Medicine',
  engineering: 'Engineering',
  business: 'Business',
  law: 'Law',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; course: string }>;
}): Promise<Metadata> {
  const { lang, course } = await params;
  const name = courseNames[course] ?? course;
  return {
    title: `Study ${name} in Italy | StudentItaly.it`,
    description: `Explore Italian universities offering ${name} degrees and learn how to apply as an international student.`,
    alternates: { canonical: `https://studentitaly.it/${lang}/courses/${course}` },
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ lang: string; course: string }>;
}) {
  const { course } = await params;
  const name = courseNames[course] ?? course;

  return (
    <main className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">
        Study {name} in Italy
      </h1>
      <p className="text-lg text-slate-600 leading-relaxed mb-4">
        Italy offers internationally recognised {name} programs at competitive tuition rates compared to the UK, US, or Australia — with English-taught options available at many top public universities.
        Our team helps you identify the programs that match your academic background and career goals.
      </p>
      <p className="text-lg text-slate-600 leading-relaxed mb-10">
        Use our university matching tool to filter specifically for {name} programs and compare entry requirements, costs, and locations.
      </p>
      <Link
        href="/en/university-match"
        className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Match me with {name} programs →
      </Link>
    </main>
  );
}
