import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Camera, MapPin, IndianRupee, Milk, Info, ChevronDown, Award, Repeat,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Header from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNav';
import LocationSheet from '@/components/common/LocationSheet';
import CowIcon from '@/components/icons/CowIcon';
import {
  ChipSelect,
  MediaUploadTile,
} from '@/components/ui';
import useLanguage from '@/hooks/useLanguage';
import { addAnimal, updateAnimal, fetchMyListings } from '@/store/slices/animalsSlice';
import { EMPTY_ADDRESS, formatAddress, hasAddress } from '@/utils/addressFormat';

// One page, two modes:
//   • Create: /sell  → dispatches addAnimal
//   • Edit:   /sell?edit=<animalId>  → prefills form from store, dispatches updateAnimal
// Edit mode treats the 3 media tiles as APPEND (uploading new images adds to
// the existing array — old media is preserved on the server side).

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

const MILK_TYPES = new Set(['cow', 'buffalo']);

function SectionHeader({ icon: Icon, label, required }) {
  return (
    <header className="flex items-center gap-2 mb-3">
      <span className="grid place-items-center w-7 h-7 rounded-lg bg-surface-100 text-surface-700">
        <Icon size={16} />
      </span>
      <h3 className="text-body-lg font-extrabold text-surface-900 leading-tight">{label}</h3>
      {required && <span className="text-accent-600 text-body-sm leading-none -mt-1">*</span>}
    </header>
  );
}

function Helper({ children }) {
  return (
    <p className="text-micro !font-medium normal-case tracking-normal text-surface-500 -mt-2 mb-3 pl-9">{children}</p>
  );
}

function SuffixedInput({ prefix, suffix, ...inputProps }) {
  return (
    <div className="flex items-stretch rounded-2xl bg-surface-0 border border-surface-200 overflow-hidden focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-colors">
      {prefix && (
        <span className="px-4 grid place-items-center bg-surface-50 text-surface-700 font-bold text-body-sm">
          {prefix}
        </span>
      )}
      <input
        {...inputProps}
        className="flex-1 px-4 py-3 outline-none border-none bg-transparent text-surface-900 placeholder:text-surface-400 text-body-sm font-medium min-w-0"
      />
      {suffix && (
        <span className="px-4 grid place-items-center bg-surface-100 text-surface-600 font-medium text-caption whitespace-nowrap">
          {suffix}
        </span>
      )}
    </div>
  );
}

