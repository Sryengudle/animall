import PropTypes from 'prop-types';

// Category card used on the Buy page top row. Each tile shows a big animal
// emoji on a type-specific tinted gradient. We dropped the photo-based design
// because the buffalo and "other" photos were unreliable across viewports
// (failed loads left blank tiles) — a vector emoji is instant, identical for
// every user, and farmer-friendly across literacy levels.
const PALETTE = {
  cow:     'from-brand-50 via-brand-100 to-brand-200/70  text-brand-900 ring-brand-200',
  buffalo: 'from-slate-100 via-slate-200 to-slate-300/70 text-slate-800 ring-slate-300',
  other:   'from-accent-50 via-accent-100 to-accent-200/80 text-accent-900 ring-accent-200',
};
const SELECTED = {
  cow:     'from-brand-100 via-brand-200 to-brand-300/70   ring-brand-500',
  buffalo: 'from-slate-200 via-slate-300 to-slate-400/70   ring-slate-500',
  other:   'from-accent-100 via-accent-200 to-accent-300/80 ring-accent-500',
};

export default function CategoryTile({ label, typeKey = 'cow', selected, onClick, emoji }) {
  const paletteKey = PALETTE[typeKey] ? typeKey : 'other';
  const idle = PALETTE[paletteKey];
  const active = SELECTED[paletteKey];

  // `emoji` may be a single emoji or an array — the "Other" tile passes a
  // cluster (goat + sheep + chicken + pig) so farmers see it represents
  // multiple animal types at once.
  const emojis = Array.isArray(emoji) ? emoji : [emoji];
  const single = emojis.length === 1;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!selected}
      className={`
        relative aspect-[5/4] overflow-hidden rounded-2xl
        bg-gradient-to-br ${selected ? active : idle}
        ring-1 transition-all active:scale-[0.98]
        focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300
        ${selected ? 'shadow-[0_4px_14px_-4px_rgba(15,80,55,0.25)]' : 'hover:ring-2'}
      `}
    >
      <span
        className="absolute inset-0 flex items-center justify-center gap-[1px] select-none px-1"
        style={{ marginTop: '-8px', lineHeight: 1 }}
        aria-hidden="true"
      >
        {single ? (
          <span style={{ fontSize: '54px' }}>{emojis[0]}</span>
        ) : (
          // Cluster: two staggered rows so up to 4 emojis fit without
          // shrinking too much. First row gets the smaller pair, second
          // (offset down + scaled up slightly) the dominant pair.
          <span
            className="grid grid-cols-2 gap-x-0.5 gap-y-0"
            style={{ fontSize: '30px' }}
          >
            {emojis.slice(0, 4).map((e, i) => (
              <span
                key={i}
                className="leading-none"
                style={{ transform: i % 2 === 0 ? 'translateY(-2px)' : 'translateY(2px)' }}
              >
                {e}
              </span>
            ))}
          </span>
        )}
      </span>
      <span className="absolute inset-x-0 bottom-0 px-2 py-1.5 bg-surface-0/80 backdrop-blur-[2px]">
        <span className="block text-caption !font-extrabold text-surface-900 leading-tight text-center">
          {label}
        </span>
      </span>
      {selected && (
        <span
          className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-700 ring-2 ring-white"
          aria-hidden="true"
        />
      )}
    </button>
  );
}

CategoryTile.propTypes = {
  label: PropTypes.string.isRequired,
  typeKey: PropTypes.oneOf(['cow', 'buffalo', 'other']),
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  emoji: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
};
