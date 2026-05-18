import PropTypes from 'prop-types';

// Compact quick-filter card on the Buy page top section.
// Vertical layout (icon top, label middle, value bottom) so the label has the
// full tile width to breathe — at 388px screen, each tile is ~115px wide and
// labels like "Distance" + values like "All Capacity" need full width.
// Tap → opens PremiumFiltersSheet scrolled to the matching facet.
export default function QuickFilterTile({ icon: Icon, label, value, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`
        w-full flex flex-col items-center justify-center gap-1 rounded-2xl
        px-2 py-2.5 border-2 transition-all active:scale-[0.98] min-h-touch
        focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200
        ${active
          ? 'bg-surface-0 border-brand-600 shadow-card'
          : 'bg-surface-0 border-surface-200 hover:border-brand-300'}
      `}
    >
      <span
        className={`grid place-items-center w-7 h-7 rounded-full shrink-0
          ${active ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'}`}
      >
        <Icon size={16} />
      </span>
      <span className="block text-[11px] font-extrabold text-surface-900 leading-tight">
        {label}
      </span>
      <span className="block text-[10px] text-surface-500 truncate max-w-full leading-tight">
        {value}
      </span>
    </button>
  );
}

QuickFilterTile.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  active: PropTypes.bool,
  onClick: PropTypes.func,
};
