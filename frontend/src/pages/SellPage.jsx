import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Camera, MapPin, IndianRupee, Milk, Info, ChevronDown, Award, Repeat,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Header from '../components/common/Header';
import BottomNav from '../components/common/BottomNav';
import LocationSheet from '../components/common/LocationSheet';
import CowIcon from '../components/icons/CowIcon';
import {
  ChipSelect,
  MediaUploadTile,
} from '../components/ui';
import useLanguage from '../hooks/useLanguage';
import { addAnimal } from '../store/slices/animalsSlice';

// ── Constants
const ANIMAL_TYPES = [
  { key: 'cow',     label: 'Cow' },
  { key: 'buffalo', label: 'Buffalo' },
  { key: 'goat',    label: 'Goat' },
  { key: 'sheep',   label: 'Sheep' },
  { key: 'chicken', label: 'Chicken' },
];

const BREEDS_BY_TYPE = {
  cow:     ['jersey_cross', 'hf', 'gir', 'sahiwal', 'khillar', 'other'],
  buffalo: ['murrah', 'jaffarabadi', 'haryana', 'surti', 'mehsana', 'other'],
  goat:    ['osmanabadi', 'sangamneri', 'berari', 'other'],
  sheep:   ['deccani', 'other'],
  chicken: ['desi', 'other'],
};

const LACTATIONS = [
  { key: 'none',   label: 'Not delivered' },
  { key: 'first',  label: 'First' },
  { key: 'second', label: 'Second' },
  { key: 'third',  label: 'Third' },
];

// Cow / Buffalo are the only types with milk + lactation fields
const MILK_TYPES = new Set(['cow', 'buffalo']);

// ── Sub-components inside this file (one-off)
function SectionHeader({ icon: Icon, label, required }) {
  return (
    <header className="flex items-center gap-2 mb-3">
      <span className="grid place-items-center w-7 h-7 rounded-lg bg-surface-100 text-surface-700">
        <Icon size={18} />
      </span>
      <h3 className="text-base font-extrabold text-surface-900 leading-tight">{label}</h3>
      {required && <span className="text-accent-600 text-base leading-none -mt-1">*</span>}
    </header>
  );
}

function Helper({ children }) {
  return (
    <p className="text-xs text-surface-500 -mt-2 mb-3 pl-9">{children}</p>
  );
}

function SuffixedInput({ prefix, suffix, ...inputProps }) {
  return (
    <div className="flex items-stretch rounded-2xl bg-surface-0 border border-surface-200 overflow-hidden focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-colors">
      {prefix && (
        <span className="px-4 grid place-items-center bg-surface-50 text-surface-700 font-bold">
          {prefix}
        </span>
      )}
      <input
        {...inputProps}
        className="flex-1 px-4 py-3.5 outline-none border-none bg-transparent text-surface-900 placeholder:text-surface-400 text-base font-medium min-w-0"
      />
      {suffix && (
        <span className="px-4 grid place-items-center bg-surface-100 text-surface-600 font-medium text-sm whitespace-nowrap">
          {suffix}
        </span>
      )}
    </div>
  );
}

