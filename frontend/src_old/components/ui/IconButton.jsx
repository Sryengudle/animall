import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const SIZES = { sm: 'w-9 h-9', md: 'w-11 h-11', lg: 'w-14 h-14' };
const ICON_SIZE = { sm: 18, md: 20, lg: 24 };

const VARIANTS = {
  default: 'bg-surface-0 text-surface-700 border border-surface-200 hover:bg-surface-50 shadow-sm',
  primary: 'bg-primary-600 text-white shadow-lg hover:bg-primary-700',
  ghost:   'bg-transparent text-surface-600 hover:bg-surface-100',
  filled:  'bg-surface-100 text-surface-700 hover:bg-surface-200',
};

const IconButton = forwardRef(function IconButton(
  { icon: Icon, label, size = 'md', variant = 'default', className = '', ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={`
        inline-flex items-center justify-center rounded-full
        transition-all duration-200 active:scale-95
        focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-300
        ${SIZES[size]} ${VARIANTS[variant]} ${className}
      `}
      {...rest}
    >
      <Icon size={ICON_SIZE[size]} />
    </button>
  );
});

IconButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(Object.keys(VARIANTS)),
  className: PropTypes.string,
};

export default IconButton;
