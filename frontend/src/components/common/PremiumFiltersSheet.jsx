import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import {
  Sparkles, Droplets, IndianRupee, MapPin, Tag, Calendar, ArrowDownNarrowWide, ShieldCheck,
} from 'lucide-react';

import useLanguage from '../../hooks/useLanguage';
import BottomSheet from '../ui/BottomSheet';
import FilterCard from '../ui/FilterCard';
import FilterPill from '../ui/FilterPill';
import Button from '../ui/Button';

// The 7 facets in the Pashu Mandi reference. Each facet's options are 2-line
// pills (title + optional subtitle) so the user can scan them without reading.
const ANIMAL_OPTS = [
  { key: 'all',     title: 'All Animals', subtitle: 'All kinds of animals' },
  { key: 'cow',     title: 'Cow',         subtitle: 'Dairy and milking cows' },
  { key: 'buffalo', title: 'Buffalo',     subtitle: 'High fat milk buffalo' },
  { key: 'other',   title: 'Other Animals', subtitle: 'Other available animals' },
];

const MILK_OPTS = [
  { key: 'all',   title: 'All Capacity', subtitle: 'All milk capacity' },
  { key: '0-5',   title: '0-5 Liters' },
  { key: '5-8',   title: '5-8 Liters' },
  { key: '8-10',  title: '8-10 Liters' },
  { key: '10-12', title: '10-12 Liters' },
  { key: '12-15', title: '12-15 Liters' },
  { key: '15-20', title: '15-20 Liters' },
  { key: '20+',   title: '20+ Liters' },
];

const PRICE_OPTS = [
  { key: 'all',    title: 'All Budget',     subtitle: 'Every price' },
  { key: '0-20k',  title: '₹0-₹20 Thousand' },
  { key: '20-50k', title: '₹20-₹50 Thousand' },
  { key: '50-80k', title: '₹50-₹80 Thousand' },
  { key: '80-99k', title: '₹80-₹99 Thousand' },
  { key: '1-1.5L', title: '₹1-₹1.5 Lakh' },
  { key: '1.5L+',  title: '₹1.5+ Lakh' },
];

const DISTANCE_OPTS = [
  { key: 'nearby', title: 'Nearby',   subtitle: 'Closest only' },
  { key: '25',     title: '25 km' },
  { key: '50',     title: '50 km' },
  { key: '100',    title: '100 km' },
  { key: '200',    title: '200 km' },
  { key: 'any',    title: 'Any distance' },
];

const LACTATION_OPTS = [
  { key: 'all',  title: 'All Lactations', subtitle: 'Every stage' },
  { key: 'none', title: 'Not Delivered',  subtitle: 'Not delivered yet' },
  { key: '1',    title: '1st Lactation',  subtitle: 'First lactation' },
  { key: '2',    title: '2nd Lactation',  subtitle: 'Second lactation' },
  { key: '3',    title: '3rd Lactation',  subtitle: 'Third lactation' },
  { key: '4+',   title: '4th+ Lactation', subtitle: 'Fourth or more' },
];

const LISTED_OPTS = [
  { key: 'any', title: 'Anytime',     subtitle: 'Every animal' },
  { key: '1h',  title: '1 Hour Ago',  subtitle: 'Fresh animals' },
  { key: '1d',  title: '1 Day Ago',   subtitle: "Today's animals" },
  { key: '2d',  title: '2 Days Ago',  subtitle: 'Recent animals' },
];

const SORT_OPTS = [
  { key: 'recent',   title: 'Most Recent', subtitle: 'New animals first' },
  { key: 'low',      title: 'Low Price',   subtitle: 'Cheapest animals first' },
  { key: 'nearest',  title: 'Nearest',     subtitle: 'Nearby animals first' },
  { key: 'farthest', title: 'Farthest',    subtitle: 'Far away animals first' },
];

export const DEFAULT_FILTERS = {
  animal:         'all',
  milkCapacity:   'all',
  price:          'all',
  distance:       'any',
  lactation:      'all',
  listed:         'any',
  sort:           'recent',
  nearbyOnly:     false,
  negotiableOnly: false,
};

