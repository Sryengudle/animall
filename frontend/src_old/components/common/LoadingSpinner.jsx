import PropTypes from 'prop-types';

const SIZES = {
  sm: 'h-6 w-6 border-[3px]',
  md: 'h-10 w-10 border-4',
  lg: 'h-16 w-16 border-4',
};

export default function LoadingSpinner({ size = 'md', className = '' }) {
  return (
    <div className={`flex justify-center items-center py-8 ${className}`} role="status" aria-live="polite">
      <div className={`${SIZES[size]} animate-spin rounded-full border-primary-200 border-t-primary-600`} />
      <span className="sr-only">Loading</span>
    </div>
  );
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};
