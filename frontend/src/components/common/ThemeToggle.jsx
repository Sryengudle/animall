import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon, Monitor } from 'lucide-react';
import useLanguage from '@/hooks/useLanguage';
import { setTheme } from '@/store/slices/uiSlice';

const OPTIONS = [
  { value: 'light',  icon: Sun,     labelKey: 'theme_light' },
  { value: 'system', icon: Monitor, labelKey: 'theme_system' },
  { value: 'dark',   icon: Moon,    labelKey: 'theme_dark' },
];

// 3-way segmented control: Light · System · Dark.
export default function ThemeToggle({ variant = 'light', className = '' }) {
  const { tr } = useLanguage();
  const dispatch = useDispatch();
  const theme = useSelector((s) => s.ui.theme);

  const wrapper =
    variant === 'solid'
      ? 'bg-white/15 backdrop-blur-sm border border-white/25'
      : 'bg-surface-100 border border-surface-200';

  const activeBtn = 'bg-surface-0 text-primary-700 shadow-sm';
  const idleBtn =
    variant === 'solid'
      ? 'text-white/85 hover:text-white'
      : 'text-surface-500 hover:text-surface-800';

  return (
    <div
      role="radiogroup"
      aria-label={tr('theme')}
      className={`inline-flex items-center rounded-full p-1 ${wrapper} ${className}`}
    >
      {OPTIONS.map(({ value, icon: Icon, labelKey }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={tr(labelKey)}
          title={tr(labelKey)}
          onClick={() => dispatch(setTheme(value))}
          className={`
            inline-flex items-center justify-center w-8 h-7 rounded-full transition-all duration-200
            ${theme === value ? activeBtn : idleBtn}
          `}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}

ThemeToggle.propTypes = {
  variant: PropTypes.oneOf(['solid', 'light']),
  className: PropTypes.string,
};
