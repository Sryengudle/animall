import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const Textarea = forwardRef(function Textarea(
  { label, error, hint, className = '', id, rows = 4, ...rest },
  ref
) {
  const inputId = id || `ta-${rest.name || Math.random().toString(36).slice(2, 8)}`;
  const errored = Boolean(error);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-body-sm font-semibold text-surface-800 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        aria-invalid={errored}
        className={`
          w-full px-4 py-3 text-body text-surface-900 bg-surface-0 rounded-2xl border-2 outline-none resize-none
          transition-all placeholder:text-surface-400
          ${errored
            ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
            : 'border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100'}
        `}
        {...rest}
      />
      {errored && <p className="mt-1.5 text-caption font-semibold text-red-500">{error}</p>}
      {!errored && hint && <p className="mt-1.5 text-caption text-surface-500">{hint}</p>}
    </div>
  );
});

Textarea.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  hint: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  rows: PropTypes.number,
};

export default Textarea;
