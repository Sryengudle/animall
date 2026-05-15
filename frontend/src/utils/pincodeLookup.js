// India Post pincode lookup — free, no API key. Falls back when Google Maps
// isn't configured (or the user prefers typing their pincode over autocomplete).
// API docs: https://api.postalpincode.in/

const ENDPOINT = 'https://api.postalpincode.in/pincode/';

const cache = new Map();

export async function lookupPincode(pincode) {
  const code = String(pincode || '').trim();
  if (!/^\d{6}$/.test(code)) throw new Error('invalid_pincode');
  if (cache.has(code)) return cache.get(code);

  const res = await fetch(`${ENDPOINT}${code}`, { method: 'GET' });
  if (!res.ok) throw new Error('network_error');
  const json = await res.json();
  const block = Array.isArray(json) ? json[0] : null;
  if (!block || block.Status !== 'Success' || !Array.isArray(block.PostOffice) || !block.PostOffice.length) {
    throw new Error('pincode_not_found');
  }

  // Each post office becomes a selectable locality. Same district/state across
  // entries — only `area` (the post office name) differs.
  const offices = block.PostOffice.map((po) => ({
    area:     po.Name || '',
    city:     po.Block || po.Division || '',
    district: po.District || '',
    state:    po.State || '',
    pincode:  code,
    country:  po.Country || 'India',
  }));

  cache.set(code, offices);
  return offices;
}
