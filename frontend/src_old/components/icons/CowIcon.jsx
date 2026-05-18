import PropTypes from 'prop-types';

// Simple cow silhouette icon. Matches the Pashu Mandi reference's Sell tab icon.
// Drawn to be lucide-react-compatible (accepts `size` + arbitrary svg props).
export default function CowIcon({ size = 24, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Horns */}
      <path
        d="M3.5 9.5 L2.5 6 M7.5 9.5 L8.5 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Head */}
      <rect x="2" y="10" width="6.5" height="8" rx="1.6" />
      {/* Body */}
      <rect x="7" y="13" width="20" height="10" rx="2" />
      {/* Tail */}
      <path d="M27 14 v6 q1 1.5 2 1 q1 -.6 -.4 -1.4 L27 18" />
      {/* Legs */}
      <rect x="9"  y="23" width="2" height="5" rx="0.5" />
      <rect x="13" y="23" width="2" height="5" rx="0.5" />
      <rect x="19" y="23" width="2" height="5" rx="0.5" />
      <rect x="23" y="23" width="2" height="5" rx="0.5" />
    </svg>
  );
}

CowIcon.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
};
