import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import Button from '../components/ui/Button';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <>
      <SEO title="404" path="/404" />
      <div className="grid place-items-center py-32 px-6 text-center">
        <span className="text-7xl" aria-hidden="true">🐄</span>
        <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold text-ink">
          {t('notFound.title')}
        </h1>
        <p className="mt-3 text-lg text-muted max-w-md">{t('notFound.body')}</p>
        <Button to="/" size="lg" className="mt-8">
          {t('notFound.cta')}
        </Button>
      </div>
    </>
  );
}
