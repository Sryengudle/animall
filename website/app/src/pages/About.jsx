import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import CTABand from '../components/CTABand';
import { FOUNDERS, pickLang } from '../lib/constants';

export default function About() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <>
      <SEO title={t('about.title')} path="/about" />

      <Section spacing="lg">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-brand-700 uppercase tracking-wider">
            {t('about.title')}
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-ink leading-tight">
            {t('about.lede')}
          </h1>
        </div>
      </Section>

      <Section tone="tinted">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <h2 className="text-3xl font-extrabold text-ink">
            {t('about.missionTitle')}
          </h2>
          <p className="text-lg text-ink leading-relaxed">
            {t('about.missionBody')}
          </p>
        </div>
      </Section>

      <Section>
        <h2 className="text-3xl font-extrabold text-ink">
          {t('about.foundersTitle')}
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {FOUNDERS.map((f) => (
            <article key={f.key} className="rounded-2xl bg-white p-8 shadow-card">
              <div
                className="h-24 w-24 rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 grid place-items-center text-4xl"
                aria-hidden="true"
              >
                👤
              </div>
              <h3 className="mt-5 text-xl font-bold text-ink">
                {pickLang(f.name, lang)}
              </h3>
              <p className="text-sm font-medium text-brand-700">
                {pickLang(f.role, lang)}
              </p>
              <p className="mt-4 text-sm text-muted leading-relaxed">
                {pickLang(f.bio, lang)}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <CTABand />
    </>
  );
}
