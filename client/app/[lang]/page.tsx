import HeroSection from '@/components/HeroSection';
import PricingTiers from '@/components/PricingTiers';
import FAQ from '@/components/FAQ';
import AboutFounder from '@/components/AboutFounder';

export default function HomePage() {
  return (
    <main>
      {/* Hero — includes ScholarshipCalculator modal internally */}
      <HeroSection />

      {/* About the founder */}
      <AboutFounder />

      {/* Pricing — anchor targeted by nav "See Our Packages" CTA */}
      <section id="pricing">
        <PricingTiers />
      </section>

      {/* FAQ */}
      <FAQ />
    </main>
  );
}
