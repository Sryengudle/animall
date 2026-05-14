import { useTranslation } from 'react-i18next';
import Section from './ui/Section';

const FEATURES = [
  { icon: '📷', key: 'f1' },
  { icon: '✓',  key: 'f2' },
  { icon: '🌐', key: 'f3' },
  { icon: '🆓', key: 'f4' },
];

export default function Features() {
  const { t } = useTranslation();
  return (
    <Section id="features">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-brand-700 uppercase tracking-wider">
          {t('features.title')}
        </p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-ink">
          {t('features.subtitle')}
        </h2>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div
            key={f.key}
            className="group rounded-2xl bg-white p-6 shadow-card transition-transform hover:-translate-y-1"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 text-2xl">
              <span aria-hidden="true">{f.icon}</span>
            </div>
            <h3 className="mt-5 text-lg font-bold text-ink">
              {t(`features.${f.key}Title`)}
            </h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              {t(`features.${f.key}Body`)}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
