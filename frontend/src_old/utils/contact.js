import toast from 'react-hot-toast';
import { formatPhoneE164, formatPhoneDisplay } from './formatters';

// On mobile this opens the dialer. On desktop tel: is a no-op,
// so we show a toast with the number for the user to copy/dial manually.
const isMobile = () =>
  typeof navigator !== 'undefined' &&
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const callPhone = (phone, { tr } = {}) => {
  const e164 = formatPhoneE164(phone);
  if (!e164) return;

  if (isMobile()) {
    window.location.href = `tel:${e164}`;
    return;
  }

  const display = formatPhoneDisplay(phone);
  const copyAction = async () => {
    try {
      await navigator.clipboard.writeText(e164);
      toast.success(tr ? tr('phone_copied') : 'Number copied');
    } catch {
      /* clipboard blocked — ignore */
    }
  };

  toast(
    (t) => {
      // Imperative toast so we can render an action — react-hot-toast accepts JSX
      // via render-prop. Keep it simple: number + tap-to-copy hint.
      return `${display} — ${tr ? tr('tap_to_copy') : 'tap to copy'}`;
    },
    { duration: 4000, icon: '📞', ariaProps: { role: 'status', 'aria-live': 'polite' } }
  );
  copyAction();
};

export const openWhatsApp = (phone, message = '') => {
  const e164 = formatPhoneE164(phone).replace('+', '');
  if (!e164) return;
  const url = `https://wa.me/${e164}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};
