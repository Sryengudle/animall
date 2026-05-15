// Lazy loader for the Google Maps JavaScript SDK (Places + Geocoder).
// Activates only when VITE_GOOGLE_MAPS_API_KEY is set — without a key, callers
// fall back to GPS coords + India Post pincode lookup (see pincodeLookup.js).

const KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

let loadPromise = null;

export function hasGoogleMapsKey() {
  return Boolean(KEY);
}

export function loadGoogleMaps() {
  if (!KEY) return Promise.reject(new Error('no_google_maps_key'));
  if (window.google?.maps?.places && window.google?.maps?.Geocoder) {
    return Promise.resolve(window.google);
  }
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-google-maps]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google));
      existing.addEventListener('error', () => reject(new Error('google_maps_load_failed')));
      return;
    }
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(KEY)}&libraries=places&v=weekly&loading=async`;
    s.async = true;
    s.defer = true;
    s.dataset.googleMaps = '1';
    s.onload = () => resolve(window.google);
    s.onerror = () => reject(new Error('google_maps_load_failed'));
    document.head.appendChild(s);
  });

  return loadPromise;
}

// Reverse geocode a {lat,lng} via Google. Returns a structured address shape
// matching backend `User.address` so we can dispatch directly.
export async function reverseGeocode({ lat, lng }) {
  const google = await loadGoogleMaps();
  const geocoder = new google.maps.Geocoder();
  const { results } = await geocoder.geocode({ location: { lat, lng } });
  if (!results?.length) throw new Error('geocode_empty');
  return resultToAddress(results[0], { lat, lng });
}

// Convert a google.maps.GeocoderResult / PlaceResult → our address shape.
export function resultToAddress(result, fallbackCoords) {
  const comps = result.address_components || [];
  const find = (type) => comps.find((c) => c.types?.includes(type))?.long_name || '';
  const findShort = (type) => comps.find((c) => c.types?.includes(type))?.short_name || '';

  const streetNumber = find('street_number');
  const route = find('route');
  const subloc1 = find('sublocality_level_1') || find('sublocality') || find('neighborhood');
  const locality = find('locality') || find('postal_town');
  const adminLvl2 = find('administrative_area_level_2');
  const adminLvl1 = find('administrative_area_level_1');
  const country = findShort('country');
  const pincode = find('postal_code');

  const loc = result.geometry?.location;
  const lat = typeof loc?.lat === 'function' ? loc.lat() : (loc?.lat ?? fallbackCoords?.lat ?? null);
  const lng = typeof loc?.lng === 'function' ? loc.lng() : (loc?.lng ?? fallbackCoords?.lng ?? null);

  return {
    line1:    [streetNumber, route].filter(Boolean).join(' '),
    area:     subloc1,
    city:     locality,
    district: adminLvl2,
    state:    adminLvl1,
    pincode,
    lat,
    lng,
    country,
  };
}
