import PropTypes from 'prop-types';
import { Check } from 'lucide-react';

// Two-line filter option pill used inside FilterCard's grid.
// Selected state: filled brand-700 with a small Check icon top-right.
// Unselected: subtle surface card with brand-tinted hover.
export default function FilterPill({ title, subtitle, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`
        relative w-full text-left rounded-xl px-3 py-2 transition-all duration-150 active:scale-[0.98]
        focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200
        ${selected
          ? 'bg-brand-700 text-white shadow-[0_4px_12px_-3px_rgba(15,80,55,0.35)] ring-1 ring-brand-800'
          : 'bg-surface-50 ring-1 ring-surface-200 hover:bg-brand-50/50 hover:ring-brand-200'}
      `}
    >
      {selected && (
        <span
          className="absolute top-1.5 right-1.5 grid place-items-center h-4 w-4 rounded-full bg-white/95 text-brand-700"
          aria-hidden="true"
        >
          <Check size={10} strokeWidth={3} />
        </span>
      )}
      <div className={`text-caption !font-bold leading-tight pr-4 ${selected ? 'text-white' : 'text-brand-800'}`}>
        {title}
      </div>
      {subtitle && (
        <div
          className={`text-micro !font-medium normal-case tracking-normal mt-0.5 pr-4 ${
            selected ? 'text-white/85' : 'text-surface-500'
          }`}
        >
          {subtitle}
        </div>
      )}
    </button>
  );
}

FilterPill.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
};
