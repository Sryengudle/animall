import PropTypes from 'prop-types';

// Small two-line stat block. Used inside ListingCard for Lactation, Milk Capacity, etc.
export default function StatTile({ label, value, className = '' }) {
  return (
    <div className={`rounded-2xl bg-brand-50/60 px-3 py-2 ${className}`}>
      <div className="text-micro-caps text-surface-500">{label}</div>
      <div className="text-caption !font-bold text-surface-900 mt-0.5 leading-tight">{value}</div>
    </div>
  );
}

StatTile.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.node.isRequired,
  className: PropTypes.string,
};
