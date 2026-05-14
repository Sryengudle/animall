import PropTypes from 'prop-types';

// Two-line filter option pill used inside FilterCard's grid.
// Pashu Mandi reference: inactive labels use brand color (dark maroon there → dark
// emerald for us), not gray. Selected fills with brand-700 + white text.
export default function FilterPill({ title, subtitle, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`
        w-full text-left rounded-2xl px-4 py-3 transition-all duration-150 active:scale-[0.98]
        focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200
        ${selected
          ? 'bg-brand-700 text-white shadow-md ring-1 ring-brand-800'
          : 'bg-surface-0 border border-surface-200 hover:border-brand-400 hover:bg-brand-50/40'}
      `}
    >
      <div className={`text-sm font-bold leading-tight ${selected ? 'text-white' : 'text-brand-800'}`}>
        {title}
      </div>
      {subtitle && (
        <div className={`text-xs mt-1 ${selected ? 'text-white/85' : 'text-brand-700/70'}`}>
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
