import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';

function LegalBlock({ id, title, children }) {
  return (
    <article id={id} className="scroll-mt-24">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">{title}</h2>
      <div className="mt-6 space-y-4 text-base text-ink/90 leading-relaxed">
        {children}
      </div>
    </article>
  );
}

export default function Legal() {
  const { t } = useTranslation();
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [hash]);

  const sections = [
    { id: 'privacy', title: t('legal.privacyTitle') },
    { id: 'terms',   title: t('legal.termsTitle') },
    { id: 'refund',  title: t('legal.refundTitle') },
  ];

  return (
    <>
      <SEO title={t('legal.title')} path="/legal" />

      <Section spacing="lg">
        <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
          <aside className="lg:sticky lg:top-24 self-start">
            <p className="text-sm font-semibold text-brand-700 uppercase tracking-wider">
              {t('legal.title')}
            </p>
            <p className="mt-1 text-xs text-muted">{t('legal.lastUpdated')}</p>
            <nav className="mt-6 flex flex-col gap-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-ink hover:bg-brand-50"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          <div className="space-y-16">
            <LegalBlock id="privacy" title={t('legal.privacyTitle')}>
              <p>{t('legal.privacyP1')}</p>
              <p>{t('legal.privacyP2')}</p>
              <p>{t('legal.privacyP3')}</p>
            </LegalBlock>

            <LegalBlock id="terms" title={t('legal.termsTitle')}>
              <p>{t('legal.termsP1')}</p>
              <p>{t('legal.termsP2')}</p>
              <p>{t('legal.termsP3')}</p>
            </LegalBlock>

            <LegalBlock id="refund" title={t('legal.refundTitle')}>
              <p>{t('legal.refundP1')}</p>
              <p>{t('legal.refundP2')}</p>
              <p>{t('legal.refundP3')}</p>
            </LegalBlock>
          </div>
        </div>
      </Section>
    </>
  );
}
