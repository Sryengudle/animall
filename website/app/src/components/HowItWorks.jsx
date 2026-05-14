import { useTranslation } from 'react-i18next';
import Section from './ui/Section';

function StepCard({ index, title, body, accent }) {
  return (
    <li className="relative rounded-2xl bg-white p-6 shadow-card">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold ${accent === 'amber' ? 'bg-accent-100 text-accent-800' : 'bg-brand-100 text-brand-800'}`}>
        {index}
      </div>
      <h4 className="mt-4 text-lg font-semibold text-ink">{title}</h4>
      <p className="mt-2 text-sm text-muted leading-relaxed">{body}</p>
    </li>
  );
}

function Column({ heading, steps, accent }) {
  return (
    <div>
      <h3 className="text-2xl font-bold text-ink">{heading}</h3>
      <ol className="mt-6 grid gap-4">
        {steps.map((s, i) => (
          <StepCard key={i} index={i + 1} title={s.title} body={s.body} accent={accent} />
        ))}
      </ol>
    </div>
  );
}

export default function HowItWorks() {
  const { t } = useTranslation();
  const buyers = [
    { title: t('howItWorks.buyers.step1Title'), body: t('howItWorks.buyers.step1Body') },
    { title: t('howItWorks.buyers.step2Title'), body: t('howItWorks.buyers.step2Body') },
    { title: t('howItWorks.buyers.step3Title'), body: t('howItWorks.buyers.step3Body') },
  ];
  const sellers = [
    { title: t('howItWorks.sellers.step1Title'), body: t('howItWorks.sellers.step1Body') },
    { title: t('howItWorks.sellers.step2Title'), body: t('howItWorks.sellers.step2Body') },
    { title: t('howItWorks.sellers.step3Title'), body: t('howItWorks.sellers.step3Body') },
  ];

  return (
    <Section id="how-it-works" tone="tinted">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-brand-700 uppercase tracking-wider">
          {t('howItWorks.title')}
        </p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-ink">
          {t('howItWorks.subtitle')}
        </h2>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Column heading={t('howItWorks.buyers.heading')}  steps={buyers}  accent="brand" />
        <Column heading={t('howItWorks.sellers.heading')} steps={sellers} accent="amber" />
      </div>
    </Section>
  );
}
