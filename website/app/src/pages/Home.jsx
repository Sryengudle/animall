import SEO from '../components/SEO';
import Hero from '../components/Hero';
import TrustStrip from '../components/TrustStrip';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import B2BBand from '../components/B2BBand';
import CTABand from '../components/CTABand';

export default function Home() {
  return (
    <>
      <SEO path="/" />
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <Features />
      <B2BBand />
      <CTABand />
    </>
  );
}
