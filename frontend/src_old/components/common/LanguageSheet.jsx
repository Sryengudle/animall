import PropTypes from 'prop-types';
import useLanguage from '@/hooks/useLanguage';
import BottomSheet from '@/components/ui/BottomSheet';

// Language-picker bottom sheet matching the Pashu Mandi reference (image 7):
// 2-column grid of cards with landmark imagery on a dark scrim. Selected card
// gets a brand-600 border + ring. App supports 3 languages (mr / hi / en).
const LANGS = [
  {
    code: 'hi',
    label: 'हिंदी',
    sub: 'Hindi',
    // Lotus Temple (Delhi) — visual shorthand for Hindi-speaking India
    img: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&q=70&auto=format',
  },
  {
    code: 'en',
    label: 'English',
    sub: 'English',
    // Tower Bridge (London) — visual shorthand for English
    img: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&q=70&auto=format',
  },
  {
    code: 'mr',
    label: 'मराठी',
    sub: 'Marathi',
    // Gateway of India (Mumbai) — visual shorthand for Marathi-speaking Maharashtra
    img: 'https://images.unsplash.com/photo-1567252521265-2f7f4c9b7c8d?w=800&q=70&auto=format',
  },
];

export default function LanguageSheet({ open, onClose, value, onChange }) {
  const { tr } = useLanguage();
  return (
    <BottomSheet open={open} onClose={onClose}>
      <header className="text-center mb-1">
        <h2 className="text-h1 font-extrabold text-surface-900">Choose Language</h2>
        <p className="mt-1 text-body-sm text-surface-500">{tr('edit_profile_language') || 'Select your preferred language'}</p>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-3 pb-2">
        {LANGS.map((l, i) => {
          const active = value === l.code;
          const isOdd = LANGS.length % 2 === 1 && i === LANGS.length - 1;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => onChange?.(l.code)}
              aria-pressed={active}
              className={`
                relative aspect-[4/3] rounded-2xl overflow-hidden text-left
                ring-1 transition-all active:scale-[0.98]
                focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300
                ${active
                  ? 'ring-[3px] ring-brand-600 shadow-button'
                  : 'ring-surface-200 hover:ring-brand-400'}
                ${isOdd ? 'col-span-2 aspect-[16/7]' : ''}
              `}
            >
              <img
                src={l.img}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-white text-h1 font-extrabold leading-tight drop-shadow">
                  {l.label}
                </p>
                <p className="text-white/90 text-body-sm font-medium drop-shadow">{l.sub}</p>
              </div>
              {active && (
                <span className="absolute top-2.5 right-2.5 grid place-items-center h-7 w-7 rounded-full bg-brand-600 text-white text-body-sm font-bold shadow-md">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
}

LanguageSheet.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
};
