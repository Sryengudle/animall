import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// Floating action button anchored above the bottom navigation.
// Used on Buy / My Cattle to provide a persistent "Sell Livestock" path.
// Sized small enough not to compete with listing-card content or seller actions.
export default function StickyFAB({ to, onClick, icon, children, className = '' }) {
  const navigate = useNavigate();
  function handleClick() {
    if (to) navigate(to);
    else onClick?.();
  }
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        fixed right-3 bottom-[72px] z-50 inline-flex items-center gap-1.5
        px-3.5 py-2 rounded-full bg-brand-700 text-white font-bold text-caption
        shadow-lg shadow-brand-900/40 ring-2 ring-surface-0
        hover:bg-brand-800 active:scale-95
        transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300
        ${className}
      `}
    >
      {icon && <span aria-hidden="true" className="text-caption">{icon}</span>}
      {children}
    </button>
  );
}

StickyFAB.propTypes = {
  to: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