function ToggleRow({ label, sub, value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      aria-pressed={value}
      className="w-full flex items-center justify-between gap-3 rounded-2xl bg-surface-0 border border-surface-200 px-4 py-3 hover:border-brand-300 transition-colors"
    >
      <div className="text-left min-w-0">
        <p className="text-caption !font-bold text-surface-900">{label}</p>
        {sub && <p className="text-micro !font-medium normal-case tracking-normal text-surface-500 mt-0.5">{sub}</p>}
      </div>
      <span
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${value ? 'bg-brand-600' : 'bg-surface-300'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-5' : ''}`}
        />
      </span>
    </button>
  );
}

export default function SellPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tr } = useLanguage();
  const { token, user } = useSelector((s) => s.auth);
  const myListings = useSelector((s) => s.animals.myListings);
  const [searchParams] = useSearchParams();

  const editingId = searchParams.get('edit');
  const isEditMode = !!editingId;
  const editingAnimal = isEditMode
    ? myListings.find((a) => a._id === editingId)
    : null;

  // Form state
  const [animal, setAnimal] = useState('cow');
  const [breed, setBreed] = useState('');
  const [lactation, setLactation] = useState('');
  const [milk, setMilk] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState({ ...EMPTY_ADDRESS, ...(user?.address || {}) });
  const [isNegotiable, setIsNegotiable] = useState(true);

  // Optional new media (uploaded → appended to existing on PUT, or required on POST)
  const [mainFile, setMainFile] = useState(null);
  const [udderFile, setUdderFile] = useState(null);
  const [milkingFile, setMilkingFile] = useState(null);

  // In edit mode: existing media URLs mapped to each tile slot. When the
  // seller clears an existing tile we collect the URLs in `removedImages` /
  // `removedVideo` so the backend can drop them on save.
  const [existingMain, setExistingMain] = useState(null);
  const [existingUdder, setExistingUdder] = useState(null);
  const [existingVideo, setExistingVideo] = useState(null);
  const [removedImages, setRemovedImages] = useState([]);
  const [removedVideo, setRemovedVideo] = useState(false);

  const [moreOpen, setMoreOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // In edit mode, fetch myListings if not loaded; prefill form once available.
  useEffect(() => {
    if (isEditMode && myListings.length === 0) dispatch(fetchMyListings());
  }, [isEditMode, myListings.length, dispatch]);

  // Create mode: default the listing location to the seller's profile address.
  // (Edit mode overrides this from the listing itself in the next effect.)
  useEffect(() => {
    if (isEditMode) return;
    if (hasAddress(user?.address) && !location) {
      setAddress({ ...EMPTY_ADDRESS, ...user.address });
      setLocation(formatAddress(user.address));
    }
  }, [isEditMode, user, location]);

  useEffect(() => {
    if (!editingAnimal) return;
    setAnimal(editingAnimal.type || 'cow');
    setBreed(editingAnimal.breed || '');
    setLactation(editingAnimal.calving || '');
    setMilk(editingAnimal.milkPerDay || '');
    setPrice(String(editingAnimal.price ?? ''));
    setDescription(editingAnimal.description || '');
    setLocation(editingAnimal.location || '');
    setIsNegotiable(editingAnimal.isNegotiable !== false);

    // Map existing media into the 3 tile slots so the seller can see what's
    // currently attached. images[0] → main photo, images[1] → udder photo,
    // videoUrl → milking video.
    const imgs = Array.isArray(editingAnimal.images) ? editingAnimal.images : [];
    setExistingMain(imgs[0] || null);
    setExistingUdder(imgs[1] || null);
    setExistingVideo(editingAnimal.videoUrl || null);
    setRemovedImages([]);
    setRemovedVideo(false);
  }, [editingAnimal]);

  const showMilk = MILK_TYPES.has(animal);
  const breedKeys = BREEDS_BY_TYPE[animal] || ['other'];

  // Validation: in create mode require a main photo; in edit mode it's optional
  // (existing media is preserved), but if the seller has cleared their existing
  // main photo without picking a new one, block submit.
  const hasMainMedia = mainFile || existingMain;
  const canPost = !!(
    animal && breed && price && location
    && (!showMilk || (lactation && milk))
    && (isEditMode ? hasMainMedia : mainFile)
  );

  function handleLocation(addr) {
    setAddress({ ...EMPTY_ADDRESS, ...addr });
    setLocation(formatAddress(addr));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canPost || submitting) return;
    setSubmitting(true);

    const fd = new FormData();
    fd.append('type', animal);
    fd.append('price', String(price));
    fd.append('location', location);
    fd.append('age', '3'); // placeholder until we add an age field to the form
    fd.append('ageUnit', 'years');
    fd.append('breed', breed);
    fd.append('isNegotiable', String(isNegotiable));
    if (showMilk) {
      fd.append('calving', lactation);
      fd.append('milkPerDay', milk);
    }
    fd.append('description', description);
    for (const f of [mainFile, udderFile, milkingFile]) {
      if (f) fd.append('images', f);
    }
    // Tell the backend which existing media (if any) to delete on this save.
    if (isEditMode) {
      if (removedImages.length > 0) fd.append('removeImages', removedImages.join(','));
      if (removedVideo) fd.append('removeVideo', 'true');
    }

    try {
      if (isEditMode) {
        await dispatch(updateAnimal({ id: editingId, formData: fd, token })).unwrap();
        toast.success(tr('done'));
      } else {
        await dispatch(addAnimal({ formData: fd, token })).unwrap();
        toast.success(tr('listing_added'));
      }
      navigate('/my-listings');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : tr('error_generic'));
    } finally {
      setSubmitting(false);
    }
  }

  const pageTitle = isEditMode ? tr('edit_listing') : tr('sell_livestock');
  const submitLabel = isEditMode ? tr('update_button') : tr('post_button');

  return (
    <div className="min-h-screen bg-surface-50 pb-44">
      {isEditMode ? <Header title={pageTitle} showBack /> : <Header />}

      <main className="mx-auto max-w-xl px-4 pt-5">
        {!isEditMode && (
          <h1 className="text-h2 font-extrabold text-surface-900 mb-4">{pageTitle}</h1>
        )}

        {isEditMode && editingAnimal && (
          <div className="mb-5 rounded-2xl bg-brand-50 border border-brand-200 px-4 py-3 flex items-center gap-3">
            <span className="grid place-items-center h-9 w-9 rounded-full bg-brand-700 text-white shrink-0">
              <Info size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-caption !font-extrabold text-brand-900 truncate">
                {tr('edit_listing')}
                {editingAnimal.breed && (
                  <span className="text-brand-800"> · {tr(`breed_${editingAnimal.type}_${editingAnimal.breed}`) || editingAnimal.breed.toUpperCase()}</span>
                )}
              </p>
              <p className="text-micro !font-medium normal-case tracking-normal text-brand-700">
                {tr('edit_existing_media_hint')}
              </p>
            </div>
          </div>
        )}

        {!isEditMode && (
          <div className="mb-6 rounded-2xl bg-surface-0 px-4 py-3 flex items-center gap-3 shadow-card">
            <Info size={18} className="text-brand-700 shrink-0" />
            <p className="text-caption !font-bold text-brand-800">{tr('free_to_list')}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          <section>
            <SectionHeader icon={CowIcon} label={tr('which_animal')} required />
            <ChipSelect
              value={animal}
              onChange={(v) => { setAnimal(v); setBreed(''); setLactation(''); }}
              options={ANIMAL_TYPES.map((a) => ({ key: a.key, label: tr(a.key) || a.label }))}
            />
          </section>

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
            <div className="mt-3">
              <ToggleRow
                label={tr('negotiable_toggle_label')}
                sub={tr('negotiable_toggle_sub')}
                value={isNegotiable}
                onChange={setIsNegotiable}
              />
            </div>
          </section>

          <section>
            <SectionHeader icon={Camera} label={tr('add_video_or_photo')} required={!isEditMode} />
            <Helper>{tr('add_video_or_photo_hint')}</Helper>
            <div className="grid grid-cols-2 gap-3">
              <MediaUploadTile
                kind="photo"
                label={tr('select_photo')}
                file={mainFile}
                existingUrl={existingMain}
                onFile={setMainFile}
                onRemoveExisting={() => {
                  if (existingMain) setRemovedImages((r) => [...r, existingMain]);
                  setExistingMain(null);
                }}
                onError={(m) => toast.error(m)}
              />
              <MediaUploadTile
                kind="photo"
                label={tr('select_udder_photo')}
                file={udderFile}
                existingUrl={existingUdder}
                onFile={setUdderFile}
                onRemoveExisting={() => {
                  if (existingUdder) setRemovedImages((r) => [...r, existingUdder]);
                  setExistingUdder(null);
                }}
                onError={(m) => toast.error(m)}
              />
              {/* Milking tile now accepts video — backend Multer was extended for video MIME types */}
              <MediaUploadTile
                kind="video"
                label={tr('add_milking_video')}
                fullWidth
                file={milkingFile}
                existingUrl={existingVideo}
                onFile={setMilkingFile}
                onRemoveExisting={() => {
                  setExistingVideo(null);
                  setRemovedVideo(true);
                }}
                onError={(m) => toast.error(m)}
              />
            </div>
            {isEditMode && (
              <p className="mt-2 text-micro !font-medium normal-case tracking-normal text-surface-500 pl-9">
                {tr('edit_existing_media_hint')}
              </p>
            )}
          </section>

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
                <label className="block text-caption !font-bold text-surface-900 mb-2">
                  {tr('detail_description')}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder={tr('sell_description_placeholder')}
                  className="w-full px-4 py-3 rounded-2xl bg-surface-50 border border-surface-200 text-surface-900 placeholder:text-surface-400 text-body-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-colors resize-none"
                />
              </div>
            )}
          </section>

          <section>
            <SectionHeader icon={MapPin} label={tr('location_label')} required />
            <Helper>{tr('location_helper')}</Helper>
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={tr('tell_your_location')}
                className="w-full pl-4 pr-24 py-3 rounded-2xl bg-surface-0 border border-surface-200 text-surface-900 placeholder:text-surface-500 text-body-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-colors"
              />
              <button
                type="button"
                onClick={() => setLocOpen(true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-caption !font-bold text-brand-700 hover:text-brand-800 px-2 py-1.5"
              >
                {tr('loc_change')}
              </button>
            </div>
          </section>
        </form>
      </main>

      {/* Sticky Post/Update button */}
      <div className="fixed bottom-[60px] left-0 right-0 z-30 bg-surface-0/95 backdrop-blur-sm border-t border-surface-200 px-4 py-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canPost || submitting}
          className={`w-full py-3.5 rounded-2xl font-bold text-body active:scale-95 transition-all
            ${canPost && !submitting
              ? 'bg-brand-700 text-white shadow-button hover:bg-brand-800'
              : 'bg-surface-200 text-surface-500 cursor-not-allowed'}`}
        >
          {submitting ? tr('loading') : submitLabel}
        </button>
      </div>

      <BottomNav />

      <LocationSheet
        open={locOpen}
        onClose={() => setLocOpen(false)}
        onSelect={handleLocation}
        initial={address}
      />
    </div>
  );
}
