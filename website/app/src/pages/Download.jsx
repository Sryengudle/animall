import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import { APP, SITE } from '../lib/constants';

export default function Download() {
  const { t } = useTranslation();
  const isLive = APP.status === 'live';

  const preview = [
    { emoji: '🐄', title: t('download.preview.title1'), meta: t('download.preview.meta1') },
    { emoji: '🐃', title: t('download.preview.title2'), meta: t('download.preview.meta2') },
    { emoji: '🐐', title: t('download.preview.title3'), meta: t('download.preview.meta3') },
  ];

  return (
    <>
      <SEO title={t('nav.download')} path="/download" />

      <Section spacing="lg">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-brand-700 uppercase tracking-wider">
              {t('nav.download')}
            </p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-ink leading-tight">
              {t('download.title')}
            </h1>
            <p className="mt-5 text-lg text-muted leading-relaxed max-w-xl">
              {t('download.subtitle')}
            </p>

            <div className="mt-8 flex flex-col gap-3 max-w-md">
              {isLive ? (
                <Button href={APP.playStoreUrl} size="lg" target="_blank" rel="noopener noreferrer">
                  <span aria-hidden="true">▶</span>
                  {t('download.playStore')}
                </Button>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/60 p-5">
                  <p className="text-sm font-semibold text-brand-800">
                    {t('download.comingSoonTitle')}
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    {t('download.comingSoonBody')}
                  </p>
                  <Button href="mailto:hello@pashubazaar.com" variant="secondary" size="sm" className="mt-3">
                    {t('download.notifyCta')}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Phone mockup */}
          <div className="relative mx-auto max-w-sm">
            <div className="absolute inset-0 -rotate-2 rounded-[3rem] bg-brand-600/10" aria-hidden="true" />
            <div className="relative rounded-[3rem] bg-ink p-3 shadow-glass">
              <div className="rounded-[2.5rem] bg-gradient-to-br from-brand-50 via-white to-accent-50 p-6 aspect-[9/16] flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-600 text-white text-sm">🐄</span>
                  <span className="font-bold text-ink">{SITE.name}</span>
                </div>
                <div className="mt-6 flex-1 space-y-3">
                  {preview.map((row, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-card">
                      <span className="text-2xl" aria-hidden="true">{row.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink truncate">{row.title}</p>
                        <p className="text-xs text-muted">{row.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="tinted">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">
            {t('download.pwaTitle')}
          </h2>
          <p className="mt-4 text-base text-muted leading-relaxed">
            {t('download.pwaBody')}
          </p>
          <Button href={SITE.url} variant="secondary" size="lg" className="mt-6">
            {SITE.domain}
            <span aria-hidden="true">↗</span>
          </Button>
        </div>
      </Section>
    </>
  );
}
