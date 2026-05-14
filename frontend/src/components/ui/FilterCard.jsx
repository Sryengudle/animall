import PropTypes from 'prop-types';

// Premium-filter group card. Icon-circle + title + subtitle header, 2-col grid body.
// One FilterCard per facet (Milk Capacity, Price, Distance, etc.).
export default function FilterCard({ icon, title, subtitle, children, columns = 2 }) {
  const grid = columns === 1 ? 'grid-cols-1' : 'grid-cols-2';
  return (
    <section className="rounded-3xl bg-surface-0 shadow-card p-4 sm:p-5">
      <header className="flex items-start gap-3 mb-4">
        <div
          className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 text-xl shrink-0"
          aria-hidden="true"
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="text-base font-extrabold text-surface-900 leading-tight">{title}</h3>
          {subtitle && <p className="text-xs text-surface-500 mt-0.5">{subtitle}</p>}
        </div>
      </header>
      <div className={`grid ${grid} gap-2.5`}>{children}</div>
    </section>
  );
}

FilterCard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  children: PropTypes.node,
  columns: PropTypes.oneOf([1, 2]),
};
