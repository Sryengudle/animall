import PropTypes from 'prop-types';

const TONES = {
  neutral: 'bg-surface-100 text-surface-700 border-surface-200',
  green:   'bg-green-50 text-green-700 border-green-200',
  teal:    'bg-primary-50 text-primary-700 border-primary-200',
  amber:   'bg-accent-50 text-accent-700 border-accent-200',
  blue:    'bg-blue-50 text-blue-700 border-blue-200',
  red:     'bg-red-50 text-red-600 border-red-200',
  purple:  'bg-purple-50 text-purple-700 border-purple-200',
};

export default function Badge({ tone = 'neutral', icon: Icon, children, className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-1 text-caption font-bold rounded-full border
        ${TONES[tone]} ${className}
      `}
    >
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}

Badge.propTypes = {
  tone: PropTypes.oneOf(Object.keys(TONES)),
  icon: PropTypes.elementType,
  children: PropTypes.node,
  className: PropTypes.string,
};
