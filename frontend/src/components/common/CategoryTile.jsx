import PropTypes from 'prop-types';

// Image-backed category card used on the Buy page top section.
// Renders a square-ish tile with a photo (or emoji fallback) and a label overlay.
// Label is text-xs to fit on one line at ~110px tile width (1/3 of 388px screen).
export default function CategoryTile({ label, image, selected, onClick, fallbackEmoji }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!selected}
      className={`
        relative aspect-[5/4] overflow-hidden rounded-2xl bg-brand-50/60
        ring-2 transition-all active:scale-[0.98]
        focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300
        ${selected ? 'ring-brand-600 shadow-md' : 'ring-transparent hover:ring-brand-300'}
      `}
    >
      {image ? (
        <img
          src={image}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      ) : (
        <span className="absolute inset-0 grid place-items-center text-4xl text-surface-400">
          {fallbackEmoji || '🐾'}
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 px-2 py-1.5 bg-gradient-to-t from-black/65 via-black/30 to-transparent">
        <span className="block text-white font-bold text-xs leading-tight drop-shadow text-center">
          {label}
        </span>
      </span>
    </button>
  );
}

CategoryTile.propTypes = {
  label: PropTypes.string.isRequired,
  image: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  fallbackEmoji: PropTypes.string,
};
