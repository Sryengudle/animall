import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
  { label, error, hint, options, placeholder, className = '', id, children, ...rest },
  ref
) {
  const inputId = id || `sel-${rest.name || Math.random().toString(36).slice(2, 8)}`;
  const errored = Boolean(error);

  // Two call shapes are supported:
  //   <Select options={[{value,label}]} placeholder="…" />     ← preferred
  //   <Select>{<option>…</option>...}</Select>                  ← legacy
  // We render whichever the caller provided. If both are given, options wins.
  const renderedOptions = options && options.length > 0
    ? options.map(({ value, label: optLabel }) => (
        <option key={value} value={value}>{optLabel}</option>
      ))
    : children;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-body-sm font-semibold text-surface-800 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          aria-invalid={errored}
          className={`
            w-full px-4 py-3 pr-10 text-body text-surface-900 bg-surface-0 rounded-2xl border-2 outline-none
            appearance-none transition-all
            ${errored
              ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
              : 'border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100'}
          `}
          {...rest}
        >
          {placeholder && !options && <option value="">{placeholder}</option>}
          {options && placeholder && <option value="">{placeholder}</option>}
          {renderedOptions}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none"
          size={18}
        />
      </div>
      {errored && <p className="mt-1.5 text-caption font-semibold text-red-500">{error}</p>}
      {!errored && hint && <p className="mt-1.5 text-caption text-surface-500">{hint}</p>}
    </div>
  );
});

Select.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  hint: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })),
  placeholder: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  children: PropTypes.node,
};

export default Select;
