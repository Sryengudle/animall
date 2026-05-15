// Build a Google Maps deep link from a structured address (preferred) or a
// free-text location string. The `search` API form opens the native Maps app
// on iOS/Android when installed, and Google Maps in a new tab on desktop.
//
// Returns null if there's nothing useful to map, so callers can skip the link.

const BASE = 'https://www.google.com/maps/search/?api=1&query=';

export function mapsUrl({ address, location, lat, lng } = {}) {
  // 1. Coordinates win — most precise.
  if (typeof lat === 'number' && typeof lng === 'number' && !Number.isNaN(lat) && !Number.isNaN(lng)) {
    return `${BASE}${lat},${lng}`;
  }
  if (address && typeof address.lat === 'number' && typeof address.lng === 'number') {
    return `${BASE}${address.lat},${address.lng}`;
  }

  // 2. Structured address — join the parts that exist.
  if (address && typeof address === 'object') {
    const parts = [address.line1, address.area, address.city, address.district, address.state, address.pincode]
      .map((s) => (s || '').toString().trim())
      .filter(Boolean);
    if (parts.length > 0) return `${BASE}${encodeURIComponent(parts.join(', '))}`;
  }

  // 3. Fallback — free-text location string.
  const text = (location || '').toString().trim();
  if (!text) return null;
  return `${BASE}${encodeURIComponent(text)}`;
}
