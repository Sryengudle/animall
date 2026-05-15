import PropTypes from 'prop-types';

// Premium-filter group card. Icon-badge + title + subtitle header, then a
// 2-col grid of FilterPill children below.
// Visual style matches the buyer-facing ListingCard and the seller-facing
// SectionCard so the whole app reads as one design system: rounded-2xl,
// emerald-tinted layered shadow, subtle surface ring.
export default function FilterCard({ icon, title, subtitle, children, columns = 2 }) {
  const grid = columns === 1 ? 'grid-cols-1' : 'grid-cols-2';
  return (
    <section className="rounded-2xl bg-surface-0 p-4 ring-1 ring-surface-200/70 shadow-[0_2px_8px_-3px_rgba(15,80,55,0.08)]">
      <header className="flex items-center gap-2.5 mb-3">
        <span
          className="grid h-8 w-8 place-items-center rounded-lg bg-brand-100 text-brand-700 shrink-0"
          aria-hidden="true"
        >
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-body-sm font-extrabold text-surface-900 leading-tight">{title}</h3>
          {subtitle && (
            <p className="text-micro !font-medium normal-case tracking-normal text-surface-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </header>
      <div className={`grid ${grid} gap-2`}>{children}</div>
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
