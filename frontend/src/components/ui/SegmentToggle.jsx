import PropTypes from 'prop-types';

// Pill-shaped segmented control. Used for the En|हिं|मर language toggle in the profile header.
export default function SegmentToggle({ options, value, onChange, className = '' }) {
  return (
    <div className={`inline-flex items-center bg-brand-50 rounded-full p-1 gap-0.5 ${className}`} role="group">
      {options.map((opt) => {
        const active = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange?.(opt.key)}
            aria-pressed={active}
            className={`
              min-h-[36px] px-3 rounded-full text-caption font-bold transition-all
              focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300
              ${active ? 'bg-brand-600 text-white shadow-sm' : 'text-brand-700 hover:text-brand-900'}
            `}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

SegmentToggle.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({ key: PropTypes.string.isRequired, label: PropTypes.node.isRequired }),
  ).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
};