function Toggle({ label, sub, value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!value)}
      aria-pressed={value}
      className="w-full flex items-center justify-between gap-3 rounded-2xl bg-surface-0 border border-surface-200 px-4 py-3 hover:border-brand-300 transition-colors"
    >
      <div className="text-left min-w-0">
        <p className="text-sm font-bold text-surface-900">{label}</p>
        {sub && <p className="text-xs text-surface-500 mt-0.5">{sub}</p>}
      </div>
      <span
        className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-brand-600' : 'bg-surface-300'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-5' : ''}`}
        />
      </span>
    </button>
  );
}

Toggle.propTypes = {
  label: PropTypes.string.isRequired,
  sub: PropTypes.string,
  value: PropTypes.bool,
  onChange: PropTypes.func,
};

export default function PremiumFiltersSheet({
  open,
  onClose,
  value,
  onApply,
  initialFocus,
}) {
  const { tr } = useLanguage();
  const [local, setLocal] = useState(value || DEFAULT_FILTERS);
  const sectionRefs = useRef({});

  // Sync from prop when opening with new filters
  useEffect(() => { if (open) setLocal(value || DEFAULT_FILTERS); }, [open, value]);

  // Scroll to the requested facet when the sheet opens with an initial focus.
  useEffect(() => {
    if (!open || !initialFocus) return;
    const t = setTimeout(() => {
      sectionRefs.current[initialFocus]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => clearTimeout(t);
  }, [open, initialFocus]);

  function set(k, v) { setLocal((f) => ({ ...f, [k]: v })); }

  function handleReset() { setLocal(DEFAULT_FILTERS); }
  function handleApply() { onApply?.(local); onClose?.(); }

  const dirty = JSON.stringify(local) !== JSON.stringify(DEFAULT_FILTERS);

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      footer={
        <div className="space-y-3">
          <p className="flex items-center justify-center gap-1.5 text-xs text-brand-700 font-semibold">
            <ShieldCheck size={14} />
            {dirty ? tr('filter_apply') : tr('filter_no_additional')}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={handleReset}>{tr('filter_reset')}</Button>
            <Button onClick={handleApply}>{tr('filter_apply')}</Button>
          </div>
        </div>
      }
    >
      <header className="-mt-1">
        <h2 className="text-2xl font-extrabold text-surface-900">{tr('premium_filters')}</h2>
        <p className="mt-1 text-sm text-surface-500">{tr('premium_filters_sub')}</p>
        <span className="mt-3 inline-block text-xs font-bold rounded-full bg-brand-50 text-brand-700 px-3 py-1.5 border border-brand-200">
          {tr('filter_all_animals_showing')}
        </span>
      </header>

      <div className="mt-5 space-y-4 pb-2">
        <div ref={(el) => (sectionRefs.current.animal = el)}>
          <FilterCard
            icon={<Sparkles size={22} />}
            title="Choose Animal"
            subtitle="Like outside quick cards, but more options here too"
          >
            {ANIMAL_OPTS.map((o) => (
              <FilterPill
                key={o.key}
                title={o.title}
                subtitle={o.subtitle}
                selected={local.animal === o.key}
                onClick={() => set('animal', o.key)}
              />
            ))}
          </FilterCard>
        </div>

        <div ref={(el) => (sectionRefs.current.milkCapacity = el)}>
          <FilterCard
            icon={<Droplets size={22} />}
            title="Milk Capacity"
            subtitle="Feed API supported ranges included"
          >
            {MILK_OPTS.map((o) => (
              <FilterPill
                key={o.key}
                title={o.title}
                subtitle={o.subtitle}
                selected={local.milkCapacity === o.key}
                onClick={() => set('milkCapacity', o.key)}
              />
            ))}
          </FilterCard>
        </div>

        <div ref={(el) => (sectionRefs.current.price = el)}>
          <FilterCard
            icon={<IndianRupee size={22} />}
            title="Price"
            subtitle="No typing needed, choose budget ranges directly"
          >
            {PRICE_OPTS.map((o) => (
              <FilterPill
                key={o.key}
                title={o.title}
                subtitle={o.subtitle}
                selected={local.price === o.key}
                onClick={() => set('price', o.key)}
              />
            ))}
          </FilterCard>
        </div>

        <div ref={(el) => (sectionRefs.current.distance = el)}>
          <FilterCard
            icon={<MapPin size={22} />}
            title="Distance & Location"
            subtitle="Choose preferred distance to view nearby animals quickly"
          >
            {DISTANCE_OPTS.map((o) => (
              <FilterPill
                key={o.key}
                title={o.title}
                subtitle={o.subtitle}
                selected={local.distance === o.key}
                onClick={() => set('distance', o.key)}
              />
            ))}
          </FilterCard>
        </div>

        <div ref={(el) => (sectionRefs.current.lactation = el)}>
          <FilterCard
            icon={<Tag size={22} />}
            title="Lactation Stage"
            subtitle="Shortlist by lactation stage"
          >
            {LACTATION_OPTS.map((o) => (
              <FilterPill
                key={o.key}
                title={o.title}
                subtitle={o.subtitle}
                selected={local.lactation === o.key}
                onClick={() => set('lactation', o.key)}
              />
            ))}
          </FilterCard>
        </div>

        <div ref={(el) => (sectionRefs.current.listed = el)}>
          <FilterCard
            icon={<Calendar size={22} />}
            title="When Animal Listed"
            subtitle="Choose new or recent animals first"
            columns={1}
          >
            {LISTED_OPTS.map((o) => (
              <FilterPill
                key={o.key}
                title={o.title}
                subtitle={o.subtitle}
                selected={local.listed === o.key}
                onClick={() => set('listed', o.key)}
              />
            ))}
          </FilterCard>
        </div>

        <div ref={(el) => (sectionRefs.current.sort = el)}>
          <FilterCard
            icon={<ArrowDownNarrowWide size={22} />}
            title="Sort & Additional Options"
            subtitle="Set order of animals shown and deal conditions"
          >
            {SORT_OPTS.map((o) => (
              <FilterPill
                key={o.key}
                title={o.title}
                subtitle={o.subtitle}
                selected={local.sort === o.key}
                onClick={() => set('sort', o.key)}
              />
            ))}
          </FilterCard>
          <div className="mt-3 space-y-2.5">
            <Toggle
              label="Nearby Only"
              sub="When off, all distance animals will show"
              value={local.nearbyOnly}
              onChange={(v) => set('nearbyOnly', v)}
            />
            <Toggle
              label="Negotiable Only"
              sub="Only show animals where bargaining is possible"
              value={local.negotiableOnly}
              onChange={(v) => set('negotiableOnly', v)}
            />
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}

PremiumFiltersSheet.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  value: PropTypes.object,
  onApply: PropTypes.func,
  initialFocus: PropTypes.oneOf([
    'animal', 'milkCapacity', 'price', 'distance', 'lactation', 'listed', 'sort',
  ]),
};
