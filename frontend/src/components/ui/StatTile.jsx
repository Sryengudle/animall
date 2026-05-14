import PropTypes from 'prop-types';

// Small two-line stat block. Used inside ListingCard for Lactation, Milk Capacity, etc.
export default function StatTile({ label, value, className = '' }) {
  return (
    <div className={`rounded-2xl bg-brand-50/60 px-3.5 py-2.5 ${className}`}>
      <div className="text-[11px] font-medium text-surface-500 uppercase tracking-wide">{label}</div>
      <div className="text-sm font-bold text-surface-900 mt-0.5 leading-tight">{value}</div>
    </div>
  );
}

StatTile.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.node.isRequired,
  className: PropTypes.string,
};
