import { SearchCheck, Notebook } from 'lucide-react';
import CowIcon from '../components/icons/CowIcon';

// 3-tab bottom navigation (Pashu Mandi-style flat layout).
// Buy uses SearchCheck (magnifier with a small check) — closest to the
// reference's magnifier+plus glyph. Sell uses our custom cow silhouette so
// livestock is unmistakable. My Cattle uses Notebook for the receipt/list feel.
export const BOTTOM_NAV_ITEMS = [
  { key: 'buy',       to: '/buy',         icon: SearchCheck, labelKey: 'nav_buy' },
  { key: 'sell',      to: '/sell',        icon: CowIcon,     labelKey: 'nav_sell',     emphasis: true },
  { key: 'my_cattle', to: '/my-listings', icon: Notebook,    labelKey: 'nav_my_cattle' },
];
