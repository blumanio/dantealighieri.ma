import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About StudentItaly.it | Study in Italy Guidance',
  description:
    'StudentItaly.it helps North African and international students navigate Italian university admissions — from choosing the right program to visa approval.',
  openGraph: {
    title: 'About StudentItaly.it',
    description:
      'We guide North African students through every step of studying in Italy: university selection, applications, scholarships, and visas.',
    url: 'https://studentitaly.it/en/about',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">
        About StudentItaly.it
      </h1>

      <p className="text-lg text-slate-600 leading-relaxed mb-6">
        StudentItaly.it exists because the path to studying in Italy is harder
        than it should be. Every year, thousands of motivated students from
        Morocco, Algeria, Tunisia, Egypt, and beyond dream of enrolling in
        Italian universities — but get lost in a maze of Universitaly
        registrations, consulate appointments, language requirements, and
        scholarship deadlines. We built this platform to change that.
      </p>

      <p className="text-lg text-slate-600 leading-relaxed mb-6">
        Founded by Mohamed El Aammari — an environmental geologist who arrived
        in Italy with €500 and no Italian — StudentItaly.it is built on
        first-hand experience. We know which documents Italian universities
        actually reject, which scholarships North African students consistently
        qualify for, and how to prepare a visa file that passes. Our guidance
        has helped over 500 students get accepted, with an 85% success rate
        across our consultation packages.
      </p>

      <p className="text-lg text-slate-600 leading-relaxed">
        Whether you are just starting to explore Italian universities or you are
        60 days from a deadline and need expert support fast, we have a package
        for you. Our goal is simple: remove the guesswork, save you months of
        wasted effort, and get you enrolled in a program that fits your profile
        and budget.
      </p>
    </main>
  );
}
