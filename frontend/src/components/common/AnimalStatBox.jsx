import PropTypes from 'prop-types';

/**
 * Compact label-over-value stat box used to render lactation, milk capacity,
 * and age on both the listing-card preview and the listing-detail page so
 * the two surfaces stay visually consistent.
 *
 * Sizing is deliberately tight — earlier the boxes were chunky enough to
 * push the seller row below the fold on the listing card. We trade a few
 * pixels of vertical breathing room for two clean rows the eye scans
 * instantly.
 */
export default function AnimalStatBox({ label, value }) {
  return (
    <div className="rounded-xl bg-brand-50/60 ring-1 ring-brand-100 px-2.5 py-1.5">
      <p className="text-[10px] !font-semibold normal-case tracking-normal text-surface-500 leading-none">
        {label}
      </p>
      <p className="mt-1 text-caption !font-bold text-surface-900 truncate leading-tight">
        {value}
      </p>
    </div>
  );
}

AnimalStatBox.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.node.isRequired,
};
