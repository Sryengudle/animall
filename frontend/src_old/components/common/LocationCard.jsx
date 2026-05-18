import PropTypes from 'prop-types';
import { MapPin } from 'lucide-react';
import useLanguage from '@/hooks/useLanguage';

// "Select Location" card at the top of the Buy page. Tap → opens LocationSheet
// (or fires onClick). Shows currently-selected location, or placeholder text.
export default function LocationCard({ value, onClick }) {
  const { tr } = useLanguage();
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between gap-3 rounded-2xl bg-surface-0 px-3 py-2.5 shadow-card border border-surface-200 hover:border-brand-300 active:scale-[0.99] transition-all"
    >
      <span className="flex items-center gap-2.5 min-w-0">
        <span className="grid place-items-center w-8 h-8 rounded-full bg-surface-100 text-surface-700 shrink-0">
          <MapPin size={16} />
        </span>
        <span className="min-w-0 text-left">
          <span className={`block text-body-sm font-bold truncate ${value ? 'text-surface-900' : 'text-surface-500'}`}>
            {value || tr('loc_select')}
          </span>
        </span>
      </span>
      <span className="text-caption font-bold text-brand-700 px-2.5 py-1 rounded-full bg-brand-50 hover:bg-brand-100 transition-colors shrink-0">
        {tr('loc_change')}
      </span>
    </button>
  );
}

LocationCard.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func,
};
