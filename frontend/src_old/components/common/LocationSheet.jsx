import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Loader2, LocateFixed, MapPin, Search } from 'lucide-react';
import toast from 'react-hot-toast';

import useLanguage from '@/hooks/useLanguage';
import BottomSheet from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui';
import { EMPTY_ADDRESS, hasAddress } from '@/utils/addressFormat';
import { lookupPincode } from '@/utils/pincodeLookup';
import {
  hasGoogleMapsKey,
  loadGoogleMaps,
  resultToAddress,
  reverseGeocode,
} from '@/utils/googleMaps';

// Location-picker bottom sheet — three entry methods feed into one structured
// address object: GPS, Google Places autocomplete (lazy-loaded only when an API
// key is configured), and India Post pincode lookup. Editable fields below let
// the user refine before saving.
//
// onSelect receives the full structured address:
//   { line1, area, city, district, state, pincode, lat, lng }
// (plus `formatted` — the one-line representation).

export default function LocationSheet({ open, onClose, onSelect, initial }) {
  const { tr } = useLanguage();
  const googleEnabled = hasGoogleMapsKey();

  const [addr, setAddr] = useState(() => ({ ...EMPTY_ADDRESS, ...(initial || {}) }));
  const [pincode, setPincode] = useState(initial?.pincode || '');
  const [pincodeOffices, setPincodeOffices] = useState([]);
  const [pinLoading, setPinLoading] = useState(false);
  const [pinError, setPinError] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [placesQuery, setPlacesQuery] = useState('');
  const placesInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Reset form whenever the sheet opens with a different initial value.
  useEffect(() => {
    if (!open) return;
    setAddr({ ...EMPTY_ADDRESS, ...(initial || {}) });
    setPincode(initial?.pincode || '');
    setPincodeOffices([]);
    setPinError('');
    setPlacesQuery('');
  }, [open, initial]);

  // Wire up Google Places Autocomplete only when a key is configured AND the
  // sheet is open (avoids burning quota on initial app load).
  useEffect(() => {
    if (!open || !googleEnabled) return;
    let cancelled = false;
    loadGoogleMaps()
      .then((google) => {
        if (cancelled || !placesInputRef.current) return;
        // Bias toward India — gives much better results for villages/talukas.
        const ac = new google.maps.places.Autocomplete(placesInputRef.current, {
          componentRestrictions: { country: 'in' },
          fields: ['address_components', 'geometry', 'formatted_address', 'name'],
          types: ['geocode'],
        });
        ac.addListener('place_changed', () => {
          const place = ac.getPlace();
          if (!place?.address_components) return;
          const parsed = resultToAddress(place);
          setAddr((a) => ({ ...a, ...parsed }));
          setPincode(parsed.pincode || '');
          setPlacesQuery(place.formatted_address || place.name || '');
        });
        autocompleteRef.current = ac;
      })
      .catch(() => {
        // Key invalid or network blocked — silently disable autocomplete; the
        // pincode + manual flow still works.
      });
    return () => {
      cancelled = true;
      autocompleteRef.current = null;
    };
  }, [open, googleEnabled]);

  function setField(k, v) {
    setAddr((a) => ({ ...a, [k]: v }));
  }

  function useGps() {
    if (!navigator.geolocation) {
      toast.error(tr('loc_geo_failed'));
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setField('lat', lat);
        setField('lng', lng);
        if (googleEnabled) {
          try {
            const parsed = await reverseGeocode({ lat, lng });
            setAddr((a) => ({ ...a, ...parsed }));
            if (parsed.pincode) setPincode(parsed.pincode);
          } catch {
            toast.error(tr('loc_geo_failed'));
          }
        } else {
          // No Google key — stash the coords; user fills the address fields by hand.
          toast.success(`${lat.toFixed(3)}, ${lng.toFixed(3)}`);
        }
        setGpsLoading(false);
      },
      (err) => {
        setGpsLoading(false);
        toast.error(err.code === err.PERMISSION_DENIED ? tr('loc_geo_denied') : tr('loc_geo_failed'));
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 },
    );
  }

  async function runPincodeLookup(code) {
    setPinError('');
    setPincodeOffices([]);
    if (!/^\d{6}$/.test(code)) return;
    setPinLoading(true);
    try {
      const offices = await lookupPincode(code);
      setPincodeOffices(offices);
      // Auto-apply if there's only one post office for this pincode.
      if (offices.length === 1) applyOffice(offices[0]);
    } catch (err) {
      setPinError(err.message === 'pincode_not_found' ? tr('loc_pincode_not_found') : tr('error_generic'));
    } finally {
      setPinLoading(false);
    }
  }

  function applyOffice(office) {
    setAddr((a) => ({
      ...a,
      area:     office.area,
      city:     office.city || office.area,
      district: office.district,
      state:    office.state,
      pincode:  office.pincode,
    }));
    setPincode(office.pincode);
  }

  function handlePincodeChange(e) {
    const code = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(code);
    if (code.length === 6) runPincodeLookup(code);
    else { setPincodeOffices([]); setPinError(''); }
  }

  const canSave = useMemo(() => hasAddress(addr), [addr]);

  function handleSave() {
    if (!canSave) {
      toast.error(tr('loc_required_fields'));
      return;
    }
    // Always sync pincode field back into the address shape on save.
    const finalAddr = { ...addr, pincode: pincode || addr.pincode || '' };
    onSelect?.(finalAddr);
    toast.success(tr('loc_address_saved'));
    onClose?.();
  }

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="space-y-5 max-h-[80vh] overflow-y-auto -mr-4 pr-4">
        <div>
          <h3 className="text-h2 text-surface-900">{tr('loc_set_your_location')}</h3>
          <p className="mt-1 text-body-sm text-surface-600">{tr('loc_set_your_location_sub')}</p>
        </div>

        {/* GPS button — primary entry for users on mobile */}
        <button
          type="button"
          onClick={useGps}
          disabled={gpsLoading}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-success/12 text-success font-bold border border-success/30 hover:bg-success/20 active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {gpsLoading ? <Loader2 size={18} className="animate-spin" /> : <LocateFixed size={18} />}
          {gpsLoading ? tr('loc_locating') : tr('loc_use_current')}
        </button>

        {/* Google Places autocomplete — only when API key is configured */}
        {googleEnabled && (
          <div>
            <label className="block text-body-sm font-bold text-surface-900 mb-2">
              {tr('loc_search_places')}
            </label>
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500" />
              <input
                ref={placesInputRef}
                type="text"
                value={placesQuery}
                onChange={(e) => setPlacesQuery(e.target.value)}
                placeholder={tr('loc_search_places')}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface-0 border border-surface-200 text-surface-900 placeholder:text-surface-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-colors"
              />
            </div>
            <p className="mt-1 text-micro !font-medium text-surface-500">{tr('loc_search_places_hint')}</p>
          </div>
        )}

        <div className="flex items-center gap-3">
          <span className="flex-1 h-px bg-surface-200" />
          <span className="text-micro text-surface-500">{tr('loc_or')}</span>
          <span className="flex-1 h-px bg-surface-200" />
        </div>

        {/* Pincode lookup */}
        <div>
          <label className="block text-body-sm font-bold text-surface-900 mb-2">
            {tr('loc_pincode_label')}
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={pincode}
              onChange={handlePincodeChange}
              placeholder="411001"
              className="w-full pl-4 pr-12 py-3 rounded-2xl bg-surface-0 border border-surface-200 text-surface-900 text-h3 tracking-widest focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-colors"
            />
            {pinLoading && (
              <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-700 animate-spin" />
            )}
          </div>
          <p className="mt-1 text-micro !font-medium text-surface-500">{tr('loc_pincode_hint')}</p>
          {pinError && <p className="mt-2 text-body-sm text-accent-700">{pinError}</p>}

          {pincodeOffices.length > 1 && (
            <div className="mt-3 space-y-2">
              <p className="text-body-sm font-bold text-surface-900">{tr('loc_pincode_pick_office')}</p>
              <div className="space-y-1.5 max-h-44 overflow-y-auto">
                {pincodeOffices.map((po, i) => {
                  const selected = addr.area === po.area;
                  return (
                    <button
                      key={`${po.area}-${i}`}
                      type="button"
                      onClick={() => applyOffice(po)}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-left transition-colors ${
                        selected
                          ? 'bg-brand-50 border-brand-300 text-brand-900'
                          : 'bg-surface-0 border-surface-200 hover:bg-surface-50'
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block text-body-sm font-bold truncate">{po.area}</span>
                        <span className="block text-caption text-surface-600 truncate">
                          {[po.city, po.district].filter(Boolean).join(' · ')}
                        </span>
                      </span>
                      {selected && <Check size={16} className="text-brand-700 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Editable fields — auto-filled by any of the methods above, also
            usable as a manual fallback */}
        <div className="space-y-3">
          <Field
            label={tr('loc_addr_house')}
            value={addr.line1}
            onChange={(v) => setField('line1', v)}
            placeholder={tr('loc_addr_house_ph')}
          />
          <Field
            label={tr('loc_addr_area')}
            value={addr.area}
            onChange={(v) => setField('area', v)}
            placeholder={tr('loc_addr_area_ph')}
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label={tr('loc_addr_city')}
              value={addr.city}
              onChange={(v) => setField('city', v)}
              placeholder={tr('loc_addr_city_ph')}
            />
            <Field
              label={tr('loc_addr_district')}
              value={addr.district}
              onChange={(v) => setField('district', v)}
              placeholder=""
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label={tr('loc_addr_state')}
              value={addr.state}
              onChange={(v) => setField('state', v)}
              placeholder=""
            />
            <Field
              label={tr('loc_addr_pincode')}
              value={pincode}
              onChange={(v) => {
                const code = v.replace(/\D/g, '').slice(0, 6);
                setPincode(code);
                setField('pincode', code);
              }}
              placeholder="411001"
              inputMode="numeric"
            />
          </div>
        </div>

        <div className="pt-2 sticky bottom-0 bg-surface-0">
          <Button
            type="button"
            size="lg"
            fullWidth
            onClick={handleSave}
            disabled={!canSave}
            className="!rounded-2xl !bg-brand-700 hover:!bg-brand-800"
          >
            <MapPin size={18} className="mr-1.5" />
            {tr('loc_save')}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}

function Field({ label, value, onChange, placeholder, inputMode }) {
  return (
    <div>
      <label className="block text-body-sm font-semibold text-surface-700 mb-1.5">{label}</label>
      <input
        type="text"
        inputMode={inputMode}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl bg-surface-0 border border-surface-200 text-surface-900 placeholder:text-surface-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-colors"
      />
    </div>
  );
}

LocationSheet.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  initial: PropTypes.object,
};
