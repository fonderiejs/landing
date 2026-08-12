import { setRequestLocale } from 'next-intl/server';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollReveal from './components/ScrollReveal';
import Hero from './sections/Hero';
import Problem from './sections/Problem';
import Control from './sections/Control';
import Shift from './sections/Shift';
import Proof from './sections/Proof';
import Packages from './sections/Packages';
import Difference from './sections/Difference';
import Pricing from './sections/Pricing';
import FinalCta from './sections/FinalCta';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <ScrollReveal />
      <Navbar />
      <main>
        <Hero />
        {/* Every section from Problem through the first Pricing section
            shares this single .container (max-width:1080px) - each
            section's own border-bottom is drawn on an unconstrained
            full-width element, so it only appears inset because it's a
            child of this shared wrapper, not because it has its own. */}
        <div className="container">
          <Problem />
          <Control />
          <Shift />
          <Proof />
          <Packages />
          <Difference />
          <Pricing />
        </div>
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
