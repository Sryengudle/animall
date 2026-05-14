import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

// 6-digit underline OTP/pincode input. Auto-focus, paste support, backspace navigation.
// Used for OTP screen and the pincode field in the location bottom sheet.
export default function OtpInput({
  length = 6,
  value = '',
  onChange,
  onComplete,
  autoFocus = true,
  disabled = false,
  className = '',
}) {
  const inputs = useRef([]);

  useEffect(() => {
    if (autoFocus) inputs.current[0]?.focus();
  }, [autoFocus]);

  function setAt(i, digit) {
    const arr = (value || '').padEnd(length, ' ').split('');
    arr[i] = digit;
    const next = arr.join('').replace(/ /g, '').slice(0, length);
    onChange?.(next);
    if (next.length === length) onComplete?.(next);
  }

  function handleChange(i, e) {
    const ch = e.target.value.replace(/\D/g, '').slice(-1);
    if (!ch) return;
    setAt(i, ch);
    if (i < length - 1) inputs.current[i + 1]?.focus();
  }

  function handleKey(i, e) {
    if (e.key === 'Backspace') {
      if (value[i]) {
        setAt(i, '');
      } else if (i > 0) {
        inputs.current[i - 1]?.focus();
        setAt(i - 1, '');
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      inputs.current[i - 1]?.focus();
    } else if (e.key === 'ArrowRight' && i < length - 1) {
      inputs.current[i + 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    onChange?.(pasted);
    if (pasted.length === length) onComplete?.(pasted);
    inputs.current[Math.min(pasted.length, length - 1)]?.focus();
  }

  return (
    <div className={`flex gap-2 justify-center ${className}`} onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={value[i] || ''}
          disabled={disabled}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          aria-label={`Digit ${i + 1}`}
          className="
            w-12 h-12 text-center text-2xl font-bold text-surface-900 bg-transparent
            border-0 border-b-2 border-brand-400 focus:border-brand-700
            focus:outline-none transition-colors disabled:opacity-50
          "
        />
      ))}
    </div>
  );
}

OtpInput.propTypes = {
  length: PropTypes.number,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onComplete: PropTypes.func,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
