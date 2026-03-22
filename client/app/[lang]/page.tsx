import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import AboutFounder from '@/components/AboutFounder';
import PricingTiers from '@/components/PricingTiers';
import FAQ from '@/components/FAQ';
import WhatsAppButton from '@/components/WhatsAppButton';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Testimonial {
  name: string;
  country: string;
  flag: string;
  university: string;
  quote: string;
}

// ─── Data helpers (server-side) ───────────────────────────────────────────────

function getTestimonials(): Testimonial[] {
  const filePath = path.join(process.cwd(), 'public/data/testimonials.json');
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Testimonial[];
  } catch {
    return [];
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const testimonials = getTestimonials();

  return (
    <main>
      {/* ── 1. HERO ───────────────────────────────────────────────────────── */}
      {/* ScholarshipCalculator modal is managed internally by HeroSection */}
      <HeroSection />

      {/* ── 2. PAIN POINTS ────────────────────────────────────────────────── */}
      <section className="bg-slate-900 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Col 1 */}
            <div className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-3xl" aria-hidden="true">❌</span>
              <p className="text-slate-200 text-lg leading-relaxed font-medium">
                100+ hours lost navigating Universitaly, deadlines, and consulate requirements
              </p>
            </div>
            {/* Col 2 */}
            <div className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-3xl" aria-hidden="true">❌</span>
              <p className="text-slate-200 text-lg leading-relaxed font-medium">
                Application rejected for a missing document or wrong deadline
              </p>
            </div>
            {/* Col 3 */}
            <div className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-3xl" aria-hidden="true">❌</span>
              <p className="text-slate-200 text-lg leading-relaxed font-medium">
                No expert to call when the embassy asks questions
              </p>
            </div>
          </div>

          <p className="text-center text-slate-300 text-xl font-semibold tracking-wide">
            That&apos;s why <span className="text-orange-400 font-bold">StudentItaly.it</span> exists.
          </p>
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ───────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 text-center mb-4">
            How It Works
          </h2>
          <p className="text-slate-500 text-center mb-14 text-lg">
            Three steps. No guesswork. A clear path to your Italian degree.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-orange-200">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900">Tell us your profile</h3>
              <p className="text-slate-500 leading-relaxed">
                Take the free quiz — your country, budget, and target degree. It takes 2 minutes.
              </p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-orange-200">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900">We build your roadmap</h3>
              <p className="text-slate-500 leading-relaxed">
                Get a personalised list of university matches and a scholarship stacking plan.
              </p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-orange-200">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900">We guide every document & deadline</h3>
              <p className="text-slate-500 leading-relaxed">
                From Universitaly registration to visa approval — step by step, nothing missed.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Link
              href={`/${lang}/university-match`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl shadow-lg shadow-orange-200/50 transition-all hover:scale-[1.02] text-lg"
            >
              Start Free Quiz →
            </Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT FOUNDER ─────────────────────────────────────────────────── */}
      <AboutFounder />

      {/* ── 4. COMPARISON TABLE ───────────────────────────────────────────── */}
      <section className="bg-neutral-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 text-center mb-4">
            DIY vs StudentItaly.it
          </h2>
          <p className="text-slate-500 text-center mb-12 text-lg">
            See exactly what expert guidance changes.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-slate-500 font-semibold uppercase tracking-wider text-xs w-1/3">
                    &nbsp;
                  </th>
                  <th className="px-6 py-4 text-center text-slate-600 font-bold text-sm">
                    DIY (Alone)
                  </th>
                  <th className="px-6 py-4 text-center font-bold text-sm bg-orange-50 text-orange-700 rounded-t-xl">
                    StudentItaly.it
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { label: 'Time needed',    diy: '3–6 months',        us: '4–8 weeks' },
                  { label: 'Success rate',   diy: '40–50%',            us: '85%' },
                  { label: 'Visa errors',    diy: 'Common',            us: 'Rare' },
                  { label: 'Cost',           diy: 'Free (risky)',      us: '€297–€697' },
                  { label: 'Support',        diy: 'Google',            us: 'Direct WhatsApp' },
                ].map(({ label, diy, us }) => (
                  <tr key={label} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-700">{label}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{diy}</td>
                    <td className="px-6 py-4 text-center font-bold text-orange-700 bg-orange-50/60">
                      {us}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 5. PRICING ────────────────────────────────────────────────────── */}
      <section id="pricing">
        <div className="pt-16 pb-2 text-center px-4">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            Choose Your Guidance Package
          </h2>
        </div>
        <PricingTiers />
      </section>

      {/* ── 6. TESTIMONIALS ───────────────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="bg-white py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 text-center mb-4">
              Students Who Made It
            </h2>
            <p className="text-slate-500 text-center mb-12 text-lg">
              Real results from real students across North Africa.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="flex flex-col gap-4 p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white"
                >
                  {/* Stars */}
                  <div className="flex gap-0.5 text-yellow-400 text-sm" aria-label="5 stars">
                    {'★★★★★'}
                  </div>
                  {/* Quote */}
                  <p className="text-slate-700 leading-relaxed flex-1 text-base">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  {/* Author */}
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                      {t.flag}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                      <p className="text-slate-500 text-xs">{t.university}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 7. FAQ ────────────────────────────────────────────────────────── */}
      <FAQ />

      {/* ── 8. FINAL CTA BANNER ───────────────────────────────────────────── */}
      <section className="bg-orange-600 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to start your Italian university journey?
          </h2>
          <p className="text-orange-100 text-lg mb-10">
            Join 500+ students who stopped guessing and started getting accepted.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${lang}/university-match`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-orange-700 font-black rounded-xl hover:bg-orange-50 transition-colors shadow-lg text-lg"
            >
              Get Free University Match
            </Link>
            <a
              href="#pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-700 hover:bg-orange-800 text-white font-bold rounded-xl transition-colors border border-orange-500 text-lg"
            >
              See All Packages
            </a>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp button */}
      <WhatsAppButton />
    </main>
  );
}
