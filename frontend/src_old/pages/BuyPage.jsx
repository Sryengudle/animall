import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Droplets, IndianRupee, MapPin } from 'lucide-react';

import Header from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNav';
import ListingCard from '@/components/common/ListingCard';
import LocationCard from '@/components/common/LocationCard';
import CategoryTile from '@/components/common/CategoryTile';
import QuickFilterTile from '@/components/common/QuickFilterTile';
import LocationSheet from '@/components/common/LocationSheet';
import PremiumFiltersSheet, { DEFAULT_FILTERS } from '@/components/common/PremiumFiltersSheet';

import { StickyFAB } from '@/components/ui';
import useLanguage from '@/hooks/useLanguage';
import { fetchAnimals } from '@/store/slices/animalsSlice';
import { DEMO_ANIMALS } from '@/constants/demoAnimals';
import { filtersToQuery } from '@/utils/filtersToQuery';
import { EMPTY_ADDRESS, hasAddress, shortAddress } from '@/utils/addressFormat';

// Pashu Mandi-style Buy page. Location → categories → quick filters → listings.
// Uses ListingCard (rich card with photos, stats, icon-only Call + WhatsApp).
// Demo data fills in whenever the API returns nothing — page is never blank.

const MILK_RANGES = {
  'all':   [0, Infinity],
  '0-5':   [0, 5],
  '5-8':   [5, 8],
  '8-10':  [8, 10],
  '10-12': [10, 12],
  '12-15': [12, 15],
  '15-20': [15, 20],
  '20+':   [20, Infinity],
};

const PRICE_RANGES = {
  'all':    [0, Infinity],
  '0-20k':  [0, 20_000],
  '20-50k': [20_000, 50_000],
  '50-80k': [50_000, 80_000],
  '80-99k': [80_000, 99_000],
  '1-1.5L': [1_00_000, 1_50_000],
  '1.5L+':  [1_50_000, Infinity],
};

const DISTANCE_KM = {
  'nearby': 25, '25': 25, '50': 50, '100': 100, '200': 200, 'any': Infinity,
};

const LACTATION_MATCH = {
  '1':    (s) => /^1\s/i.test(s),
  '2':    (s) => /^2\s/i.test(s),
  '3':    (s) => /^3\s/i.test(s),
  '4+':   (s) => /^[4-9]\s/i.test(s),
  'none': (s) => !s || /not/i.test(s),
};

const LISTED_HOURS = { 'any': Infinity, '1h': 1, '1d': 24, '2d': 48 };

// Client-side residual filter — only the facets the backend can't handle:
//   • milkCapacity range (backend stores milkPerDay as a string)
//   • distance (no geo data on the schema)
//   • nearbyOnly + nearest/farthest sort (same reason)
// Everything else (type, price, lactation, within, negotiable, sort newest/priceAsc)
// is already applied server-side via filtersToQuery — we just refine here.
function applyClientResiduals(list, f) {
  let arr = list.filter((a) => {
    if (f.milkCapacity !== 'all' && MILK_RANGES[f.milkCapacity]) {
      const [lo, hi] = MILK_RANGES[f.milkCapacity];
      const milk = Number(a.milkPerDay) || 0;
      if (milk < lo || milk > hi) return false;
    }
    if (f.distance !== 'any' && DISTANCE_KM[f.distance] != null) {
      if (a.distanceKm != null && a.distanceKm > DISTANCE_KM[f.distance]) return false;
    }
    if (f.nearbyOnly && a.distanceKm != null && a.distanceKm > 50) return false;
    return true;
  });

  // Geo-based sorts (server can't do these without coordinates)
  if (f.sort === 'nearest') {
    arr = [...arr].sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
  } else if (f.sort === 'farthest') {
    arr = [...arr].sort((a, b) => (b.distanceKm ?? -1) - (a.distanceKm ?? -1));
  }
  return arr;
}

// CategoryTile data — each tile renders a big emoji on its own brand-tinted
// gradient via CategoryTile's `typeKey` palette. Photo backgrounds were
// retired because the buffalo + other images failed to load reliably and
// left blank tiles in production.
const CATEGORY_TILES = [
  { key: 'cow',     labelKey: 'cow',                     emoji: '🐄' },
  { key: 'buffalo', labelKey: 'buffalo',                 emoji: '🐃' },
  // "Other" shows a cluster so the farmer sees at a glance that this group
  // covers multiple species — goat, sheep, chicken, and pig.
  { key: 'other',   labelKey: 'category_other_animals',  emoji: ['🐐', '🐑', '🐔', '🐖'] },
];

// Filter-value labels — the all/any defaults route through i18n. Range strings
// ("0-5 L", "₹0-20K") stay literal since numbers + ₹ travel fine across scripts.
const MILK_VALUE = {
  '0-5': '0-5 L', '5-8': '5-8 L', '8-10': '8-10 L',
  '10-12': '10-12 L', '12-15': '12-15 L', '15-20': '15-20 L', '20+': '20+ L',
};
const PRICE_VALUE = {
  '0-20k': '₹0-20K', '20-50k': '₹20-50K', '50-80k': '₹50-80K',
  '80-99k': '₹80-99K', '1-1.5L': '₹1-1.5L', '1.5L+': '₹1.5L+',
};
const DISTANCE_VALUE = {
  nearby: 'Nearby', '25': '25 km', '50': '50 km', '100': '100 km', '200': '200 km',
};

