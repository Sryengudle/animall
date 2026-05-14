import { NavLink } from 'react-router-dom';
import useLanguage from '../../hooks/useLanguage';
import { BOTTOM_NAV_ITEMS } from '../../constants/nav';

// 3-tab flat bottom navigation matching the Pashu Mandi reference.
// Buy · Sell · My Cattle. Active tab uses brand-800 color (no top bar — reference
// is flat). Sell tab gets a slightly larger icon + bold label for visual anchor.
export default function BottomNav() {
  const { tr } = useLanguage();

  return (
    <nav
      role="navigation"
      aria-label={tr('nav_my_cattle')}
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface-0 border-t border-surface-200 safe-bottom"
    >
      <ul className="flex items-stretch justify-around px-2 pt-2 pb-1.5">
        {BOTTOM_NAV_ITEMS.map(({ key, to, icon: Icon, labelKey, emphasis }) => (
          <li key={key} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              aria-label={tr(labelKey)}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1.5 px-1
                 min-h-touch justify-center rounded-2xl
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300
                 transition-colors
                 ${isActive ? 'text-brand-800' : 'text-surface-500 hover:text-surface-700'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={emphasis ? 30 : 24}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={isActive ? 'scale-105 transition-transform' : 'transition-transform'}
                  />
                  <span
                    className={`text-[11px] tracking-wide ${
                      emphasis || isActive ? 'font-bold' : 'font-semibold'
                    }`}
                  >
                    {tr(labelKey)}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
