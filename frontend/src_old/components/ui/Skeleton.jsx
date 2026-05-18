import PropTypes from 'prop-types';

// Shimmering placeholder. Compose multiple Skeletons to mimic the final layout.
export default function Skeleton({ className = '', rounded = 'rounded-xl' }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-surface-200 ${rounded} ${className}`}
    >
      <span
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite]
                   bg-gradient-to-r from-transparent via-white/60 to-transparent"
      />
    </div>
  );
}

Skeleton.propTypes = {
  className: PropTypes.string,
  rounded: PropTypes.string,
};
