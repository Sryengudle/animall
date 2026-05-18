// Convert PremiumFiltersSheet state → URL query params for GET /api/animals.
// Distance, milkCapacity, and nearbyOnly/farthest sort stay client-side because
// the backend has no geo data and milkPerDay is a free string (would need
// aggregation). BuyPage applies those after fetch.

const PRICE_RANGES = {
  '0-20k':  [0, 20_000],
  '20-50k': [20_000, 50_000],
  '50-80k': [50_000, 80_000],
  '80-99k': [80_000, 99_000],
  '1-1.5L': [1_00_000, 1_50_000],
  '1.5L+':  [1_50_000, null],
};

const WITHIN_HOURS = { '1h': 1, '1d': 24, '2d': 48 };

const SORT_TO_BACKEND = {
  recent: 'newest',
  low:    'priceAsc',
  // 'nearest' / 'farthest' fall through to default newest; BuyPage re-sorts.
};

// Animal type — 'all' clears the filter, 'other' explodes into a comma list of
// non-cow/buffalo types, anything else passes through.
function typeParam(animal) {
  if (!animal || animal === 'all') return null;
  if (animal === 'other') return 'goat,sheep,chicken,pig,other';
  return animal;
}

export function filtersToQuery(filters) {
  const params = {};
  if (!filters) return params;

  const t = typeParam(filters.animal);
  if (t) params.type = t;

  const priceRange = PRICE_RANGES[filters.price];
  if (priceRange) {
    const [min, max] = priceRange;
    if (min != null) params.minPrice = String(min);
    if (max != null) params.maxPrice = String(max);
  }

  if (filters.lactation && filters.lactation !== 'all') {
    params.lactation = filters.lactation;
  }

  const hours = WITHIN_HOURS[filters.listed];
  if (hours) params.within = String(hours);

  const sortBackend = SORT_TO_BACKEND[filters.sort];
  if (sortBackend) params.sort = sortBackend;

  if (filters.negotiableOnly) params.negotiable = 'true';

  return params;
}
