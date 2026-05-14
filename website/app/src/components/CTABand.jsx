import { useTranslation } from 'react-i18next';
import Container from './ui/Container';
import Button from './ui/Button';

export default function CTABand() {
  const { t } = useTranslation();
  return (
    <div className="pb-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-brand-900 p-10 sm:p-16 text-center shadow-glass">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,rgba(110,231,183,0.25),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.25),transparent_50%)]" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white max-w-2xl mx-auto">
              {t('ctaBand.title')}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-white/80 max-w-xl mx-auto">
              {t('ctaBand.body')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button to="/download" size="lg" className="bg-white text-brand-800 hover:bg-brand-50">
                <span aria-hidden="true">📱</span>
                {t('ctaBand.cta')}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
