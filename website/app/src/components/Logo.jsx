import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SITE } from '../lib/constants';

export default function Logo({ withTagline = false, dark = false }) {
  const { t } = useTranslation();
  const textColor = dark ? 'text-white' : 'text-ink';
  const taglineColor = dark ? 'text-white/70' : 'text-muted';
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <span
        className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-600 text-2xl shadow-button transition-transform group-hover:scale-105"
        aria-hidden="true"
      >
        🐄
      </span>
      <span className="flex flex-col leading-tight">
        <span className={`text-xl font-extrabold tracking-tight ${textColor}`}>
          {SITE.name}
        </span>
        {withTagline && (
          <span className={`text-xs ${taglineColor}`}>
            {t('footer.tagline')}
          </span>
        )}
      </span>
    </Link>
  );
}
