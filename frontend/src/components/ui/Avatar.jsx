import PropTypes from 'prop-types';

const SIZES = {
  xs: 'w-7 h-7 text-caption',
  sm: 'w-9 h-9 text-body-sm',
  md: 'w-12 h-12 text-body',
  lg: 'w-16 h-16 text-h2',
  xl: 'w-24 h-24 text-display',
};

export default function Avatar({ src, name = '', size = 'md', className = '' }) {
  const initial = name?.trim()?.[0]?.toUpperCase() || '👤';
  return (
    <div
      className={`
        ${SIZES[size]} rounded-full overflow-hidden flex items-center justify-center
        bg-gradient-to-br from-accent-100 to-accent-300 text-accent-800 font-bold
        border-2 border-surface-0 shadow-sm ${className}
      `}
    >
      {src ? (
        <img src={src} alt={name || ''} className="w-full h-full object-cover" />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}

Avatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(Object.keys(SIZES)),
  className: PropTypes.string,
};
