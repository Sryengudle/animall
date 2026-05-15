import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, hint, leftAddon, rightAddon, icon: Icon, className = '', id, ...rest },
  ref
) {
  const inputId = id || `in-${rest.name || Math.random().toString(36).slice(2, 8)}`;
  const errored = Boolean(error);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-body-sm font-semibold text-surface-800 mb-1.5">
          {label}
        </label>
      )}
      <div
        className={`
          flex items-stretch overflow-hidden rounded-2xl border-2 bg-surface-0 transition-all
          ${errored
            ? 'border-red-400 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-100'
            : 'border-surface-200 focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-100'}
        `}
      >
        {leftAddon && (
          <div className="flex items-center px-3 bg-surface-50 border-r border-surface-200 text-surface-600 font-semibold text-body-sm">
            {leftAddon}
          </div>
        )}
        {Icon && (
          <div className="flex items-center pl-3 text-surface-400">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={errored}
          aria-describedby={errored ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className="flex-1 min-w-0 px-3 py-3 text-body text-surface-900 bg-surface-0 outline-none placeholder:text-surface-400"
          {...rest}
        />
        {rightAddon && (
          <div className="flex items-center px-3 bg-surface-50 border-l border-surface-200 text-surface-600 font-semibold text-body-sm">
            {rightAddon}
          </div>
        )}
      </div>
      {errored && (
        <p id={`${inputId}-error`} className="mt-1.5 text-caption font-semibold text-red-500">
          {error}
        </p>
      )}
      {!errored && hint && (
        <p id={`${inputId}-hint`} className="mt-1.5 text-caption text-surface-500">
          {hint}
        </p>
      )}
    </div>
  );
});

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  hint: PropTypes.string,
  leftAddon: PropTypes.node,
  rightAddon: PropTypes.node,
  icon: PropTypes.elementType,
  className: PropTypes.string,
  id: PropTypes.string,
};

export default Input;
