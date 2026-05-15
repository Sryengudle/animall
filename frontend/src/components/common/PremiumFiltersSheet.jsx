import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import {
  Sparkles, Droplets, IndianRupee, MapPin, Tag, Calendar, ArrowDownNarrowWide, ShieldCheck,
} from 'lucide-react';

import useLanguage from '@/hooks/useLanguage';
import BottomSheet from '@/components/ui/BottomSheet';
import FilterCard from '@/components/ui/FilterCard';
import FilterPill from '@/components/ui/FilterPill';
import Button from '@/components/ui/Button';

// The 7 facets in the Pashu Mandi reference. Each option's title/subtitle is
// referenced by i18n key so the sheet renders in the user's language.
const ANIMAL_OPTS = [
  { key: 'all',     t: 'pfs_animal_all_t',     s: 'pfs_animal_all_s' },
  { key: 'cow',     t: 'cow',                  s: 'pfs_animal_cow_s' },
  { key: 'buffalo', t: 'buffalo',              s: 'pfs_animal_buffalo_s' },
  { key: 'other',   t: 'category_other_animals', s: 'pfs_animal_other_s' },
];

const MILK_OPTS = [
  { key: 'all',   t: 'pfs_milk_all_t',  s: 'pfs_milk_all_s' },
  { key: '0-5',   t: 'pfs_milk_0_5' },
  { key: '5-8',   t: 'pfs_milk_5_8' },
  { key: '8-10',  t: 'pfs_milk_8_10' },
  { key: '10-12', t: 'pfs_milk_10_12' },
  { key: '12-15', t: 'pfs_milk_12_15' },
  { key: '15-20', t: 'pfs_milk_15_20' },
  { key: '20+',   t: 'pfs_milk_20p' },
];

const PRICE_OPTS = [
  { key: 'all',    t: 'pfs_price_all_t', s: 'pfs_price_all_s' },
  { key: '0-20k',  t: 'pfs_price_0_20k' },
  { key: '20-50k', t: 'pfs_price_20_50k' },
  { key: '50-80k', t: 'pfs_price_50_80k' },
  { key: '80-99k', t: 'pfs_price_80_99k' },
  { key: '1-1.5L', t: 'pfs_price_1_15L' },
  { key: '1.5L+',  t: 'pfs_price_15Lp' },
];

const DISTANCE_OPTS = [
  { key: 'nearby', t: 'pfs_dist_nearby_t', s: 'pfs_dist_nearby_s' },
  { key: '25',     t: 'pfs_dist_25' },
  { key: '50',     t: 'pfs_dist_50' },
  { key: '100',    t: 'pfs_dist_100' },
  { key: '200',    t: 'pfs_dist_200' },
  { key: 'any',    t: 'pfs_dist_any' },
];

const LACTATION_OPTS = [
  { key: 'all',  t: 'pfs_lact_all_t',  s: 'pfs_lact_all_s' },
  { key: 'none', t: 'pfs_lact_none_t', s: 'pfs_lact_none_s' },
  { key: '1',    t: 'pfs_lact_1_t',    s: 'pfs_lact_1_s' },
  { key: '2',    t: 'pfs_lact_2_t',    s: 'pfs_lact_2_s' },
  { key: '3',    t: 'pfs_lact_3_t',    s: 'pfs_lact_3_s' },
  { key: '4+',   t: 'pfs_lact_4p_t',   s: 'pfs_lact_4p_s' },
];

const LISTED_OPTS = [
  { key: 'any', t: 'pfs_listed_any_t', s: 'pfs_listed_any_s' },
  { key: '1h',  t: 'pfs_listed_1h_t',  s: 'pfs_listed_1h_s' },
  { key: '1d',  t: 'pfs_listed_1d_t',  s: 'pfs_listed_1d_s' },
  { key: '2d',  t: 'pfs_listed_2d_t',  s: 'pfs_listed_2d_s' },
];

