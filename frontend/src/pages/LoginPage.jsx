import { useState, useEffect, useRef } from 'react';

import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { sendOTP } from '@/store/slices/authSlice';
import useLanguage from '@/hooks/useLanguage';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { Button, Input } from '@/components/ui';
import { isValidIndianMobile } from '@/utils/formatters';
import { auth } from '@/services/firebase';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tr } = useLanguage();
  const { loading } = useSelector((s) => s.auth);

  const setupRecaptcha = async () => {

    try {

      if (!window.recaptchaVerifier) {

        window.recaptchaVerifier =
          new RecaptchaVerifier(
            auth,
            'recaptcha-container',
            {
              size: "invisible",

              callback: () => {
                console.log("Recaptcha solved");
              },
            }
          );

        await window.recaptchaVerifier.render();
      }

    } catch (err) {

      console.error("Recaptcha Error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidIndianMobile(phone)) {
      setError(tr('invalid_mobile'));
      return;
    }
    setError('');
    console.log('Auth:', auth);
    const result = await sendOtp();
    if (result?.verificationId) {
      toast.success(tr('otp_sent'));
      navigate('/otp');
    }
  };

  // Send OTP
  const sendOtp = async () => {

    try {

      await setupRecaptcha();

      const appVerifier =
        window.recaptchaVerifier;

      if (!appVerifier) {
        console.log("No verifier found");
        return;
      }
      const formattedPhone = `+91${phone}`;
      const result =
        await signInWithPhoneNumber(
          auth,
          formattedPhone,
          appVerifier
        );

      console.log(result);

      setConfirmationResult(result);
      return { verificationId: result?.verificationId };

    } catch (error) {

      console.error("OTP ERROR:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-100 via-accent-50 to-accent-100">
      {/* Top bar */}
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

      {/* Hero photograph — bundled in public/images/ so it ships with the build
          (no network dependency, no third-party licensing). A Maharashtrian
          farmer between his Gir cow and Murrah buffalo, sugarcane field with
          village in the background at golden hour. Brand-tinted overlay warms
          the photo to match palette and fades into the welcome card. */}
      <div className="flex-1 relative overflow-hidden">
        <motion.img
          src="/images/login-hero.jpg"
          alt={tr('home_banner_buy_alt')}
          className="absolute inset-0 w-full h-full object-cover object-center"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          loading="eager"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        {/* Soft fade-to-card overlay at the bottom only — the photo is already
            warm-toned, so we don't tint it; we just blend into the welcome card. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(15,80,55,0.10) 0%, rgba(15,80,55,0) 30%, rgba(250,249,245,0.0) 70%, rgba(250,249,245,0.92) 95%, rgba(250,249,245,1) 100%)',
          }}
        />
      </div>

      {/* Bottom sheet card */}
      <motion.div
        initial={{ y: 32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 240 }}
        className="bg-surface-0 rounded-t-3xl shadow-2xl px-6 pt-7 pb-8 -mt-2"
      >
        <h2 className="text-h1 font-extrabold text-surface-900 text-center">{tr('welcome_to_app')}</h2>
        <p className="text-center text-surface-500 text-body-sm mt-1 mb-5">{tr('enter_phone_to_continue')}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={tr('mobile_number')}
            type="tel"
            inputMode="numeric"
            autoFocus
            leftAddon={<span className="flex items-center gap-1.5">🇮🇳 +91</span>}
            value={phone}
            onChange={(e) => {
              setError('');
              setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
            }}
            placeholder={tr('mobile_placeholder')}
            error={error}
          />

          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={loading}
            disabled={loading || phone.length !== 10}
          >
            {tr('get_otp')}
          </Button>
        </form>
        <div id="recaptcha-container"></div>

        <div className="mt-5 inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-2xl px-3 py-2 w-full">
          <CheckCircle2 className="text-primary-600 shrink-0" size={16} />
          <p className="text-caption text-primary-700 font-semibold">{tr('trusted_by_farmers')}</p>
        </div>

        <p className="text-center text-[11px] text-surface-400 mt-4">{tr('terms_privacy')}</p>
      </motion.div>
    </div>
  );
}
