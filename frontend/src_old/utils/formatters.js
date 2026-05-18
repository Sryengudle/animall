// Shared formatting helpers — language-aware where possible.

const INR_FORMATTER = new Intl.NumberFormat('en-IN');

export const formatPrice = (value) => '₹' + INR_FORMATTER.format(Number(value) || 0);

export const formatAge = (age, unit, tr) =>
  unit === 'months' ? `${age} ${tr('months')}` : `${age} ${tr('years')}`;

export const timeAgo = (iso, tr) => {
  const ms = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return tr('time_just_now');
  if (minutes < 60) return `${minutes} ${tr('time_minutes_ago')}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${tr('time_hours_ago')}`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ${tr('time_days_ago')}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ${tr('time_months_ago')}`;
  return `${Math.floor(months / 12)} ${tr('time_years_ago')}`;
};

// "9876543210" -> "+919876543210" (E.164 for India).
// Accepts already-prefixed numbers and strips spaces / dashes.
export const formatPhoneE164 = (raw, countryCode = '91') => {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith(countryCode) && digits.length === 12) return `+${digits}`;
  if (digits.length === 10) return `+${countryCode}${digits}`;
  return `+${digits}`;
};

export const formatPhoneDisplay = (raw, countryCode = '91') => {
  const digits = String(raw || '').replace(/\D/g, '').slice(-10);
  if (digits.length !== 10) return raw;
  return `+${countryCode} ${digits.slice(0, 5)} ${digits.slice(5)}`;
};

export const isValidIndianMobile = (raw) =>
  /^[6-9]\d{9}$/.test(String(raw || '').replace(/\D/g, ''));
