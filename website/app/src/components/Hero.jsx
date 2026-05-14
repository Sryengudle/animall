import { useTranslation } from 'react-i18next';
import Button from './ui/Button';
import Container from './ui/Container';
import { ANIMAL_TYPES } from '../lib/constants';

export default function Hero() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const langKey = ['en', 'mr', 'hi'].includes(lang) ? lang : 'en';

  return (
    <section className="relative overflow-hidden pt-10 pb-20 sm:pt-16 sm:pb-32">
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 -right-20 h-96 w-96 rounded-full bg-accent-200/40 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600"></span>
              </span>
              {t('hero.comingSoonNote')}
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-display-lg font-extrabold leading-tight tracking-tight text-ink">
              <span className="text-gradient-primary">{t('hero.headline')}</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg sm:text-xl text-muted leading-relaxed">
              {t('hero.subhead')}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button to="/download" size="lg">
                <span aria-hidden="true">📱</span>
                {t('hero.primaryCta')}
              </Button>
              <Button to="/how-it-works" size="lg" variant="secondary">
                {t('hero.secondaryCta')}
                <span aria-hidden="true">→</span>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
              {ANIMAL_TYPES.slice(0, 6).map((a) => (
                <span key={a.key} className="inline-flex items-center gap-1.5">
                  <span aria-hidden="true" className="text-xl">{a.emoji}</span>
                  <span>{a[langKey] || a.en}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-up">
            <div className="relative mx-auto max-w-md">
              <div className="absolute inset-0 -rotate-3 rounded-3xl bg-brand-600/10" aria-hidden="true" />
              <div className="relative rounded-3xl bg-white shadow-card p-6 sm:p-8">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-brand-50 via-accent-50 to-brand-100 grid place-items-center">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 text-7xl sm:text-8xl" aria-hidden="true">
                      <span className="animate-float" style={{ animationDelay: '0s' }}>🐄</span>
                      <span className="animate-float" style={{ animationDelay: '0.5s' }}>🐃</span>
                      <span className="animate-float" style={{ animationDelay: '1s' }}>🐐</span>
                    </div>
                    <p className="mt-6 px-4 text-sm font-medium text-brand-800">
                      {t('hero.statsLine')}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-brand-50 p-3">
                    <p className="text-2xl font-extrabold text-brand-700">5★</p>
                    <p className="text-[10px] text-muted uppercase tracking-wider">{t('hero.verified')}</p>
                  </div>
                  <div className="rounded-xl bg-accent-50 p-3">
                    <p className="text-2xl font-extrabold text-accent-700">3</p>
                    <p className="text-[10px] text-muted uppercase tracking-wider">{t('hero.languages')}</p>
                  </div>
                  <div className="rounded-xl bg-brand-50 p-3">
                    <p className="text-2xl font-extrabold text-brand-700">₹0</p>
                    <p className="text-[10px] text-muted uppercase tracking-wider">{t('hero.fees')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
