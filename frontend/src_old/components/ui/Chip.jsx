import PropTypes from 'prop-types';

// Selectable filter chip. Use for category strips, breed picks, etc.
export default function Chip({ active, onClick, children, icon, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`
        inline-flex items-center gap-1.5 px-4 py-2 text-body-sm font-semibold rounded-full border-2
        whitespace-nowrap flex-shrink-0 transition-all duration-200 active:scale-95
        focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200
        ${active
          ? 'bg-gradient-to-r from-primary-600 to-primary-700 border-transparent text-white shadow-md'
          : 'bg-surface-0 border-surface-200 text-surface-700 hover:border-primary-300 hover:bg-primary-50'}
        ${className}
      `}
    >
      {icon && <span className="text-body leading-none">{icon}</span>}
      {children}
    </button>
  );
}

Chip.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
  icon: PropTypes.node,
  className: PropTypes.string,
};
