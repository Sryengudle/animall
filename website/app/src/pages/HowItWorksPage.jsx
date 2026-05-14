import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import HowItWorks from '../components/HowItWorks';
import CTABand from '../components/CTABand';

export default function HowItWorksPage() {
  const { t } = useTranslation();
  return (
    <>
      <SEO title={t('howItWorks.title')} path="/how-it-works" />
      <Section spacing="lg">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-brand-700 uppercase tracking-wider">
            {t('howItWorks.title')}
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-ink leading-tight">
            {t('howItWorks.subtitle')}
          </h1>
        </div>
      </Section>
      <HowItWorks />
      <CTABand />
    </>
  );
}
