import { Navigate } from 'react-router-dom';

// The redesign uses a 3-tab bottom nav: Buy · Sell · My Cattle.
// There is no separate "Home" anymore — the root path forwards to /buy,
// which is the new home tab. File kept (vs deleted) so existing imports and
// the lazy-loaded chunk stay valid; can delete after grep confirms no callers.
export default function HomePage() {
  return <Navigate to="/buy" replace />;
}
