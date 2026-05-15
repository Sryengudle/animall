import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { verifyOTP, sendOTP } from '@/store/slices/authSlice';
import useLanguage from '@/hooks/useLanguage';
import AuthLoadingScreen from '@/components/common/AuthLoadingScreen';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { Button } from '@/components/ui';
import { formatPhoneDisplay } from '@/utils/formatters';

const RESEND_SECONDS = 30;

export default function OTPPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tr } = useLanguage();
  const { pendingPhone, demoOtp, loading } = useSelector((s) => s.auth);

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const inputsRef = useRef([]);

  // Bounce to login if user landed directly without a pending phone.
  useEffect(() => { if (!pendingPhone) navigate('/login'); }, [pendingPhone, navigate]);

  // Resend countdown
  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setInterval(() => setResendIn((n) => Math.max(0, n - 1)), 1000);
    return () => clearInterval(id);
  }, [resendIn]);

  // Autofocus first digit
  useEffect(() => { inputsRef.current[0]?.focus(); }, []);

  const otp = useMemo(() => digits.join(''), [digits]);

  const setDigit = (i, val) => {
    const v = val.replace(/\D/g, '').slice(-1);
    setDigits((d) => {
      const copy = [...d];
      copy[i] = v;
      return copy;
    });
    if (v && i < 5) inputsRef.current[i + 1]?.focus();
  };

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && i > 0) inputsRef.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < 5) inputsRef.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    const text = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const arr = ['', '', '', '', '', ''];
    text.split('').forEach((c, i) => { arr[i] = c; });
    setDigits(arr);
    inputsRef.current[Math.min(text.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (otp.length !== 6) {
      toast.error(tr('invalid_otp_length'));
      return;
    }
    setIsVerifying(true);
    const result = await dispatch(verifyOTP({ phone: pendingPhone, otp }));
    if (verifyOTP.fulfilled.match(result)) {
      toast.success(tr('login_success'));
      setTimeout(() => navigate('/'), 600);
    } else {
      setIsVerifying(false);
      toast.error(tr('invalid_otp'));
      setDigits(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendIn > 0) return;
    await dispatch(sendOTP(pendingPhone));
    setResendIn(RESEND_SECONDS);
    toast.success(tr('otp_sent'));
  };

  if (isVerifying) return <AuthLoadingScreen />;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-100 via-accent-50 to-accent-100">
      <header className="flex items-center justify-between px-4 py-3 bg-surface-0/70 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-h1">🐄</span>
          <div className="leading-tight">
            <p className="text-primary-700 font-extrabold text-body">{tr('app_name')}</p>
            <p className="text-surface-500 text-[10px]">{tr('app_tagline')}</p>
          </div>
        </div>
        <LanguageSwitcher />
      </header>

      <div className="flex-1 flex items-end justify-center px-4 pt-4">
        <motion.img
          src="/images/farmer-illustration.png"
          alt=""
          className="w-full max-w-md object-contain"
          style={{ aspectRatio: '4/3' }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>

      <motion.div
        initial={{ y: 32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 240 }}
        className="bg-surface-0 rounded-t-3xl shadow-2xl px-6 pt-7 pb-8 -mt-2"
      >
        <h2 className="text-h1 font-extrabold text-surface-900 text-center">{tr('enter_otp')}</h2>
        <p className="text-center text-surface-500 text-body-sm mt-1 mb-2">{tr('otp_six_digit')}</p>
        <p className="text-center text-body-sm font-bold text-surface-800 mb-3">
          {formatPhoneDisplay(pendingPhone)}
        </p>

        {demoOtp && (
          <div className="bg-accent-50 border border-accent-200 rounded-2xl px-4 py-2 mb-4 text-center">
            <p className="text-[11px] text-accent-700">{tr('otp_demo_label')}</p>
            <p className="text-h2 font-extrabold text-accent-900 tracking-widest">{demoOtp}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                aria-label={`Digit ${i + 1}`}
                value={d}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => handleKey(i, e)}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-h1 font-extrabold rounded-2xl border-2 border-surface-200 bg-surface-0 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
              />
            ))}
          </div>

          <Button type="submit" size="lg" fullWidth loading={loading} disabled={otp.length !== 6}>
            {tr('verify_otp')}
          </Button>
        </form>

        <div className="flex justify-between mt-4 text-body-sm font-semibold">
          <button type="button" onClick={() => navigate('/login')} className="text-surface-500">
            {tr('change_number')}
          </button>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendIn > 0}
            className={`${resendIn > 0 ? 'text-surface-400 cursor-not-allowed' : 'text-primary-600'}`}
          >
            {resendIn > 0 ? `${tr('resend_otp')} · ${resendIn}s` : tr('resend_otp')}
          </button>
        </div>

        <p className="text-center text-[11px] text-surface-400 mt-4">{tr('terms_privacy')}</p>
      </motion.div>
    </div>
  );
}
