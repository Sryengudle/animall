// Helpers for rendering the structured `User.address` shape used across the
// app. Keep these here so every page formats addresses the same way.

export const EMPTY_ADDRESS = {
  line1: '', area: '', city: '', district: '', state: '', pincode: '',
  lat: null, lng: null,
};

// Full address, comma-joined. e.g. "Plot 12, Indiranagar, Nashik, Maharashtra, 422001"
export function formatAddress(addr) {
  if (!addr) return '';
  return [addr.line1, addr.area, addr.city, addr.district, addr.state, addr.pincode]
    .map((s) => (s || '').toString().trim())
    .filter(Boolean)
    .join(', ');
}

// Two-line compact form for cards / small chips.
// e.g. "Indiranagar, Nashik" — falls back through area → city → district → pincode.
export function shortAddress(addr) {
  if (!addr) return '';
  const primary = addr.area || addr.city || addr.district;
  const secondary = addr.district && addr.district !== primary ? addr.district : addr.state;
  return [primary, secondary].filter(Boolean).join(', ');
}

// True if the user has captured a usable address (anything that lets a buyer
// figure out roughly where the animal is).
export function hasAddress(addr) {
  if (!addr) return false;
  return Boolean(addr.pincode || addr.city || addr.area || addr.district);
}
