import PropTypes from 'prop-types';
import { useState } from 'react';
import { MapPin, LocateFixed } from 'lucide-react';
import useLanguage from '../../hooks/useLanguage';
import BottomSheet from '../ui/BottomSheet';
import OtpInput from '../ui/OtpInput';

// Location-picker bottom sheet (Pashu Mandi reference image 3).
// Three ways in: GPS "Use current location" chip, address text search, or
// 6-digit pincode (reuses OtpInput at length=6 for the segmented look).
export default function LocationSheet({ open, onClose, onSelect }) {
  const { tr } = useLanguage();
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [busy, setBusy] = useState(false);

  function useGps() {
    if (!navigator.geolocation) return;
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBusy(false);
        onSelect?.({ kind: 'gps', coords: { lat: pos.coords.latitude, lng: pos.coords.longitude } });
        onClose?.();
      },
      () => { setBusy(false); /* user denied — silent */ },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
    );
  }

  function submitAddress() {
    if (!address.trim()) return;
    onSelect?.({ kind: 'address', address: address.trim() });
    onClose?.();
  }

  function onPincodeComplete(code) {
    onSelect?.({ kind: 'pincode', pincode: code });
    onClose?.();
  }

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="-mt-1 flex items-center justify-end">
        <button
          type="button"
          onClick={useGps}
          disabled={busy}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-success/15 text-success text-sm font-bold hover:bg-success/25 active:scale-95 transition-all disabled:opacity-50"
        >
          <LocateFixed size={16} />
          {tr('loc_use_current')}
        </button>
      </div>

      <section className="mt-6">
        <h3 className="text-2xl font-extrabold text-surface-900">
          {tr('loc_search_by_address')}
        </h3>
        <div className="mt-4 relative">
          <MapPin
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500"
          />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitAddress()}
            placeholder={tr('loc_select')}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-surface-0 border border-surface-200 text-surface-900 placeholder:text-surface-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-colors"
          />
        </div>
      </section>

      <div className="my-6 flex items-center gap-3">
        <span className="flex-1 h-px bg-surface-200" />
        <span className="text-xs font-medium text-surface-500 uppercase tracking-wider">
          {tr('loc_or')}
        </span>
        <span className="flex-1 h-px bg-surface-200" />
      </div>

      <section>
        <h3 className="text-2xl font-extrabold text-surface-900">
          {tr('loc_search_by_pincode')}
        </h3>
        <div className="mt-5 rounded-2xl bg-surface-50 px-3 py-5">
          <OtpInput
            length={6}
            value={pincode}
            onChange={setPincode}
            onComplete={onPincodeComplete}
            autoFocus={false}
          />
        </div>
      </section>

      <div className="h-4" />
    </BottomSheet>
  );
}

LocationSheet.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
};