const SORT_OPTS = [
  { key: 'recent',   t: 'pfs_sort_recent_t',   s: 'pfs_sort_recent_s' },
  { key: 'low',      t: 'pfs_sort_low_t',      s: 'pfs_sort_low_s' },
  { key: 'nearest',  t: 'pfs_sort_nearest_t',  s: 'pfs_sort_nearest_s' },
  { key: 'farthest', t: 'pfs_sort_farthest_t', s: 'pfs_sort_farthest_s' },
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

// Render helper — passes a localized FilterPill from an option spec.
function L({ tr, opt, selected, onClick }) {
  return (
    <FilterPill
      title={tr(opt.t)}
      subtitle={opt.s ? tr(opt.s) : undefined}
      selected={selected}
      onClick={onClick}
    />
  );
}

L.propTypes = {
  tr: PropTypes.func.isRequired,
  opt: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
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
        <p className="text-caption !font-bold text-surface-900">{label}</p>
        {sub && <p className="text-micro !font-medium normal-case tracking-normal text-surface-500 mt-0.5">{sub}</p>}
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
          <p className="flex items-center justify-center gap-1.5 text-caption text-brand-700 font-semibold">
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
        <h2 className="text-h2 font-extrabold text-surface-900">{tr('premium_filters')}</h2>
        <p className="mt-1 text-caption text-surface-500">{tr('premium_filters_sub')}</p>
        <span className="mt-3 inline-block text-micro !font-bold rounded-full bg-brand-50 text-brand-700 px-3 py-1.5 border border-brand-200">
          {tr('filter_all_animals_showing')}
        </span>
      </header>

      <div className="mt-5 space-y-4 pb-2">
        <div ref={(el) => (sectionRefs.current.animal = el)}>
          <FilterCard
            icon={<Sparkles size={22} />}
            title={tr('pfs_section_animal_t')}
            subtitle={tr('pfs_section_animal_s')}
          >
            {ANIMAL_OPTS.map((o) => (
              <L key={o.key} tr={tr} opt={o} selected={local.animal === o.key} onClick={() => set('animal', o.key)} />
            ))}
          </FilterCard>
        </div>

        <div ref={(el) => (sectionRefs.current.milkCapacity = el)}>
          <FilterCard
            icon={<Droplets size={22} />}
            title={tr('pfs_section_milk_t')}
            subtitle={tr('pfs_section_milk_s')}
          >
            {MILK_OPTS.map((o) => (
              <L key={o.key} tr={tr} opt={o} selected={local.milkCapacity === o.key} onClick={() => set('milkCapacity', o.key)} />
            ))}
          </FilterCard>
        </div>

        <div ref={(el) => (sectionRefs.current.price = el)}>
          <FilterCard
            icon={<IndianRupee size={22} />}
            title={tr('pfs_section_price_t')}
            subtitle={tr('pfs_section_price_s')}
          >
            {PRICE_OPTS.map((o) => (
              <L key={o.key} tr={tr} opt={o} selected={local.price === o.key} onClick={() => set('price', o.key)} />
            ))}
          </FilterCard>
        </div>

        <div ref={(el) => (sectionRefs.current.distance = el)}>
          <FilterCard
            icon={<MapPin size={22} />}
            title={tr('pfs_section_distance_t')}
            subtitle={tr('pfs_section_distance_s')}
          >
            {DISTANCE_OPTS.map((o) => (
              <L key={o.key} tr={tr} opt={o} selected={local.distance === o.key} onClick={() => set('distance', o.key)} />
            ))}
          </FilterCard>
        </div>

        <div ref={(el) => (sectionRefs.current.lactation = el)}>
          <FilterCard
            icon={<Tag size={22} />}
            title={tr('pfs_section_lactation_t')}
            subtitle={tr('pfs_section_lactation_s')}
          >
            {LACTATION_OPTS.map((o) => (
              <L key={o.key} tr={tr} opt={o} selected={local.lactation === o.key} onClick={() => set('lactation', o.key)} />
            ))}
          </FilterCard>
        </div>

        <div ref={(el) => (sectionRefs.current.listed = el)}>
          <FilterCard
            icon={<Calendar size={22} />}
            title={tr('pfs_section_listed_t')}
            subtitle={tr('pfs_section_listed_s')}
            columns={1}
          >
            {LISTED_OPTS.map((o) => (
              <L key={o.key} tr={tr} opt={o} selected={local.listed === o.key} onClick={() => set('listed', o.key)} />
            ))}
          </FilterCard>
        </div>

        <div ref={(el) => (sectionRefs.current.sort = el)}>
          <FilterCard
            icon={<ArrowDownNarrowWide size={22} />}
            title={tr('pfs_section_sort_t')}
            subtitle={tr('pfs_section_sort_s')}
          >
            {SORT_OPTS.map((o) => (
              <L key={o.key} tr={tr} opt={o} selected={local.sort === o.key} onClick={() => set('sort', o.key)} />
            ))}
          </FilterCard>
          <div className="mt-3 space-y-2.5">
            <Toggle
              label={tr('pfs_toggle_nearby_t')}
              sub={tr('pfs_toggle_nearby_s')}
              value={local.nearbyOnly}
              onChange={(v) => set('nearbyOnly', v)}
            />
            <Toggle
              label={tr('pfs_toggle_negotiable_t')}
              sub={tr('pfs_toggle_negotiable_s')}
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
