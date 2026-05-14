import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import Features from '../components/Features';
import CTABand from '../components/CTABand';

export default function FeaturesPage() {
  const { t } = useTranslation();
  return (
    <>
      <SEO title={t('features.title')} path="/features" />
      <Section spacing="lg">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-brand-700 uppercase tracking-wider">
            {t('features.title')}
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-ink leading-tight">
            {t('features.subtitle')}
          </h1>
        </div>
      </Section>
      <Features />
      <CTABand />
    </>
  );
}
