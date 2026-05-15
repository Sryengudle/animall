import PropTypes from 'prop-types';
import useLanguage from '@/hooks/useLanguage';
import { LANG_OPTIONS } from '@/i18n';

// Segmented control switching between EN / हि / मर.
// `variant="solid"` for dark headers, `variant="light"` for white backgrounds.
export default function LanguageSwitcher({ variant = 'light', className = '' }) {
  const { lang, changeLang } = useLanguage();

  const wrapper =
    variant === 'solid'
      ? 'bg-white/15 backdrop-blur-sm border border-white/25'
      : 'bg-surface-100 border border-surface-200';

  const activeBtn =
    variant === 'solid' ? 'bg-surface-0 text-primary-700 shadow-sm' : 'bg-surface-0 text-primary-700 shadow-sm';
  const idleBtn =
    variant === 'solid' ? 'text-white/85 hover:text-white' : 'text-surface-600 hover:text-surface-900';

  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className={`inline-flex items-center rounded-full p-1 ${wrapper} ${className}`}
    >
      {LANG_OPTIONS.map(({ code, short, label }) => (
        <button
          key={code}
          type="button"
          role="radio"
          aria-checked={lang === code}
          aria-label={label}
          onClick={() => changeLang(code)}
          className={`
            px-3 py-1 text-caption font-bold rounded-full transition-all duration-200
            ${lang === code ? activeBtn : idleBtn}
          `}
        >
          {short}
        </button>
      ))}
    </div>
  );
}

LanguageSwitcher.propTypes = {
  variant: PropTypes.oneOf(['solid', 'light']),
  className: PropTypes.string,
};