export default function SellPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tr } = useLanguage();
  const { token } = useSelector((s) => s.auth);

  const [animal, setAnimal] = useState('cow');
  const [breed, setBreed] = useState('');
  const [lactation, setLactation] = useState('');
  const [milk, setMilk] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  // V1: backend's /api/animals only accepts photos via `images[]`. Video upload
  // requires a backend extension — TODO in `services/storage.py`. So all three
  // tiles are `kind='photo'` until then. Labels still match the reference layout.
  const [mainFile, setMainFile] = useState(null);
  const [udderFile, setUdderFile] = useState(null);
  const [milkingFile, setMilkingFile] = useState(null);

  const [moreOpen, setMoreOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const showMilk = MILK_TYPES.has(animal);
  const breedKeys = BREEDS_BY_TYPE[animal] || ['other'];

  const canPost = !!(animal && breed && price && location && mainFile && (!showMilk || (lactation && milk)));

  function handleLocation(payload) {
    if (payload.kind === 'pincode') setLocation(`PIN ${payload.pincode}`);
    else if (payload.kind === 'address') setLocation(payload.address);
    else if (payload.kind === 'gps') setLocation(`${payload.coords.lat.toFixed(3)}, ${payload.coords.lng.toFixed(3)}`);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canPost || submitting) return;
    setSubmitting(true);

    const fd = new FormData();
    fd.append('type', animal);
    fd.append('price', String(price));
    fd.append('location', location);
    fd.append('age', '3');               // placeholder default until we add an age field
    fd.append('ageUnit', 'years');
    fd.append('breed', breed);
    if (showMilk) {
      fd.append('calving', lactation);
      fd.append('milkPerDay', milk);
    }
    fd.append('description', description);
    for (const f of [mainFile, udderFile, milkingFile]) {
      if (f) fd.append('images', f);
    }

    try {
      await dispatch(addAnimal({ formData: fd, token })).unwrap();
      toast.success(tr('listing_added'));
      navigate('/my-listings');
    } catch {
      toast.error(tr('error_generic'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-50 pb-44">
      <Header />

      <main className="mx-auto max-w-xl px-4 pt-5">
        <h1 className="text-2xl font-extrabold text-surface-900 mb-4">{tr('sell_livestock')}</h1>

        {/* FREE info banner — single translated string, bold + brand color signals "free" */}
        <div className="mb-6 rounded-2xl bg-surface-0 px-4 py-3 flex items-center gap-3 shadow-card">
          <Info size={18} className="text-brand-700 shrink-0" />
          <p className="text-sm font-bold text-brand-800">
            {tr('free_to_list')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Which animal */}
          <section>
            <SectionHeader icon={CowIcon} label={tr('which_animal')} required />
            <ChipSelect
              value={animal}
              onChange={(v) => { setAnimal(v); setBreed(''); setLactation(''); }}
              options={ANIMAL_TYPES.map((a) => ({ key: a.key, label: tr(a.key) || a.label }))}
            />
          </section>

          {/* Breed */}
          <section>
            <SectionHeader icon={Award} label={tr('breed_label')} required />
            <ChipSelect
              value={breed}
              onChange={setBreed}
              options={breedKeys.map((b) => ({
                key: b,
                label: (tr(`breed_${animal}_${b}`) || b).toUpperCase(),
              }))}
            />
          </section>

          {/* Lactation — cow/buffalo only */}
          {showMilk && (
            <section>
              <SectionHeader icon={Repeat} label={tr('which_lactation')} required />
              <ChipSelect
                value={lactation}
                onChange={setLactation}
                options={LACTATIONS.map((l) => ({ key: l.key, label: tr(`calving_${l.key}`) || l.label }))}
              />
            </section>
          )}

          {/* Milk — cow/buffalo only */}
          {showMilk && (
            <section>
              <SectionHeader icon={Milk} label={tr('current_milk_per_day')} required />
              <Helper>{tr('current_milk_helper')}</Helper>
              <SuffixedInput
                type="number"
                inputMode="numeric"
                value={milk}
                onChange={(e) => setMilk(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="10"
                suffix={tr('litre')}
              />
            </section>
          )}

          {/* Price */}
          <section>
            <SectionHeader icon={IndianRupee} label={tr('price_label')} required />
            <Helper>{tr('price_helper')}</Helper>
            <SuffixedInput
              type="number"
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="40,000"
              prefix="₹"
              suffix={tr('rupees')}
            />
          </section>

          {/* Media — 3 tiles */}
          <section>
            <SectionHeader icon={Camera} label={tr('add_video_or_photo')} required />
            <Helper>{tr('add_video_or_photo_hint')}</Helper>
            <div className="grid grid-cols-2 gap-3">
              {/* Main photo (will accept video too once backend supports it) */}
              <MediaUploadTile
                kind="photo"
                label={tr('select_photo')}
                file={mainFile}
                onFile={setMainFile}
                onError={(m) => toast.error(m)}
              />
              <MediaUploadTile
                kind="photo"
                label={tr('select_udder_photo')}
                file={udderFile}
                onFile={setUdderFile}
                onError={(m) => toast.error(m)}
              />
              <MediaUploadTile
                kind="photo"
                label={tr('add_milking_video')}
                fullWidth
                file={milkingFile}
                onFile={setMilkingFile}
                onError={(m) => toast.error(m)}
              />
            </div>
          </section>

          {/* Add more information (accordion) */}
          <section>
            <button
              type="button"
              onClick={() => setMoreOpen((o) => !o)}
              className="w-full flex items-center justify-between gap-3 rounded-2xl bg-surface-0 border-2 border-brand-200 px-4 py-3.5 text-brand-800 font-bold shadow-card active:scale-[0.99] transition-transform"
            >
              <span>{tr('add_more_information')}</span>
              <ChevronDown
                size={20}
                className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {moreOpen && (
              <div className="mt-3 rounded-2xl bg-surface-0 p-4 shadow-card">
                <label className="block text-sm font-bold text-surface-900 mb-2">
                  {tr('detail_description')}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder={tr('sell_description_placeholder')}
                  className="w-full px-4 py-3 rounded-2xl bg-surface-50 border border-surface-200 text-surface-900 placeholder:text-surface-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-colors resize-none"
                />
              </div>
            )}
          </section>

          {/* Location */}
          <section>
            <SectionHeader icon={MapPin} label={tr('location_label')} required />
            <Helper>{tr('location_helper')}</Helper>
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={tr('tell_your_location')}
                className="w-full pl-4 pr-24 py-3.5 rounded-2xl bg-surface-0 border border-surface-200 text-surface-900 placeholder:text-surface-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-colors"
              />
              <button
                type="button"
                onClick={() => setLocOpen(true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-brand-700 hover:text-brand-800 px-2 py-1.5"
              >
                {tr('loc_change')}
              </button>
            </div>
          </section>
        </form>
      </main>

      {/* Sticky Post button (sits above BottomNav).
          Disabled state uses surface-200 bg + surface-500 text so it's always
          clearly readable — earlier bg-brand-200/60 + text-white/70 made the
          label invisible. */}
      <div className="fixed bottom-[60px] left-0 right-0 z-30 bg-surface-0/95 backdrop-blur-sm border-t border-surface-200 px-4 py-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canPost || submitting}
          className={`w-full py-3.5 rounded-2xl font-bold text-base active:scale-95 transition-all
            ${canPost && !submitting
              ? 'bg-brand-700 text-white shadow-button hover:bg-brand-800'
              : 'bg-surface-200 text-surface-500 cursor-not-allowed'}`}
        >
          {submitting ? tr('loading') : tr('post_button')}
        </button>
      </div>

      <BottomNav />

      <LocationSheet
        open={locOpen}
        onClose={() => setLocOpen(false)}
        onSelect={handleLocation}
      />
    </div>
  );
}
