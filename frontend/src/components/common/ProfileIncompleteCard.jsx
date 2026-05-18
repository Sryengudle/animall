import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowRight, ChevronLeft } from 'lucide-react';
import useLanguage from '@/hooks/useLanguage';

/**
 * Full-screen card shown in place of the sell-livestock form when the user's
 * profile lacks the contactable basics (name / phone / address). Replacing
 * the form (rather than letting them fill it out and then blocking submit)
 * keeps the flow honest: the seller can't compose a listing buyers won't be
 * able to act on.
 *
 * After they complete the profile, EditProfilePage honors `?return=/sell`
 * and navigates back here — at which point `canSell` is true and SellPage
 * renders the real form.
 */
export default function ProfileIncompleteCard({ missingFields = [] }) {
  const navigate = useNavigate();
  const { tr } = useLanguage();

  const labelFor = (k) => {
    if (k === 'name') return tr('profile_field_name');
    if (k === 'phone') return tr('profile_field_phone');
    if (k === 'address') return tr('profile_field_address');
    return k;
  };

  return (
    <div className="mx-auto max-w-md px-4 pt-6 pb-24">
      <button
        type="button"
        onClick={() => navigate('/buy')}
        className="inline-flex items-center gap-1 text-body-sm font-semibold text-surface-600 hover:text-surface-900 mb-3 -ml-1"
      >
        <ChevronLeft size={18} />
        {tr('profile_gate_browse_instead')}
      </button>

      <div className="bg-surface-0 rounded-3xl shadow-card border border-surface-100 overflow-hidden">
        {/* Hero strip — large icon over a warm primary tint, so the card has
            obvious visual weight before the body text. */}
        <div className="bg-gradient-to-br from-primary-50 via-primary-50 to-accent-50 px-6 pt-7 pb-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-0 shadow-md flex items-center justify-center text-primary-700">
            <UserPlus size={32} strokeWidth={2.25} />
          </div>
          <h1 className="mt-4 text-h2 font-extrabold text-surface-900 text-center">
            {tr('profile_gate_title')}
          </h1>
          <p className="mt-1.5 text-body-sm text-surface-700 text-center max-w-xs">
            {tr('profile_gate_body')}
          </p>
        </div>

        {/* Missing fields — laid out as a list so the user sees the
            checklist they have to satisfy. */}
        {missingFields.length > 0 && (
          <ul className="px-6 py-5 space-y-3 border-t border-surface-100">
            {missingFields.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="w-7 h-7 rounded-full bg-warning-100 text-warning-700 flex items-center justify-center text-body font-extrabold"
                >
                  !
                </span>
                <span className="text-body font-semibold text-surface-900">
                  {labelFor(f)}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Primary CTA — single-action card. Skips the secondary "Not now"
            we had on the modal: this isn't a friction prompt, it's the only
            path forward to sell. */}
        <div className="px-6 pb-6">
          <button
            type="button"
            onClick={() => navigate('/edit-profile?return=/sell')}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold text-body shadow-lg shadow-primary-500/20 active:scale-[0.98] transition-all"
          >
            {tr('profile_gate_complete')}
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

ProfileIncompleteCard.propTypes = {
  missingFields: PropTypes.arrayOf(PropTypes.string),
};
