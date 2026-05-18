import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import useLanguage from '@/hooks/useLanguage';
import LanguageSwitcher from './LanguageSwitcher';
import IconButton from '@/components/ui/IconButton';
import Avatar from '@/components/ui/Avatar';

// Pashu Mandi-style header. Solid brand-800 (the deepest emerald in our scale —
// emotionally the closest substitute for the reference's deep maroon, kept since
// the user wants to keep our emerald brand). The wordmark renders from i18n
// `app_name`, which is Devanagari for mr/hi and Latin for en — matching the
// reference's prominent Devanagari brand mark.

function InnerHeader({ title, showBack, onBack }) {
  const navigate = useNavigate();
  const back = onBack || (() => navigate(-1));
  return (
    <header className="sticky top-0 z-40 bg-brand-800 shadow-sm">
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-1 min-w-0">
          {showBack && (
            <IconButton
              icon={ArrowLeft}
              label="Back"
              variant="ghost"
              onClick={back}
              className="text-white hover:bg-white/15"
            />
          )}
          <h1 className="text-h3 text-white truncate">{title}</h1>
        </div>
        <LanguageSwitcher variant="solid" />
      </div>
    </header>
  );
}

InnerHeader.propTypes = {
  title: PropTypes.string.isRequired,
  showBack: PropTypes.bool,
  onBack: PropTypes.func,
};

function HomeHeader({ showSellCta }) {
  const navigate = useNavigate();
  const { tr } = useLanguage();
  const { user } = useSelector((s) => s.auth);

  return (
    <header className="sticky top-0 z-40 bg-brand-800 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2.5 gap-3">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 group min-w-0"
          aria-label={tr('app_name')}
        >
          {/* Logo mark — 36px circular tint with cow + ₹ badge. */}
          <span
            className="w-9 h-9 rounded-full bg-white/12 grid place-items-center shrink-0 transition-transform group-hover:scale-105 border border-white/20"
            aria-hidden="true"
          >
            <span className="relative inline-flex items-center justify-center">
              <span className="text-h3 leading-none">🐄</span>
              <span className="absolute -bottom-1 -right-1 text-[9px] font-extrabold text-white bg-brand-600 rounded-full w-3.5 h-3.5 grid place-items-center border border-white/30">
                ₹
              </span>
            </span>
          </span>

          <span className="text-left leading-tight min-w-0">
            <span className="block text-h3 text-white tracking-tight truncate">
              {tr('app_name')}
            </span>
            <span className="block text-micro-caps !font-medium normal-case tracking-normal text-white/85 truncate">
              {tr('app_tagline')}
            </span>
          </span>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          {showSellCta && (
            <button
              type="button"
              onClick={() => navigate('/sell')}
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white text-caption font-bold border border-white/25"
            >
              {tr('sell_livestock')}
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('/profile')}
            aria-label={tr('nav_profile')}
            className="focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 rounded-full"
          >
            <Avatar name={user?.name} size="sm" />
          </button>
        </div>
      </div>
    </header>
  );
}

HomeHeader.propTypes = {
  showSellCta: PropTypes.bool,
};

export default function Header({ title, showBack = false, onBack, showSellCta = true }) {
  if (title) return <InnerHeader title={title} showBack={showBack} onBack={onBack} />;
  return <HomeHeader showSellCta={showSellCta} />;
}

Header.propTypes = {
  title: PropTypes.string,
  showBack: PropTypes.bool,
  onBack: PropTypes.func,
  showSellCta: PropTypes.bool,
};
