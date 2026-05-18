import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Flag } from 'lucide-react';
import toast from 'react-hot-toast';

import Modal from '@/components/ui/Modal';
import useLanguage from '@/hooks/useLanguage';
import { reportAnimal } from '@/store/slices/animalsSlice';

// Listing report dialog — buyer picks one of five canonical reasons (matched
// to the Report.reason enum on the backend) and optionally adds free-text
// detail. Submitting POSTs to /api/animals/:id/report and toasts the result.
const REASONS = [
  { key: 'fake_photo',        labelKey: 'report_reason_fake_photo' },
  { key: 'spam_or_duplicate', labelKey: 'report_reason_spam' },
  { key: 'scam_price',        labelKey: 'report_reason_scam' },
  { key: 'animal_cruelty',    labelKey: 'report_reason_cruelty' },
  { key: 'other',             labelKey: 'report_reason_other' },
];

export default function ReportDialog({ open, animalId, onClose }) {
  const { tr } = useLanguage();
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);

  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setReason('');
    setDetails('');
    setSubmitting(false);
  }

  async function handleSubmit() {
    if (!reason || submitting) return;
    setSubmitting(true);
    try {
      await dispatch(reportAnimal({ id: animalId, reason, details, token })).unwrap();
      toast.success(tr('report_thanks'));
      reset();
      onClose?.();
    } catch (err) {
      toast.error(typeof err === 'string' ? err : tr('error_generic'));
      setSubmitting(false);
    }
  }

  function handleClose() {
    reset();
    onClose?.();
  }

  return (
    <Modal open={open} onClose={handleClose} size="md">
      <div className="text-center -mt-1">
        <div className="mx-auto grid place-items-center h-14 w-14 rounded-full bg-red-100 text-red-600">
          <Flag size={24} />
        </div>
        <h3 className="mt-4 text-h3 font-extrabold text-surface-900">{tr('report_title')}</h3>
        <p className="mt-1 text-body-sm text-surface-600">{tr('report_subtitle')}</p>
      </div>

      <div className="mt-5 space-y-2">
        {REASONS.map((r) => {
          const selected = reason === r.key;
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => setReason(r.key)}
              aria-pressed={selected}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-colors ${
                selected
                  ? 'bg-red-50 border-red-300 text-red-900'
                  : 'bg-surface-0 border-surface-200 hover:border-red-200 hover:bg-red-50/30'
              }`}
            >
              <span
                className={`grid place-items-center h-5 w-5 rounded-full border-2 shrink-0 ${
                  selected ? 'border-red-500 bg-red-500' : 'border-surface-300'
                }`}
              >
                {selected && <span className="h-2 w-2 rounded-full bg-white" />}
              </span>
              <span className="text-body-sm font-bold">{tr(r.labelKey)}</span>
            </button>
          );
        })}
      </div>

      {reason && (
        <div className="mt-4">
          <label className="block text-body-sm font-semibold text-surface-700 mb-1.5">
            {tr('report_details_label')}
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value.slice(0, 1000))}
            placeholder={tr('report_details_placeholder')}
            rows={3}
            className="w-full px-4 py-3 rounded-2xl bg-surface-0 border border-surface-200 text-surface-900 placeholder:text-surface-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-colors resize-none"
          />
          <p className="mt-1 text-caption text-surface-500">{details.length}/1000</p>
        </div>
      )}

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={handleClose}
          disabled={submitting}
          className="flex-1 py-3 rounded-2xl bg-surface-100 hover:bg-surface-200 text-surface-800 font-bold text-body-sm transition-colors disabled:opacity-50"
        >
          {tr('cancel')}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!reason || submitting}
          className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-body-sm transition-colors disabled:opacity-50 disabled:bg-surface-300 disabled:text-surface-500"
        >
          {submitting ? tr('loading') : tr('report_submit')}
        </button>
      </div>
    </Modal>
  );
}

ReportDialog.propTypes = {
  open: PropTypes.bool,
  animalId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};
