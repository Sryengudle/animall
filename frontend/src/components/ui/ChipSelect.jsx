import PropTypes from 'prop-types';

// Selectable pill row. Single-select by default; multi-select with `multi` prop.
// Matches the Pashu Mandi reference: white inactive, light brand-50 active with darker border.
export default function ChipSelect({ options, value, onChange, multi = false, className = '' }) {
  function toggle(key) {
    if (multi) {
      const set = new Set(value || []);
      set.has(key) ? set.delete(key) : set.add(key);
      onChange?.([...set]);
    } else {
      onChange?.(key);
    }
  }

  function isActive(key) {
    if (multi) return (value || []).includes(key);
    return value === key;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((opt) => {
        const active = isActive(opt.key);
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => toggle(opt.key)}
            aria-pressed={active}
            className={`
              inline-flex items-center justify-center min-h-[40px] px-3.5 py-1.5 rounded-full
              text-caption !font-semibold transition-all duration-150 border-2 active:scale-95
              focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200
              ${active
                ? 'bg-brand-50 border-brand-400 text-brand-800 shadow-sm'
                : 'bg-surface-0 border-surface-200 text-surface-700 hover:border-brand-300'}
            `}
          >
            {opt.icon && <span className="mr-1.5 text-body-sm">{opt.icon}</span>}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

ChipSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      icon: PropTypes.node,
    }),
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  onChange: PropTypes.func,
  multi: PropTypes.bool,
  className: PropTypes.string,
};
