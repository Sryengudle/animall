import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary:   'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/20 hover:shadow-xl hover:from-primary-700 hover:to-primary-800 focus-visible:ring-primary-400',
  secondary: 'bg-surface-0 text-primary-700 border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50 focus-visible:ring-primary-300',
  success:   'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/20 hover:shadow-xl hover:from-green-600 hover:to-green-700 focus-visible:ring-green-400',
  ghost:     'bg-transparent text-surface-700 hover:bg-surface-100 focus-visible:ring-surface-300',
  danger:    'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20 hover:shadow-xl focus-visible:ring-red-400',
  whatsapp:  'bg-[#25D366] text-white shadow-lg shadow-primary-500/20 hover:bg-[#1ebe57] focus-visible:ring-primary-400',
  call:      'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl focus-visible:ring-blue-400',
};

const SIZES = {
  sm: 'h-9  px-3  text-body-sm rounded-xl',
  md: 'h-11 px-4  text-body-sm rounded-2xl',
  lg: 'h-14 px-5  text-body rounded-2xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  children,
  className = '',
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-bold
        transition-all duration-200 active:scale-[0.97]
        focus:outline-none focus-visible:ring-4
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        ${VARIANTS[variant]} ${SIZES[size]}
        ${fullWidth ? 'w-full' : ''} ${className}
      `}
      {...rest}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={size === 'lg' ? 20 : 16} />
      ) : LeftIcon ? (
        <LeftIcon size={size === 'lg' ? 20 : 16} />
      ) : null}
      <span>{children}</span>
      {!loading && RightIcon && <RightIcon size={size === 'lg' ? 20 : 16} />}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(Object.keys(VARIANTS)),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  leftIcon: PropTypes.elementType,
  rightIcon: PropTypes.elementType,
  children: PropTypes.node,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};
