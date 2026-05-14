import { useTranslation } from 'react-i18next';
import Container from './ui/Container';
import Button from './ui/Button';
import { CONTACT } from '../lib/constants';

export default function B2BBand() {
  const { t } = useTranslation();
  return (
    <div className="py-16 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-100 via-accent-50 to-white p-8 sm:p-12 shadow-card">
          <div aria-hidden="true" className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-accent-200/50 blur-3xl" />
          <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-accent-700">
                B2B
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-ink max-w-2xl">
                {t('b2b.title')}
              </h2>
              <p className="mt-3 text-base text-muted max-w-2xl leading-relaxed">
                {t('b2b.body')}
              </p>
            </div>
            <Button
              href={`mailto:${CONTACT.partnerEmail}`}
              variant="accent"
              size="lg"
              className="whitespace-nowrap"
            >
              {t('b2b.cta')}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
