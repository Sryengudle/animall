import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import { CONTACT } from '../lib/constants';

export default function Contact() {
  const { t } = useTranslation();
  return (
    <>
      <SEO title={t('contact.title')} path="/contact" />

      <Section spacing="lg">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-brand-700 uppercase tracking-wider">
            {t('contact.title')}
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-ink leading-tight">
            {t('contact.subtitle')}
          </h1>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <article className="rounded-2xl bg-white p-8 shadow-card">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-100 text-2xl" aria-hidden="true">
              💬
            </div>
            <h2 className="mt-5 text-xl font-bold text-ink">{t('contact.supportTitle')}</h2>
            <p className="mt-2 text-sm text-muted">{t('contact.supportBody')}</p>
            <Button href={`mailto:${CONTACT.supportEmail}`} variant="secondary" size="sm" className="mt-5">
              {CONTACT.supportEmail}
            </Button>
          </article>

          <article className="rounded-2xl bg-white p-8 shadow-card">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent-100 text-2xl" aria-hidden="true">
              🤝
            </div>
            <h2 className="mt-5 text-xl font-bold text-ink">{t('contact.partnerTitle')}</h2>
            <p className="mt-2 text-sm text-muted">{t('contact.partnerBody')}</p>
            <Button href={`mailto:${CONTACT.partnerEmail}`} variant="accent" size="sm" className="mt-5">
              {CONTACT.partnerEmail}
            </Button>
          </article>
        </div>
      </Section>
    </>
  );
}