export default function BuyPage() {
  const dispatch = useDispatch();
  const { tr } = useLanguage();
  const { list: apiAnimals = [] } = useSelector((s) => s.animals);
  const { user } = useSelector((s) => s.auth);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [address, setAddress] = useState({ ...EMPTY_ADDRESS, ...(user?.address || {}) });
  const [locOpen, setLocOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersFocus, setFiltersFocus] = useState(null);

  // Pre-fill BuyPage location chip from the seller's saved profile address (if any).
  useEffect(() => {
    if (hasAddress(user?.address) && !hasAddress(address)) {
      setAddress({ ...EMPTY_ADDRESS, ...user.address });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Refetch on every filter change — backend handles type / price / lactation
  // / within / sort / negotiable. The query string contains only what the
  // server understands; client-side residuals apply on top.
  useEffect(() => {
    dispatch(fetchAnimals(filtersToQuery(filters)));
  }, [dispatch, filters]);

  const sourceAnimals = apiAnimals.length > 0 ? apiAnimals : DEMO_ANIMALS;
  const filtered = useMemo(
    () => applyClientResiduals(sourceAnimals, filters),
    [sourceAnimals, filters],
  );

  function openFilters(focus) {
    setFiltersFocus(focus || null);
    setFiltersOpen(true);
  }

  function handleLocation(addr) {
    setAddress({ ...EMPTY_ADDRESS, ...addr });
  }
  const locationLabel = shortAddress(address);

  function pickCategory(k) {
    if (k === 'other') openFilters('animal');
    else setFilters((f) => ({ ...f, animal: f.animal === k ? 'all' : k }));
  }

  // Stat tiles already show "Lactation" / "ब्यांत" as the label, so the value
  // is just the count number. Avoids the redundant "ब्यांत · 2 ब्यांत" look.
  function formatLactation(label) {
    if (!label) return '';
    return String(label).match(/^\d+/)?.[0] || label;
  }

  // Map a stored animal record → the localized strings the card expects.
  // Breed + calving are stored as canonical keys (e.g. "murrah", "first") so
  // we look up the matching i18n string instead of showing the raw English.
  function localizedCardProps(a) {
    const breedKey = a.breed ? `breed_${a.type}_${a.breed}` : null;
    const breedLabel = breedKey ? tr(breedKey) : '';
    const calvingLabel = a.lactationLabel
      ? formatLactation(a.lactationLabel)
      : (a.calving ? tr(`calving_${a.calving}`) || a.calving : '');
    return {
      title: a.title || breedLabel || tr(a.type) || '',
      breedLabel,
      calvingLabel,
    };
  }

  return (
    <div className="min-h-screen bg-surface-50 pb-28">
      <Header />

      <main className="mx-auto max-w-xl px-4 pt-4 space-y-4">
        <LocationCard value={locationLabel} onClick={() => setLocOpen(true)} />

        <div className="grid grid-cols-3 gap-2.5">
          {CATEGORY_TILES.map((c) => (
            <CategoryTile
              key={c.key}
              label={tr(c.labelKey)}
              emoji={c.emoji}
              typeKey={c.key}
              selected={filters.animal === c.key}
              onClick={() => pickCategory(c.key)}
            />
          ))}
        </div>

        {/* <div className="grid grid-cols-3 gap-2.5">
          <QuickFilterTile
            icon={Droplets}
            label={tr('filter_milk')}
            value={MILK_VALUE[filters.milkCapacity] || tr('filter_all_capacity')}
            active={filters.milkCapacity !== 'all'}
            onClick={() => openFilters('milkCapacity')}
          />
          <QuickFilterTile
            icon={IndianRupee}
            label={tr('filter_price')}
            value={PRICE_VALUE[filters.price] || tr('filter_all_budget')}
            active={filters.price !== 'all'}
            onClick={() => openFilters('price')}
          />
          <QuickFilterTile
            icon={MapPin}
            label={tr('filter_distance')}
            value={DISTANCE_VALUE[filters.distance] || tr('filter_any_distance')}
            active={filters.distance !== 'any'}
            onClick={() => openFilters('distance')}
          />
        </div> */}

        <div className="flex items-center justify-between border-t border-surface-200 pt-3 -mx-1 px-1">
          <p className="text-caption font-bold uppercase tracking-wider text-surface-500">
            {tr('filter_all_animals_showing')}
          </p>
          <p className="text-caption font-bold uppercase tracking-wider text-surface-500">
            {filtered.length}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-surface-500">
            <p className="text-display mb-2">🐾</p>
            <p className="text-body-sm font-medium">{tr('no_animals_match')}</p>
            <button
              type="button"
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="mt-3 px-4 py-2 rounded-full bg-brand-700 text-white text-body-sm font-bold hover:bg-brand-800"
            >
              {tr('filter_reset')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((a) => {
              const localized = localizedCardProps(a);
              return (
                <ListingCard
                  key={a._id}
                  id={a._id}
                  title={localized.title}
                  type={tr(a.type) || a.type}
                  typeKey={a.type}
                  breedLabel={localized.breedLabel}
                  age={a.age}
                  ageUnit={a.ageUnit}
                  description={a.description}
                  price={a.price}
                  isNegotiable={a.isNegotiable}
                  location={a.location}
                  distanceKm={a.distanceKm}
                  lactationLabel={localized.calvingLabel}
                  milkPerDay={a.milkPerDay}
                  images={a.images}
                  videoUrl={a.videoUrl}
                  posterUrl={a.posterUrl}
                  sellerName={a.sellerName}
                  sellerPhone={a.sellerPhone}
                  createdAt={a.createdAt}
                />
              );
            })}
          </div>
        )}
      </main>

      <StickyFAB to="/sell" icon="🐄">
        {tr('sell_livestock')}
      </StickyFAB>

      <BottomNav />

      <LocationSheet
        open={locOpen}
        onClose={() => setLocOpen(false)}
        onSelect={handleLocation}
        initial={address}
      />

      <PremiumFiltersSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={filters}
        onApply={setFilters}
        initialFocus={filtersFocus}
      />
    </div>
  );
}
