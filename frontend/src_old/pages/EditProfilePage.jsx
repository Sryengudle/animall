import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Info, Phone, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import Header from '@/components/common/Header';
import LocationSheet from '@/components/common/LocationSheet';
import { updateProfile, uploadProfilePhoto } from '@/store/slices/authSlice';
import { setLang } from '@/store/slices/uiSlice';
import useLanguage from '@/hooks/useLanguage';
import { LANG_OPTIONS } from '@/i18n';
import { Button, Select } from '@/components/ui';
import { EMPTY_ADDRESS, formatAddress, hasAddress } from '@/utils/addressFormat';

// Edit Profile — Pashu Mandi-style single-form layout (reference images 11, 14).
// Avatar with camera badge at top, then stacked fields with consistent typography.
// Language is a Select (per the user's "instead of segment toggle, give Select").
function FieldLabel({ children, required }) {
  return (
    <label className="block text-body-sm font-bold text-surface-900 mb-2">
      {children}
      {required && <span className="ml-1 text-accent-600">*</span>}
    </label>
  );
}

function TextField({ label, value, onChange, placeholder, type = 'text', inputMode, disabled, leftIcon: LeftIcon, leftIconColor, required }) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="relative">
        {LeftIcon && (
          <LeftIcon
            size={18}
            className={`absolute left-4 top-1/2 -translate-y-1/2 ${leftIconColor || 'text-surface-500'}`}
          />
        )}
        <input
          type={type}
          inputMode={inputMode}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full ${LeftIcon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 rounded-2xl bg-surface-0 border border-surface-200 text-surface-900 placeholder:text-surface-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-colors disabled:bg-surface-100 disabled:text-surface-600`}
        />
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options, placeholder, required }) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <Select value={value || ''} onChange={onChange}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </Select>
    </div>
  );
}

export default function EditProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tr, lang } = useLanguage();
  const { user } = useSelector((s) => s.auth);
  const photoRef = useRef(null);
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    language: lang,
    address: { ...EMPTY_ADDRESS, ...(user?.address || {}) },
    whatsapp: user?.whatsapp || '',
    phone: user?.phone || '',
    dob: user?.dob ? String(user.dob).slice(0, 10) : '',
    livestock: user?.livestock || '',
    occupation: user?.occupation || '',
    experience: user?.experience || '',
    education: user?.education || '',
    profilePhoto: user?.profilePhoto || '',
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const addressLine = formatAddress(form.address) || user?.location || '';

  // Photo: keep the file aside in state and upload AFTER the profile save
  // succeeds. We also set a data-URL preview so the user sees their pick before
  // it lands on the server.
  const [photoFile, setPhotoFile] = useState(null);
  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => set('profilePhoto', reader.result);
    reader.readAsDataURL(file);
  }

  function handleLocationPicked(addr) {
    set('address', { ...EMPTY_ADDRESS, ...addr });
  }

  const [saving, setSaving] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      // Save all fields (except profilePhoto — that goes via a separate upload
      // endpoint because it's a file, not a JSON value). Photo upload happens
      // after, so its returned URL overwrites the data-URL preview in state.
      await dispatch(updateProfile({
        name: form.name,
        address: form.address,
        location: formatAddress(form.address),
        whatsapp: form.whatsapp,
        dob: form.dob || null,
        livestock: Number(form.livestock) || 0,
        occupation: form.occupation,
        experience: form.experience,
        education: form.education,
      })).unwrap();

      if (photoFile) {
        await dispatch(uploadProfilePhoto(photoFile)).unwrap();
      }

      if (form.language !== lang) dispatch(setLang(form.language));
      toast.success(tr('done'));
      navigate('/profile');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : tr('error_generic'));
    } finally {
      setSaving(false);
    }
  }

  const langOptions = LANG_OPTIONS.map(({ code, label }) => ({ value: code, label }));
  const occupationOptions = [
    { value: 'HOME',    label: tr('occupation_home') },
    { value: 'FARMING', label: tr('occupation_farming') },
    { value: 'DAIRY',   label: tr('occupation_dairy') },
    { value: 'TRADING', label: tr('occupation_trading') },
    { value: 'OTHER',   label: tr('occupation_other') },
  ];
  const experienceOptions = [
    { value: '0-1',   label: '0–1 years' },
    { value: '1-3',   label: '1–3 years' },
    { value: '3-5',   label: '3–5 years' },
    { value: '5-10',  label: '5–10 years' },
    { value: '10-20', label: '10–20 years' },
    { value: '20+',   label: '20+ years' },
  ];
  const educationOptions = [
    { value: 'NONE',     label: tr('edu_none') },
    { value: 'UPTO_5',   label: tr('edu_upto_5') },
    { value: 'UPTO_8',   label: tr('edu_upto_8') },
    { value: 'UPTO_10',  label: tr('edu_upto_10') },
    { value: 'UPTO_12',  label: tr('edu_upto_12') },
    { value: 'GRADUATE', label: tr('edu_graduate') },
    { value: 'OTHER',    label: tr('edu_other') },
  ];

  return (
    <div className="min-h-screen pb-12 bg-surface-50">
      <Header title={tr('edit_profile')} showBack />

      <form onSubmit={handleSubmit} className="mx-auto max-w-xl px-4 py-6 space-y-5">
        {/* Avatar with camera overlay */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-surface-100 to-surface-200 grid place-items-center text-display-xl text-surface-500 shadow-card">
              {form.profilePhoto
                ? <img src={form.profilePhoto} alt="" className="w-full h-full object-cover" />
                : (form.name?.[0]?.toUpperCase() || '👤')}
            </div>
            <button
              type="button"
              onClick={() => photoRef.current?.click()}
              aria-label={tr('profile_photo_cta')}
              className="absolute -bottom-1 -right-1 grid place-items-center w-9 h-9 rounded-full bg-brand-700 text-white shadow-md hover:bg-brand-800 active:scale-95 transition-all"
            >
              <Camera size={16} />
            </button>
            <input ref={photoRef} type="file" accept="image/*" className="sr-only" onChange={handlePhoto} />
          </div>
          <p className="mt-3 text-body font-extrabold text-brand-800">{tr('profile_photo_cta')}</p>
          <p className="mt-1 text-caption text-surface-500 max-w-xs">{tr('profile_photo_hint')}</p>
        </div>

        {/* Name */}
        <TextField
          label={tr('edit_profile_name')}
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder={tr('edit_profile_name')}
          required
        />

        {/* Language — Select dropdown (replaces segmented toggle per user request) */}
        <SelectField
          label="भाषा / Language"
          value={form.language}
          onChange={(e) => set('language', e.target.value)}
          options={langOptions}
        />

        {/* Address — tap to open LocationSheet (GPS / pincode / manual) */}
        <div>
          <FieldLabel required>{tr('edit_profile_address')}</FieldLabel>
          <button
            type="button"
            onClick={() => setLocationSheetOpen(true)}
            className="w-full flex items-start gap-3 text-left px-4 py-3.5 rounded-2xl bg-surface-0 border border-surface-200 hover:border-brand-300 hover:bg-brand-50/30 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors"
          >
            <MapPin size={20} className="mt-0.5 shrink-0 text-brand-700" />
            <span className="min-w-0 flex-1">
              {hasAddress(form.address) ? (
                <>
                  <span className="block text-body font-bold text-surface-900 truncate">
                    {[form.address.area, form.address.city].filter(Boolean).join(', ') || form.address.district || form.address.pincode}
                  </span>
                  <span className="block text-caption text-surface-600 truncate">{addressLine}</span>
                </>
              ) : (
                <span className="block text-body text-surface-500">{tr('tell_your_location')}</span>
              )}
            </span>
            <span className="text-body-sm font-bold text-brand-700 shrink-0">{tr('loc_change')}</span>
          </button>
          <p className="mt-2 flex items-center gap-1.5 text-caption text-accent-700">
            <Info size={12} />
            {tr('profile_address_warn')}
          </p>
        </div>

        {/* WhatsApp + Phone — 2 columns */}
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label={tr('edit_profile_whatsapp')}
            value={form.whatsapp}
            onChange={(e) => set('whatsapp', e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="नंबर डालें"
            type="tel"
            inputMode="numeric"
            leftIcon={MessageCircle}
            leftIconColor="text-success"
          />
          <TextField
            label={tr('edit_profile_phone')}
            value={form.phone}
            disabled
            type="tel"
            inputMode="numeric"
            leftIcon={Phone}
            leftIconColor="text-brand-700"
          />
        </div>

        {/* Birthday */}
        <TextField
          label={tr('edit_profile_dob')}
          value={form.dob}
          onChange={(e) => set('dob', e.target.value)}
          type="date"
        />

        {/* Occupation */}
        <SelectField
          label={tr('edit_profile_occupation')}
          value={form.occupation}
          onChange={(e) => set('occupation', e.target.value)}
          options={occupationOptions}
          placeholder={tr('select')}
        />

        {/* Education */}
        <SelectField
          label={tr('edit_profile_education')}
          value={form.education}
          onChange={(e) => set('education', e.target.value)}
          options={educationOptions}
          placeholder={tr('select')}
        />

        {/* Cattle count */}
        <TextField
          label={tr('edit_profile_livestock')}
          value={form.livestock}
          onChange={(e) => set('livestock', e.target.value.replace(/\D/g, '').slice(0, 4))}
          placeholder={tr('edit_profile_livestock')}
          type="number"
          inputMode="numeric"
        />

        {/* Experience */}
        <SelectField
          label={tr('edit_profile_experience')}
          value={form.experience}
          onChange={(e) => set('experience', e.target.value)}
          options={experienceOptions}
          placeholder={tr('experience_pick')}
        />

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={saving}
          disabled={saving}
          className="!rounded-2xl !bg-brand-700 hover:!bg-brand-800"
        >
          {tr('edit_profile_save')}
        </Button>
      </form>

      <LocationSheet
        open={locationSheetOpen}
        onClose={() => setLocationSheetOpen(false)}
        onSelect={handleLocationPicked}
        initial={form.address}
      />
    </div>
  );
}
