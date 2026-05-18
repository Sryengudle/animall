import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight, Edit3, LogOut, Users, Palette, MapPin,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Header from '@/components/common/Header';
import ThemeToggle from '@/components/common/ThemeToggle';
import { logout } from '@/store/slices/authSlice';
import useLanguage from '@/hooks/useLanguage';
import { Avatar, Card, CompletionBadge, ConfirmDialog } from '@/components/ui';
import { formatPhoneDisplay } from '@/utils/formatters';
import { hasAddress, shortAddress } from '@/utils/addressFormat';

// Pashu Mandi-style profile main page (reference image 18).
// Card-based: user identity at top, settings list below, legal footer.
//
// Profile completion: 10 fields × 10% each. Phone is automatic (already
// OTP-verified). Each of the 9 optional fields adds 10% when filled.
// Completion fields keyed by what we actually read off the user object.
// `address` is treated as filled when any of its meaningful parts is set.
const COMPLETION_FIELDS = [
  'name', 'profilePhoto', 'address', 'whatsapp',
  'dob', 'occupation', 'education', 'livestock', 'experience',
];

function computeCompletion(user) {
  if (!user) return 0;
  const filled = COMPLETION_FIELDS.filter((k) => {
    if (k === 'address') return hasAddress(user.address);
    const v = user[k];
    return v != null && v !== '' && v !== 0;
  }).length;
  // Phone counted as already-filled (OTP-verified at signup)
  return Math.round(((filled + 1) / (COMPLETION_FIELDS.length + 1)) * 100);
}

function SettingCard({ icon: Icon, accent, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-surface-0 hover:bg-surface-50 active:bg-surface-100 transition-colors shadow-card text-left
        focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
    >
      <span className={`grid place-items-center h-9 w-9 rounded-full shrink-0 ${accent}`}>
        <Icon size={18} />
      </span>
      <span className="flex-1 text-body font-bold text-surface-900">{label}</span>
      <ChevronRight size={18} className="text-surface-400" />
    </button>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tr } = useLanguage();
  const { user } = useSelector((s) => s.auth);
  const completion = computeCompletion(user);

  async function handleShare() {
    const url = window.location.origin;
    const text = `${tr('app_name')} — ${tr('app_tagline')}`;
    if (navigator.share) {
      try { await navigator.share({ title: tr('app_name'), text, url }); }
      catch { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        toast.success(tr('link_copied'));
      } catch { toast.error(tr('error_generic')); }
    }
  }

  const [logoutOpen, setLogoutOpen] = useState(false);
  function confirmLogout() {
    dispatch(logout());
    toast.success(tr('done'));
    navigate('/login');
  }

  return (
    <div className="min-h-screen pb-32 bg-surface-50">
      <Header title={tr('profile_title')} showBack />

      <main className="mx-auto max-w-xl px-4 pt-5 space-y-3">
        {/* User identity card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card className="p-4">
            <div className="flex items-start gap-3">
              {/* Smaller avatar (lg) gives the middle column more room so the
                  phone number doesn't truncate and the badge doesn't wrap. */}
              <Avatar src={user?.profilePhoto} name={user?.name || 'A'} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-h3 font-extrabold text-surface-900 truncate">
                    {user?.name || tr('seller')}
                  </h2>
                  <button
                    type="button"
                    onClick={() => navigate('/edit-profile')}
                    aria-label={tr('edit')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-100/60 text-brand-800 text-caption font-bold hover:bg-brand-100 active:scale-95 transition-all shrink-0"
                  >
                    <Edit3 size={12} />
                    {tr('edit')}
                  </button>
                </div>
                {/* Phone on its own line so the full +91 99999 99999 string
                    has room to breathe. No truncate — let it wrap if needed. */}
                <p className="mt-1 text-body-sm font-semibold text-surface-700 break-all">
                  {formatPhoneDisplay(user?.phone)}
                </p>
                {hasAddress(user?.address) && (
                  <p className="mt-1 inline-flex items-center gap-1 text-caption text-surface-600 truncate">
                    <MapPin size={12} className="text-brand-700 shrink-0" />
                    <span className="truncate">{shortAddress(user.address)}</span>
                  </p>
                )}
                <div className="mt-2">
                  <CompletionBadge percent={completion} />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Setting cards */}
        <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-surface-0 shadow-card">
          <span className="grid place-items-center h-9 w-9 rounded-full shrink-0 bg-brand-100 text-brand-700">
            <Palette size={18} />
          </span>
          <span className="flex-1 text-body font-bold text-surface-900">{tr('theme')}</span>
          <ThemeToggle />
        </div>

        <SettingCard
          icon={Users}
          accent="bg-accent-100 text-accent-700"
          label={tr('profile_share_friends')}
          onClick={handleShare}
        />
        <SettingCard
          icon={LogOut}
          accent="bg-red-50 text-red-600"
          label={tr('profile_logout')}
          onClick={() => setLogoutOpen(true)}
        />
      </main>

      <ConfirmDialog
        open={logoutOpen}
        title={tr('profile_logout')}
        message={tr('profile_confirm_logout')}
        confirmLabel={tr('profile_logout')}
        cancelLabel={tr('cancel')}
        variant="danger"
        onConfirm={confirmLogout}
        onClose={() => setLogoutOpen(false)}
      />

      {/* Footer — pinned to bottom of viewport, sits above BottomNav */}
      <footer className="absolute bottom-0 left-0 right-0 px-4 pb-24 pt-6 text-center text-caption text-surface-500 bg-gradient-to-t from-surface-100 to-transparent">
        <p>0.1.0 (V2)</p>
        <p className="mt-3 flex items-center justify-center gap-2 flex-wrap">
          <button type="button" onClick={() => navigate('/legal#privacy')} className="hover:text-brand-700 transition-colors">{tr('footer_privacy')}</button>
          <span className="text-surface-300">·</span>
          <button type="button" onClick={() => navigate('/legal#terms')} className="hover:text-brand-700 transition-colors">{tr('footer_terms')}</button>
          <span className="text-surface-300">·</span>
          <button type="button" onClick={() => navigate('/legal#refund')} className="hover:text-brand-700 transition-colors">{tr('footer_refund')}</button>
        </p>
        <p className="mt-2 text-surface-400">© 2026 {tr('app_name')}.</p>
      </footer>
    </div>
  );
}
